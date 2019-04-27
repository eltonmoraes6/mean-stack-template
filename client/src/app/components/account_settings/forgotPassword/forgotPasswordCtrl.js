angular.module('LShare')
    .controller('forgotPasswordCtrl', ['$location', '$timeout', '$routeParams', 'ResetPassword', function ($location, $timeout, $routeParams, ResetPassword) {

        const app = this;
        app.title = "Forgot Password";

        app.send = (forgotPasswordData) => {
            ResetPassword.sendResetToken(app.forgotPasswordData).then((data) => {
                app.sendResetPass = true;
                if (data.data.success) {
                    app.successResetPassMsg = data.data.message;
                    $timeout(function () {
                        $location.path('/login');
                    }, 2000);
                } else {
                    app.sendResetPass = false;
                };
            }).catch((err) => {
                app.sendResetPass = false;
                app.errorResetPassMsg = err.data;
            });
        };

        app.resetPass = async (token, data) => {
            app.ResetPass = true;
            ResetPassword.resetPassword($routeParams.token, app.data).then((data) => {
                const success = data.data.success;
                if (success) {
                    app.succssMsg = data.data.message;
                    $timeout(function () {
                        $location.path('/login');
                    }, 2000);
                } else {
                    app.ResetPass = false;
                };
            }).catch((err) => {
                app.ResetPass = false;
                app.errorMsg = err.data;
                app.errorTokenMsg = err.data.token;
            });
        };
    }]);