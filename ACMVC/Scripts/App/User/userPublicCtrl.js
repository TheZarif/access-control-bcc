(function (app) {
    'use strict';

    app.controller('userPublicCtrl', userPublicCtrl);

    userPublicCtrl.$inject = ['$scope', 'userFactory', 'notificationService'];

    function userPublicCtrl($scope, userFactory, notificationService) {

        $scope.designations = {};

        userFactory.getUserByDesignation().success(function (data) {
            $scope.designations = data;
        }).error(function(err) {
            console.log(err);
            notificationService.displayError("Error getting data");
        });

        
    }


})(angular.module("accessControl"));