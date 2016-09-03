(function (app) {
    'use strict';

    app.controller('deviceCtrl', deviceCtrl);

    deviceCtrl.$inject = ['$scope', 'deviceFactory', 'zoneFactory', 'notificationService'];

    function deviceCtrl($scope, deviceFactory, zoneFactory, notificationService) {
        $scope.devices = [];
        $scope.zones = []
        $scope.newDevice = {};
        $scope.addMode = false;
        var editMode = false;
        $scope.DeviceTypes = angular.copy(DeviceTypes);

        $scope.statuses = [
            { Id: 1, Type: "Active" },
            { Id: 1003, Type: "Inactive" }
        ];

        var getDevices = function () {
            deviceFactory.getDevice().success(function (data) {
                $scope.devices = data;
            }).error(function (err) {
                notificationService.displayError("Could not load data");
                console.log(err);
            });
        }
        getDevices();

        zoneFactory.getZone().success(function (data) {
            $scope.zones = data;
        }).error(function (err) {
            notificationService.displayError("Could not load data");
            console.log(err);
        });

        $scope.toggleAddMode = function () {
            $scope.addMode = !$scope.addMode;
        };

        $scope.toggleEditMode = function (item) {
            item.editMode = !item.editMode;
        };

        $scope.addDevice = function () {
            deviceFactory.addDevice($scope.newDevice)
                .success(function () {
                    $scope.newDevice = {};
                    $scope.toggleAddMode();
                    getDevices();
                })
                .error(function (err) {
                    notificationService.displayError(err);
                    console.log(err);
                });
        };

        $scope.deleteDevice = function (device) {
            deviceFactory.deleteDevice(device)
                .success(function (data) {
                    helperLib.deleteItem(device, $scope.devices);
                })
                .error(function (err) {
                    notificationService.displayError("Could not delete data");
                    console.log(err);
                });
        };

        $scope.updateDevice = function (device) {
            deviceFactory.updateDevice(device)
                .success(function(data) {
                    device.editMode = false;
                    getDevices();
                })
                .error(function(err) {
                    notificationService.displayError("Could not update data");
                    console.log(err);
                });
        };

        $scope.getZoneName = function(id) {
            for (var i = 0; i < $scope.zones.length; i++) {
                if ($scope.zones[i].Id == id) {
                    return $scope.zones[i].Name;
                }
            }
        };


    }


})(angular.module('accessControl'));