/**
 * Created by Qianxiong.Zheng on 2016/5/11.
 */
(function () {
    'use strict';
    angular.module('app')
        .controller('CompanyController', controller);

    function controller(DataService) {
        // get company data
         var vm = this;
         vm.companys = null;
        DataService.getCompany()
            .then(function (doc) {
                vm.companys = doc;
            });
    }

})();