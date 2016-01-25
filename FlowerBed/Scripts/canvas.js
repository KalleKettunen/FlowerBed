function flowerCanvas(context, zoomController, data) {

    var contextLayer = context,
        zoom = zoomController,
        content = {},
        date;

    function drawPolygon(polygon) {
        var start = polygon.points[0];

        contextLayer.moveTo(zoom.scale(start.x), zoom.scale(start.y));
        polygon.points.slice(1).forEach(function (elem) {
            contextLayer.lineTo(zoom.scale(elem.x), zoom.scale(elem.y));
        });
        contextLayer.closePath();
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
        content.area.forEach(function(polygon) { drawPolygon(polygon); });
        content.plants.sort(function(a, b) {
            return a.flower.height - b.flower.height;
        }).forEach(drawFlower);
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
        update : update,
        init : function(data) {
            content = data.planting;
            date = data.date;
            $(this).on("update", update);
        }

    }
};