'use strict';

angular.module('directive.layout', [])
        .config(function ($sceDelegateProvider) {
            $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://www.youtube.com/**']);
        })
        .directive('responsivevideo', function ($sce) {
            return {
                restrict: 'E',
                transclude: true,
                priority: -100,
                scope: {
                    embedcode: '@'
                },
                templateUrl: 'bower_components/chat-component/dist/layout/responsive-video.html',
                link: function (scope) {
                    scope.$watch('embedcode', function (newVal) {
                        if (newVal) {
                            scope.url = $sce.trustAsResourceUrl("http://www.youtube.com/embed/" + newVal);
                        }
                    });
                }
            };
        });