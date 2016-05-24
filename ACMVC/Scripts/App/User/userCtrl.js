(function (app) {
    'use strict';

    app.controller('userCtrl', userCtrl);

    userCtrl.$inject = ['$scope', 'userFactory', 'roleFactory', 'notificationService'];

    function userCtrl($scope, userFactory, notificationService) {
        $scope.users = [];
        %scope.roles = [];
        // $scope.addMode = false;
        // $scope.newUser = {};
        var editMode = false;

        userFactory.getUser().success(function (data) {
            $scope.users = data;
        }).error(function (err) {
            notificationService.displayError("Could not load data");
            console.log(err);
        });

        roleFactory.getRole().success(function(data) {
            $scope.roles = data;
        }).error(function(err){
            notificationService.displayError("Could not load data");
            console.log(err);
        })

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
                .success(function (data) {
                    helperLib.deleteItem(user, $scope.users);
                })
                .error(function (err) {
                    notificationService.displayError("Could not delete data");
                    console.log(err);
                })
        };

        $scope.updateUser = function (user) {
            userFactory.updateUser(user)
                .success(function (data) {
                    user.editMode = false;
                })
                .error(function (err) {
                    notificationService.displayError("Could not update data");
                    console.log(err)
                })
        };


    }


})(angular.module('accessControl'));