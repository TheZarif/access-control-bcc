(function (app) {
    'use strict';

    app.factory('deviceFactory', deviceFactory);

    deviceFactory.$inject = ['$http'];

    function deviceFactory($http) {
        return {
            getDevice: function () {
                return $http.get(baseUrl + "devices/getall");
            },
            addDevice: function (device) {
                return $http.post(baseUrl + "devices/create", device);
            },
            deleteDevice: function (device) {
                return $http.post(baseUrl + "devices/delete/" + device.Id);
            },
            updateDevice: function (device) {
                return $http.post(baseUrl + "devices/edit/" + device.Id, device);
            }
        };
    }

})(angular.module('accessControl'));