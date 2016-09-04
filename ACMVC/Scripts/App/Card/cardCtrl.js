(function (app) {
    'use strict';

    app.controller('cardCtrl', cardCtrl);

    cardCtrl.$inject = ['$scope', 'cardFactory', 'statusFactory', 'notificationService'];

    function cardCtrl($scope, cardFactory, statusFactory, notificationService) {
        $scope.cards = [];
        $scope.statuses = []
        $scope.addMode = false;
        $scope.newCard = {};

        $scope.totalPages = 0;
        $scope.currentPage = 0;

        $scope.defaultFilter = {
            Id: null,
            Type: "All"
        }

        $scope.filterStatus = $scope.defaultFilter;

        $scope.getCards = function (page, search, statusId) {
            cardFactory.getCard(page, search, statusId).success(function (data) {
                notificationService.displaySuccess("Successfully retrieved data");
                $scope.cards = data.Cards;
                $scope.totalPages = data.Pager.TotalPages;
                $scope.totalItems = data.Pager.TotalItems;
                $scope.currentPage = data.Pager.CurrentPage;

                $scope.statuses = [
                    { Id: 1, Type: "Active" },
                    { Id: 2, Type: "Disabled" },
                    { Id: 3, Type: "Pending" }
                ];

            }).error(function () {
                notificationService.displayError("Could not load data");
                console.log("Could not retrieve data from server");
            });
        }

        $scope.getCards(1);

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
                    $scope.getCards(1);

                })
                .error(function (err) {
                    notificationService.displayError("Could not add data");
                    console.log(err);
                });
        };

        $scope.deleteCard = function (card) {
            cardFactory.deleteCard(card)
                .success(function (data) {
                    helperLib.deleteItem(card, $scope.cards);
                })
                .error(function (err) {
                    notificationService.displayError("Could not delete data");
                    console.log(err);
                });
        };

        $scope.updateCard = function (card) {
            cardFactory.updateCard(card)
                .success(function (data) {
                    card.editMode = false;
                    $scope.getCards(1);
                })
                .error(function (err) {
                    notificationService.displayError("Could not update data");
                    console.log(err);
                });
        };

        $scope.setFilterStatus = function (data) {
            $scope.filterStatus = data;
            $scope.getCards(1, $scope.searchConfig.model, data.Id);
        }

        $scope.searchConfig = {
            method: $scope.getCards,
            placeholder: "Search Card by number",
            model: ""
        }


    }


})(angular.module('accessControl'));