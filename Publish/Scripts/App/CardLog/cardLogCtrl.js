(function (app) {
    'use strict';

    app.controller('cardLogCtrl', cardLogCtrl);

    cardLogCtrl.$inject = ['$scope', 'cardLogFactory', 'cardFactory', 'deviceFactory', 'notificationService'];

    function cardLogCtrl($scope, cardLogFactory, cardFactory, deviceFactory, notificationService) {
        $scope.cardLogs = [];
        $scope.cards = [];
        $scope.devices = [];

        $scope.addMode = false;
        $scope.newCardLog = {};
        var editMode = false;

        cardLogFactory.getCardLog().success(function (data) {
            $scope.cardLogs = data;
        }).error(function (err) {
            notificationService.displayError("Could not load data");
            console.log(err);
        });

        cardFactory.getCard().success(function (data) {
            notificationService.displaySuccess("Successfully retrieved data");
            $scope.cards = data;
        }).error(function (err) {
            notificationService.displayError("Could not load data");
            console.log(err);
        });

        deviceFactory.getDevice().success(function (data) {
            $scope.devices = data;
        }).error(function () {
            notificationService.displayError("Could not load data");
            console.log(err);
        });



        $scope.toggleAddMode = function () {
            $scope.addMode = !$scope.addMode;
        };

        $scope.toggleEditMode = function (item) {
            item.editMode = !item.editMode;
        };

        $scope.addCardLog = function () {
            cardLogFactory.addCardLog($scope.newCardLog)
                .success(function (data) {
                    $scope.cardLogs.push(data);
                    $scope.newCardLog = {};
                    $scope.toggleAddMode();
                    data.CardNumber = $scope.getCardNumber(data.CardId);
                    data.DeviceName = $scope.getDeviceName(data.DeviceId);
                })
                .error(function (err) {
                    notificationService.displayError("Could not add data");
                    console.log(err);
                })
        };

        $scope.deleteCardLog = function (cardLog) {
            cardLogFactory.deleteCardLog(cardLog)
                .success(function (data) {
                    helperLib.deleteItem(cardLog, $scope.cardLogs);
                })
                .error(function (err) {
                    notificationService.displayError("Could not delete data");
                    console.log(err);
                })
        };

        $scope.updateCardLog = function (cardLog) {
            cardLogFactory.updateCardLog(cardLog)
                .success(function (data) {
                    cardLog.editMode = false;
                    cardLog.CardNumber = $scope.getCardNumber(cardLog.CardId);
                    cardLog.DeviceName = $scope.getDeviceName(cardLog.DeviceId);
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

        $scope.getCardNumber = function (id) {
            for (var i = 0; i < $scope.cards.length; i++) {
                if ($scope.cards[i].Id == id) {
                    return $scope.cards[i].Number;
                }
            }
        }

        $scope.getDateTime = function(item){
            return new Date(parseInt(item.substr(6)));
        }
    }


})(angular.module('accessControl'));