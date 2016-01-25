function repository(callback) {
    var _planting = [],
        _edges = [],
        _flowers = [],
        _objectid = 0,
        ready = 0;

    

    return {
        init : function() {
            return $.get("api/Flowers/Get",
                function(data) {
                    _flowers = data;
                    var options = $("#selectFlower");
                    data.forEach(function(flower) {
                        options.append(new Option(flower.name, flower.name));
                    });
                    console.log("get flowers done");

                });
        },
        Planting :function(planting) {
            if (planting !== undefined) {
                _planting = planting;
                _planting[0].plants.forEach(function(flower) {
                    flower.id = _objectid++;
                    flower.Name = function() { return this.flower.name + " " + this.id; };
                });
            }

            return _planting;
        },
        Flowers : function(flowers) {
            if (flowers !== undefined) {
                _flowers = flowers;
            }

            return _flowers;
        },
        Edges : function(edges) {
            if (edges !== undefined) {
                _edges = edges;
                _edges.forEach(function (edge) {
                    edge.id = _objectid++;
                    edge.Name = function () { return "edge_"+this.id; };
                });
            }

            return _edges;
        },

        findObject : function (id) {
            var obj = [];
            obj =_planting[0].plants.filter(function (elem) { return elem.id === id; });
            if (obj.length === 0) {
                obj = _edges.filter(function (elem) { return elem.id === id; });
            }

            return obj;
        },
        findFlower : function(name) {
            var flower = _flowers.filter(function (elem) { return elem.name === name; });
            return flower[0];
        },
        addPlant: function (plant) {
            plant.id = _objectid++;
            plant.Name = function () { return this.flower.name + " " + this.id; };
            _planting[0].plants.push(plant);
        },

        db : {
            addFlower :function(flower) {
                $.post('api/Flowers/Add', flower, function(data) {
                    
                });
            },
            updateFlower : function(flower) {
                $.post('api/Flowers/Update', flower);
            },

            getPlanting : function(id) {
                $.get('api/Planting/'+id)
            }
        }

    };
}
