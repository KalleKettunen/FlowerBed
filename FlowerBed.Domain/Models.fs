namespace FlowerBed.Domain

[<CLIMutable>]
// tyyppi kasville
type Flower = {    ID: int; Name : string;    Color : string; Width : decimal; Height : decimal; StartDate :int; EndDate :int}

[<CLIMutable>]
// tyyppi pisteelle
type Point = {    X : float32;    Y : float32}

[<CLIMutable>]
// tyyppi kasvimaassa olevalle kasville
type Plant = {    Flower : Flower;    Pos : Point}

[<CLIMutable>]
// kasvimaan rajat listana pisteitä.
type Polygon = {   Points : Point list}

[<CLIMutable>]
// tyyppi kasvimaalle
type Planting = {Id :int;Name :string; Owner :string; Plants: Plant list; Area : Polygon list}

// tyyppi kasvimaan lisädatalle
type PlantingData = {Id: int; Name :string}