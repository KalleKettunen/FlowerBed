namespace FlowerBedService

open System
open System.Data
open System.Linq
open FSharp
open FSharp.Data.Sql

type sql = SqlDataProvider<
                ConnectionString = @"Server=127.0.0.1;Port=5432;Database=FlowerBed;User Id=kalle;Password=1n<<uP1n<<u",
                DatabaseVendor = Common.DatabaseProviderTypes.POSTGRESQL, 
                ResolutionPath = @"C:\Apps\Npgsql2.0.12.0-bin-ms.net4.0\">

module sqlTest =
    let ctx = sql.GetDataContext()
    
    //let foo = ctx.``[public].[flower]`` |> Seq.toList
   
   