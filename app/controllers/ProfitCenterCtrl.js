/**
 * Created by Qianxiong.Zheng on 2016/5/11.
 */
(function () {
    'use strict';
    angular.module('app')
        .controller('ProfitCenterController', controller);
    function controller( usSpinnerService, DTOptionsBuilder, DataService) {
        var vm = this;


        // DataTables configurable options
        // vm.dtOptions = DTOptionsBuilder.newOptions()
        //     .withDisplayLength(10)
        //     .withOption('bLengthChange', false);
        // get company data
        usSpinnerService.spin('spinner-1');
        vm.profitCenters = null;


        DataService.getProfitCenter()
            .then(function (doc) {
                vm.profitCenters = doc;
                usSpinnerService.stop('spinner-1');
            });

    }

    controller.$inject = ['usSpinnerService','DTOptionsBuilder','DataService'];
})();