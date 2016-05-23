/**
 * Created by Qianxiong.Zheng on 2016/5/4.
 */
angular.module('LoginService', []).factory('LoginService', function($http) {
    return {
        login : function(formData) {
            return $http.post('/api/authenticate', formData);
        }

    }

});