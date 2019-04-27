angular.module('LShare')
    .controller('registerCtrl', ['$location', '$timeout', 'User', function ($location, $timeout, User) {

        const app = this;
        app.title = 'Create your account';

        app.regUser = (data) => {
            app.loading = true;
            app.submit = true;
            app.errorMsg = false;
            User.create(app.data).then((data) => {
                if (data.data.success) {
                    app.submit = false;
                    app.loading = false;
                    app.successMsg = data.data.message + '...Redirecting';
                    $timeout(() => {
                        $location.path('/login');
                    }, 2000);
                } else {
                    app.loading = false;
                    app.submit = false;
                }
            }).catch(err => {
                app.submit = false;
                app.errorMsg = err.data;
            });
        }
    }]);