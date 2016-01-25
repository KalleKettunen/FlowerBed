namespace FlowerBed.Models

open Newtonsoft.Json

[<CLIMutable>]
type Plant = {
    Flower : int
    Pos : Point
}

