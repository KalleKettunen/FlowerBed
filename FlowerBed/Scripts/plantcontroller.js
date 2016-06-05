function plantController(repository, canvas, flower) {
    var _repository = repository,
        _canvas = canvas,
        _flower = flower;

    return {
        "click" : function(pos) {
            var plant = {
                flower: _flower,
                pos: pos
            };
            main.repository.addPlant(plant);
        },
        "mousemove": function(pos) {
            _canvas.drawCircle(pos, _flower.width, _flower.color);
            _canvas.update();
        },
        "close" : function() {
            _canvas.update();
        }
    }
}