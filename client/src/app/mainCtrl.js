angular.module('LShare')
    .controller('mainCtrl',
        [
            'Auth',
            '$timeout',
            '$location',
            '$routeParams',
            '$route',
            '$rootScope',
            '$scope',
            '$window',
            '$interval',
            'User',
            'AuthToken',
            '$translate',
            function (Auth, $timeout, $location, $routeParams, $route, $rootScope, $scope, $window, $interval, User, AuthToken, $translate) {

                const app = this;
                app.title = 'LShare';
                app.loadme = false;
                app.spinner = () => {
                    $scope.$watch('online', function (newStatus) {
                        if (newStatus) {
                            app.loadme = true;
                        }
                    });
                };

                const sidenav = new Sidenav({
                    content: document.getElementById("content"),
                    sidenav: document.getElementById("sidenav"),
                    backdrop: document.getElementById("backdrop")
                });

                $scope.closeSidenav = () => {
                    sidenav.close();
                };

                $scope.openSidenav = () => {
                    sidenav.open();
                };

                angular.element(document.getElementById("menu-toggle")).bind("click", () => {
                    sidenav.open();
                });

                $scope.goView = (routes) => {
                    $location.path(routes);
                };

                app.hideModal = () => {
                    angular.element(document).ready(function () {
                        $('#exampleModal').modal('hide');
                    });
                };

                app.showModal = () => {
                    angular.element(document).ready(function () {
                        $('#exampleModal').modal({
                            backdrop: 'static',
                            keyboard: false
                        }, 'show');
                    });
                };
                app.newPass = () => {
                    app.hideModal();
                    $location.path('/new/password');
                };
                app.checkSession = () => {
                    if (Auth.isLoggedIn()) {
                        app.checkingSession = true;
                        let interval = $interval(() => {
                            const token = $window.localStorage.getItem('token');
                            if (token === null) {
                                $interval.cancel(interval);
                            } else {
                                self.parserJwt = (token) => {
                                    const base64Url = token.split('.')[1];
                                    const base64 = base64Url.replace('-', '+').replace('_', '/');
                                    return JSON.parse($window.atob(base64));
                                };
                                const expireTime = self.parserJwt(token);
                                const timeSamp = Math.floor(Date.now() / 1000);
                                const timeCheck = (expireTime.exp - timeSamp);
                                //console.log('TimeCheck: ' + timeCheck)
                                if (timeCheck <= 300) {
                                    app.renewSession();
                                    $interval.cancel(interval);
                                }
                            }
                        }, 3000);
                    }
                }; 

                app.checkSession();

                app.renewSession = () => {
                    User.newToken(app.decoded.email).then((data) => {
                        if (data.data.auth) {
                            AuthToken.setToken(data.data.token);
                            app.checkSession();
                        }
                    }).catch(err => {
                        app.renewSessionErr = err;
                    });
                };

                app.endSession = () => {
                    app.hideModal();
                    app.loging_out = true;
                    $timeout(() => {
                        app.loging_out = false;
                        $location.path('/logout');
                        $location.path('/');
                        $window.localStorage.clear();
                        Auth.logout();
                        $route.reload();
                    }, 2000);
                };

                app.facebook = () => {
                    $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/facebook';
                };

                app.google = () => {
                    $window.location = $window.location.protocol + '//' + $window.location.host + '/auth/google';
                };

                $rootScope.$on('$routeChangeStart', () => {
                    if (!app.checkSession) {
                        app.checkSession();
                    }
                    if (Auth.isLoggedIn()) {
                        app.isLoggedIn = true;
                        Auth.getUser().then((data) => {
                            //console.log(data)
                            if (data.data.decoded) {
                                app.decoded = data.data.decoded;
                                if (app.decoded.role === 'admin') {
                                    app.role = true;
                                } else {
                                    app.role = false;
                                };

                                if (!app.decoded.password_verified) {
                                    app.password_not_verified = true;
                                    app.showModal();
                                } else {
                                    app.password_not_verified = false;
                                    app.hideModal();
                                }
                                app.spinner();
                            } else {
                                Auth.logout();
                                $route.reload();
                                app.spinner();
                            }
                        }).catch(err => {
                            app.isLoggedInErr = err;
                        });
                    } else {
                        app.isLoggedIn = false;
                        app.username = '';
                        app.spinner();
                    };

                    if ($location.hash() === '_=_') $location.hash(null)
                });

                app.doLogin = (data) => {
                    app.loading = true;
                    app.errorMsg = false;
                    app.submit = true;
                    Auth.login(app.data).then((data) => {
                        if (data.data.auth) {
                            app.loading = false;
                            app.successMsg = data.data.message + '...Redirecting';
                            $timeout(() => {
                                $location.path('/home');
                                app.data = {};
                                app.successMsg = '';
                                $route.reload();
                                app.checkSession();
                            }, 2000);

                        } else {
                            app.loading = false;
                            app.submit = false;
                        };
                    }).catch((err) => {
                        app.submit = false;
                        app.errorMsgActive = err.data.active;
                        app.errorMsg = err.data;
                    });
                };

                app.logout = () => {
                    app.endSession();
                };

                app.switchLanguage = function (key) {
                    $translate.use(key);
                };
            }
        ]);