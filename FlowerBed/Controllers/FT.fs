namespace FlowerBed.Controllers
open System
open System.Collections.Generic
open System.Linq
open System.Net.Http
open System.Web.Http
open FlowerBed.Models
open DataService

[<CLIMutable>]
type SFlower = {
    ID   : int
    Name : string
    Color : string
    Width : decimal
    Height : decimal
    }

type FlowerTestController() =
    inherit ApiController()

    member this.Post(flower: Flower) =
        DataService.sqlTest.addFlower flower
        
[<CLIMutable>]
type MyData = { MyText : string; MyNumber : int }
 
type MyController() =
    inherit ApiController()
    member this.Post(myData : MyData) = this.Ok myData