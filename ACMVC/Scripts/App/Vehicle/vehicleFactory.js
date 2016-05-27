(function (app) {
    'use strict';

    app.factory('vehicleFactory', vehicleFactory);

    vehicleFactory.$inject = ['$http'];

    function vehicleFactory($http) {
        return {
            getVehicle: function (page) {
                if (!page) page = 1;
                return $http.get(baseUrl + "vehicle/getall?page=" + page);
            },
            addVehicle: function (vehicle) {
                return $http.post(baseUrl + "vehicle/create", vehicle);
            },
            deleteVehicle: function (vehicle) {
                return $http.post(baseUrl + "vehicle/delete/" + vehicle.Id);
            },
            updateVehicle: function (vehicle) {
                return $http.post(baseUrl + "vehicle/edit/" + vehicle.Id, vehicle);
            }
        };
    }

})(angular.module('accessControl'));