(function (app) {
    'use strict';

    app.directive('appointmentMinibar', appointmentMinibar);


    function appointmentMinibar() {
        return {
            restrict: 'AE',
            scope: {
                userInfo: "=",
                self: "=",
            },
            controller: ['$scope', 'appointmentFactory', 'notificationService', function ($scope, appointmentFactory, notificationService) {

                $scope.default = "N/A";
                $scope.user = {};
                $scope.tab = { firstOpen: false, secondOpen: true };
                $scope.tempUser = {};

                console.log($scope.viewMode);

                if ($scope.userInfo.isLoggedIn !== false) {
                    getDetails();
                }

                $scope.$watch("userInfo", function (newVal, oldVal) {
                    if($scope.userInfo.Id != undefined)     getDetails();
                });

                function getDetails() {
                    appointmentFactory.getAppointment(1).success(function (data) {
                        $scope.appointments = data.Appointments;
                    }).error(function (err) {
                        console.log(err);
                    });
                };

            }],
            templateUrl: "scripts/App/Appointment/appointmentsminibar.html"
        }
    }


    function userCtrl($scope, $routeParams, userFactory, notificationService) {
        $scope.id = $routeParams.id;
        $scope.editMode = false;
        $scope.user = {};
        $scope.selfId = null;
        $scope.default = "N/A";
        $scope.tab = { firstOpen: false, secondOpen: true };

        $scope.tempUser = {};



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

    }


})(angular.module("accessControl"));