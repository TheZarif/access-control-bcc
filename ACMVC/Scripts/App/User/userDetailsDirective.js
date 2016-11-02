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
            controller: ['$scope', 'userFactory', 'designationFactory', 'notificationService', 'authFactory', function ($scope, userFactory, designationFactory, notificationService, authFactory) {

                $scope.default = "N/A";
                $scope.user = {};
                $scope.tab = { firstOpen: false, secondOpen: true };
                $scope.tempUser = {};
                $scope.percentComplete = 0;

                $scope.designations = null;

                console.log($scope.userInfo, $scope.self);

                console.log($scope.viewMode);

                if ($scope.userInfo.isLoggedIn !== false) {
                    getDetails();
                }

                $scope.$watch("userInfo", function (newVal, oldVal) {
                    if ($scope.userInfo.Id != undefined) getDetails();
                });

                function getDetails() {
                    userFactory.getUserDetails($scope.userInfo.Id).success(function (data) {
                        $scope.user = data;
                        $scope.tempUser = angular.copy($scope.user);

                        $scope.percentComplete = authFactory.profileCompletionData.Percent;
                        $scope.mandatoryFieldMissing = authFactory.profileCompletionData.MandatoryFieldMissing;

                    }).error(function (err) {
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

                $scope.verifyUser = function (val) {
                    var oldVal = $scope.user.IsVerified;
                    $scope.user.IsVerified = val;
                    userFactory.verifyUser($scope.user).success(function () {
                        $scope.user.IsVerified = val;
                    }).error(function (err) {
                        $scope.user.IsVerified = oldVal;
                        notificationService.displayError(err);
                    });
                }

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

                designationFactory.getDesignations().success(function (data) {
                    $scope.designations = data;
                    console.log("Designations", data);
                }).error(function (err) {
                    console.log(err);
                });

                $scope.adminPrivilege = function () {
                    return $scope.self.isAdmin;
                }
            }],
            templateUrl: "scripts/App/User/userprofile.html"
        }
    }




})(angular.module("accessControl"));