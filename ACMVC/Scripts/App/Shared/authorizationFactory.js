﻿(function (app) {
    'use strict';

    app.factory('authFactory', authFactory);

    authFactory.$inject = ['$http'];

    function authFactory($http) {
        return {
            userData: {
                Id: undefined,
                UserName: undefined,
                isLoggedIn: false,
                isAdmin: false,
                isOfficial: false,
                isVisitor: true
            },
            profileCompletionData: {
                Valid: false,
                Percent: 0,
                MandatoryFieldMissing: true
            }
        };
    }

})(angular.module('accessControl'));