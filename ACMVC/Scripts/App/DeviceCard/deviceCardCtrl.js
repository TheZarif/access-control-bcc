(function (app) {
    'use strict';

    app.controller('deviceCardCtrl', deviceCardCtrl);

    deviceCardCtrl.$inject = ['$scope', 'deviceCardFactory', 'deviceFactory', 'cardFactory', 'statusFactory' ,'notificationService'];

    function deviceCardCtrl($scope, deviceCardFactory, deviceFactory, cardFactory, statusFactory, notificationService) {
        $scope.deviceCards = [];
        $scope.devices = [];
        $scope.cards = [];
        $scope.statuses = [];
        $scope.newDeviceCard = {};

        $scope.addMode = false;

        deviceCardFactory.getDeviceCard().success(function (data) {
            $scope.deviceCards = data;
        }).error(function () {
            notificationService.displayError("Could not load data");
            console.log(err);
        });

        deviceFactory.getDevice().success(function (data) {
            $scope.devices = data;
        }).error(function (err) {
            notificationService.displayError("Could not load data");
            console.log(err);
        });

        statusFactory.getStatus().success(function (data) {
            $scope.statuses = data;
        }).error(function (err) {
            console.log(err);
        });

        $scope.$watch("newDeviceCard.CardIdNumber", function (newVal, oldVal) {
            cardFactory.getCardNumberAutocomplete(newVal)
                .success(function (data) {
                    $scope.cards = data;
                }).error(function (err) {
                    console.log(err);
                });
        });

        $scope.toggleAddMode = function () {
            $scope.addMode = !$scope.addMode;
        };

        $scope.toggleEditMode = function (item) {
            item.editMode = !item.editMode;
        };

        $scope.addDeviceCard = function () {
            if ($scope.cards.length != 0 && $scope.devices.length != 0) {
                var index = $scope.findElement($scope.devices, "Name", $scope.newDeviceCard.DeviceName);
                $scope.newDeviceCard.DeviceId = $scope.devices[index].Id;

                index = $scope.findElement($scope.cards, "IdNumber", $scope.newDeviceCard.CardIdNumber);
                $scope.newDeviceCard.CardId = $scope.cards[index].Id;

                console.log("NewDeviceCard", $scope.newDeviceCard);
            } else {
                console.log("Invalid Model");
            }

            deviceCardFactory.addDeviceCard($scope.newDeviceCard)
                .success(function(data) {
                    $scope.deviceCards.push(data);
                    $scope.newDeviceCard = {};
                    $scope.toggleAddMode();
                    data.DeviceName = $scope.getDeviceName(data.DeviceId);
                    data.CardNumber = $scope.cards[$scope.findElement($scope.cards, "Id", data.CardId)].Number;
                    data.StatusType = $scope.statuses[$scope.findElement($scope.statuses, "Id", data.StatusId)].Type;
                })
                .error(function(err) {
                    notificationService.displayError("Could not add data");
                    console.log(err);
                });
        };

        $scope.deleteDeviceCard = function (deviceCard) {
            deviceCardFactory.deleteDeviceCard(deviceCard)
                .success(function(data) {
                    helperLib.deleteItem(deviceCard, $scope.deviceCards);
                })
                .error(function(err) {
                    notificationService.displayError("Could not delete data");
                    console.log(err);
                });
        };

        $scope.updateDeviceCard = function (deviceCard) {
            deviceCardFactory.updateDeviceCard(deviceCard)
                .success(function (data) {
                    deviceCard.editMode = false;
                    deviceCard.DeviceName = $scope.getDeviceName(deviceCard.AccessDeviceId);
                })
                .error(function (err) {
                    notificationService.displayError("Could not update data");
                    console.log(err)
                })
        };

        $scope.getDeviceName = function (id) {
            for (var i = 0; i < $scope.devices.length; i++) {
                if ($scope.devices[i].Id == id) {
                    return $scope.devices[i].Name;
                }
            }
        }

        $scope.findElement = function (array, column, data) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][column] == data) {
                    return i;
                }
            }
            return -1;
        }
    }
})(angular.module('accessControl'));