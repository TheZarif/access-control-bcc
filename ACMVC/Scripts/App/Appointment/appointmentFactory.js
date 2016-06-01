(function (app) {
    'use strict';

    app.factory('appointmentFactory', appointmentFactory);

    appointmentFactory.$inject = ['$http'];

    function appointmentFactory($http) {
        return {
            getAppointment: function (page, search) {
                if (!page) page = 1;
                if (!search) search = "";
                return $http.get(baseUrl + "appointments/getall?page=" + page + "&search=" + search);
            },
            addAppointment: function (appointment) {
                return $http.post(baseUrl + "appointments/create", appointment);
            },
            approveAppointment: function (appointment) {
                return $http.post(baseUrl + "appointments/ApproveAppointment", appointment);
            },
            deleteAppointment: function (appointment) {
                return $http.post(baseUrl + "appointments/delete/" + appointment.Id);
            },
            updateAppointment: function (appointment) {
                return $http.post(baseUrl + "appointments/edit/" + appointment.Id, appointment);
            }
        };
    }

})(angular.module('accessControl'));