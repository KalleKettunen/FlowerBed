var main = {},
    contextLayer,
    focusLayer,
    radius = 20,
    focusObject,
    zoom,
    canvas;

$(document).ready(function () {

    main.repository = repository();
    main.zoom = zoomController({ "zoomIn": "#zoom_in", "zoomOut": "#zoom_out", "scale": "#scale" });
    main.canvas = flowerCanvas(document.getElementById("flowerbed").getContext("2d"), main.zoom, { "update": ["#zoom_in", "#zoom_out"] });
    main.date = dateController({"date" : "#date", "dateControl" : "#date_slider", "update" :main.canvas });
    main.repository.init().done(function () {
        main.flowerManager = flowerManager(main.repository);
    });
    
    focusLayer = document.getElementById("layer2").getContext("2d");

    $(".canvas_holder").click(selectObject);
    // Add layer click eventhandler.
    $("#add_layer").click(function (event) {
        var plant, flower;
        $("#add_layer").zIndex(1).toggleClass("hidden");
        event.stopPropagation();

        flower = main.repository.findFlower($("#selectFlower option:selected").val());
        plant = {
            flower: flower,
            pos: { x: event.offsetX, y: event.offsetY }
        };
        main.repository.addPlant(plant);
        main.canvas.update();
    });

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

    //$("#date_slider").change(function () {
    //    var dayOfYear = $(this).val();
    //    var year = new Date($('#date').val()).getFullYear();
    //    $('#date').val(DateUtils.dateFromDayOfYear(dayOfYear, year).toISOString().substring(0,10));
    //});

    //$("#date").change(function () {
    //    $('#date_slider').attr('max', DateUtils.daysInYear(new Date($(this).val())));
    //    $("#date_slider").val(DateUtils.dayOfYear(new Date($(this).val())));
    //});

    // Control button handlers
    $("#add_flower").click(function () {
        $("#add_layer").zIndex(10).toggleClass("hidden");
    });

    //$('#date').val(new Date().toISOString().substring(0, 10));
    //$("#date_slider").val(DateUtils.dayOfYear(new Date($("#date").val())));
    //$('#date_slider').attr('max', DateUtils.daysInYear(new Date($('#date').val())));
    $.get("api/Planting/1",
        function (data) {
            main.repository.Planting(data);
            processPlanting(data[0]);
            main.canvas.init({ "planting" : data[0], "date": main.date });
            main.canvas.update();
        });

    

});
/*
function drawPolygon(polygon) {
    var start = polygon.points[0];

    contextLayer.moveTo(start.x, start.y);
    polygon.points.slice(1).forEach(function(elem) {
        contextLayer.lineTo(elem.x, elem.y);
    });
    contextLayer.closePath();
    contextLayer.stroke();
}
*/
function processPlanting(data) {
    $("#canvas_name").text(data.name);
    //main.canvas.update(data);
    /*
        drawPolygon(data.area);
        data.plants.forEach(drawFlower);
    */
    main.repository.Edges(createEdges(data.area));
}
/*
function drawFlower(flower) {
    contextLayer.beginPath();
    contextLayer.arc(main.zoom.scale(flower.pos.x), main.zoom.scale(flower.pos.y), main.zoom.scale(flower.flower.width), 0, 2 * Math.PI);
    contextLayer.fillStyle = flower.flower.color;
    contextLayer.fill();
    contextLayer.stroke();
}
*/
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
    var elems = main.repository.Planting()[0].plants.filter(function (elem) { return inCircle({ x: event.offsetX, y: event.offsetY }, elem.pos, radius); });
    var edges = main.repository.Edges().filter(function (elem) { return distanceToEdge({ x: event.offsetX, y: event.offsetY }, elem) <= radius; });
    var options = $("#selectObject_select").empty();
    $.each(elems, function () {
        options.append(new Option(this.Name(), this.id));
    });
    $.each(edges, function () {
        options.append(new Option(this.Name(), this.id));
    });
    $("#selectObject").dialog();
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

function createEdges(polygon) {
    var prev = polygon.points.slice(-1)[0];
    return polygon.points.map(function(p) {
        var edge = { begin: prev, end: p, pos : midPoint(prev, p)};
        prev = p;
        return edge;
    });
}

function midPoint(p1, p2) {
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
}
/*
function updateContexLayer() {
    contextLayer.clearRect(0, 0, 640, 480);
    var data = main.repository.Planting()[0];
    drawPolygon(data.area);
    data.flowers.forEach(drawFlower);
}*/
