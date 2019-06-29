(function () {
    angular.module('LShare')
        .controller('userListCtrl', ['UserList', '$location', '$timeout', '$routeParams', '$route', function (UserList, $location, $timeout, $routeParams, $route) {

            const app = this;

            app.UserList = () => {
                UserList.getAllUsers().then((data) => {
                    app.data = data.data.result;
                    app.count = data.data.result.length;
                }).catch(err => {
                    app.errorMsg = err;
                });
            }

            app.UserList();

            app.getUserData = async (id) => {
                $location.path('/admin/userprofile/' + id);
            };

            app.userDisable = true;

            app.getUser = () => {
                app.disabeId = true;
                app.userId = $routeParams.id;
                if (app.userId != undefined) {
                    UserList.getUserById(app.userId).then((data) => {
                        app.success = data.data.success;
                        if (app.success) {
                            app.userID = data.data.user._id;
                            app.userAvatar = data.data.user;
                            app.result = data.data.user;
                            console.log(app.userAvatar)
                        }
                    }).catch(err => {
                        app.errorMsg = err;
                    });
                }

            };
            app.getUser();

            app.enable = () => {
                app.userDisable = false;
            };

            app.delete = (id) => {
                app.id = $routeParams.id;
                UserList.deleteAccount(app.id).then((data) => {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(() => {
                            $location.path('/admin');
                        }, 2000);
                    }
                }).catch((err) => {
                    app.errorMsg = err;
                });
            };

            app.edit = (id, reult) => {
                app.submit = true;
                app.ID = $routeParams.id;
                UserList.updateUser(app.ID, app.result).then((data) => {
                    if (data.data.success) {
                        app.successUpdateMsg = data.data.message;
                        $timeout(() => {
                            $route.reload();
                        }, 2000);
                    }
                }).catch((err) => {
                    app.submit = false;
                    app.errorUpdateMsg = err.data;
                });
            };
        }]);
})();