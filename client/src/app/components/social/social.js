(function () {
    angular.module('LShare')
        .controller('socialCtrl', ['$routeParams', '$location', '$timeout', 'Auth', function ($routeParams, $location, $timeout, Auth) {
            const app = this;
            app.title = "Facebook";

            app.socialFacebook = () => {
                app.facebookLoading = true;
                Auth.facebook($routeParams.token)
                $location.path('/');
            };

            app.socialGoogle = () => {
                app.googleLoadin = true;
                Auth.google($routeParams.token)
                $location.path('/');
            };

            app.socialFacebook();
            app.socialGoogle();
        }]);
})();