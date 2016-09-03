(function (app) {
    'use strict';

    app.filter("dateServerToJS", function() {
        return function(serverDate) {
            var temp = serverDate.replace(/[^0-9 +]/g, '');
            return new Date(parseInt(temp));
        }
    });

    app.filter("statusString", function () {
        return function (statusId) {
            var statuses = angular.copy(Statuses);
            var id = parseInt(statusId);
            for (var i = 0; i < statuses.length; i++) {
                if (id === statuses[i].Id) {
                    return statuses[i].Type;
                }
            }
            return "N/A";
        }
    });


})(angular.module('accessControl'));