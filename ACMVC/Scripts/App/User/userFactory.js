(function (app) {
    'use strict';

    app.factory('userFactory', userFactory);

    userFactory.$inject = ['$http'];

    function userFactory($http) {
        return {
            getUser: function () {
                return $http.get(baseUrl + "users/getall");
            },
            addUser: function (user) {
                return $http.post(baseUrl + "users/create", user);
            },
            deleteUser: function (user) {
                return $http.post(baseUrl + "users/delete/" + user.Id);
            },
            updateUser: function (user) {
                return $http.post(baseUrl + "users/edit/" + user.Id, user);
            },
            findUser: function (email, phone) {
                return $http.post(baseUrl + "users/SearchUser",
                    { "searchModel": {
                        Email: email,
                        Phone : phone
                    } });
            },
            changePassword: function(user) {
                return $http.post(baseUrl + "users/ResetPassword", user);
            }
        };
    }

})(angular.module('accessControl'));