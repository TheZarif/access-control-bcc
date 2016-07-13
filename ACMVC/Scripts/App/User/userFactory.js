(function (app) {
    'use strict';

    app.factory('userFactory', userFactory);

    userFactory.$inject = ['$http'];

    function userFactory($http) {
        return {
            getUser: function (page, search, selectedFilter) {
                console.log(selectedFilter);
                if (!page) page = 1;
                if (!search) search = "";
                if (!selectedFilter) selectedFilter = "";
                return $http.get(baseUrl + "users/getall?page=" + page + "&search=" + search + "&selectedFilter=" + selectedFilter);
            },
            getUserByDesignation: function() {
                return $http.get(baseUrl + "users/GetByDesignation");
            },
            addUser: function (user) {
                console.log("Method not implemented");
                return $http.post(baseUrl + "users/crrreat", user);
            },
            deleteUser: function (user) {
                return $http.post(baseUrl + "users/delete/" + user.Id);
            },
            updateUser: function (user) {
                return $http.post(baseUrl + "users/UpdateUser/" + user.Id, user);
            },
            updateUserOfficial: function (user) {
                console.log("User: ", user);
                return $http.post(baseUrl + "users/UpdateUserOfficial/", user);
            },
            getUserDetails: function(id) {
                return $http.get(baseUrl + "users/Details/" + id);
            },
            findUser: function (searchString) {
                return $http.post(baseUrl + "users/SearchUser", { "searchModel": searchString });
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
            editType: function (user, type) {
                return $http.post(baseUrl + "users/EditType",
                {
                    "user": user,
                    "isEmployee": type
                });
            },
            getLoginDetails: function() {
                return $http.post(baseUrl + "manage/GetLoginDetails");
            },
            getProfileCompletion: function(id) {
                return $http.get(baseUrl + "Users/ProfileCompletionPercent?userId=" + id);
            }
        };
    }

})(angular.module('accessControl'));