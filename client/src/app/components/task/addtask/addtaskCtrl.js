angular.module('LShare')
    .controller('taskCtrl', ['$scope', '$location', '$timeout', 'Task', function ($scope, $location, $timeout, Task) {

        const app = this;

        app.send = false;
        app.img_default = 'src/img/no-image-icon-4.png'

        app.task = (data) => {
            app.loading = true;
            app.send = true;
            var fd = new FormData();
            for (key in app.data) {
                fd.append(key, app.data[key]);
            }
            app.fl = angular.element(document.getElementById('avatar'))[0].files[0];
            fd.append('avatar', app.fl);
            Task.addTask(fd).then((data) => {
                if (data.data.success) {
                    app.loading = false;
                    app.successMsg = data.data.message + '...Redirecting';
                    $timeout(() => {
                        $location.path('/listtask');
                    }, 2000);
                }
            }).catch(err => {
                app.loading = false;
                app.send = false;
                app.errorMsg = err.data;
                $timeout(() => {
                    app.errorMsg = '';
                }, 3000);
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

        const myElement = angular.element(document.querySelector("#avatar"))
        angular.element(document.querySelector(".custom-file-input")).bind('change', () => {
            const fileName = myElement.val().split("\\").pop().split('.')[0];
            myElement.siblings(".custom-file-label").addClass("selected").html(fileName.slice(0, 10) + '...');
        })
    }]);