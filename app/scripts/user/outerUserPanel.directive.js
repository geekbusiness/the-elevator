(function () {
    'use strict';

    /**
     * @desc order directive that is specific to the order module at a company named Acme
     * @example <userPanel></userPanel>
     */
    angular
        .module('theElevator')
        .directive('outerUserPanel', outerUserPanelDirective);

    function outerUserPanelDirective() {
        var directive = {
            restrict: 'E',
            templateUrl: 'scripts/user/outerUserPanel.directive.html',
            scope: {},
            link: outerUserPanelLinkFunc
        };

        return directive;

        function outerUserPanelLinkFunc(scope) {
            scope.stepIn = function () {

            };

            scope.stepOut = function () {

            };
        }
    }
})();
