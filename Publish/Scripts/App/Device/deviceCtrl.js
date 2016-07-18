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
        $scope.DeviceTypes = [
           {
               Id: 1,
               Name: "Door"
           },
           {
               Id: 2,
               Name: "Flapgate"
           },
           {
               Id: 3,
               Name: "Vehicle Control"
           }
        ];

        deviceFactory.getDevice().success(function (data) {
            $scope.devices = data;
        }).error(function () {
            notificationService.displayError("Could not load data");
            console.log(err);
        });

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
                .success(function (data) {
                    $scope.devices.push(data);
                    $scope.newDevice = {};
                    $scope.toggleAddMode();
                    data.ZoneName = $scope.getZoneName(data.AccessZoneId);
                })
                .error(function (err) {
                    notificationService.displayError("Could not add data");
                    console.log(err);
                })
        };

        $scope.deleteDevice = function (device) {
            deviceFactory.deleteDevice(device)
                .success(function (data) {
                    helperLib.deleteItem(device, $scope.devices);
                })
                .error(function (err) {
                    notificationService.displayError("Could not delete data");
                    console.log(err);
                })
        };

        $scope.updateDevice = function (device) {
            deviceFactory.updateDevice(device)
                .success(function (data) {
                    device.editMode = false;
                    device.ZoneName = $scope.getZoneName(device.AccessZoneId);
                })
                .error(function (err) {
                    notificationService.displayError("Could not update data");
                    console.log(err)
                })
        };

        $scope.getZoneName = function (id) {
            for (var i = 0; i < $scope.zones.length; i++) {
                if ($scope.zones[i].Id == id) {
                    return $scope.zones[i].Name;
                }
            }
        }


    }


})(angular.module('accessControl'));