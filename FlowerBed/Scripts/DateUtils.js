var DateUtils = {
    dateFromValue: function (millisec) {
        var d = new Date();
        d.setTime(millisec);

        return d;
    },

    dayOfYear : function(date){
        var year = date.getFullYear();
        var firstDate = new Date();

        firstDate.setFullYear(year);
        firstDate.setMonth(0);
        firstDate.setDate(1);
        
        return (date - firstDate) / (1000 * 60 * 60 * 24);
    },

    daysInYear: function (date) {
        var year = date.getFullYear();
        var firstDate = new Date(), lastDate = new Date();
        
        firstDate.setFullYear(year);
        firstDate.setMonth(0);
        firstDate.setDate(1);

        lastDate.setFullYear(year);
        lastDate.setMonth(11);
        lastDate.setDate(31);

        return (lastDate - firstDate) / (1000 * 60 * 60 * 24);
    },

    dateFromDayOfYear : function(day, year) {
        var d = new Date(year, 0, 1);

        return this.dateFromValue(day * (1000 * 60 * 60 * 24) + d.valueOf());
    }
};