function dateController(data) {
    var date = {};

    function getDate()
    {
        return date;
    }
    function change() {
        $(data.update).trigger("update");
    }

    $(data.dateControl).change(function () {
        var dayOfYear = $(this).val();
        var year = new Date($(data.date).val()).getFullYear();
        $(data.date).val(DateUtils.dateFromDayOfYear(dayOfYear, year).toISOString().substring(0, 10));
        date = new Date($(data.date).val());
        change();
    });

    $(data.date).change(function () {
        $(data.dateControl).attr("max", DateUtils.daysInYear(new Date($(this).val())));
        $(data.dateControl).val(DateUtils.dayOfYear(new Date($(this).val())));
        date = new Date($(data.date).val());
        change();
    });

    $(data.date).val(new Date().toISOString().substring(0, 10));
    $(data.dateControl).val(DateUtils.dayOfYear(new Date($(data.date).val())));

    date = new Date($(data.date).val());

    return {
        currentDate : function() {
            return date;
        },
        dayOfYear : function() {
            return DateUtils.dayOfYear(date);
        },
        month : function() {
            return date.getMonth()+1;
        }
    };
}