angular.module('listServices', ['authServices'])
    .factory('ListTask', ['$http', 'env', function ($http, env) {

        const listFactory = {};

        listFactory.getTasks = () => {
            return $http.get(env.get('apiroot') + '/api/task/');
        };

        listFactory.deleteTask = (id) => {
            return $http.delete(env.get('apiroot') + '/api/task/' + id);
        };

        listFactory.getTaskById = (id) => {
            return $http.get(env.get('apiroot') + '/api/task/' + id);
        };

        listFactory.updateTask = (id, data) => {
            return $http.patch(env.get('apiroot') + '/api/task/update/' + id, data);
        };

        listFactory.updateTaskAvatar = function (id, data) {
            return $http.patch(env.get('apiroot') + '/api/task/update/avatar/' + id, data, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
        };

        return listFactory;
    }]);