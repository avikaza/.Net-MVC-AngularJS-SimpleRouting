angular
    .module('myApp', [
        'kendo.directives',
        'ngRoute'
    ])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/', {templateUrl: '/Home/Home', controller: 'HomeCtrl'})
                      .when('/About', {templateUrl: '/Home/About', controller: 'AboutCtrl'})
                      .when('/Contact', {templateUrl: '/Home/Contact',controller: 'ContactCtrl'})
                      .when('/SPAView', {templateUrl: '/SPAView/Index.html'})
                      .otherwise({ redirectTo: '/' });
    }]);
