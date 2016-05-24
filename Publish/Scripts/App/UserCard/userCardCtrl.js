(function (app) {
    'use strict';

    app.controller('userCardCtrl', userCardCtrl);

    userCardCtrl.$inject = ['$scope', 'userCardFactory', "userFactory", 'cardFactory', 'statusFactory', 'notificationService'];

    function userCardCtrl($scope, userCardFactory, userFactory, cardFactory, statusFactory, notificationService) {
        $scope.userCards = [];
        $scope.users = [];
        $scope.cards = [];
        $scope.statuses = [];
        
        $scope.addMode = false;
        $scope.newUserCard = {};

        statusFactory.getStatus().success(function(data) {
            $scope.statuses = data;
        }).error(function(err) {
            console.log(err);
        });

        $scope.$watch("newUserCard.Email", function (newVal, oldVal) {
            console.log("Watch UserID: ", $scope.newUserCard.UserId);
            console.log("Watch val", newVal);
            userFactory.findUser(newVal)
                .success(function (data) {
                    $scope.users = data;
                }).error(function (err) {
                    console.log(err);
                });
        });

        $scope.$watch("newUserCard.CardNumber", function (newVal, oldVal) {
            console.log("Watch CardId: ", $scope.newUserCard.CardId);
            console.log("Watch val", newVal);
            cardFactory.getCardByNumber(newVal)
                .success(function(data) {
                    $scope.cards = data;
                }).error(function(err) {
                    console.log(err);
                });
        });

        userCardFactory.getUserCard().success(function (data) {
            $scope.userCards = data;
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

        $scope.addUserCard = function () {
            if ($scope.cards.length != 0 && $scope.users.length != 0) {
                var index = $scope.findElement($scope.users, "Email", $scope.newUserCard.Email);
                $scope.newUserCard.UserId = $scope.users[index].Id;

                index = $scope.findElement($scope.cards, "Number", $scope.newUserCard.CardNumber);
                $scope.newUserCard.CardId = $scope.cards[index].Id;

                console.log("NewUserCard", $scope.newUserCard);
            } else {
                console.log("Invalid Model");
            }
            userCardFactory.addUserCard($scope.newUserCard)
                .success(function(data) {
                    $scope.userCards.push(data);
                    $scope.newUserCard = {};
                    $scope.toggleAddMode();
                })
                .error(function(err) {
                    notificationService.displayError("Could not add data");
                    console.log(err);
                });
        };

        $scope.deleteUserCard = function (userCard) {
            userCardFactory.deleteUserCard(userCard)
                .success(function (data) {
                    helperLib.deleteItem(userCard, $scope.userCards);
                })
                .error(function (err) {
                    notificationService.displayError("Could not delete data");
                    console.log(err);
                })
        };

        $scope.updateUserCard = function (userCard) {
            console.log("Update", userCard);
            if ($scope.cards.length != 0 && $scope.users.length != 0) {
                var index = $scope.findElement($scope.users, "Email", $scope.newUserCard.Email);
                $scope.newUserCard.UserId = $scope.users[index].Id;

                index = $scope.findElement($scope.cards, "Number", $scope.newUserCard.CardNumber);
                $scope.newUserCard.CardId = $scope.cards[index].Id;

                console.log("NewUserCard", userCard);
            } else {
                console.log("Invalid Model");
            }
            userCardFactory.updateUserCard(userCard)
                .success(function(data) {
                    userCard.editMode = false;
                })
                .error(function(err) {
                    notificationService.displayError("Could not update data");
                    console.log(err);
                });
        };

        $scope.findElement = function(array, column, data) {
            for (var i = 0; i < array.length; i++) {
                if (array[i][column] == data) {
                    return i;
                }
            }
            return -1;
        }


    }


})(angular.module('accessControl'));