function flowerManager(repository) {
    var _repository = repository,
        months = {
            "I": 1,
            "II": 2,
            "III": 3,
            "IV": 4,
            "V": 5,
            "VI": 6,
            "VII":7,
            "VIII" : 8,
            "IX" :9,
            "X": 10,
            "XI": 11,
            "XII" : 12
        },
        selectedFlowerId;
    
    function getRomanMonth(month) {
        var result = Object.keys(months).filter(function (elem) { return months[elem] == month; });

        if (result.length > 0) {
            return result;
        } else {
            return "Error";
        }
    }
    function setMonth(control, month) {
        var value = getRomanMonth(month);
        $(control).val(month);
        $(control).html(value + ' <span class="caret"></span>');
    }
    function selectFlower(flower) {
        selectedFlowerId = flower.id;
        $("#flowerManager-Name").val(flower.name);
        $("#flowerManager-Color").val(flower.color);
        $("#flowerManager-Width").val(flower.width);
        $("#flowerManager-Height").val(flower.height);
        setMonth("#flowerManager-StartDate", flower.startDate);
        setMonth("#flowerManager-EndDate", flower.endDate);
    }

    function createFlower() {
        return {
            "id"  : 0,
            "name": $("#flowerManager-Name").val(),
            "color": $("#flowerManager-Color").val(),
            "width": $("#flowerManager-Width").val(),
            "height": $("#flowerManager-Height").val(),
            "startDate" : $("#flowerManager-StartDate").val(),
            "endDate": $("#flowerManager-EndDate").val()

            };
    }

    var manager = {
        addFlower: function () {
            var flower = createFlower();
            repository.Flowers().push(flower);
            repository.db.addFlower(flower);
        },
        updateFlower: function () {
            var flower = createFlower();
            flower.id = selectedFlowerId;
            var repFlower = repository.Flowers().filter(function (f) { return f.id === flower.id })[0];
            for (var i in flower) repFlower[i] = flower[i];
            repository.db.updateFlower(flower);
        }
    };

    _repository.Flowers().forEach(function (elem) {
        $("#flowerManager-flowers").append("<li><a href='#'>" + elem.name + "</a></li>").find("li a").last().attr("data-id", elem.name);
    });

    $(".dropdown-menu li a").click(function (e) {
        var id = $(e.target).attr("data-id");
        selectFlower(_repository.Flowers().filter(function (v) { return v.name === id })[0]);
    });

    $("#manage_flowers").click(function () {
        $("#flowerManager").dialog({width : 1000, height : 600});
    });

    $("#flowerManager-add").click(manager.addFlower);
    $("#flowerManager-save").click(manager.updateFlower);
   
    Object.keys(months).forEach(function(obj) {
        $(".month-select").append("<li><a href='#' data-id="+'"'+months[obj]+'"'+">" + obj + "</a></li>");
    });

    $(".dropdown-menu li a").click(function () {
        $(this).parents(".dropdown").find(".btn").html($(this).text() + ' <span class="caret"></span>');
        $(this).parents(".dropdown").find(".btn").val($(this).data("id"));
    });
    
    return manager;
}