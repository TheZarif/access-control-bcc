﻿(function (app) {
    'use strict';

    app.controller('userCtrl', userCtrl);

    userCtrl.$inject = ['$scope', 'userFactory', 'roleFactory', 'zoneFactory', "$uibModal", 'notificationService'];

    function userCtrl($scope, userFactory, roleFactory, zoneFactory, $uibModal, notificationService) {

      
        $scope.searchItems = function() {
            $scope.getVehicle(1, $scope.search);
        };
        $scope.search = "";
        $scope.users = [];
        $scope.roles = [];
        $scope.zones = [];
        $scope.totalPages = 0;
        $scope.currentPage = 0;
        $scope.selectedFilter = "";

        $scope.filterUserType = [
            { value: false, name: "Visitor" },
            { value: true, name: "Employee" }
        ];

       

        $scope.getUser = function(page) {
            userFactory.getUser(page, $scope.search, $scope.selectedFilter).success(function(data) {
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

        zoneFactory.getZone().success(function(data) {
            $scope.zones = data;
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

        $scope.addAccessZone = function (user, accessZone) {
            userFactory.addAccessZone(user, accessZone).success(function () {
                notificationService.displaySuccess("Success");
                user.EmployeeAccessZoneMaps.push({"AccessZone": accessZone});
                $scope.addAccessZoneMode = false;
            }).error(function (err) {
                notificationService.displayError("Something went wrong");
                console.log(err);
            });
        };
        $scope.removeAccessZone = function (user, zoneMap) {
            userFactory.removeAccessZone(user, zoneMap.AccessZone).success(function () {
                notificationService.displaySuccess("Success");
                helperLib.deleteItem(zoneMap, user);
            }).error(function (err) {
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

        $scope.saveUserType = function(user, isEmployee) {
            console.log(user, isEmployee);
            userFactory.editType(user, isEmployee).success(function() {
                user.editUserType = false;
            }); 
        }

        $scope.toggleAddRoleMode = function(user) {
            user.addRoleMode = !user.addRoleMode;
        };

        $scope.toggleAddAccessZoneMode = function (user) {
            user.addAccessZoneMode = !user.addAccessZoneMode;
        };

        $scope.toggleResetPassword = function(user) {
            user.editPassword = !user.editPassword;
        }

        $scope.toggleEditUserType = function (user) {
            user.editUserType = !user.editUserType;
        }

        $scope.toggleEditMode = function (item) {
            item.editMode = !item.editMode;
        };
        
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

        $scope.openProfile = function (user) {
            $scope.selectedUser = user;
            var modalInstance = $uibModal.open({
                templateUrl: "scripts/App/User/usermodaltemplate.html",
//                size: size,
                resolve: {
                    selectedUser: function () {
                        return $scope.selectedUser;
                    },
                    loggedInUser: function() {
                        return $scope.userInfo;
                    }
                }
            });
        }

        
    }


})(angular.module("accessControl"));