/**
 * Created by Qianxiong.Zheng on 2016/5/4.
 */
angular.module('RegistrationService', []).factory('RegistrationService', function($http,$q) {
    return {
        registration : function(formData) {
            return $http.post('/api/registration', formData);
        },
        sendEmail : function(data) {
            var  deferred = $q.defer();
            $http.post('/api/respassword', data)
                .success(function (data) {
                    //     $scope.message = data.data;
                    //     alert($scope.message);

                    deferred.resolve(data);
                })
                .error(function () {
                    // hander error
                    deferred.reject(data);
                    // $rootScope.error = '注册失败'
                });
            return deferred.promise;
        },
        // verifyEmail : function(data) {
        //     return $http.post('/api/verifyemail', data);
        // }
    }
});
