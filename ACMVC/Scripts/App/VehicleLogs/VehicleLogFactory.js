(function (app) {
    'use strict';

    app.factory('vehicleLogFactory', vehicleLogFactory);

    vehicleLogFactory.$inject = ['$http'];

    function vehicleLogFactory($http) {
        return {
            getVehicleLog: function (page) {
                if (!page) page = 1;
                return $http.get(baseUrl + "VehicleLogs/getall?page=" + page );
            }
        };
    }

})(angular.module('accessControl'));