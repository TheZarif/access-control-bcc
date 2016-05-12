(function (app) {
    'use strict';

    app.factory('zoneFactory', zoneFactory);

    zoneFactory.$inject = ['$http'];

    function zoneFactory($http) {
        return {
            getZone: function () {
                return $http.get(baseUrl + "Zones/getall");
            },
            addZone: function (zone) {
                return $http.post(baseUrl + "Zones/create", zone);
            },
            deleteZone: function (zone) {
                return $http.post(baseUrl + "Zones/delete/" + zone.Id);
            },
            updateZone: function (zone) {
                return $http.post(baseUrl + "Zones/edit/" + zone.Id, zone);
            }
        };
    }

})(angular.module('accessControl'));