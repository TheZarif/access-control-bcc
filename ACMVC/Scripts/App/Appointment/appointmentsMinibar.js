(function (app) {
    'use strict';

    app.directive('appointmentMinibar', appointmentMinibar);


    function appointmentMinibar() {
        return {
            restrict: 'AE',
            scope: {
                userInfo: "=",
                self: "="
            },
            controller: ['$scope', 'appointmentFactory', 'notificationService', function ($scope, appointmentFactory, notificationService) {

                $scope.default = "N/A";
                $scope.user = {};
                $scope.tempUser = {};

                $scope.$watch('userInfo', function(val) {
                    if ($scope.userInfo.isLoggedIn !== false) {
                        getDetails();
                    }
                });

                function getDetails() {
                    appointmentFactory.getAppointment(1).success(function (data) {
                        $scope.appointments = data.Appointments;
                    }).error(function (err) {
                        console.log(err);
                    });
                };

                function canApprove(appointment) {
                    if ($scope.userInfo.isOfficial) {
                        return $scope.userInfo.Id === appointment.AspNetUserTo.Id;
                    }
                    return $scope.userInfo.isAdmin;
                }

                $scope.canApprove = canApprove;

            }],
            templateUrl: "scripts/App/Appointment/appointmentsminibar.html"
        }
    }


   

})(angular.module("accessControl"));