(function (app) {
    'use strict';

    app.controller('rootCtrl', rootCtrl);

    rootCtrl.$inject = ['$scope', '$http', '$window', 'authFactory', 'userFactory'];

    function rootCtrl($scope, $http, $window, authFactory, userFactory) {

        $scope.userData = {};
        $scope.userData.isLoggedIn = false;

        $http.get(baseUrl + "Account/checkifloggedin").success(function (data) {
            console.log("IsloggedIn", data);
            $scope.userData = data;
            $scope.userData.isLoggedIn = true;
            for (var i = 0; i < data.Roles.length; i++) {
                if (data.Roles[i].Name === "Admin") {
                    $scope.userData.isAdmin = true;
                }
                if (data.Roles[i].Name === "Official") {
                    $scope.userData.isOfficial = true;
                }
            }
            $scope.userData.isVisitor = !data.isEmployee;
            authFactory.userData = $scope.userData;

            userFactory.getProfileCompletion(data.Id).success(function (data) {
                authFactory.profileCompletionData = data;
            }).error(function (err) {
                console.log(err);
            });

        }).error(function () {
            //$window.location.href = baseUrl + 'Account/Login';
            $window.location.href = baseUrl + 'Home/dash';
        });
    }

})(angular.module('accessControl'));