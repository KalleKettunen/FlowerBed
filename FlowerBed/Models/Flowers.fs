namespace FlowerBed.Models

open Newtonsoft.Json

[<CLIMutable>]
type Flower = {
    ID   : int
    Name : string
    Color : string
    Width : decimal
    Height : decimal
}

