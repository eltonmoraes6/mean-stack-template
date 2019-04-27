angular.module('LShare')
    .controller('activationCtrl', ['$location', '$timeout', 'User', '$routeParams', function ($location, $timeout, User, $routeParams) {

        const app = this;

        app.loading = true;

        User.activation($routeParams.token).then((data) => {
            if (data.data.success) {
                app.loading = false;
                app.successMsg = data.data.message + '...Redirecting';
                $timeout(() => {
                    $location.path('/login');
                }, 2000);
            } else {
                app.errorMsg = data.data.message;
                app.loading = false;
            }
        }).catch((err) => {
            app.loading = false;
            app.errorMsg = err.data;
        });

        app.resendLink = (activationData) => {
            app.sendLink = true;
            User.resendToken(app.activationData).then((data) => {
                if (data.data.success) {
                    app.successMsgResend = data.data.message;
                    $timeout(() => {
                        $location.path('/login');
                    }, 2000);
                } else {
                    app.sendLink = false;
                };
            }).catch((err) => {
                app.sendLink = false;
                app.errorMsgResend = err.data;
            });
        };

    }]);