function workController(controllers, repository, canvas, data) {

    var currentController = {},
        _controllers = controllers,
        _repository = repository,
        _canvas = canvas;

    function activateAddLayer() {
        $(data.addLayer).zIndex(10).toggleClass("hidden");
    }

    // Add layer click eventhandler.
    $(data.addLayer).click(function (event) {
        event.stopPropagation();

        currentController.click({ x: event.offsetX, y: event.offsetY });

        main.canvas.update();
    });

    $(data.addFlower).click(function() {
        activateAddLayer();
        currentController = controllers.plant(_repository, _canvas);
    });

    $(data.addArea).click(function () {
        activateAddLayer();
        currentController = controllers.edge(_repository, _canvas);
    });

    $(document).keyup(function(e) {
        if (e.keyCode === 27) {
            // TODO: controlled controller shutdown.
            //currentController = currentController.close();
            currentController = {};
            $(data.addLayer).zIndex(1).toggleClass("hidden");
        }
    })
    return {};
}

