/**
* This is the controller for the gallery view which will show a view of the paintings collected in view 2.
*/
angular.module('myApp.view3', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view3', {
    templateUrl: 'view3/view3.html',
    controller: 'View3Ctrl'
  });
}])
.controller('View3Ctrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
	//$scope.orderProp = 'order';
  $scope.collection = [];
	$http.get('assets/data/art.json').success(function(data) {
    	$scope.paintings = data;
  	});

  	$rootScope.$on('gameover', function(event, arguments) {
      if (event.name == 'gameover')
      {
        console.log('game over from view3');
        console.log('aruments '+arguments);
        var index;
        collection = arguments;
	      for	(index = 0; index < collection.length; index++) 
	      {
      	   console.log(collection[i]); // undefined
	      }
      }
    })
    $scope.$on('collect', function(event, data){
    if (event.name == 'collect')
    {
      console.log('view:3 received '+event.name+" - "+data.name);
      collection[collection.length] = data.name;
    }
  });
  }]);