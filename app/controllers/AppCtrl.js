/**
 * Created by Qianxiong.Zheng on 2016/5/11.
 */
(function () {
    'use strict';

    angular.module('app')
        .controller('AppController', controller);

    function controller($scope,UserService) {
        // var vm = this;
        $scope.user = null;
        // get login user info
        UserService.getCurrentUser()
            .then(function (user) {
                $scope.user = user;
                $scope.user.picture = 'public/images/hadi.png';
            });

    }

})();