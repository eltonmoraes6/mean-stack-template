(function () {
    angular.module('LShare')
        .controller('editTaskCtrl', ['ListTask', '$scope', '$routeParams', '$location', '$timeout', function (ListTask, $scope, $routeParams, $location, $timeout) {

            const app = this;
            app.title = 'Edit Task';
            app.id = $routeParams.id;

            app.getTaskData = () => {
                id = app.id;
                ListTask.getTaskById(id).then((result) => {
                    if (result) {
                        app.data = result.data.task;
                    }
                }).catch(err => {
                    app.errorMsg = err;
                });
            };
            app.getTaskData();

            app.edit = (id, data) => {
                app.submit = true;
                const item = app.data.checkdata;
                dataforEach = [];
                item.forEach(element => {
                    let obj = {};
                    obj.value = element.value;
                    obj.volume = element.volume;
                    dataforEach.push(obj);
                });
                app.data.checkdata = dataforEach;
                ListTask.updateTask(app.data._id, app.data).then((data) => {
                    if (data.data.success) {
                        app.successMsg = data.data.message;
                        $timeout(() => {
                            $location.path('/listtask');
                        }, 2000);
                    }
                }).catch(err => {
                    app.submit = false;
                    app.errorMsg = err.data;
                });
            };

            app.updateAvatar = (id, data) => {
                app.loadingAvatar = true;
                app.submitAvatar = true;
                var fd = new FormData();
                for (key in app.data) {
                    fd.append(key, app.data[key]);
                }
                app.fl = angular.element(document.getElementById('avatar'))[0].files[0];
                fd.append('avatar', app.fl);
                ListTask.updateTaskAvatar(app.id, fd).then((data) => {
                    if (data.data.success) {
                        app.loadingAvatar = false;
                        app.successUpdateTaskAvatarMsg = data.data.message;
                        $timeout(() => {
                            $location.path('/listtask');
                        }, 2000);
                    }
                }).catch((err) => {
                    app.loadingAvatar = false;
                    app.submitAvatar = false;
                    app.errorUpdateTaskAvatarMsg = err.data;
                    app.errorFileMsg = err.data.file;
                });
            };

            $scope.files = [];
            $scope.uploadedFile = (element) => {
                $scope.currentFile = element.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    $scope.image_source = event.target.result
                    $scope.$apply(($scope) => {
                        $scope.files = element.files;
                    });
                }
                reader.readAsDataURL(element.files[0]);
            };
        }]);
})();