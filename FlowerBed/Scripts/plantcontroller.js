function plantController(repository, canvas, flowerService) {
    var _repository = repository,
        _canvas = canvas,
        _flowerService = flowerService;

    return {
        "click" : function(pos) {
            var plant = {
                flower: _flowerService.selectedFlower(),
                pos: pos
            };
            main.repository.addPlant(plant);
        },
        "mousemove": function (pos) {
            var flower = _flowerService.selectedFlower();
            _canvas.drawCircle(pos, flower.width, flower.color);
            _canvas.update();
        },
        "close" : function() {
            _canvas.update();
        }
    }
}