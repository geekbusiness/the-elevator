(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name theElevator.enhancedRequest
     * @description
     * Enhanced user panel request service
     * Multiple requests handling
     **/
    angular
        .module('theElevator')
        .service('enhancedRequest', enhancedRequestService);

    function enhancedRequestService() {
        var self = this,
            floors = [];

        self.callFloor = function (car, calledFloor) {
            floors.push(calledFloor);
        };

        self.getCalledFloor = function () {
            if (floors.length > 1) {
                return floors.shift();
            }
            return -1;
        };

        self.getCalledFloors = function () {
            return floors;
        };
    }
})();

