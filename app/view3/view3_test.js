'use strict';

describe('myApp.view3 module', function() {

  beforeEach(module('myApp.view3'));

  describe('view3 controller', function(){

    it('should ....', inject(function($controller) {
      var scope = {},
      var view3Ctrl = $controller('View3Ctrl');
      expect(view3Ctrl).toBeDefined();
      expect(scope.paintings.length).toBe(17);
    }));

  });
});