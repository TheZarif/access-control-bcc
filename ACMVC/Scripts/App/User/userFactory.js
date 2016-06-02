(function (app) {
    'use strict';

    app.factory('userFactory', userFactory);

    userFactory.$inject = ['$http'];

    function userFactory($http) {
        return {
            getUser: function (page, search) {
                if (!page) page = 1;
                if (!search) search = "";
                return $http.get(baseUrl + "users/getall?page=" + page + "&search=" + search);
            },
            addUser: function (user) {
                console.log("Method not implemented");
                return $http.post(baseUrl + "users/create", user);
            },
            deleteUser: function (user) {
                return $http.post(baseUrl + "users/delete/" + user.Id);
            },
            updateUser: function (user) {
                console.log("User: ", user);
                return $http.post(baseUrl + "users/UpdateUser/" + user.Id, user);
            },
            getUserDetails: function(id) {
                return $http.get(baseUrl + "users/Details/" + id);
            },
            findUser: function (email, phone) {
                return $http.post(baseUrl + "users/SearchUser",
                    {
                        "searchModel": {
                            Email: email,
                            Phone: phone
                        }
                    });
            },
            resetPassword: function (user, password) {
                return $http.post(baseUrl + "manage/ResetPassword", { "user": user, "password": password });
            },
            addRole: function(user, role) {
                return $http.post(baseUrl + "users/addRole",
                {
                    "user": user,
                    "role": role
                });
            },
            removeRole: function (user, role) {
                return $http.post(baseUrl + "users/removeRole",
                {
                    "user": user,
                    "role": role
                });
            },
            getLoginDetails: function() {
                return $http.post(baseUrl + "manage/GetLoginDetails");
            }
        };
    }

})(angular.module('accessControl'));