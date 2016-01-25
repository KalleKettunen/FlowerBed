function zoomController(zoom) {
    var scale = 1;

    function zoomIn(){
        scale += 0.1;
        $(zoom.scale).val(scale);
    }

    function zoomOut(){
        scale -= 0.1;
        $(zoom.scale).val(scale);
    }

    function scaleValue(value) {
        return value * scale;
    }

    $(zoom.zoomIn).click(zoomIn);
    $(zoom.zoomOut).click(zoomOut);
    $(zoom.scale).val(scale);
    $(zoom.scale).change(function () {
        scale = $(this).val();
    });

    return {
        zoomIn: zoomIn,
        zoomOut: zoomOut,
        scale: scaleValue,
        setScale : function(val) {
            scale = val;
        }
    };
}