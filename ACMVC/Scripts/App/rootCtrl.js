(function (app) {
    'use strict';

    app.controller('rootCtrl', rootCtrl);

    rootCtrl.$inject = ['$scope', '$http']

    function rootCtrl($scope, $http) {

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
        }).error(function() {
            alert("Not logged in");
        });


    }

})(angular.module('accessControl'));