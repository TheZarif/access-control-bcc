(function (app) {
    'use strict';

    app.controller('roleCtrl', roleCtrl);

    roleCtrl.$inject = ['$scope', 'roleFactory', 'notificationService'];

    function roleCtrl($scope, roleFactory, notificationService) {
        $scope.roles = [];
        $scope.addMode = false;
        $scope.newRole = {};
        var editMode = false;

        roleFactory.getRole().success(function (data) {
            $scope.roles = data;
        }).error(function (err) {
            notificationService.displayError("Could not load data");
            console.log(err);
        });

        $scope.toggleAddMode = function () {
            $scope.addMode = !$scope.addMode;
        };

        $scope.toggleEditMode = function (item) {
            item.editMode = !item.editMode;
        };

        $scope.addRole = function () {
            roleFactory.addRole($scope.newRole)
                .success(function (data) {
                    $scope.roles.push(data);
                    $scope.newRole = {};
                    $scope.toggleAddMode();
                })
                .error(function (err) {
                    notificationService.displayError("Could not add data");
                    console.log(err);
                })
        };

        $scope.deleteRole = function (role) {
            roleFactory.deleteRole(role)
                .success(function (data) {
                    helperLib.deleteItem(role, $scope.roles);
                })
                .error(function (err) {
                    notificationService.displayError("Could not delete data");
                    console.log(err);
                })
        };

        $scope.updateRole = function (role) {
            roleFactory.updateRole(role)
                .success(function (data) {
                    role.editMode = false;
                })
                .error(function (err) {
                    notificationService.displayError("Could not update data");
                    console.log(err)
                })
        };


    }


})(angular.module('accessControl'));