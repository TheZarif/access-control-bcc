(function (app) {
    'use strict';

    app.factory('cardFactory', cardFactory);

    cardFactory.$inject = ['$http'];

    function cardFactory($http) {
        return {
            getCard: function () {
                return $http.get(baseUrl + "cardinfoes/getall");
            },
            addCard: function (card) {
                return $http.post(baseUrl + "cardinfoes/create", card);
            },
            deleteCard: function (card) {
                return $http.post(baseUrl + "cardinfoes/delete/" + card.Id);
            },
            updateCard: function (card) {
                return $http.post(baseUrl + "cardinfoes/edit/" + card.Id, card);
            }
        };
    }

})(angular.module('homeCinema'));