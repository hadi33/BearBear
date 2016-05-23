/**
 * Created by Qianxiong.Zheng on 2016/5/5.
 */
angular.module('UserService', []).factory('UserService', function($http) {
    return {
        ego:function () {
            return $http.get('/api/ego');
        }
    }
});