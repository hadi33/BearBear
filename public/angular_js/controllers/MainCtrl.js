/**
 * Created by Qianxiong.Zheng on 2016/5/3.
 */
angular.module('MainCtrl', [])
    .controller('MainCtrollers',
        function ($scope, $location, $rootScope, $window, $localStorage,UserService) {
            // check user login
            if (typeof $localStorage.token !== 'undefined') {
                // check user token
                UserService.ego()
                    .success(function (data) {
                        if (data.success === false) {
                            $window.location.href = './login';
                        }else{
                        //   get user info
                            $scope.username = data.username;
                            $scope.userpicture = 'images/hadi.png';
                        }
                    })
                    .error(function (data) {
                        $scope.error = data.data;
                    });


            }else{
                // $window.location.href = './login';
            }
            
            $scope.logout = function () {
                delete $localStorage.token;
                $window.location.href = './login'
            };

        });