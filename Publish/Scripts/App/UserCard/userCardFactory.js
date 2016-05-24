(function (app) {
    'use strict';

    app.factory('userCardFactory', userCardFactory);

    userCardFactory.$inject = ['$http'];

    function userCardFactory($http) {
        return {
            getUserCard: function () {
                return $http.get(baseUrl + "userCards/getall");
            },
            addUserCard: function (userCard) {
                return $http.post(baseUrl + "userCards/create", userCard);
            },
            deleteUserCard: function (userCard) {
                return $http.post(baseUrl + "userCards/delete/" + userCard.Id);
            },
            updateUserCard: function (userCard) {
                return $http.post(baseUrl + "userCards/edit/" + userCard.Id, userCard);
            }
        };
    }

})(angular.module('accessControl'));