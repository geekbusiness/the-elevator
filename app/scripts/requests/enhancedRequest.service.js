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
            if (floors.length > 0) {
                return floors[0];
            }
            return -1;
        };

        self.clearFloor = function (floorToClear) {
            _.remove(floors, function (floor) {
                return (floor === floorToClear);
            });
        };

        self.clearAll = function() {
            floors = [];
        };

        self.getCalledFloors = function () {
            return floors;
        };
    }
})();

