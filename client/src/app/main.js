angular.module('LShare',
        [
            'appRoute',
            'pascalprecht.translate',
            'ngCookies',
            'authServices',
            'userServices',
            'taskServices',
            'userListServices',
            'listServices',
            'directives',
            'resetPasswordServices',
            'userSettingsServices',
            'formDataServices',
        ])
    .config(['$httpProvider', '$translateProvider', function ($httpProvider, $translateProvider) {
        $httpProvider.interceptors.push('AuthInterceptors');
        $translateProvider.useStaticFilesLoader({
                prefix: 'src/app/translation/locale-',
                suffix: '.json'
            })
            .preferredLanguage('pt-br')
            .useSanitizeValueStrategy('escape')
            .useLocalStorage()
            .useMissingTranslationHandlerLog();
    }])
    .run(['$rootScope', '$route', '$window', function ($rootScope, $route, $window) {
        $rootScope.$on('$routeChangeSuccess', function () {
            document.title = $route.current.title;
        });
        $rootScope.online = navigator.onLine;
        $window.addEventListener("offline", function () {
            $rootScope.$apply(function () {
                $rootScope.online = false;
            });
        }, false);
        $window.addEventListener("online", function () {
            $rootScope.$apply(function () {
                $rootScope.online = true;
            });
        }, false);
    }])