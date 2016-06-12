var main = {},
    contextLayer,
    focusLayer,
    radius = 20,
    focusObject,
    zoom,
    canvas;

$(document).ready(function() {

    main.geometryService = geometryService();
    main.repository = repository();
    main.flowerService = flowerService(main.repository, { "selectedFlower": "#selectFlower option:selected" });
    main.zoom = zoomController({ "zoomIn": "#zoom_in", "zoomOut": "#zoom_out", "scale": "#scale" });
    main.canvas = flowerCanvas(document.getElementById("flowerbed").getContext("2d"), main.zoom,  { "update": ["#zoom_in", "#zoom_out"] });
    main.date = dateController({"date" : "#date", "dateControl" : "#date_slider", "update" :main.canvas });
    main.repository.init().done(function () {
        main.flowerManager = flowerManager(main.repository);
        main.plantingController = plantingController(
            main.repository,
            main.canvas,
            {  
                "dialog": "#plantingController", 
                "select":"#selectPlanting", 
                "load": "#selectPlantingButton",
                "name": "#canvasName",
                "save": "#savePlanting",
                "open": "#openPlantingController",
                "create": "#createPlanting",
                "planting": "#plantingName"
            });
        edgeController.data = {
            "addLayer": "#add_layer",
            "geometry": main.geometryService
    };
            plantController.data = {
                
            };
        main.workController = workController(
            {
                "edge" : edgeController,
                "plant": plantController
            },
            main.repository,
            main.canvas,
            main.flowerService,
            main.zoom,
            {
                "addLayer": "#add_layer",
                "addFlower": "#add_flower",
                "addArea": "#add_area",
                "editArea": "#edit_area",
                "deleteArea": "#delete_area"
            }
            );
    });

    
    focusLayer = document.getElementById("layer2").getContext("2d");

    $(".canvas_holder").click(selectObject);
    

    $("#add_layer").mousemove(function(event) {
        $("#add_x").text(event.offsetX);
        $("#add_y").text(event.offsetY);
    });

    $("#selectObject_select").change(function () {
        var id = parseInt($("#selectObject_select option:selected").val(), 10);

        focusObject = main.repository.findObject(id);
        drawFocus(focusObject);
        $("#info_id").text(focusObject[0].id);
        $("#info_name").text(focusObject[0].Name());
        $("#info_color").val(focusObject[0].flower.color);
    });

    $("#info_color").change(function () {
        focusObject[0].flower.color = this.value;
        main.canvas.update();
    });
});

function processPlanting(data) {
    $("#canvas_name").text(data.name);
    main.repository.Edges(createEdges(data.area));
}

function drawFocus(object) {
    focusLayer.clearRect(0, 0, 640, 480);
    object.forEach(function (obj) {
        focusLayer.beginPath();
        focusLayer.arc(obj.pos.x, obj.pos.y, 6, 0, 2 * Math.PI);
        focusLayer.strokeStyle = "blue";
        focusLayer.stroke();
    });
}

function selectObject(event) {
    var elems = main.repository.Planting().plants.filter(function (elem) { return inCircle({ x: event.offsetX, y: event.offsetY }, elem.pos, radius); });
    var edges = main.repository.Edges().filter(function (elem) { return distanceToEdge({ x: event.offsetX, y: event.offsetY }, elem) <= radius; });
    var options = $("#selectObject_select").empty();
    if (elems.length !== 0 || edges.length !== 0) {
        $.each(elems, function() {
            options.append(new Option(this.Name(), this.id));
        });
        $.each(edges, function() {
            options.append(new Option(this.Name(), this.id));
        });
        $("#selectObject").dialog();
    }
};

function inCircle(pos, center, radius) {
    return sqrDistance(pos, center) <= radius *radius;
}

function sqrDistance(p1, p2) {
    return (p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y);
};

function distanceToEdge(p, edge) {
    return Math.abs((edge.end.y - edge.begin.y) * p.x - (edge.end.x - edge.begin.x) * p.y + edge.end.x * edge.begin.y - edge.end.y * edge.begin.x) / Math.sqrt((edge.end.y - edge.begin.y) * (edge.end.y - edge.begin.y) + (edge.end.x - edge.begin.x) * (edge.end.x - edge.begin.x));
}

function createEdges(polygons) {
    var edges = [];
    polygons.forEach(function (polygon) {
        var prev = polygon.points.slice(-1)[0];
        Array.prototype.push.apply(edges,polygon.points.map(function (p) {
            var edge = { begin: prev, end: p, pos: midPoint(prev, p) };
            prev = p;
            return edge;
        }));
    });
    return edges;
}

function midPoint(p1, p2) {
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}

