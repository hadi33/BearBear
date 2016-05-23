/**
 * Created by Qianxiong.Zheng on 2016/5/3.
 */
angular.module('appRoutes', [
        'ngStorage'
    ])
    .config(['$routeProvider', '$locationProvider', '$httpProvider',
        function($routeProvider, $locationProvider, $httpProvider) {
            $routeProvider
                .when('/', {
                    templateUrl : 'views/home.html',
                    controller : 'MainController'
                })
                .when('/company', {
                    templateUrl : 'views/company.html',
                    controller : 'CompanyController'
                })
                .when('/registration', {
                    templateUrl : 'views/registration.html',
                    controller : 'RegistrationController'
                })
                .when('/verification', {
                    templateUrl : 'views/verification.html',
                    controller : 'VerificationController'
                })
                .when('/userlist', {
                    templateUrl: 'views/userlist.html',
                    controller : 'UserController'
                })
                .when('/ego', {
                    templateUrl : 'views/home.html',
                    controller : 'MainController'
                })
                .when('/login', {
                    templateUrl : 'views/login.html',
                    controller : 'LoginController'
                })
                .when('/logout', {
                    templateUrl: 'views/home.html',
                    controller : 'LogoutController'
                });

            $httpProvider.interceptors
                .push(['$q', '$location', '$localStorage', function($q, $location, $localStorage) {
                    return {
                        'request' : function(config) {
                            config.headers = config.headers || {};
                            if($localStorage.token) {
                                config.headers.Authorization = 'Bearer ' + $localStorage.token;
                            }
                            return config;
                        },
                        'responseError' : function(response) {
                            if (response.status === 401 || response.status === 403) {
                                $location.path = '/login';
                            }
                            return $q.reject(response);
                        }
                    }
                }]);

            $locationProvider.html5Mode({
                enabled:true,
                requireBase:false
            });

        }]);