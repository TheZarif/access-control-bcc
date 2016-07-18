(function (app) {
    'use strict';

    app.factory('designationFactory', designationFactory);

    designationFactory.$inject = ['$http'];

    function designationFactory($http) {
        return {
            getDesignations: function () {
                return $http.post(baseUrl + "Designations/getall");
            }
        };
    }

})(angular.module('accessControl'));