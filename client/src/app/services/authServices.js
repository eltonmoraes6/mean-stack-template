angular.module('authServices', [])
    .factory('Auth', ['$http', 'AuthToken', 'env', function ($http, AuthToken, env) {

        const authFactory = {};

        authFactory.login = (data) => {
            return $http.post(env.get('apiroot') + '/api/users/signin', data).then((data) => {
                //console.log(data.data.token);
                AuthToken.setToken(data.data.token);
                return data;
            });
        };

        //Auth.isLogIn();
        authFactory.isLoggedIn = () => {
            if (AuthToken.getToken()) {
                return true;
            } else {
                return false;
            };
        };

        //Auth.facebook(token);
        authFactory.facebook = (token) => {
            AuthToken.setToken(token);
        }

        //Auth.google(token);
        authFactory.google = (token) => {
            AuthToken.setToken(token);
        }

        //Auth.getUser();
        authFactory.getUser = () => {
            if (AuthToken.getToken()) {
                return $http.post(env.get('apiroot') + '/api/users/me');
            } else {
                $q.reject({
                    message: 'User has no token'
                });
            };
        };

        //Auth.logout();
        authFactory.logout = () => {
            AuthToken.setToken();
        };

        return authFactory;
    }])

    .factory('AuthToken', ['$window', function ($window) {
        const authTokenFactory = {};
        //AuthToken.setToken(token);
        authTokenFactory.setToken = (token) => {
            if (token) {
                $window.localStorage.setItem('token', token);
            } else {
                $window.localStorage.removeItem('token');
            }
        }
        //AuthToken.getToken();
        authTokenFactory.getToken = () => {
            return $window.localStorage.getItem('token');
        }
        return authTokenFactory;
    }])

    .factory('AuthInterceptors', ['AuthToken', function (AuthToken) {
        const authInterceptorsFactory = {};
        authInterceptorsFactory.request = (config) => {
            const token = AuthToken.getToken();

            if (token) {
                config.headers['x-access-token'] = token;
            }
            return config;
        }
        return authInterceptorsFactory;
    }])

    .factory('env', [function env() {
        var _environments = {
                local: {
                    host: 'localhost:3000',
                    config: {
                        apiroot: 'http://localhost:3000'
                    }
                },
                dev: {
                    host: 'localhost:8080',
                    config: {
                        apiroot: 'http://localhost:8080'
                    }
                },
                test: {
                    host: 'test.com',
                    config: {
                        apiroot: 'http://localhost:3000'
                    }
                },
                stage: {
                    host: 'stage.com',
                    config: {
                        apiroot: 'staging'
                    }
                },
                prod: {
                    host: 'lshare.herokuapp.com',
                    config: {
                        apiroot: 'https://lshare.herokuapp.com'
                    }
                }
            },
            _environment;

        return {
            getEnvironment: function () {
                var host = window.location.host;
                if (_environment) {
                    return _environment;
                }

                for (var environment in _environments) {
                    if (typeof _environments[environment].host && _environments[environment].host == host) {
                        _environment = environment;
                        return _environment;
                    }
                }

                return null;
            },
            get: function (property) {
                return _environments[this.getEnvironment()].config[property];
            }
        };
    }]);