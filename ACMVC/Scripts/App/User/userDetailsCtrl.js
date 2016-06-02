(function (app) {
    'use strict';

    app.controller('userDetailsCtrl', userCtrl);

    userCtrl.$inject = ['$scope', '$routeParams', 'userFactory', 'notificationService'];

    function userCtrl($scope, $routeParams, userFactory, notificationService) {
        $scope.id = $routeParams.id;
        $scope.editMode = false;
        $scope.user = {};
        $scope.selfId = null;
        $scope.default = "N/A";

        userFactory.getLoginDetails().success(function (data) {
            $scope.selfId = data.UserId;
            if ($scope.id === "self") {
                $scope.id = $scope.selfId;
            }
            $scope.getDetails();
        }).error(function (err) {
            notificationService.displayError("Something went wrong.");
            console.log(err);
        });


        $scope.getDetails = function() {
            userFactory.getUserDetails($scope.id).success(function (data) {
                $scope.user = data;
            }).error(function (err) {
                notificationService.displayError("Something went wrong.");
                console.log(err);
            });
        }
        
        $scope.toggleEditMode = function () {
            $scope.editMode = !$scope.editMode;
        };

        $scope.isSelf = function() {
            return  $scope.selfId === $scope.id;
        }

        $scope.updateUser = function () {
            userFactory.updateUser($scope.user)
                .success(function (data) {
                    $scope.editMode = false;
                    notificationService.displaySuccess("Saved");
                })
                .error(function (err) {
                    notificationService.displayError("Could not update data");
                    console.log(err);
                });
        };

    }


})(angular.module("accessControl"));