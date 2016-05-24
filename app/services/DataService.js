/**
 * Created by Qianxiong.Zheng on 2016/5/5.
 */
(function () {

    'use strict';

    angular
        .module('app')
        .factory('DataService', Service);

    function Service($http, $q) {
        var service = {};
        service.getCompany = GetCompany;
        service.getVender  = GetVender;
        service.getProfitCenter  = getProfitCenter;

        return service;

        function GetCompany() {
            return $http.get('/api/business/getCompany').then(handleSuccess, handleError);
        }

        function GetVender() {
            //return $http.get('/api/business/getCompany').then(handleSuccess, handleError);
        }

        function getProfitCenter() {
            return $http.get('/api/business/getProfitCenter').then(handleSuccess, handleError);
        }

        // private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
    };


})();