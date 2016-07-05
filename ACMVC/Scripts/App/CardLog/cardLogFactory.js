(function (app) {
    'use strict';

    app.factory('cardLogFactory', cardLogFactory);

    cardLogFactory.$inject = ['$http'];

    function cardLogFactory($http) {
        return {
            getCardLog: function (dFrom, dTo) {
                var sModel = {
                    dateFrom: dFrom,
                    dateTo: dTo,
                    dummySearch: "Hello"
                }
//                return $http.get(baseUrl + "CardLogs/getall?dateFrom="+dateFrom + "&dateTo="+dateTo);
                return $http.post(baseUrl + "CardLogs/getall", sModel);
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