(function () {
    angular.module('LShare')
        .controller('editAvatarCtrl', ['$scope', '$timeout', '$location', 'FormData', function ($scope, $timeout, $location, FormData) {

            const app = this;
            app.title = 'Edit Avatar';

            $scope.editAvatar = (avatar) => {
                app.submit = true;
                app.loading = true;
                app.uploadUrl = '/api/users/update/avatar/';
                FormData.sendFormData(app.uploadUrl, app.avatar).then((resp) => {
                    if (resp.data.success) {
                        app.loading = false;
                        app.successMsg = resp.data.message;
                        $timeout(() => {
                            $location.path('/');
                        }, 2000);
                    } else {
                        app.submit = false;
                        app.loading = false;
                        app.item = resp.data;
                    }
                }).catch(err => {
                    app.submit = false;
                    app.loading = false;
                    app.errorMsg = err.data.message;
                });
            }

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
            }
        }]);
})();