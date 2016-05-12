(function (app) {
    'use strict';

    app.controller('rootCtrl', rootCtrl);

    rootCtrl.$inject = ['$scope', '$http']

    function rootCtrl($scope, $http) {

        $scope.userData = {};
        $scope.userData.isLoggedIn = false;

        $scope.userData.displayUserInfo = displayUserInfo;
        $scope.logout = logout;


        function displayUserInfo() {

        }

        function logout() {

        }

        $http.get(baseUrl + "Account/checkifloggedin").success(function(data){
            $scope.userData.userName = data;
            $scope.userData.isLoggedIn = true;
        }).error(function () {
            alert("Not logged in");
        })
    }

})(angular.module('accessControl'));