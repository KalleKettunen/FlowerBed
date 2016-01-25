﻿namespace FlowerBed.Controllers

open System
open System.Collections.Generic
open System.Linq
open System.Net.Http
open System.Web.Http
open FlowerBed.Models
open DataService
open FSharp.Data.Sql

type PlantingController() =
    inherit ApiController()

    // Gets specific planting
    [<Route("api/planting/{id}")>]
    member x.Get(id : int) : DataService.Planting=
        DataService.sqlTest.planting id 

    // Get Ids and names of all plantings
    [<Route("api/planting/")>]
    member x.Get() : PlantingData list =
        DataService.sqlTest.plantings
        
