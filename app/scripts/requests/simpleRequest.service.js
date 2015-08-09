(function () {
    'use strict';

    /**
     * @ngdoc service
     * @name theElevator.simpleRequest
     * @description
     * Simple user panel request service
     * One request at a time
     **/
    angular
        .module('theElevator')
        .service('simpleRequest', simpleRequestService);

    function simpleRequestService() {
        var self = this,
            floor = -1;

        self.callFloor = function (car, calledFloor) {
            if (car.dir !== 0) {
                // If car is moving, user can't call another floor
                return;
            }
            floor = calledFloor;
        };

        self.getCalledFloor = function () {
            return floor;
        };

        self.clearFloor = function () {
            floor = -1;
        };

        self.clearAll = self.clearFloor;

        self.getCalledFloors = function () {
            return [floor];
        };
    }
})();

