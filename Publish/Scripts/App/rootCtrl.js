﻿(function (app) {
    'use strict';

    app.controller('rootCtrl', rootCtrl);

    rootCtrl.$inject = ['$scope', '$http', '$window']

    function rootCtrl($scope, $http, $window) {

        $scope.dummy = "Hellow dummy";
        $scope.userData = {};
        $scope.userData.isLoggedIn = false;

        $scope.userData.displayUserInfo = displayUserInfo;
        $scope.logout = logout;


        function displayUserInfo() {

        }

        function logout() {

        }

        $http.get(baseUrl + "Account/checkifloggedin").success(function(data) {
            console.log("IsloggedIn", data);
            $scope.userData = data;
            $scope.userData.isLoggedIn = true;
            for (var i = 0; i < data.Roles.length; i++) {
                if (data.Roles[i].Name === "Admin") {
                    $scope.userData.isAdmin = true;
                }
                if (data.Roles[i].Name === "Employee") {
                    $scope.userData.isEmployee = true;
                }
            }
            console.log(data);
        }).error(function(err, status) {
//            alert("Not logged in with status:", status);
            $window.location.href = baseUrl + 'Account/Login';
        });


    }

})(angular.module('accessControl'));