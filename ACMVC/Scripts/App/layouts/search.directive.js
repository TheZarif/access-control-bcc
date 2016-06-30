(function (app) {
    'use strict';

    app.directive('search', search);

    function search(){
        return {
            restrict: 'E',
            scope: {
                config: "="
            },
            controller: ["$scope", function($scope) {
            	$scope.text = "Hello world";
            }],
            templateUrl: '/scripts/App/layouts/search.html'
        }
    }

})(angular.module('common.ui'));