angular.module('resetPasswordServices', ['authServices'])
    .factory('ResetPassword', ['$http', 'env', function ($http, env) {

        const resetPasswordFactory = {};

        resetPasswordFactory.sendResetToken = (data) => {
            return $http.post(env.get('apiroot') + '/api/users/resetpassword', data);
        };

        resetPasswordFactory.resetPassword = (token, data) => {
            return $http.patch(env.get('apiroot') + '/api/users/resetpassword/' + token, data);
        };

        resetPasswordFactory.firstAccessPassword = (data) => {
            return $http.patch(env.get('apiroot') + '/api/user/settings/first/password', data);
        };

        return resetPasswordFactory;
    }]);