(function (app) {
    'use strict';

    app.controller('userCardCtrl', userCardCtrl);

    userCardCtrl.$inject = ['$scope', 'userCardFactory', "userFactory", 'cardFactory', 'statusFactory', 'notificationService'];

    function userCardCtrl($scope, userCardFactory, userFactory, cardFactory, statusFactory, notificationService) {
        $scope.userCards = [];
        $scope.users = [];
        $scope.cards = [];
        $scope.statuses = [];
        $scope.search = "";

        $scope.addMode = false;
        $scope.newUserCard = {};

        $scope.statuses = [
            { Id: 1, Type: "Active" },
            { Id: 1003, Type: "Inactive" }
        ];


        function onUserChange(newVal) {
            userFactory.findUser(newVal)
                .success(function (data) {
                    $scope.users = data;
                }).error(function (err) {
                    console.log(err);
                });
        };

        function onCardChange(newVal) {
            cardFactory.getCardNumberAutocomplete(newVal)
            .success(function (data) {
                $scope.cards = data;
            }).error(function (err) {
                console.log(err);
            });
        }

        $scope.$watch("newUserCard.UserEmail", onUserChange, true);
        $scope.$watch("newUserCard.CardIdNumber", onCardChange, true);

        $scope.searchItems = function () {
            $scope.getUserCards(1, $scope.search);
        }

        $scope.getUserCards = function (page, search) {
            userCardFactory.getUserCard(page, search).success(function (data) {
                $scope.userCards = data.Items;
                $scope.totalPages = data.Pager.TotalPages;
                $scope.totalItems = data.Pager.TotalItems;
                $scope.currentPage = data.Pager.CurrentPage;
                for (var i = 0; i < $scope.userCards.length; i++) {
                    $scope.userCards[i].IssueDate = helperLib.serverDateToJS($scope.userCards[i].IssueDate);
                    $scope.userCards[i].RevocationDate = helperLib.serverDateToJS($scope.userCards[i].RevocationDate);
                }
            }).error(function (err) {
                notificationService.displayError("Could not load data");
                console.log(err);
            });
        }

        function init() {
            $scope.getUserCards(1);
        };
        init();

        $scope.toggleAddMode = function () {
            $scope.addMode = !$scope.addMode;
        };

        $scope.toggleEditMode = function (item) {
            item.editMode = !item.editMode;
        };

        $scope.allowAddUserCard = function () {
            console.log("wat", $scope.newUserCard.selectedCard && $scope.newUserCard.selectedCard.Id && 1 == 1);
            return $scope.newUserCard.selectedCard && $scope.newUserCard.selectedCard.Id;
        }

        var addUserCard = function () {
            //            if ($scope.cards.length != 0) {
            //                var index = findElement($scope.cards, "IdNumber", $scope.newUserCard.CardNumber);
            //                $scope.newUserCard.CardId = $scope.cards[index].Id;
            //            }
            userCardFactory.addUserCard($scope.newUserCard)
                .success(function (data) {
                    $scope.userCards.push(data);
                    $scope.newUserCard = {};
                    $scope.toggleAddMode();
                    init();
                })
                .error(function (err) {
                    notificationService.displayError(err);
                });
        };

        var deleteUserCard = function (userCard) {
            userCardFactory.deleteUserCard(userCard)
                .success(function (data) {
                    helperLib.deleteItem(userCard, $scope.userCards);
                })
                .error(function (err) {
                    notificationService.displayError("Could not delete data");
                    console.log(err);
                });
        };

        var updateUserCard = function (userCard) {

            userCardFactory.updateUserCard(userCard)
                .success(function (data) {
                    init();
                })
                .error(function (err) {
                    notificationService.displayError("Could not update data");
                    console.log(err);
                });
        };

        $scope.updateUserCard = updateUserCard;
        $scope.deleteUserCard = deleteUserCard;
        $scope.addUserCard = addUserCard;

        var findElement = function (array, column, data) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][column] == data) {
                    return i;
                }
            }
            return -1;
        }


    }


})(angular.module('accessControl'));