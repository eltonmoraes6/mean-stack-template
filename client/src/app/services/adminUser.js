(function () {
    angular.module('userListServices', ['authServices'])
        .factory('UserList', ['$http', 'env', function ($http, env) {

            const userListFactory = {};

            userListFactory.getAllUsers = () => {
                return $http.get(env.get('apiroot') + '/api/admin/users');
            }

            userListFactory.getUserById = (id) => {
                return $http.get(env.get('apiroot') + '/api/admin/user/' + id);
            }

            userListFactory.deleteAccount = (id) => {
                return $http.delete(env.get('apiroot') + '/api/admin/delete/user/' + id);
            }

            userListFactory.updateUser = (id, data) => {
                return $http.patch(env.get('apiroot') + '/api/admin/update/user/' + id, data);
            }

            return userListFactory;
        }]);
})();