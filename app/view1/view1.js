/**
* @fileOverview View1 is main controller which shows the menu.
* @author Timothy Curchod
* @version: 0.1
* @memberOf view1
*/
'use strict';
angular.module('myApp.view1', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])
.controller('View1Ctrl', [function() {

}]);