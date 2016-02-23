function edgeController(repository, canvas) {
    var _repository = repository,
        _canvas = canvas,
        _area = [],
        _point = {};

    function addEdge(pos) {
        console.log(pos);
    }

    return {
        "click": function(pos) {
            console.log("add edge click");
            _point = pos;
            $(edgeController.data.addLayer).mousemove(function(e) {
                _canvas.update();
                _canvas.drawEdge({ "start": _point, "end": { "x": e.offsetX, "y": e.offsetY } });
            });
        },
        "close": function() {
            
        }
    };
}