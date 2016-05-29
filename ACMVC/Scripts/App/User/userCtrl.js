(function (app) {
    'use strict';

    app.controller('userCtrl', userCtrl);

    userCtrl.$inject = ['$scope', 'userFactory', 'roleFactory', 'notificationService'];

    function userCtrl($scope, userFactory, roleFactory, notificationService) {

      
        $scope.searchItems = function() {
            $scope.getVehicle(1, $scope.search);
        };
        $scope.search = "";
        $scope.users = [];
        $scope.roles = [];
        $scope.totalPages = 0;
        $scope.currentPage = 0;
        // $scope.addMode = false;
        // $scope.newUser = {};
        var editMode = false;

        $scope.searchItems = function () {
            $scope.getUser(1, $scope.search);
        }

        $scope.getUser = function(page, search) {
            userFactory.getUser(page, search).success(function(data) {
                $scope.users = data.Users;
                $scope.totalPages = data.Pager.TotalPages;
                $scope.totalItems = data.Pager.TotalItems;
                $scope.currentPage = data.Pager.CurrentPage;
            });
        };
        $scope.getUser(1);

        roleFactory.getRole().success(function(data) {
            $scope.roles = data;
        }).error(function(err) {
            notificationService.displayError("Could not load data");
            console.log(err);
        });

        $scope.addRole = function (user, role) {
            userFactory.addRole(user, role).success(function() {
                notificationService.displaySuccess("Success");
                user.AspNetRoles.push(role);
                $scope.addRoleMode = false;
            }).error(function(err) {
                notificationService.displayError("Something went wrong");
                console.log(err);
            });
        };
        $scope.removeRole = function(user, role) {
            userFactory.removeRole(user, role).success(function() {
                notificationService.displaySuccess("Success");
                helperLib.deleteItem(role, user.AspNetRoles);
            }).error(function(err) {
                notificationService.displayError("Something went wrong");
                console.log(err);
            });
        };

        $scope.resetPassword = function(user, password) {
            userFactory.resetPassword(user, password).success(function() {
                notificationService.displaySuccess("Success");
                user.editPassword = false;
            }).error(function(err) {
                notificationService.displayError("Something went wrong");
                console.log(err);
            });
        };

        $scope.toggleAddRoleMode = function(user) {
            user.addRoleMode = !user.addRoleMode;
        };

        $scope.toggleResetPassword = function(user) {
            user.editPassword = !user.editPassword;
        }
        // $scope.toggleAddMode = function () {
        //     $scope.addMode = !$scope.addMode;
        // };

        $scope.toggleEditMode = function (item) {
            item.editMode = !item.editMode;
        };

        // $scope.addUser = function () {
        //     userFactory.addUser($scope.newUser)
        //         .success(function (data) {
        //             $scope.users.push(data);
        //             $scope.newUser = {};
        //             $scope.toggleAddMode();
        //         })
        //         .error(function (err) {
        //             notificationService.displayError("Could not add data");
        //             console.log(err);
        //         })
        // };

        $scope.deleteUser = function (user) {
            userFactory.deleteUser(user)
                .success(function() {
                    helperLib.deleteItem(user, $scope.users);
                })
                .error(function(err) {
                    notificationService.displayError("Could not delete data");
                    console.log(err);
                });
        };

        $scope.updateUser = function (user) {
            userFactory.updateUser(user)
                .success(function(data) {
                    user.editMode = false;
                })
                .error(function(err) {
                    notificationService.displayError("Could not update data");
                    console.log(err);
                });
        };


    }


})(angular.module("accessControl"));