function editAreaController(repository, canvas, parent, zoom) {
    var _repository = repository,
        _canvas = canvas,
        _original = {},
        _area = null;
        _point = null,
        _geometry = editAreaController.data.geometry,
        _parent = parent,
        _zoom = zoom;

        function beginEdit(pos) {
            var areas = _repository.Planting().area;
            if (_repository.Planting().area && _repository.Planting().area !== []) {
                findClosest(pos, areas);
                $(editAreaController.data.addLayer).mousemove(function (e) {
                    _point.x = e.offsetX;
                    _point.y = e.offsetY;
                    _canvas.update();
                });
                return true;
        }

        return false;
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

        _original.x = _point.x;
        _original.y = _point.y;
    }

    function endEdit(pos) {
        $(editAreaController.data.addLayer).off('mousemove');
        _original = {};
        _point = null;
        _area = null;
    }

    return {
        "click": function (pos) {
            if (_point === null) {
                return beginEdit(pos);
            } else {
                var result = endEdit(pos);
                _canvas.update();
                $(_parent).trigger('closeController');
                return result;
            }
        },
        "close": function () {
            console.log("closing editAreaController");
            if (_area !== null)
                _area[_area.indexOf(_point)] = _original;
            _canvas.update();
        }
    };
}