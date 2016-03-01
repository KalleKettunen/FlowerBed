function flowerCanvas(context, zoomController, data) {

    var contextLayer = context,
        zoom = zoomController,
        content = {},
        date,
        _work = { };

    function drawPolygon(polygon) {
        if (polygon.points.length > 0) {
            var start = polygon.points[0];

            contextLayer.moveTo(zoom.scale(start.x), zoom.scale(start.y));
            polygon.points.slice(1).forEach(function(elem) {
                contextLayer.lineTo(zoom.scale(elem.x), zoom.scale(elem.y));
            });
            contextLayer.closePath();
            contextLayer.stroke();
        }
    }

    function drawPath(path) {
        if (path.length > 0) {
            var start = path[0];

            contextLayer.moveTo(zoom.scale(start.x), zoom.scale(start.y));
            path.slice(1).forEach(function (elem) {
                contextLayer.lineTo(zoom.scale(elem.x), zoom.scale(elem.y));
            });
            contextLayer.stroke();
        }
    }

    function drawCircle(circle) {
        contextLayer.strokeStyle = circle.color;
        contextLayer.lineWidth = 5;
        contextLayer.beginPath();
        contextLayer.arc(zoom.scale(circle.point.x), zoom.scale(circle.point.y), zoom.scale(circle.radius), 0, 2 * Math.PI);
        
        contextLayer.stroke();

        contextLayer.lineWidth = 1;
        contextLayer.strokeStyle = "black";

    }

    function drawEdge(edge) {
        contextLayer.beginPath();
        contextLayer.moveTo(zoom.scale(edge.start.x), zoom.scale(edge.start.y));
        contextLayer.lineTo(zoom.scale(edge.end.x), zoom.scale(edge.end.y));
        contextLayer.stroke();
    }

    function drawFlower(plant) {
        contextLayer.beginPath();
        contextLayer.arc(zoom.scale(plant.pos.x), zoom.scale(plant.pos.y), zoom.scale(plant.flower.width), 0, 2 * Math.PI);
        contextLayer.fillStyle = flowerColor(plant.flower);
        contextLayer.fill();
        contextLayer.stroke();
    }

    function update() {
        contextLayer.clearRect(0, 0, 640, 480);
        content.area.forEach(function (polygon) { drawPolygon(polygon); });
        content.plants.sort(function(a, b) {
            return a.flower.height - b.flower.height;
        }).forEach(drawFlower);

        if (_work.path)
            drawPath(_work.path);
        if (_work.circle)
            drawCircle(_work.circle);
    }

    function flowerColor(flower) {
        if (date.month() > 2 && date.month() < flower.startDate) {
            return "#7FFF00";
        } else if (date.month() >= flower.startDate && date.month() <= flower.endDate) {
            return flower.color;
        } else {
            return "brown";
        }  
    }

    data.update.forEach(function (elem) {
        $(elem).click(update);
    });

    return {
        update: update,
        drawEdge: drawEdge,
        drawPath: function (path) {
            _work.path = path;
        },
        drawCircle : function(point, radius, color) {
            _work.circle = { "point": point, "radius": radius, "color": color };
        },
        removeCircle :function() {
            _work.circle = null;
        },
        init : function(data) {
            content = data.planting;
            date = data.date;
            $(this).on("update", update);
        }

    }
};