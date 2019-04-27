angular.module('userSettingsServices', ['authServices'])
    .factory('UserSettings', ['$http', 'env', function ($http, env) {
        
        const userSettingsFactory = {};

        userSettingsFactory.getUserById = (id) => {
            return $http.get(env.get('apiroot') + '/api/user/settings/' + id);
        };

        userSettingsFactory.deleteAccount = (id) => {
            return $http.delete(env.get('apiroot') + '/api/user/settings/delete/' + id);
        };

        userSettingsFactory.updateUser = (id, data) => {
            return $http.patch(env.get('apiroot') + '/api/user/settings/update/' + id, data);
        };

        return userSettingsFactory;
    }]);