(function (app) {
    'use strict';

    app.factory('roleFactory', roleFactory);

    roleFactory.$inject = ['$http'];

    function roleFactory($http) {
        return {
            getRole: function () {
                return $http.get(baseUrl + "roles/getall");
            },
            addRole: function (role) {
                return $http.post(baseUrl + "roles/create", role);
            },
            deleteRole: function (role) {
                return $http.post(baseUrl + "roles/delete/" + role.Id);
            },
            updateRole: function (role) {
                return $http.post(baseUrl + "roles/edit/" + role.Id, role);
            }
        };
    }

})(angular.module('accessControl'));