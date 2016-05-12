(function (app) {
    'use strict';

    app.factory('cardLogFactory', cardLogFactory);

    cardLogFactory.$inject = ['$http'];

    function cardLogFactory($http) {
        return {
            getCardLog: function () {
                return $http.get(baseUrl + "CardLogs/getall");
            },
            addCardLog: function (cardLog) {
                return $http.post(baseUrl + "CardLogs/create", cardLog);
            },
            deleteCardLog: function (cardLog) {
                return $http.post(baseUrl + "CardLogs/delete/" + cardLog.Id);
            },
            updateCardLog: function (cardLog) {
                return $http.post(baseUrl + "CardLogs/edit/" + cardLog.Id, cardLog);
            }
        };
    }

})(angular.module('accessControl'));