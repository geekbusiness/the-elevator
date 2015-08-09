(function () {
    'use strict';

    /**
     * @desc order directive that is specific to the order module at a company named Acme
     * @example <userControls></userControls>
     */
    angular
        .module('theElevator')
        .service('car', carService);

    function carService() {
        var self = this;

        self.logError = function () {
            /* */
        };
    }
})();

