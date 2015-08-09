(function () {
    'use strict';

    /**
     * @ngdoc object
     * @name theElevator.ElevatorCtrl
     * @requires  $scope $interval floorLight
     * @description
     * Elevator controller
     */
    angular
        .module('theElevator')
        .controller('ElevatorCtrl', ['$scope', '$interval', 'floorLight', elevatorController]);

    function elevatorController($scope, $interval, floorLight) {
        // Object representing the car
        var car = $scope.car = {
            active: function (n) {
                return this.floor === n;
            },
            state: function () {
                var r = this.occupied ? 'Occpd ' : 'Empty ';
                switch (this.dir) {
                    case -1:
                        r += '↑↑↑↑';
                        break;
                    case 1:
                        r += '↓↓↓↓';
                        break;
                    case 0:
                        r += this.open ? 'OPEN' : 'STOP';
                }
                return r;
            },
            innerDoorState: function () {
                return (this.open ? 'OPEN' : 'CLOSED');
            },
            call: function (n) {
                if (n < this.floor) {
                    this.dir = -1;
                }
                if (n > this.floor) {
                    this.dir = 1;
                }
                this.calledFloor = n;
                floors[this.floor].closeOuterDoor();
            },
            canOpen: function () {
                return (!this.open && (this.occupied || !this.occupied && floors[this.floor].open));
            },
            canClose: function () {
                return (this.open && floors[this.floor].open);
            },
            openInnerDoor: function () {
                this.open = true;
            },
            closeInnerDoor: function () {
                this.open = false;
            },
            stop: function () {
                this.dir = 0;
            },
            dir: 0,
            floor: 10,
            calledFloor: -1,
            open: false,
            occupied: false
        };

        // Object representing the control panel in the car
        $scope.panel = {
            btnClass: function () {
                // This can be used to emulate a LED light near or inside the button
                // to give feedback to the user.
                return null;
            },
            press: function (n) {
                // Closing outer door
                floors[n].open = false;
                // then we go to selected floor
                car.call(n);
            },
            isFloorButtonEnabled: function (n) {
                return (car.occupied && car.floor !== n && !car.open);
            },
            stop: function () {
                car.stop();
            },
            isStopButtonEnabled: function () {
                return (car.occupied && !car.open);
            }
        };

        $scope.user = {
            stepInButtonEnabled: function () {
                // User can only step in car if car is
                // empty, immobile and if inner door is open
                return (!car.occupied && car.dir === 0 && car.open);
            },
            stepOutButtonEnabled: function () {
                // User can step out car if car is occupied
                // and inner door is open
                return (car.occupied && car.open);
            },
            stepIn: function () {
                car.occupied = true;
            },
            stepOut: function () {
                car.occupied = false;
            }
        };

        // Floors
        var floors = $scope.floors = [];
        for (var i = 10; i > 0; i--) {
            floors.push({title: i});
        }
        floors.push({title: 'G'});

        // Let's have them know their indices. Zero-indexed, from top to bottom.
        // Also let's initialize them.
        floors.forEach(function (floor, n) {
            floor.n = n;
            floor.open = false;
            floor.light = null;
            floor.outerDoorState = function () {
                return (this.open ? 'OPEN' : 'CLOSED');
            };
            floor.openOuterDoor = function () {
                this.open = true;
            };
            floor.closeOuterDoor = function () {
                this.open = false;
            };
            floor.isCallButtonEnabled = function () {
                return (!car.occupied && car.dir === 0);
            };
            floor.canOpenOuterDoor = function () {
                return (this.n === car.floor && car.dir === 0 && !this.open);
            };
        });

        $interval(function () {
            if (car.calledFloor < 0) {
                return;
            }
            // Floor light color setting
            floorLight.set(car, floors);
            if (car.calledFloor === car.floor) {
                car.dir = 0;
                // Destination floor, outer door opened automatically
                // User only have to operate inner door
                floors[car.calledFloor].openOuterDoor();
                return;
            }
            // If car is moving, inner door is open and car is occupied
            // car must stop
            if (car.open && car.occupied) {
                car.stop();
                return;
            }
            // Car is moving
            car.floor = car.floor + car.dir;
        }, 1000);
    }
})();
