(function () {
    'use strict';

    /**
     * @ngdoc object
     * @name theElevator.ElevatorCtrl
     * @requires  $scope
     * @requires  $interval
     * @requires  floorLight
     * @description
     * Elevator controller
     *
     * There are 2 services handling user requests: simpleRequest and enhancedRequest
     * simpleRequest: One request at a time
     * enhancedRequest: Multiple requests handling
     *
     * simpleRequest and enhancedRequest can be switched in controller declation
     */
    angular
        .module('theElevator')
        .controller('ElevatorCtrl', ['$scope', '$interval', 'floorLight', 'simpleRequest', elevatorController]);

    function elevatorController($scope, $interval, floorLight, userRequest) {
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
                userRequest.callFloor(this, n);
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
                this.isUserStopped = true;
            },
            dir: 0,
            floor: 10,
            open: false,
            occupied: false,
            isUserStopped: false
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
            isFloorButtonEnabled: function () {
                // Panel buttons enabled if car is occupied and car door closed
                return (car.occupied && !car.open);
            },
            stop: function () {
                car.stop();
            },
            isStopButtonEnabled: function () {
                return (car.occupied && !car.open);
            }
        };
        $scope.calledFloors = userRequest.getCalledFloors;

        // User actions
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
            var nextFloor = userRequest.getCalledFloor();
            if (nextFloor < 0) {
                return;
            }
            setCarDirection(nextFloor);

            // Floor light color switching
            floorLight.set(car, floors, nextFloor);

            // If car is at the right floor
            if (nextFloor === car.floor) {
                car.dir = 0;
                // Destination floor, outer door opened automatically
                // User only have to operate inner door
                floors[nextFloor].openOuterDoor();

                // Clear current floor in called floor array
                userRequest.clearFloor(nextFloor);

                return;
            }
            if (car.isUserStopped) {
                // Car is stopped
                car.dir = 0;

                // Outer door is opened
                floors[car.floor].openOuterDoor();

                // Remove emergency stop flag
                car.isUserStopped = false;

                // Clear all other called floors
                userRequest.clearAll();
                return;
            }
            // If car is moving, inner door is open and car is occupied then car must stop
            if (car.open && car.occupied) {
                car.stop();
                return;
            }
            // Everything seems ok
            // We close outer door
            floors[car.floor].closeOuterDoor();
            // Car is moving
            car.floor = car.floor + car.dir;
        }, 1000);

        var setCarDirection = function (nextFloor) {
            if (nextFloor < car.floor) {
                car.dir = -1;
            }
            if (nextFloor > car.floor) {
                car.dir = 1;
            }
        };
    }
})();
