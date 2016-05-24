/**
 * Created by Qianxiong.Zheng on 2016/5/5.
 */
(function () {
    'use strict';

    angular
        .module('app', ['ui.router','datatables','angularSpinner'])
        .config(config)
        .run(run);

    function config($stateProvider, $urlRouterProvider, $locationProvider) {
        // default route
        $urlRouterProvider.otherwise("/");
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'views/home.html',
                controller: 'HomeController',
                controllerAs: 'vm'

            })
            .state('company', {
                url: '/company',
                templateUrl: 'views/company.html',
                controller: 'CompanyController',
                controllerAs: 'vm'
            })

            .state('vender', {
                url: '/vender',
                templateUrl: 'views/vender.html',
                controller: 'VenderController',
                controllerAs: 'vm'
            })
            .state('customer', {
                url: '/customer',
                templateUrl: 'views/customer.html',
                controller: 'CustomerController',
                controllerAs: 'vm'
            })

            .state('account', {
                url: '/account',
                templateUrl: 'views/account.html',
                controller: 'AccountController',
                controllerAs: 'vm'
            })

            .state('profit_center', {
                url: '/profit_center',
                templateUrl: 'views/profit_center.html',
                controller: 'ProfitCenterController',
                controllerAs: 'vm'
            })

            .state('cost_center', {
                url: '/cost_center',
                templateUrl: 'views/cost_center.html',
                controller: 'CostCenterController',
                controllerAs: 'vm'
            })
        ;

        // $locationProvider.html5Mode(
        //     {
        //         enabled: true,
        //         requireBase: true
        //     }
        // );
    }

    function run($http, $rootScope, $window) {
        // add JWT token as default auth header
        $http.defaults.headers.common['Authorization'] = 'Bearer ' + $window.jwtToken;
    }

// manually bootstrap angular after the JWT token is retrieved from the server
    $(function () {
        // get JWT token from server
        $.get('/app/token', function (token) {
            window.jwtToken = token;
            angular.bootstrap(document, ['app']);
        });
    });
})();