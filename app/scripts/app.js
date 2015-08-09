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
        .module('theElevator', [
            'ngRoute'
        ])
        .config(['$routeProvider', configuration]);

    function configuration($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'scripts/elevator/elevator.controller.html',
                controller: 'ElevatorCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
    }
})();

