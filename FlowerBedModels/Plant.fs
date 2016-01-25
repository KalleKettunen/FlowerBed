namespace FlowerBed.Models

open Newtonsoft.Json

[<CLIMutable>]
type Plant = {
    Flower : Flower
    Pos : Point
}

