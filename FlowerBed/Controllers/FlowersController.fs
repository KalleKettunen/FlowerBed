namespace FlowerBed.Controllers
open System
open System.Collections.Generic
open System.Linq
open System.Net.Http
open System.Web.Http
open FlowerBed.Models
open DataService

[<CLIMutable>]
type TT = {
    Data : string
}

type FlowersController() =
    inherit ApiController()

    /// Gets all values.
    member x.Get() =
        DataService.sqlTest.flowers()
    
    member x.Add(flower: Flower) =
        x.Ok (DataService.sqlTest.addFlower flower)

    member x.Update(flower: Flower) =
        x.Ok (DataService.sqlTest.updateFlower flower)
        