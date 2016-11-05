(function (app) {
    "use strict";

    app.controller("vehicleLogCtrl", vehicleLogCtrl);

    vehicleLogCtrl.$inject = ["$scope", "vehicleLogFactory", "notificationService"];

    function vehicleLogCtrl($scope, vehicleLogFactory, notificationService) {
        $scope.vehicleLogs = [];

        $scope.totalPages = 0;
        $scope.currentPage = 0;

       $scope.getVehicleLogs = function (page) {
           vehicleLogFactory.getVehicleLog(page, $scope.search).success(function (data) {
                $scope.vehicleLogs = data.VehicleLogs;
                $scope.totalPages = data.Pager.TotalPages;
                $scope.totalItems = data.Pager.TotalItems;
                $scope.currentPage = data.Pager.CurrentPage;
            });
        }

       $scope.getVehicleLogs(1);

    }


})(angular.module('accessControl'));