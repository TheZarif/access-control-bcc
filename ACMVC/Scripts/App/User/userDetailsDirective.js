(function (app) {
    'use strict';

    app.directive('userProfile', userProfile);

//    userCtrl.$inject = ['$scope', '$routeParams', 'userFactory', 'notificationService'];

    function userProfile() {
        return {
            restrict: 'AE',
            scope: {
                userInfo: "=",
                self: "=",
                viewMode: "="
            },
            controller: ['$scope', 'userFactory', 'notificationService', function($scope, userFactory, notificationService) {

                $scope.default = "N/A";
                $scope.user = {};
                $scope.tab = { firstOpen: false, secondOpen: true };
                $scope.tempUser = {};
                $scope.percentComplete = 0;

                console.log($scope.userInfo, $scope.self);

                console.log($scope.viewMode);

                if ($scope.userInfo.isLoggedIn !== false) {
                    getDetails();
                }

                $scope.$watch("userInfo", function (newVal, oldVal) {
                    if($scope.userInfo.Id != undefined)     getDetails();
                });

                function getDetails() {
                    userFactory.getUserDetails($scope.userInfo.Id).success(function(data) {
                        $scope.user = data;
                        $scope.tempUser = angular.copy($scope.user);

                        userFactory.getProfileCompletion(data.Id).success(function(data) {
                            $scope.percentComplete = data;
                            $scope.user.percentComplete = data;
                        }).error(function(err) {
                            console.log(err);
                        });
                    }).error(function(err) {
                        notificationService.displayError("Something went wrong.");
                        console.log(err);
                    });
                };

                $scope.toggleEditMode = function () {
                    $scope.editMode = !$scope.editMode;
                };

                $scope.isSelf = function () {
                    return $scope.self.Id === $scope.user.Id;
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

                $scope.updateOfficial = function () {
                    userFactory.updateUserOfficial($scope.tempUser)
                        .success(function (data) {
                            $scope.user = $scope.tempUser;
                            notificationService.displaySuccess("Saved");
                        })
                        .error(function (err) {
                            notificationService.displayError("Could not update data");
                            console.log(err);
                        });
                }

                $scope.cancelOfficial = function () {
                    $scope.tempUser = $scope.user;
                    $scope.tab.firstOpen = false;
                }
            }],
            templateUrl: "scripts/App/User/userprofile.html"
        }
    }




})(angular.module("accessControl"));