angular.module('userServices', ['authServices'])
    .factory('User', ['$http', 'env', function ($http, env) {

        const userFactory = {};

        //User.create(data)
        userFactory.create = function (data) {
            return $http.post(env.get('apiroot') + '/api/users/signup', data);
        };

        userFactory.activation = function (token) {
            return $http.patch(env.get('apiroot') + '/api/users/activation/' + token);
        };

        userFactory.resendToken = function (data) {
            return $http.post(env.get('apiroot') + '/api/users/resend', data);
        };

        userFactory.newToken = function (data) {
            return $http.get(env.get('apiroot') + '/api/users/newtoken/' + data);
        };

        return userFactory;
    }]);