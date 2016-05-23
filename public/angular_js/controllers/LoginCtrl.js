/**
 * Created by Qianxiong.Zheng on 2016/5/3.
 */
angular.module('LoginCtrl', [])
    .controller('LoginController',
        function ($scope, $location, $rootScope, $window, $localStorage, LoginService, UserService, RegistrationService) {
            // user login
            if (typeof $localStorage.token !== 'undefined') {
                // check user token
                UserService.ego()
                    .success(function (data) {
                        if (data.success === true) {
                            $scope.username = data.username;
                            $window.location.href = './main';
                        }

                    })
                    .error(function (data) {
                        $scope.error = data.data;
                    });


            }

            $scope.login = function (isValid) {
                if (isValid) {
                    LoginService.login($scope.formData)
                        .success(function (data) {
                            if (data.success === false) {
                                $scope.message = data.data;
                                alert($scope.message);
                            } else {
                                $scope.username = data.username;
                                $localStorage.token = data.token;
                                $window.location.href = './main'
                            }
                            $scope.formData = {};
                        })
                        .error(function () {
                            // hander error
                            $rootScope.error = '登陆失败'
                        })

                }

            };
            $scope.registration = function (isValid) {
                if (isValid) {
                    RegistrationService.registration($scope.regForm)
                        .success(function (data) {
                            if (data.success === false) {
                                $scope.message = data.data;
                                alert($scope.message);
                            } else {
                                $localStorage.token = data.token;
                            }
                            $scope.regForm.password = '';
                            $scope.regForm.repassword = '';
                        })
                        .error(function () {
                            // hander error
                            $rootScope.error = '注册失败'
                        })

                }
            };
            $scope.sendEmail = function (isValid) {
                if (isValid) {
                    var promise = RegistrationService.sendEmail($scope.resForm);
                    promise.then(function (data) {
                        //resolve
                        $scope.message = data.data;
                        alert($scope.message);
                    }, function (data) {
                        //reject
                        $rootScope.error = '发送失败'
                    });
                }
            }

            $scope.token = $localStorage.token;
        })

