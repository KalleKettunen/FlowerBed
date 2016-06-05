function plantingController(repository, canvas, data) {
    var _repository = repository,
        _canvas = canvas;

    
    var planting = {
        load: function (id) {
            repository.db.getPlanting(id, function(planting) {
                processPlanting(planting);
                canvas.init({ "planting": planting, "date": main.date });
                canvas.update();
            });
        },
        save: function() {
            return repository.db.savePlanting();
        },
        create: function () {
            var planting = { area: [], plants: [] };
            repository.Planting(planting);
            canvas.init({ "planting": planting, "date": main.date });
            canvas.update();
        }

    };

    _repository.db.getPlantings(function(result) {
        result.forEach(function(item) {
            $(data.select).append("<option value='"+item.id+"'>" + item.name + "</option>");
        });
    });

    $(data.load).click(function() {
        planting.load($(data.select).val());
    });

    $(data.save).click(function() {
        planting.save();
    });

    $(data.create).click(function() {
        planting.create();
    });

    $(data.open).click(function() {
        $(data.dialog).dialog();
    });

    function processPlanting(planting) {
        $(data.name).text(planting.name);
        _repository.Edges(createEdges(planting.area));
    }

    function createPlanting(name) {
        return {
            area: [],
            name: name,
            owner: "",
            plants: []
        };
    }

    return planting;
}