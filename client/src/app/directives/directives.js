angular.module('directives', [])

    //input autofocus
    .directive('autofocus', ['$timeout', function ($timeout) {
        return {
            restrict: 'A',
            link: ($scope, $element) => {
                $timeout(() => {
                    $element[0].focus();
                });
            }
        }
    }])

    //img upload
    .directive('fileModel', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function () {
                    scope.$apply(function () {
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }]);