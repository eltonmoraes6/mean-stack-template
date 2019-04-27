angular.module('LShare')
    .controller('checkTaskCtrl', ['ListTask', '$timeout', '$routeParams', '$route', '$location', function (ListTask, $timeout, $routeParams, $route, $location, ) {

        const app = this;

        app.id = $routeParams.id;

        app.getTaskData = () => {
            id = app.id;
            ListTask.getTaskById(id).then((result) => {
                if (result) {
                    app.data = result.data.task;
                    app.date = result.data.date;
                    app.count = app.data.checkdata.length;
                }
            }).catch(err => {
                app.errorMsg = err;
            });
        };

        app.getTaskData();

        app.edit = (id) => {
            $location.path('/task/update/' + app.id);
        };

        app.delete = (id) => {
            ListTask.deleteTask(id).then((resp) => {
                if (resp.data.success) {
                    app.successMsg = resp.data.message;
                    $timeout(() => {
                        $location.path('/listtask/');
                    }, 2000);
                }
            }).catch(err => {
                app.errorMsg = err;
            });
        };

        app.editAvatar = (id) => {
            $location.path('/task/update/avatar/' + app.id);
        };
    }]);