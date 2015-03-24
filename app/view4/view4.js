'use strict';

angular.module('myApp.view4', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view4', {
    templateUrl: 'view4/view4.html',
    controller: 'View4Ctrl'
  });
}])
.controller('View4Ctrl', ['$scope','$http', '$routeParams', function($scope, $http, $routeParams) {
	$http.get('assets/data/' + $routeParams.id + '.json').success(function(data) {
      	$scope.painting = data;
      	$scope.painting_id = $routeParams.id;
    });
}]);