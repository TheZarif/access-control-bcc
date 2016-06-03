(function (app) {
    'use strict';

    app.controller('issueCardCtrl', issueCardCtrl);

    issueCardCtrl.$inject = ['$scope', "cardFactory", 'notificationService'];

    function issueCardCtrl($scope, cardFactory, notificationService) {
        $scope.newIssueCard = {};
        $scope.cards = {};

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
    }
})(angular.module('accessControl')); 