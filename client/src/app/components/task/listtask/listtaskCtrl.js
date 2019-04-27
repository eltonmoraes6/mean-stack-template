angular.module('LShare')
    .controller('listtaskCtrl', ['ListTask', '$timeout', '$location', '$routeParams', '$route', function (ListTask, $timeout, $location, $routeParams, $route, ) {
       
        const app = this;
       
        app.ListTask = () => {
            ListTask.getTasks().then((data) => {
                app.count = data.data.count;
                if (app.count == 0) {
                    app.emp = false;
                } else {
                    app.listtask = data.data.data;
                    app.emp = true;
                };
            }).catch(err => {
                app.errorMsg = err;
            });
        };
        
        app.ListTask();

        app.delete = (id) => {
            app.loading = true;
            ListTask.deleteTask(id).then((resp) => {
                if (resp.data.success) {
                    app.loading = false;
                    app.successMsg = resp.data.message;
                    $timeout(() => {
                        $route.reload();
                    }, 2000);
                }
            }).catch(err => {
                app.loading = false;
                app.errorMsg = err;
            });
        };

        app.getdata = (id) => {
            $location.path('/task/update/' + id);
        };

        app.goCheckTask = (id) => {
            $location.path('/task/checktask/' + id);
        };
    }]);