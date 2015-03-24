'use strict';

// Declare app level module which depends on views, and components
var myApp = angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.view3',
  'myApp.view4',
  'myApp.version'
]);

myApp.config(['$routeProvider', function($routeProvider) {
  	$routeProvider
  		.when('/view2', {
				templateUrl: 'view2/view2.html', // Sidescroller game
				controller: 'View2Ctrl'
			})
      .when('/view3', {
        templateUrl: 'view3/view3.html', // Art collection view
        controller: 'View3Ctrl'
      })
  		.when('/view4/:id', {
        templateUrl: 'view4/view4.html', // Single painting view
        controller: 'View4Ctrl'
      })
      .otherwise({redirectTo: '/view1'}); // Main menu
}]); 
