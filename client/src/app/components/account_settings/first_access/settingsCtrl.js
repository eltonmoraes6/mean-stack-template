angular.module('LShare')
    .controller('settingsCtrl', ['$location', '$timeout', 'User', '$routeParams', 'ResetPassword', function ($location, $timeout, User, $routeParams, ResetPassword) {

        const app = this;
        app.title = 'New Password'

        app.resetPassword = (data) => {
            app.ResetPass = true;
            ResetPassword.firstAccessPassword(app.data).then((result) => {
                if (result.data.success) {
                    app.ResetPass = false;
                    app.successMsg = result.data.message;
                    $timeout(function () {
                        $location.path('/profile');
                    }, 2000);
                } else {
                    app.ResetPass = false;
                }
            }).catch((err) => {
                app.ResetPass = false;
                app.errorMsg = err.data;
            });
        };
    }]);