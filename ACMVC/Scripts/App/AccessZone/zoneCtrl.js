(function (app) {
    'use strict';

    app.controller('zoneCtrl', zoneCtrl);

    zoneCtrl.$inject = ['$scope', 'zoneFactory', 'notificationService'];

    function zoneCtrl($scope, zoneFactory, notificationService) {
        $scope.zones = [];
        $scope.addMode = false;
        $scope.newZone = {};
        var editMode = false;

        zoneFactory.getZone().success(function (data) {
            $scope.zones = data;
        }).error(function () {
            notificationService.displayError("Could not load data");
            console.log("Could not retrieve data from server");
        });

        $scope.toggleAddMode = function () {
            $scope.addMode = !$scope.addMode;
        };

        $scope.toggleEditMode = function (item) {
            item.editMode = !item.editMode;
        };

        $scope.addZone = function () {
            zoneFactory.addZone($scope.newZone)
                .success(function (data) {
                    $scope.zones.push(data);
                    $scope.newZone = {};
                    $scope.toggleAddMode();
                })
                .error(function (err) {
                    notificationService.displayError("Could not add data");
                    console.log(err);
                })
        };

        $scope.deleteZone = function (zone) {
            zoneFactory.deleteZone(zone)
                .success(function (data) {
                    helperLib.deleteItem(zone, $scope.zones);
                })
                .error(function (err) {
                    notificationService.displayError("Could not delete data");
                    console.log(err);
                })
        };

        $scope.updateZone = function (zone) {
            zoneFactory.updateZone(zone)
                .success(function (data) {
                    zone.editMode = false;
                })
                .error(function (err) {
                    notificationService.displayError("Could not update data");
                    console.log(err)
                })
        };



    }


})(angular.module('accessControl'));