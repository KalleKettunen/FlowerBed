function edgeController(repository, canvas, parent, zoom) {
    var _repository = repository,
        _canvas = canvas,
        _path = [],
        _point = {},
        _geometry = edgeController.data.geometry,
        _parent = parent,
        _zoom = zoom;

    function edge(pos) {
        return { "start": _point, "end": pos };
    }

    function addEdge(pos) {
        _path.push(pos);
    }

    function startEdge(pos) {
        console.log("startEdge click");
        _point = pos;
        addEdge(pos);
        $(edgeController.data.addLayer).mousemove(function (e) {
            var mousePos = { 'x': e.offsetX / _zoom.scale(1), 'y': e.offsetY / _zoom.scale(1) };
            _canvas.drawPath(_path);
            
            if (_geometry.sqrDistance(_path[0], mousePos) < 30) {
                _canvas.drawCircle(_path[0], 10, "#7FFFD4");
            }
            _canvas.update();
            _canvas.drawEdge(edge(mousePos));
            
        });
    }

    function finalisePath() {
        _repository.Planting().area.push({ points: _path });
        $(edgeController.data.addLayer).off('mousemove');
    }

    return {
        "click": function (pos) {
            if (_path.length > 0 && _geometry.sqrDistance(_path[0], pos) < 30) {
                finalisePath();
                _canvas.update();
                $(_parent).trigger('closeController');
            } else {
                startEdge(pos);
                _canvas.drawPath(_path);
            }
        },
        "close": function() {
            console.log("closing");
            _canvas.clearWork();
            _canvas.update();
        }   
    };
}