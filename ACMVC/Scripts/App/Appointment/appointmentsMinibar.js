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


                if ($scope.userInfo.isLoggedIn !== false) {
                    getDetails();
                }

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


   

})(angular.module("accessControl"));