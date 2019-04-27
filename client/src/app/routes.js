angular.module('appRoute', ['ngRoute'])
    .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('');
        $routeProvider
            .when('/', {
                templateUrl: './src/app/components/main/main.html',
                controller: 'mainCtrl',
                controllerAs: 'main',
                title: 'Main',
                authenticated: false
            })
            .when('/home', {
                templateUrl: './src/app/components/home/home.html',
                controller: 'homeCtrl',
                controllerAs: 'home',
                title: 'Home',
                authenticated: true
            })
            .when('/register', {
                templateUrl: './src/app/components/register/register.html',
                controller: 'registerCtrl',
                controllerAs: 'register',
                title: 'Signup',
                authenticated: false
            })
            .when('/activation/:token', {
                templateUrl: './src/app/components/account_settings/activation/activation.html',
                title: 'Activation',
                controller: 'activationCtrl',
                controllerAs: 'activation',
                authenticated: false
            })
            .when('/resend', {
                templateUrl: './src/app/components/account_settings/activation/resend.html',
                title: 'Resend Activation Link',
                controller: 'activationCtrl',
                controllerAs: 'activation',
                authenticated: false
            })
            .when('/new/password', {
                templateUrl: './src/app/components/account_settings/first_access/new-password.html',
                title: 'New Password',
                controller: 'settingsCtrl',
                controllerAs: 'settings',
                authenticated: true
            })
            .when('/forgotpassword', {
                templateUrl: './src/app/components/account_settings/forgotPassword/forgotPassword.html',
                title: 'Resend Activation Link',
                controller: 'forgotPasswordCtrl',
                controllerAs: 'forgotPassword',
                authenticated: false
            })
            .when('/resetpassword/:token', {
                templateUrl: './src/app/components/account_settings/forgotPassword/resetPassword.html',
                title: 'Reset Password',
                controller: 'forgotPasswordCtrl',
                controllerAs: 'forgotPassword',
                authenticated: false
            })
            .when('/login', {
                templateUrl: './src/app/components/login/login.html',
                title: 'Signin',
                authenticated: false
            })
            .when('/facebook/:token', {
                templateUrl: './src/app/components/social/facebook.html',
                title: 'Facebook',
                controller: 'socialCtrl',
                controllerAs: 'social',
                authenticated: false
            })
            .when('/google/:token', {
                templateUrl: './src/app/components/social/google.html',
                title: 'Google',
                controller: 'socialCtrl',
                controllerAs: 'social',
                authenticated: false
            })
            .when('/logout', {
                templateUrl: './src/app/components/login/logout.html',
                authenticated: true
            })
            .when('/admin', {
                templateUrl: './src/app/components/admin/users.html',
                controller: 'userListCtrl',
                controllerAs: 'admin',
                title: 'Admin',
                authenticated: true,
                isAdmin: true
            })
            .when('/admin/userprofile/:id', {
                templateUrl: './src/app/components/admin/userprofile.html',
                controller: 'userListCtrl',
                controllerAs: 'admin',
                title: 'User Profile',
                authenticated: true,
                isAdmin: true
            })
            .when('/profile', {
                templateUrl: './src/app/components/user/profile/profile.html',
                controller: 'userSettingsCtrl',
                controllerAs: 'settings',
                title: 'profile',
                authenticated: true
            })
            .when('/avatar', {
                templateUrl: './src/app/components/user/settings/editavatar/editavatar.html',
                controller: 'editAvatarCtrl',
                controllerAs: 'avatar',
                title: 'Edit Avatar',
                authenticated: true
            })
            .when('/task', {
                templateUrl: './src/app/components/task/addtask/addtask.html',
                controller: 'taskCtrl',
                controllerAs: 'task',
                title: 'Task',
                authenticated: true
            })
            .when('/listtask', {
                templateUrl: './src/app/components/task/listtask/listtask.html',
                controller: 'listtaskCtrl',
                controllerAs: 'listtask',
                title: 'All Task',
                authenticated: true
            })
            .when('/task/update/:id', {
                templateUrl: './src/app/components/task/edittask/editTask.html',
                controller: 'editTaskCtrl',
                controllerAs: 'editTask',
                title: 'Edit Task',
                authenticated: true
            })
            .when('/task/update/avatar/:id', {
                templateUrl: './src/app/components/task/edittask/editavatar.html',
                controller: 'editTaskCtrl',
                controllerAs: 'editTask',
                title: 'Edit Task Avatar',
                authenticated: true
            })
            .when('/task/checktask/:id', {
                templateUrl: './src/app/components/task/checktask/checktask.html',
                controller: 'checkTaskCtrl',
                controllerAs: 'checktask',
                title: 'Check List',
                authenticated: true
            })
            .otherwise({
                redirectTo: "/home",
            });
    }]).run(['$rootScope', 'Auth', '$location', function ($rootScope, Auth, $location) {
        $rootScope.$on('$routeChangeStart', (event, next, current) => {
            if (next.$$route.authenticated == true) {
                if (!Auth.isLoggedIn()) {
                    $rootScope.$evalAsync(() => {
                        $location.path('/');
                    })
                } else if (Auth.isLoggedIn()) {
                    if (next.$$route.isAdmin == true) {
                        Auth.getUser().then((data) => {
                            if (data.data.decoded.role != 'admin') {
                                $rootScope.$evalAsync(() => {
                                    $location.path('/profile');
                                });
                            }
                        })
                    }
                }
            } else if (next.$$route.authenticated == false) {
                if (Auth.isLoggedIn()) {
                    $rootScope.$evalAsync(() => {
                        $location.path('/home');
                    });
                }
            }
        });
    }]);