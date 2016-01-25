function repository() {

    var _flowers = [],
        _flowerbed = {};

    return {
                Flowers : function(flowers) {
                    if (flowers !== undefined) {
                        _flowers = flowers;
                    }
                    return _flowers;
                },
                FlowerBed : function(flowerbed) {
                    if (flowerbed !== undefined) {
                        _flowerbed = flowerbed;
                    }
                    return _flowerbed;
                }
           };
}
