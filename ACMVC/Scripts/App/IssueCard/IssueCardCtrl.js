(function (app) {
    'use strict';

    app.controller('issueCardCtrl', issueCardCtrl);

    issueCardCtrl.$inject = ['$scope', "cardFactory", "userFactory", 'notificationService'];

    function issueCardCtrl($scope, cardFactory, userFactory, notificationService) {
        $scope.newIssueCard = {};
        $scope.cards = {};
        $scope.users = {};
        $scope.userLoaded = false;


        $scope.issueCard = function(object) {
            notificationService.displaySuccess("Card Issued");
            object = null;
            $scope.newIssueCard = {};
        }
        
        $scope.$watch("newIssueCard.CardNumber", function (newVal, oldVal) {
            cardFactory.getCardByNumber(newVal)
                .success(function (data) {
                    $scope.cards = data;
                }).error(function (err) {
                    console.log(err);
                });
        });

        $scope.loadUser = function (searchUser) {
            userFactory.findUser(searchUser).success(function(data) {
                $scope.users = data;
                $scope.userLoaded = true;
            }).error(function (err) {
                notificationService.displayError("Something went wrong");
                console.log(err);
            });
        }

        $scope.selectUser = function(user) {
            $scope.userSelected = true;
            $scope.user = user;
        }
    }
})(angular.module('accessControl')); 