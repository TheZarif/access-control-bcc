(function (app) {
    'use strict';

    app.controller('issueCardCtrl', issueCardCtrl);

    issueCardCtrl.$inject = ['$scope', "cardFactory", "userFactory", "appointmentFactory", 'notificationService'];

    function issueCardCtrl($scope, cardFactory, userFactory, appointmentFactory, notificationService) {


        function init() {
            $scope.newIssueCard = {};
            $scope.cards = {};
            $scope.users = {};
            $scope.appointments = {};
            $scope.userLoaded = false;
            $scope.selectedUser = { DisplayName: "" };
            $scope.selectedAppointments = [];
            $scope.selectedCard = {};
        }

        init();
        

        $scope.$watch("selectedUser", function (newVal, oldVal) {
            if ($scope.selectedUser.Id) { $scope.getAppointments() };

            userFactory.findVisitor(newVal)
                .success(function (data) {
                    $scope.users = data;
                }).error(function (err) {
                    console.log(err);
                });
        });

        $scope.$watch("selectedCard.cardIdNumber", function (newVal) {
            cardFactory.getCardNumberAutocomplete(newVal).then(function (data) {
                $scope.cards = data.data;
            }, function (err) {
                console.log(err);
            });
        }, true);

        $scope.issueCard = function () {
            notificationService.displaySuccess("Card Issued");
            init();
        }

        $scope.getAppointments = function () {
            var userId = $scope.selectedUser.Id;
            appointmentFactory.getAppointmentsForDay(userId).success(function (data) {
                $scope.appointments = data;
            }).error(function (err) {
                console.log(err);
            });
        }

        $scope.selectAppointment = function (appointment) {
            $scope.selectedAppointments.push(appointment);
            appointment.isApproved = true;
        }

        $scope.removeAppointment = function (appointment) {
            helperLib.deleteItem(appointment, $scope.selectedAppointments);
            appointment.isApproved = false;
        }


    }
})(angular.module('accessControl'));