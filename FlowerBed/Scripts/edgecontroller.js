function edgeController(repository, canvas) {
    var _repository = repository,
        _canvas = canvas,
        _path = [],
        _point = {},
        _geometry = edgeController.data.geometry;

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
            var mousePos = { 'x': e.offsetX, 'y': e.offsetY };
            _canvas.update();
            _canvas.drawEdge(edge(mousePos));
            if (_geometry.sqrDistance(_path[0], mousePos) < 30) {
                _canvas.drawCircle(_path[0], 10, "#7FFFD4");
            } else {
                _canvas.removeCircle();
            }
        });
    }

    return {
        "click": function (pos) {
            
            startEdge(pos);
            _canvas.drawPath(_path);
        },
        "close": function() {
            
        }   
    };
}