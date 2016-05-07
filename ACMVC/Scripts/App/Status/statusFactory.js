(function (app) {
    'use strict';

    app.factory('statusFactory', statusFactory);

    statusFactory.$inject = ['$http'];

    function statusFactory($http) {
        return {
            getStatus: function () {
                return $http.get(baseUrl+ "status/getall");
            },
            addStatus: function (status) {
                return $http.post(baseUrl+ "status/create", status);
            },
            deleteStatus: function (status) {
                return $http.post(baseUrl + "status/delete/" + status.Id);
            },
            updateStatus: function (status) {
                return $http.post(baseUrl + "status/edit/" + status.Id, status);
            }
        };
    }

})(angular.module('homeCinema'));