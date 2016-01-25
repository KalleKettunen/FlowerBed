﻿namespace DataService

open System
open System.Data
open System.Linq
open FSharp.Data.Sql
open FSharp.Data.Sql.Schema
open FSharp.Data.Sql.Common
open FSharp.Data.Sql.Providers
open Microsoft.FSharp.Collections
open NpgsqlTypes

type sql = SqlDataProvider<
                ConnectionString = @"Server=kalletest.cloudapp.net;Port=54321;Database=FlowerBed;User Id=postgres;Password=!n<<uP!n<<u",
                DatabaseVendor = Common.DatabaseProviderTypes.POSTGRESQL, 
                ResolutionPath = @"D:\home\site\wwwroot\bin\">

//type sql = SqlDataProvider<
//                ConnectionString = @"Server=localhost;Port=5432;Database=FlowerBed;User Id=kalle;Password=1n<<uP1n<<u",
//                DatabaseVendor = Common.DatabaseProviderTypes.POSTGRESQL, 
//                ResolutionPath = @"D:\home\site\wwwroot\bin\">

[<CLIMutable>]
// tyyppi kasville
type Flower = {    ID: int; Name : string;    Color : string; Width : decimal; Height : decimal; StartDate :int; EndDate :int}

// tyyppi pisteelle
type SPoint = {    X : float32;    Y : float32}

// tyyppi kasvimaassa olevalle kasville
type SPlant = {    Flower : int;    Pos : SPoint}

// kasvimaan rajat listana pisteitä.
type SPolygon = {   Points : SPoint list}

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
                            planting.plantingarea_plantingid_fkey.Select( fun area -> (castAs<NpgsqlPolygon>(area.AREA), area.BORDER)).ToList() )
                } |> Seq.map(fun (a, b, c, d) ->  { Id = a;
                                                    Name = b;
                                                    Owner ="Foo"; // omistajaa ei ole vielä toteutettu joten näin.
                                                    Plants = c.Select(fun (d, e) -> {Flower = d ; Pos = { X = e.X; Y=e.Y}}) |> Seq.toList
                                                    Area = d.Select (fun (f, g) ->{ Points = f.Select(fun h -> {X = h.X; Y = h.Y}) |> Seq.toList}) |> Seq.toList}) |> Seq.exactlyOne
    
    // päivittää kukkapenkin muutokset kantaan poistamalla ensin kaikki kukkapenkin tiedot ja tallentamalla sen jälkeen muuttuneet tiedot kantaan
    let update_planting id =
        let x = [id].FirstOrDefault()
        let con = PostgreSQL.createConnection ctx.Functions.ConnectionString
        con.Open()
        let query = sprintf @"DELETE FROM PLANT WHERE PLANTINGID = %i; DELETE FROM PLANTINGAREA WHERE PLANTINGID = %i;" id id
        use command = PostgreSQL.createCommand query con 
        command.ExecuteNonQuery() |> ignore
        con.Close()

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
        
