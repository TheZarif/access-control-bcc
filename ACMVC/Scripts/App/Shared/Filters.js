(function (app) {
    'use strict';

    app.filter("dateServerToJS", function() {
        return function(serverDate) {
            var temp = serverDate.replace(/[^0-9 +]/g, '');
            return new Date(parseInt(temp));
        }
    });


})(angular.module('accessControl'));