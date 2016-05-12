(function (app) {
    'use strict';

    app.controller('statusCtrl', statusCtrl);

    statusCtrl.$inject = ['$scope', 'statusFactory', 'notificationService'];

    function statusCtrl($scope, statusFactory, notificationService) {
        $scope.statuses = [];
        $scope.addMode = false;
        $scope.newStatus = {};
        var editMode = false;

        statusFactory.getStatus().success(function (data) {
            $scope.statuses = data;
        }).error(function () {
            notificationService.displayError("Could not retrieve data");
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
                    notificationService.displayError("Could not add data");
                    console.log(err);
                })
        };

        $scope.deleteStatus = function (status) {
            statusFactory.deleteStatus(status)
                .success(function (data) {
                    helperLib.deleteItem(status, $scope.statuses);
                })
                .error(function (err) {
                    notificationService.displayError("Could not delete data");
                    console.log(err);
                })
        };

        $scope.updateStatus = function (status) {
            statusFactory.updateStatus(status)
                .success(function (data) {
                    status.editMode = false;
                })
                .error(function () {
                    notificationService.displayError("Could not update data");
                })
        };
    }

})(angular.module('accessControl'));