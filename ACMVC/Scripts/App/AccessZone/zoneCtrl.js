(function (app) {
    'use strict';

    app.controller('zoneCtrl', zoneCtrl);

    zoneCtrl.$inject = ['$scope', 'zoneFactory', 'notificationService'];

    function zoneCtrl($scope, zoneFactory, notificationService) {
        $scope.zones = [];
        $scope.zonesDropdown = [];
        $scope.addMode = false;
        $scope.newZone = {};

        function init() {
            zoneFactory.getZone().success(function (data) {
                $scope.zones = data;
                $scope.zonesDropdown = angular.copy(data);
                $scope.zonesDropdown.push({ Id: null, Name: "None" });
            }).error(function () {
                notificationService.displayError("Could not load data");
                console.log("Could not retrieve data from server");
            });
        };

        init();

        $scope.toggleAddMode = function () {
            $scope.addMode = !$scope.addMode;
        };

        $scope.toggleEditMode = function (item) {
            item.editMode = !item.editMode;
        };

        $scope.addZone = function () {
            zoneFactory.addZone($scope.newZone)
                .success(function (data) {
                    init();
                    $scope.newZone = {};
                    $scope.toggleAddMode();
                })
                .error(function(err) {
                    notificationService.displayError("Could not add data");
                    console.log(err);
                });
        };

        $scope.zoneString = function(id) {
            for (var i = 0; i < $scope.zonesDropdown.length; i++) {
                if ($scope.zonesDropdown[i].Id === id) {
                    return $scope.zonesDropdown[i].Name;
                };
            }
            return "N/A";
        };

        $scope.deleteZone = function (zone) {
            zoneFactory.deleteZone(zone)
                .success(function(data) {
                    helperLib.deleteItem(zone, $scope.zones);
                })
                .error(function(err) {
                    notificationService.displayError("Could not delete data");
                    console.log(err);
                });
        };

        $scope.updateZone = function (zone) {
            zoneFactory.updateZone(zone)
                .success(function (data) {
                    init();
                })
                .error(function(err) {
                    notificationService.displayError("Could not update data");
                    console.log(err);
                });
        };
    }
})(angular.module('accessControl'));