// Learn more about F# at http://fsharp.net
// See the 'F# Tutorial' project for more help.

open DataService
open FSharp.Data.Sql
open System.Data


[<EntryPoint>]
let main argv =
    let l = DataService.sqlTest.flowers()


    0// return an integer exit code
