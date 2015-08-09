'use strict';
// jscs:disable disallowDanglingUnderscores
describe('Controller: ElevatorCtrl', function () {

    // load the controller's module
    beforeEach(module('theElevator'));

    var ElevatorCtrl,
        scope,
        floorLight;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope, _floorLight_) {
        scope = $rootScope.$new();
        ElevatorCtrl = $controller('ElevatorCtrl', {
            $scope: scope
            // place here mocked dependencies
        });
        floorLight = _floorLight_;
    }));

    it('should set car occupied flag true if user step in', function () {
        scope.user.stepIn();
        expect(scope.car.occupied).toBe(true);
    });

    it('should set car occupied flag false if user step out', function () {
        scope.user.stepOut();
        expect(scope.car.occupied).toBe(false);
    });

    it('should set green light in called floor', function () {
        scope.car.calledFloor = 2;
        scope.car.dir = -1;

        floorLight.set(scope.car, scope.floors);

        expect(scope.floors[scope.car.calledFloor].light).toBe('green');
    });

    it('should set red all lights', function () {
        scope.car.occupied = true;

        floorLight.set(scope.car, scope.floors);

        scope.floors.forEach(function (floor) {
            expect(floor.light).toBe('red');
        });
    });
});
