'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.view3',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  	$routeProvider
  		.when('/view2', {
				templateUrl: 'view2/view2.html',
				controller: 'View2Ctrl'
			})
      .when('/view3', {
        templateUrl: 'view3/view3.html',
        controller: 'View3Ctrl'
      })
  		.when('/view4', {
        templateUrl: 'view4/view4.html',
        controller: 'View4Ctrl'
      })
      .otherwise({redirectTo: '/view1'});
}]);
