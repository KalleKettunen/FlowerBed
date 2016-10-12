function deleteAreaController(repository, canvas, parent, zoom) {
    var _repository = repository,
        _canvas = canvas,
        _area = null;
        _point = null,
        _geometry = editAreaController.data.geometry,
        _parent = parent,
        _zoom = zoom;

    function deletePoint(pos) {
        var areas = _repository.Planting().area;
        if (_repository.Planting().area && _repository.Planting().area !== []) {
            findClosest(pos, areas);
            var index = _area.points.indexOf(_point);
            if (index !== -1) {
                _area.points.splice(index, 1);
                // if area has fewer than 3 points it's removed.
                if (_area.points.length < 3) {
                    var areaIndex = areas.indexOf(_area);
                    if (areaIndex > -1)
                        areas.splice(areaIndex, 1);
                }
            }
        }
    }

    function findClosest(pos, areas) {
        var closestDistance = Number.MAX_VALUE;

        areas.forEach(function (area) {
            area.points.forEach(function (point) {
                var distance = _geometry.sqrDistance(point, pos);
                if (closestDistance > distance) {
                    closestDistance = distance;
                    _point = point;
                    _area = area;
                }
            })
        });
    }

    return {
        "click": function (pos) {
            deletePoint(pos);
        },
        "close": function () {
            console.log("closing deleteAreaController");
            _canvas.update();
        }
    };
}