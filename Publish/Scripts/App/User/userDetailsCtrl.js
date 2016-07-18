(function (app) {
    'use strict';

    app.controller('userDetailsCtrl', userCtrl);

    userCtrl.$inject = ['$scope', '$routeParams', 'userFactory', 'designationFactory', 'notificationService'];

    function userCtrl($scope, $routeParams, userFactory, designationFactory, notificationService) {
        $scope.id = $routeParams.id;
        $scope.editMode = false;
        $scope.user = {};
        $scope.selfId = null;
        $scope.default = "N/A";
        $scope.tab = { firstOpen: false, secondOpen: true };

        $scope.designations = null;

        $scope.tempUser = {};

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
                $scope.tempUser = angular.copy($scope.user);
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

        $scope.updateOfficial = function() {
            userFactory.updateUserOfficial($scope.tempUser)
                .success(function (data) {
                    $scope.user = $scope.tempUser;
                    notificationService.displaySuccess("Saved");
                })
                .error(function(err) {
                    notificationService.displayError("Could not update data");
                    console.log(err);
                });
        }

        $scope.cancelOfficial = function() {
            $scope.tempUser = $scope.user;
            $scope.tab.firstOpen = false;
        }

        designationFactory.getDesignations().success(function(data) {
            $scope.designations = data;
            console.log("Designations", data);
        }).error(function(err) {
            console.log(err);
        });
    }


})(angular.module("accessControl"));