(function () {
    'use strict';

    /**
     * @ngdoc overview
     * @name theElevator
     * @description
     * # theElevator
     *
     * Main module of the application.
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
            canClose: function (n) {
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
            btnClass: function (n) {
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
            isStopButtonEnabled: function(n) {
                return (car.occupied && !car.open);
            }
        };

        $scope.user = {
            stepInButtonEnabled: function () {
                return (!car.occupied && car.dir===0 && car.open)
            },
            stepOutButtonEnabled: function () {
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
                if (!this.canOpenOuterDoor()) {
                    return;
                }
                this.open = true;
            };
            floor.closeOuterDoor = function () {
                this.open = false;
            };
            floor.isCallButtonEnabled = function () {
                return (!car.occupied && car.dir===0);
            };
            floor.canOpenOuterDoor = function () {
                return (this.n === car.floor && car.dir === 0 && !this.open);
            };
        });

        $interval(function () {
            if (car.calledFloor < 0) {
                return;
            }
            floorLight.set(car, floors);
            if (car.calledFloor === car.floor) {
                //
                car.dir = 0;
                //floors[car.calledFloor].openOuterDoor();
                return;
            }
            if (car.open && car.occupied) {
                car.stop();
                return;
            }
            car.floor = car.floor + car.dir;
        }, 1000);
    }
})();
