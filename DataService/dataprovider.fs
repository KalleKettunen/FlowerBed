namespace DataService

open System
open System.Data
open System.Linq
open FSharp.Data.Sql
open FSharp.Data.Sql.Schema
open FSharp.Data.Sql.Common
open FSharp.Data.Sql.Providers
open Microsoft.FSharp.Collections
open NpgsqlTypes



[<CLIMutable>]
// tyyppi kasville
type Flower = {    ID: int; Name : string;    Color : string; Width : decimal; Height : decimal; StartDate :int; EndDate :int}

[<CLIMutable>]
// tyyppi pisteelle
type SPoint = {    X : float32;    Y : float32}

[<CLIMutable>]
// tyyppi kasvimaassa olevalle kasville
type SPlant = {    Flower : int;    Pos : SPoint}

[<CLIMutable>]
// kasvimaan rajat listana pisteitä.
type SPolygon = {   Points : SPoint list}

[<CLIMutable>]
// tyyppi kasvimaalle
type Planting = {Id :int;Name :string; Owner :string; Plants: SPlant list; Area : SPolygon list}

// tyyppi kasvimaan lisädatalle
type PlantingData = {Id: int; Name :string}

// tietokanta rajapinta
module sqlTest =
    
    // funktio joka muuntaa tietueen halutun tyyppiseksi tietueeksi
    let castAs<'T when 'T : (new : unit -> 'T)> (o:obj) = 
          match o with
          | :? 'T as res -> res
          | _ -> new 'T()
   
    let pointToString(p : SPoint) : string =
        sprintf "(%f,%f)" p.X p.Y

    let polygonToString (polygon : SPolygon) : string =
        sprintf "'(%s)'"(polygon.Points 
                           |> Seq.map(fun p -> (pointToString p)) 
                           |> String.concat ","
                        )

    // alustaa tietokantakontekstin
    let ctx = sql.GetDataContext()
   
    // hakee kaikki viljelykset tietokannasta.
    let plantings =
        query { for planting in ctx.``[PUBLIC].[PLANTING]`` do
                select ({Id=planting.ID;Name=planting.NAME})
        } |> Seq.toList

    // hakee kasvimaan sen tunnuksen perusteella kannasta.
    let planting (id :int) : Planting =
        query { for planting in ctx.``[PUBLIC].[PLANTING]`` do
                where (planting.ID = id)
                select (    planting.ID,
                            planting.NAME, 
                            planting.plant_plantingid_fkey.Select( fun p -> (p.FLOWERID, castAs<NpgsqlPoint>(p.POSITION))).ToList(),
                            planting.plantingarea_plantingid_fkey.Select( fun area -> (castAs<NpgsqlPolygon>(area.AREA))).ToList() )
                } |> Seq.map(fun (a, b, c, d) ->  { Id = a;
                                                    Name = b;
                                                    Owner ="Foo"; // omistajaa ei ole vielä toteutettu joten näin.
                                                    Plants = c.Select(fun (d, e) -> {Flower = d ; Pos = { X = e.X; Y=e.Y}}) |> Seq.toList
                                                    Area = d.Select (fun f ->{ Points = f.Select(fun h -> {X = h.X; Y = h.Y}) |> Seq.toList}) |> Seq.toList}) |> Seq.exactlyOne
    
    // päivittää kukkapenkin muutokset kantaan poistamalla ensin kaikki kukkapenkin tiedot ja tallentamalla sen jälkeen muuttuneet tiedot kantaan
    let update_planting (planting : Planting) =
        let con = PostgreSQL.createConnection ctx.Functions.ConnectionString
        con.Open()
        let query = sprintf @"DELETE FROM PLANT WHERE PLANTINGID = %i; DELETE FROM PLANTINGAREA WHERE PLANTINGID = %i;" planting.Id planting.Id
        use command = PostgreSQL.createCommand query con 
        command.ExecuteNonQuery() |> ignore
        con.Close()

        // luodaan kasveille avaimet niiden listanssa olevan järjestyksen mukaan ja viedään jokainen rivi kantaan
        let plants = planting.Plants |> Seq.zip (seq {0 .. planting.Plants.Count()-1}) |> Seq.map(fun (n, p) ->
            // Rivit joudutaan viemään kantaan ilman entity mallia koska framework ei oikeastaan tue Postgres kannan kaikkia tietotyyppejä.
            con.Open()
            let query = sprintf @"INSERT INTO PLANT (plantid, plantingid, flowerid, position) VALUES(%i,%i,%i,%s);" n planting.Id p.Flower (sprintf "'%s'" (pointToString p.Pos))
            use command = PostgreSQL.createCommand query con 
            command.ExecuteNonQuery() |> ignore
            con.Close()           
            query    ) |> Seq.toList
            
        con.Open()
        let areas = planting.Area |> Seq.zip (seq {0 .. planting.Area.Count()-1}) |> Seq.map(fun (n,a) -> 
            let query = sprintf @"INSERT INTO PLANTINGAREA (plantingid, areaid, area) VALUES(%i,%i,%s);" planting.Id n (polygonToString a)
            use command = PostgreSQL.createCommand query con
            command.ExecuteNonQuery() |> ignore
            
            query   ) |> Seq.toList
        con.Close()
        
        ctx.SubmitUpdates()
        
        //TODO: tietojen lisäys

        true

    // Hakee kaikki erillaiset kukkaset kukkatietokannasta
    let flowers ()=
        query { for flower in ctx.``[PUBLIC].[FLOWER]`` do
                          for state in flower.flowerstate_flower_fkey do
                          select (flower.ID,
                                flower.NAME,
                                flower.COLOR,
                                flower.WIDTH,
                                flower.HEIGHT,
                                state.STARTDATE,
                                state.ENDDATE
                                ) } |> Seq.map (fun(id, name, color, width, height, startDate, endDate) -> 
                                {
                                    ID = id;
                                    Name = name;
                                    Color = color;
                                    Width = width;
                                    Height = height;
                                    StartDate = startDate;
                                    EndDate = endDate}) |>Seq.toList

    // lisää uuden kukkasen kukkatietokantaan
    let addFlower (flower : Flower) =
        let f = ctx.``[PUBLIC].[FLOWER]``.Create()
        f.NAME <- flower.Name
        f.COLOR <- flower.Color
        f.WIDTH <- flower.Width
        f.HEIGHT <- flower.Height
        
        ctx.SubmitUpdates()

        let state = ctx.``[PUBLIC].[FLOWERSTATE]``.Create()
        state.FLOWER <- f.ID
        state.STARTDATE <- flower.StartDate
        state.ENDDATE <- flower.EndDate

        ctx.SubmitUpdates()

    // Päivittää kukkasen tiedot kukkatietokantaan.
    let updateFlower (flower : Flower) =
        // ensin kukka
        let dbFlower = ctx.``[PUBLIC].[FLOWER]`` |> Seq.where(fun (f) -> f.ID = flower.ID) |> Seq.head
        dbFlower.NAME <- flower.Name
        dbFlower.COLOR <- flower.Color
        dbFlower.WIDTH <- flower.Width
        dbFlower.HEIGHT <-flower.Height
        
        // ja sen kukinta-aika
        let state = ctx.``[PUBLIC].[FLOWERSTATE]`` |> Seq.where(fun (f) -> f.FLOWER = flower.ID) |> Seq.head
        state.STARTDATE <- flower.StartDate
        state.ENDDATE <- flower.EndDate
        
        // tallenetaan muutokset.
        ctx.SubmitUpdates()
        