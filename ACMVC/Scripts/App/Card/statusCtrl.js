(function (app) {
    'use strict';

    app.controller('statusCtrl', statusCtrl);

    statusCtrl.$inject = ['$scope', 'statusFactory'];

    function statusCtrl($scope, statusFactory, apiService, notificationService) {
        $scope.statuses = [];
        $scope.addMode = false;
        $scope.newStatus = {};
        var editMode = false;

        statusFactory.getStatus().success(function (data) {
            $scope.statuses = data;
        }).error(function () {
            //show error
            console.log("Could not retrieve data from server");
        });

        $scope.toggleAddMode = function () {
            $scope.addMode = !$scope.addMode;
        };

        $scope.toggleEditMode = function (item) {
            item.editMode = !item.editMode;
        };

        $scope.addStatus = function () {
            statusFactory.addStatus($scope.newStatus)
                .success(function (data) {
                    $scope.statuses.push(data);
                    $scope.newStatus = {};
                    $scope.toggleAddMode();
                })
                .error(function (err) {
                    //TODO: Toastr Notification error
                    console.log(err);
                })
        };

        $scope.deleteStatus = function (status) {
            statusFactory.deleteStatus(status)
                .success(function (data) {
                    //TODO: Remove item from list
                    helperLib.deleteItem(status, $scope.statuses);
                })
                .error(function (err) {
                    //TODO: Toastr Notification error
                    console.log(err);
                })
        };

        $scope.updateStatus = function (status) {
            statusFactory.updateStatus(status)
                .success(function (data) {
                    status.editMode = false;
                })
                .error(function () {
                    //TODO: Toastr Notification error
                })
        };
    }

})(angular.module('homeCinema'));