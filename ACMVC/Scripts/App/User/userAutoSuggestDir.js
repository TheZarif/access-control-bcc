(function (app) {
    "use strict";

    app.directive('userAutoSuggest', userAutoSuggest);

    function userAutoSuggest() {
        return {
            restrict: 'E',
            scope: {
                user: "=",
                placeholder: "="
            },
            controller: ['$scope', 'userFactory', 'notificationService', function($scope, userFactory, notificationService) {

                $scope.default = "N/A";
                $scope.user = null;

                if (!$scope.placeholder) {
                    $scope.placeholder = "Enter name of person";
                }

                $scope.$watch("user", function (newVal, oldVal) {
                    userFactory.findUser(newVal)
                        .success(function (data) {
                            $scope.users = data;
                        }).error(function (err) {
//                            notificationService.displayError("User not found");
                            console.log(err);
                        });
                });
            }],
            template: '<input id="" name="" ng-model="user" uib-typeahead="user as user.DisplayName for user in users" type="text" placeholder="{{placeholder}}" class="form-control input-md" required="">'
        }
    }

})(angular.module("accessControl"));