function workController(controllers, repository, canvas, flowerService,zoom, data) {

    var currentController = {},
        _controllers = controllers,
        _repository = repository,
        _canvas = canvas,
        _flowerService = flowerService,
        self = {
            init: function() {
                $(this).on("closeController", closeController);
                return this;
            }
        },
        _zoom = zoom;

    function activateAddLayer() {
        $(data.addLayer).zIndex(10).toggleClass("hidden");
    }

    function closeController() {
        currentController = currentController.close();
        $(data.addLayer).zIndex(1).toggleClass("hidden");
    }

    // Add layer click eventhandler.
    $(data.addLayer).click(function (event) {
        event.stopPropagation();

        currentController.click({ x: event.offsetX / _zoom.scale(1), y: event.offsetY / _zoom.scale(1) });

        main.canvas.update();
    });

    $(data.addFlower).click(function() {
        activateAddLayer();
        currentController = controllers.plant(_repository, _canvas, _flowerService);
    });

    $(data.addLayer).mousemove(function (e) {
        if (currentController.mousemove) {
            currentController.mousemove({ x: event.offsetX , y: event.offsetY });
        }
    });

    $(data.addArea).click(function () {
        activateAddLayer();
        currentController = controllers.edge(_repository, _canvas, self, _zoom);
    });

    $(document).keyup(function(e) {
        if (e.keyCode === 27) {
            // TODO: controlled controller shutdown.
            closeController();
        }
    });
    
    return self.init();
}

