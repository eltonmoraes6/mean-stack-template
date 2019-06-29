(function () {
    angular.module('LShare')
        .controller('userSettingsCtrl', ['UserSettings', 'Auth', '$timeout', '$routeParams', '$route', function (UserSettings, Auth, $timeout, $routeParams, $route) {

            const app = this;
            app.userDisable = true;

            app.enable = () => {
                app.userDisable = false;
            };

            app.delete = (id) => {
                app.deletId = id;
                UserSettings.deleteAccount(app.deletId).then((data) => {
                    if (data.data.success) {
                        app.successDelMsg = data.data.message;
                        $timeout(() => {
                            Auth.logout();
                            $route.reload();
                        }, 2000);
                    }
                }).catch((err) => {
                    app.errorMsg = err;
                });
            };

            app.edit = (id, decoded) => {
                app.submit = true;
                app.editId = id;
                app.decoded = decoded;
                UserSettings.updateUser(app.editId, app.decoded).then((data) => {
                    if (data.data.success) {
                        app.successUpdateMsg = data.data.message;
                        $timeout(() => {
                            $route.reload();
                        }, 2000);
                    }
                }).catch((err) => {
                    app.submit = false;
                    app.errorUpdateMsg = err;
                    if (app.errorUpdateMsg.data.name) {
                        app.errorNameMsg = app.errorUpdateMsg.data.name;
                    }
                });
            };
        }]);
})();