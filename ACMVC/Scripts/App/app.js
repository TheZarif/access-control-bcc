(function () {
    'use strict';

    angular.module('accessControl', ['common.core', 'common.ui', 'ngAnimate', 'ui.bootstrap', 'ngFileUpload'])
        .config(config);

    config.$inject = ['$routeProvider'];
    function config($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "scripts/App/Home/homepage.html"
            })
            .when("/status", {
                templateUrl: "scripts/App/Status/index.html",
                controller: "statusCtrl"
            })
            .when("/card", {
                templateUrl: "scripts/App/Card/cardpage.html",
                controller: "cardCtrl"
            })
            .when("/role", {
                templateUrl: "scripts/App/Role/rolePage.html",
                controller: "roleCtrl"
            })
            .when("/zone", {
                templateUrl: "scripts/App/AccessZone/zonepage.html",
                controller: "zoneCtrl"
            })
            .when("/device", {
                templateUrl: "scripts/App/Device/devicepage.html",
                controller: "deviceCtrl"
            })
            .when("/cardlog", {
                templateUrl: "scripts/App/CardLog/cardlogpage.html",
                controller: "cardLogCtrl"
            })
            .when("/usercard", {
                 templateUrl: "scripts/App/UserCard/usercardpage.html",
                 controller: "userCardCtrl"
            })
            .when("/devicecard", {
                templateUrl: "scripts/App/DeviceCard/devicecardpage.html",
                controller: "deviceCardCtrl"
            })
            .when("/user", {
                templateUrl: "scripts/App/User/userpage.html",
                controller: "userCtrl"
            })
            .when("/users", {
                templateUrl: "scripts/App/User/userspublic.html",
                controller: "userCtrl"
            })
            .when("/users/:id", {
                templateUrl: "scripts/App/User/userdetails.html",
                controller: "userDetailsCtrl"
            })
            .when("/vehicle", {
                templateUrl: "scripts/App/Vehicle/vehiclepage.html",
                controller: "vehicleCtrl"
            })
            .when("/vehicleLogs", {
                templateUrl: "scripts/App/VehicleLogs/vehiclelogs.html",
                controller: "vehicleLogCtrl"
            })
            .when("/appointments/:userId?", {
                templateUrl: "scripts/App/Appointment/allappointmentspage.html",
                controller: "appointmentCtrl"
            })
            .when("/appointments/add", {
                templateUrl: "scripts/App/Appointment/newappointmentpage.html",
                controller: "appointmentCtrl"
            })
            .when("/addappointment/:userId", {
                templateUrl: "scripts/App/Appointment/newappointmentpage.html",
                controller: "appointmentCtrl"
            })
            .when("/issuecard", {
                templateUrl: "scripts/App/IssueCard/issuecard.html"
            })
            .when("/official", {
                templateUrl: "scripts/App/User/userspublic.html",
                controller: "userPublicCtrl"
            })
            .otherwise({ redirectTo: "/" });
    }

})();