angular.module('taskServices', ['authServices'])
    .factory('Task', ['$http', 'env', function ($http, env) {
        
        const taskFactory = {};
        
        //task.addTask(data)
        taskFactory.addTask = function (data) {
            return $http.post(env.get('apiroot') + '/api/task/', data, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }
            })
        };

        return taskFactory;
    }]);