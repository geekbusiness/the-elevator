(function () {
    'use strict';

    angular
        .module('theElevator')
        .service('floorLight', floorLightService);

    function floorLightService() {
        var self = this;

        self.set = function (car, floors) {
            // If car is occupied, set all lights red
            if (car.occupied) {
                setAllFloorsRedLight(floors);
                return;
            }
            // If car is available to call, switch all lights off
            if (car.dir === 0) {
                setAllLightsOff(floors);
                return;
            }
            // If car is moving, set destination floor green light
            floors.forEach(function (floor) {
                if (car.calledFloor === floor.n && car.dir !== 0) {
                    setGreenLight(floor);
                } else {
                    setRedLight(floor);
                }
            });
        };

        var setAllFloorsRedLight = function (floors) {
            floors.forEach(setRedLight);
        };

        var setRedLight = function (floor) {
            setFloorLightColor(floor, 'red');
        };

        var setGreenLight = function (floor) {
            setFloorLightColor(floor, 'green');
        };

        var setAllLightsOff = function (floors) {
            floors.forEach(setLightOff);
        };

        var setLightOff = function (floor) {
            setFloorLightColor(floor, null);
        };

        var setFloorLightColor = function (floor, color) {
            floor.light = color;
        };
    }
})();

