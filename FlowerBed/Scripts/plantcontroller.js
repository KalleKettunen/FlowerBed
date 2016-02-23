function plantController(repository, canvas) {
    var _repository = repository,
        _canvas = canvas;

    return {
        "click" : function(pos) {
            var plant = {
                flower: _repository.findFlower($(plantController.data.selectedFlower).val()),
                pos: pos
            };
            main.repository.addPlant(plant);
        }
    }
}