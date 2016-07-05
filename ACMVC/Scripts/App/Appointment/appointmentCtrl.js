(function (app) {
    "use strict";

    app.controller("appointmentCtrl", appointmentCtrl);

    appointmentCtrl.$inject = ["$scope", "$routeParams", "appointmentFactory", "userFactory", "notificationService"];

    function appointmentCtrl($scope, $routeParams, appointmentFactory, userFactory, notificationService) {
        $scope.appointments = [];
        $scope.search = "";
        $scope.addMode = false;
        $scope.expandMode = false;
        $scope.newAppointment = {};
        $scope.users = {};
        $scope.status = {};

        var userId = $routeParams.userId;

        if (userId != null) {
            userFactory.getUserDetails(userId).success(function(data) {
                $scope.newAppointment.U = data;
            }).error(function(err) {
                console.log(err);
                notificationService.displayError("Invalid user");
            });
        }

        $scope.loadAppointment = function(id) {
            appointmentFactory.getDetails(id).success(function(data) {
                $scope.selected = data;
            }).error(function (err) {
                $scope.selected = null;
                notificationService.displayError("Invalid input");
                console.log(err);
            });
        };

        $scope.totalPages = 0;
        $scope.currentPage = 0;

        $scope.searchItems = function () {
            $scope.getAppointment(1, $scope.search);
        }


        $scope.getAppointment = function (page, search) {
            appointmentFactory.getAppointment(page, search).success(function (data) {
                $scope.appointments = data.Appointments;
                $scope.totalPages = data.Pager.TotalPages;
                $scope.totalItems = data.Pager.TotalItems;
                $scope.currentPage = data.Pager.CurrentPage;
            });
        }

        $scope.getAppointment(1);


        $scope.toggleAddMode = function () {
            $scope.addMode = !$scope.addMode;
            $scope.status.open = false;
        };

        $scope.toggleEditMode = function (item) {
            item.editMode = !item.editMode;
        };

        $scope.expand = function(item) {
//            item.isAuthorized = { show: false};
            $scope.expandMode = true;
            $scope.selected = item;
            $scope.checkAuthorize(item);
        }

        $scope.minimize = function() {
            $scope.selected.Remarks = null;
            $scope.selected = null;
            $scope.expandMode = false;
        }

        $scope.$watch("newAppointment.U", function (newVal, oldVal) {
            userFactory.findUser(newVal)
                .success(function (data) {
                    $scope.users = data;
                }).error(function (err) {
                    console.log(err);
                });
        });

        $scope.addAppointment = function () {
            $scope.newAppointment.UserTo = $scope.newAppointment.U.Id;
            appointmentFactory.addAppointment($scope.newAppointment)
                .success(function (data) {
                    //                    $scope.appointments.push(data);
                    $scope.getAppointment(1);

                    $scope.newAppointment = {};
                    $scope.toggleAddMode();
                    notificationService.displaySuccess("Added");
                })
                .error(function (err) {
                    notificationService.displayError("Could not add data");
                    console.log(err);
                });
        };


        $scope.approveAppointment = function (appointment, statusId) {
            appointment.AppointmentStatusId = statusId;
            appointmentFactory.approveAppointment(appointment)
                .success(function (data) {
                    $scope.expandMode = false;
                    $scope.selected = null;
                    notificationService.displaySuccess("Success");
                })
                .error(function (err) {
                    notificationService.displayError("Could not update data");
                    console.log(err)
                })
        };

        $scope.checkAuthorize = function(item) {
            userFactory.getLoginDetails().success(function(data) {
                $scope.user = data;
                item.isAuthorized = (item.AspNetUserTo.Id === data.UserId);

//                $scope.$apply();
            });
        }

        $scope.cancelAppointment = function() {
            $scope.newAppointment = {};
            $scope.addMode = false;
        }

        $scope.deleteAppointment = function (appointment) {
            appointmentFactory.deleteAppointment(appointment)
                .success(function (data) {
                    helperLib.deleteItem(appointment, $scope.appointments);
                })
                .error(function (err) {
                    notificationService.displayError("Could not delete data");
                    console.log(err);
                })
        };

        $scope.updateAppointment = function (appointment) {
            appointmentFactory.updateAppointment(appointment)
                .success(function (data) {
                    appointment.editMode = false;
                })
                .error(function (err) {
                    notificationService.displayError("Could not update data");
                    console.log(err)
                })
        };

        $scope.setHour = function () {
            if ($scope.newAppointment.hours >= 0 && $scope.newAppointment.hours <= 23) {
                console.log("Hours set Before", $scope.newAppointment.Time);
                $scope.newAppointment.Time.setHours($scope.newAppointment.hours);
                console.log("Hours set After", $scope.newAppointment.Time);
            }
        }

        $scope.setMin = function () {
            if ($scope.newAppointment.minutes >= 0 && $scope.newAppointment.minutes <= 59) {
                $scope.newAppointment.Time.setHours($scope.newAppointment.hours, $scope.newAppointment.minutes);
                console.log("Minutes set", $scope.newAppointment.Time);
            }
        }


    }


})(angular.module('accessControl'));