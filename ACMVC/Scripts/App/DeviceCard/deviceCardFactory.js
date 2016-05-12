(function (app) {
    'use strict';

    app.factory('deviceCardFactory', deviceCardFactory);

    deviceCardFactory.$inject = ['$http'];

    function deviceCardFactory($http) {
        return {
            getDeviceCard: function () {
                return $http.get(baseUrl + "deviceCardMaps/getall");
            },
            addDeviceCard: function (deviceCard) {
                return $http.post(baseUrl + "deviceCardMaps/create", deviceCard);
            },
            deleteDeviceCard: function (deviceCard) {
                return $http.post(baseUrl + "deviceCardMaps/delete/" + deviceCard.Id);
            },
            updateDeviceCard: function (deviceCard) {
                return $http.post(baseUrl + "deviceCardMaps/edit/" + deviceCard.Id, deviceCard);
            }
        };
    }

})(angular.module('accessControl'));