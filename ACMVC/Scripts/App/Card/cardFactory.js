(function (app) {
    'use strict';

    app.factory('cardFactory', cardFactory);

    cardFactory.$inject = ['$http'];

    function cardFactory($http) {
        return {
            getCard: function (page, search) {
                if (!page) page = 1;
                if (!search) search = "";
                return $http.get(baseUrl + "cardinfoes/getall?page=" + page + "&search=" + search);
            },
            addCard: function (card) {
                return $http.post(baseUrl + "cardinfoes/create", card);
            },
            deleteCard: function (card) {
                return $http.post(baseUrl + "cardinfoes/delete/" + card.Id);
            },
            updateCard: function (card) {
                return $http.post(baseUrl + "cardinfoes/edit/" + card.Id, card);
            },
            getCardByNumber: function (number) {
                console.log("cardFactory", number);
                return $http.post(baseUrl + "cardinfoes/getall", {"Number": number});
            }
        };
    }

})(angular.module('accessControl'));