(function (app) {
    'use strict';

    app.factory('deviceCardFactory', deviceCardFactory);

    deviceCardFactory.$inject = ['$http'];

    function deviceCardFactory($http) {
        return {
            getDeviceCard: function (page, search) {
                if (!page) page = 1;
                if (!search) search = "";
                return $http.get(baseUrl + "deviceCardMaps/getall?page=" + page + "&search=" + search);
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