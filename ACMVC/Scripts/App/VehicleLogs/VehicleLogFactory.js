(function (app) {
    'use strict';

    app.factory('vehicleLogFactory', vehicleLogFactory);

    vehicleLogFactory.$inject = ['$http'];

    function vehicleLogFactory($http) {
        return {
            getVehicleLog: function (page, search) {
                if (!page) page = 1;
                if (!search) search = "";
                
                return $http.get(baseUrl + "VehicleLogs/getall?page=" + page + "&search=" + search);
            }
        };
    }

})(angular.module('accessControl'));