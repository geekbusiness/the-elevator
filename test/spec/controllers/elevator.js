'use strict';

describe('Controller: ElevatorCtrl', function () {

    // load the controller's module
    beforeEach(module('theElevator'));

    var ElevatorCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ElevatorCtrl = $controller('theElevator', {
            $scope: scope
            // place here mocked dependencies
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(ElevatorCtrl.awesomeThings.length).toBe(3);
    });
});
