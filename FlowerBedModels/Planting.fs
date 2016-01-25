namespace FlowerBed.Models

open Newtonsoft.Json

[<CLIMutable>]
type Planting = {
    Name : string
    Owner : string
    Flowers : Plant list
    Area : Polygon
}
