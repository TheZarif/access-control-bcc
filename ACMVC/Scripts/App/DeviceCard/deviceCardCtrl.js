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
        $scope.search = "";

        $scope.searchItems = function() {
            $scope.getDeviceCards(1, $scope.search);
        }

        $scope.getDeviceCards = function(page, search) {
            deviceCardFactory.getDeviceCard(page, search).success(function (data) {
                $scope.deviceCards = data.Items;
                $scope.totalPages = data.Pager.TotalPages;
                $scope.totalItems = data.Pager.TotalItems;
                $scope.currentPage = data.Pager.CurrentPage;
                for (var i = 0; i < $scope.deviceCards.length; i++) {
                    $scope.deviceCards[i].AssignTime = helperLib.serverDateToJS($scope.deviceCards[i].AssignTime);
                    $scope.deviceCards[i].ExpireTime = helperLib.serverDateToJS($scope.deviceCards[i].ExpireTime);
                };
            }).error(function (err) {
                notificationService.displayError("Could not load data");
                console.log(err);
            });
        }

        function init() {
            $scope.getDeviceCards(1);
        };
        init();
        
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
            if (!item.editMode) {
                item = item.orignal;
            } else {
                item.orignal = angular.copy(item);
            }
        };

        $scope.addDeviceCard = function () {
            if ($scope.cards.length != 0 && $scope.devices.length != 0) {
                var index = $scope.findElement($scope.devices, "Name", $scope.newDeviceCard.DeviceName);
                $scope.newDeviceCard.DeviceId = $scope.devices[index].Id;

                index = $scope.findElement($scope.cards, "IdNumber", $scope.newDeviceCard.CardIdNumber);
                $scope.newDeviceCard.CardId = $scope.cards[index].Id;
            } else {
                console.log("Invalid Model");
            }

            deviceCardFactory.addDeviceCard($scope.newDeviceCard)
                .success(function(data) {
                    $scope.deviceCards.push(data);
                    $scope.newDeviceCard = {};
                    $scope.toggleAddMode();
                    init();
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
                .success(function(data) {
                    init();
                })
                .error(function(err) {
                    notificationService.displayError("Could not update data");
                    console.log(err);
                });
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