﻿(function (app) {
    'use strict';

    app.controller('cardCtrl', cardCtrl);

    cardCtrl.$inject = ['$scope', 'cardFactory', 'statusFactory', 'notificationService'];

    function cardCtrl($scope, cardFactory, statusFactory, notificationService) {
        $scope.cards = [];
        $scope.statuses = []
        $scope.addMode = false;
        $scope.newCard = {};
        var editMode = false;

        cardFactory.getCard().success(function (data) {
            notificationService.displaySuccess("Successfully retrieved data");
            $scope.cards = data;
            statusFactory.getStatus()
                .success(   function (data) { $scope.statuses = data;})
                .error(function (err) { console.log(err);});
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

        $scope.addCard = function () {
            cardFactory.addCard($scope.newCard)
                .success(function (data) {
                    $scope.cards.push(data);
                    $scope.newCard = {};
                    $scope.toggleAddMode();
                    data.StatusType = $scope.getStatusName(data.StatusId);
                })
                .error(function (err) {
                    notificationService.displayError("Could not add data");
                    console.log(err);
                })
        };

        $scope.deleteCard = function (card) {
            cardFactory.deleteCard(card)
                .success(function (data) {
                    helperLib.deleteItem(card, $scope.cards);
                })
                .error(function (err) {
                    notificationService.displayError("Could not delete data");
                    console.log(err);
                })
        };

        $scope.updateCard = function (card) {
            cardFactory.updateCard(card)
                .success(function (data) {
                    card.editMode = false;
                    card.StatusType = $scope.getStatusName(card.StatusId);
                })
                .error(function (err) {
                    notificationService.displayError("Could not update data");
                    console.log(err)
                })
        };

        $scope.getStatusName = function (id) {
            for (var i = 0; i < $scope.statuses.length; i++) {
                if ($scope.statuses[i].Id == id) {
                    return $scope.statuses[i].Type;
                }
            }
        }

       
    }


})(angular.module('accessControl'));