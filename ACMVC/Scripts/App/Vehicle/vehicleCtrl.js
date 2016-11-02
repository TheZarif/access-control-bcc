(function (app) {
    "use strict";

    app.controller("vehicleCtrl", vehicleCtrl);

    vehicleCtrl.$inject = ["$scope", "vehicleFactory", "notificationService"];

    function vehicleCtrl($scope, vehicleFactory, notificationService) {
        $scope.vehicles = [];
        $scope.search = "";
        $scope.addMode = false;
        $scope.newVehicle = {};
        $scope.vehicleTypes = angular.copy(VehicleTypes);

        $scope.totalPages = 0;
        $scope.currentPage = 0;

        $scope.searchItems = function () {
            $scope.getVehicle(1, $scope.search);
        }


        $scope.getVehicle = function (page, search) {
            vehicleFactory.getVehicle(page, search).success(function (data) {
                $scope.vehicles = data.Vehicles;
                $scope.totalPages = data.Pager.TotalPages;
                $scope.totalItems = data.Pager.TotalItems;
                $scope.currentPage = data.Pager.CurrentPage;
            });
        }

        $scope.getVehicle(1);


        $scope.toggleAddMode = function () {
            $scope.addMode = !$scope.addMode;
        };

        $scope.toggleEditMode = function (item) {
            item.editMode = !item.editMode;
        };

        $scope.addVehicle = function () {
            vehicleFactory.addVehicle($scope.newVehicle)
                .success(function (data) {
                    $scope.vehicles.push(data);
                    $scope.newVehicle = {};
                    $scope.toggleAddMode();
                    notificationService.displaySuccess("Added");
                })
                .error(function (err) {
                    notificationService.displayError("Could not add data");
                    console.log(err);
                });
        };

        $scope.deleteVehicle = function (vehicle) {
            vehicleFactory.deleteVehicle(vehicle)
                .success(function (data) {
                    helperLib.deleteItem(vehicle, $scope.vehicles);
                })
                .error(function (err) {
                    notificationService.displayError("Could not delete data");
                    console.log(err);
                })
        };

        $scope.updateVehicle = function (vehicle) {
            vehicleFactory.updateVehicle(vehicle)
                .success(function (data) {
                    vehicle.editMode = false;
                })
                .error(function (err) {
                    notificationService.displayError("Could not update data");
                    console.log(err)
                })
        };


    }


})(angular.module('accessControl'));