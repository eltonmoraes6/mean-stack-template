angular.module('formDataServices', ['authServices'])
    .factory('FormData', ['$http', 'env', function ($http, env) {
       
        const formDataFactory = {};
        const app = this;
        app.avatar = {};
        
        formDataFactory.sendFormData = (uploadUrl, file) => {
            const fd = new FormData();
            for (key in app.avatar) {
                fd.append(key, app.avatar[key]);
            }
            app.fl = angular.element(document.getElementById('avatar'))[0].files[0];
            fd.append('avatar', app.fl);
            return $http.patch(env.get('apiroot') + uploadUrl, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined
                }                
            });
        }

        return formDataFactory;
    }]);