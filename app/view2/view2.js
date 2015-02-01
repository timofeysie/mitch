'use strict';
angular.module('myApp.view2', ['ngRoute'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])
.controller('View2Ctrl', ['$scope', function($scope) {
	var SideScroller = SideScroller || {};
	var money = 2000;
    var score = 0;
    var score_text;
    var money_text;
	$scope.value = 'Collect the good art, avoid the bad art.';
	SideScroller.game = new Phaser.Game(746, 420, Phaser.CANVAS, '');

var BootState = {
	preload: function() {
    	this.load.image('preloadbar', 'assets/images/preloader-bar.png'); //assets we'll use in the loading screen
  	},
  	create: function() {
    	this.game.stage.backgroundColor = '#fff'; //loading screen background
    	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; //scaling options
    	this.scale.pageAlignHorizontally = true; //have the game centered horizontally
    	this.scale.pageAlignVertically = true;
    	this.scale.setScreenSize(true); //screen size will be set automatically
    	this.game.physics.startSystem(Phaser.Physics.ARCADE);
    	this.state.start('Preload');
  	}
};

var PreloadState = {
  preload: function() {
    //show loading screen
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(3);
    this.load.setPreloadSprite(this.preloadBar);
    //load game assets
    this.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('gameTiles', 'assets/images/tiles_spritesheet.png');
    this.load.image('player', 'assets/images/player.png');
    this.load.image('playerDuck', 'assets/images/player_duck.png');
    this.load.image('playerDead', 'assets/images/player_dead.png');
    this.load.image('goldCoin', 'assets/images/goldCoin.png');
    this.load.audio('coin', ['assets/audio/coin.ogg', 'assets/audio/coin.mp3']);
    this.load.image('good_art1', 'assets/images/good_art/good_art1.png');
    this.load.image('good_art2', 'assets/images/good_art/good_art2.png');
    this.load.image('good_art3', 'assets/images/good_art/good_art3.png');
    this.load.image('good_art4', 'assets/images/good_art/good_art4.png');
    this.load.image('good_art5', 'assets/images/good_art/good_art5.png');
    this.load.image('good_art6', 'assets/images/good_art/good_art6.png');
    this.load.image('good_art7', 'assets/images/good_art/good_art7.png');
    this.load.image('bad_art1', 'assets/images/bad_art/bad_art1.png');
    this.load.image('bad_art2', 'assets/images/bad_art/bad_art2.png');
    this.load.image('bad_art3', 'assets/images/bad_art/bad_art3.png');
    this.load.image('bad_art4', 'assets/images/bad_art/bad_art4.png');
    this.load.image('bad_art5', 'assets/images/bad_art/bad_art5.png');
    this.load.image('bad_art6', 'assets/images/bad_art/bad_art6.png');
    this.load.image('bad_art7', 'assets/images/bad_art/bad_art7.png');
    this.load.image('bad_art8', 'assets/images/bad_art/bad_art8.png');
    this.load.image('bad_art9', 'assets/images/bad_art/bad_art9.png');
    this.load.image('bad_art10', 'assets/images/bad_art/bad_art10.png');
    this.load.image('bad_art11', 'assets/images/bad_art/bad_art11.png');
    this.load.image('bad_art12', 'assets/images/bad_art/bad_art12.png');
  },
  create: function() {
    this.state.start('Game');
  }	
};

var GameState = {
  preload: function() {
      this.game.time.advancedTiming = true;
    },
  create: function() {
    this.map = this.game.add.tilemap('level1');
    this.map.addTilesetImage('tiles_spritesheet', 'gameTiles'); //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
    this.backgroundlayer = this.map.createLayer('backgroundLayer'); //create layers
    this.blockedLayer = this.map.createLayer('blockedLayer');
    this.map.setCollisionBetween(1, 5000, true, 'blockedLayer'); //collision on blockedLayer
    this.backgroundlayer.resizeWorld(); //resizes the game world to match the layer dimensions
    this.createCoins(); //create coins and art
    this.createGoodArt();
    this.createBadArt();
    this.player = this.game.add.sprite(100, 300, 'player'); //create player
    this.game.physics.arcade.enable(this.player); //enable physics on the player
    this.player.body.gravity.y = 1000; //player gravity
    var playerDuckImg = this.game.cache.getImage('playerDuck'); //properties when the player is ducked and standing, so we can use in update()
    this.player.duckedDimensions = {width: playerDuckImg.width, height: playerDuckImg.height};
    this.player.standDimensions = {width: this.player.width, height: this.player.height};
    this.player.anchor.setTo(0.5, 1);
    this.game.camera.follow(this.player); //the camera will follow the player in the world
    this.cursors = this.game.input.keyboard.createCursorKeys(); //move player with cursor keys
    this.initGameController(); //init game controller
    //sounds
    this.coinSound = this.game.add.audio('coin');
    console.log("world width = "+this.game.world.width);
    // score
    score_text = this.game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
    score_text.fixedToCamera = true;
    money_text = this.game.add.text(546, 16, 'Money: '+money, { fontSize: '32px', fill: '#000' });
    money_text.fixedToCamera = true;
  },
  update: function() {
    //collision
    this.game.physics.arcade.collide(this.player, this.blockedLayer, this.playerHit, null, this);
    this.game.physics.arcade.overlap(this.player, this.coins, this.collect, null, this);
    this.game.physics.arcade.overlap(this.player, this.good_art, this.collect, null, this);
    this.game.physics.arcade.overlap(this.player, this.bad_art, this.collect, null, this);
    //only respond to keys and keep the speed if the player is alive
    if(this.player.alive) {
      this.player.body.velocity.x = 300;  
      if(this.cursors.up.isDown) {
        this.playerJump();
      }
      else if(this.cursors.down.isDown) {
        this.playerDuck();
      }
      if(!this.cursors.down.isDown && this.player.isDucked && !this.pressingDown) {
        //change image and update the body size for the physics engine
        this.player.loadTexture('player');
        this.player.body.setSize(this.player.standDimensions.width, this.player.standDimensions.height);
        this.player.isDucked = false;
      }
      // Behavior when reaching the edge: this.game.world.width
      if(this.player.x >= this.game.world.width) {
        //this.game.state.start('Game');
        this.game.destroy(); 
        $scope.$emit('game:over', 'sideScroller'); //Uncaught TypeError: Cannot read property '$emit' of undefined
        // Uncaught TypeError: Cannot read property 'update' of null
      }
    }
  },
  playerHit: function(player, blockedLayer) {
    //if hits on the right side, die
    if(player.body.blocked.right) {
      //set to dead (this doesn't affect rendering)
      this.player.alive = false;
      //stop moving to the right
      this.player.body.velocity.x = 0;
      //change sprite image
      this.player.loadTexture('playerDead');
      //go to gameover after a few miliseconds
      this.game.time.events.add(1500, this.gameOver, this);
    }
  },
  collect: function(player, collectable) {
    //play audio
    this.coinSound.play();
    // collect different types of items and remove them if there is enough money.
    if (collectable.type == 'good_art' && money > 0)
    {
      score = score + 50;
      money = money - 500;
      console.log('type: '+collectable.type+' name '+collectable.name);
      collectable.destroy();
      $scope.$emit('collect', collectable);
    }  else if (collectable.type == 'bad_art' && money > 0)
    {
      score = score - 10;
      money = money - 500;
      console.log('type: '+collectable.type+' name '+collectable.name);
      collectable.destroy();
      $scope.$emit('collect', collectable);
    } else if (collectable.type == 'coin')
    {
      money = money + 1000;
      console.log('type: '+collectable.type+' name '+collectable.name);
      collectable.destroy();
    }
    if (score < 0) { score = 0;}
    score_text.text = 'Score: '+score;
    money_text.text = 'Money: '+money;
  },
  initGameController: function() {
    if(!GameController.hasInitiated) {
      var that = this; 
      GameController.init({
          left: {
              type: 'none',
          },
          right: {
              type: 'buttons',
              buttons: [
                false,
                {
                  label: 'J', 
                  touchStart: function() {
                    if(!that.player.alive) {
                      return;
                    }
                    that.playerJump();
                  }
                },
                false,
                {
                  label: 'D',
                  touchStart: function() {
                    if(!that.player.alive) {
                      return;
                    }
                    that.pressingDown = true; that.playerDuck();
                  },
                  touchEnd: function(){
                    that.pressingDown = false;
                  }
                }
              ]
          },
      });
      GameController.hasInitiated = true;
    }
  },
  //create coins
  createCoins: function() {
    this.coins = this.game.add.group();
    this.coins.enableBody = true;
    var result = this.findObjectsByType('coin', this.map, 'objectsLayer');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.coins);
    }, this);
  },
  createGoodArt: function() {
    this.good_art = this.game.add.group();
    this.good_art.enableBody = true;
    for (var i = 1; i <= 7; i++)
    {
      var good_art_painting = this.good_art.create(i * 900, 190, 'good_art'+i);
      good_art_painting.type = 'good_art';
      good_art_painting.name = 'good_art'+i;
    }
  },
  createBadArt: function() {
    this.bad_art = this.game.add.group();
    this.bad_art.enableBody = true;
    for (var i = 1; i <= 12; i++)
    {
      var bad_art_painting = this.bad_art.create(i * 500, 190, 'bad_art'+i);
      bad_art_painting.type = 'bad_art';
      bad_art_painting.name = 'bad_art'+i;
    }
  },
  //find objects in a Tiled layer that containt a property called "type" equal to a certain value
  findObjectsByType: function(type, map, layerName) {
    var result = new Array();
    map.objects[layerName].forEach(function(element){
      //console.log('looking for type = '+type);
      if(element.properties.type === type) {
        //console.log('found type = '+element.properties.type);
        //Phaser uses top left, Tiled bottom left so we have to adjust
        //also keep in mind that some images could be of different size as the tile size
        //so they might not be placed in the exact position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }      
    });
    return result;
  },
  //create a sprite from an object
  createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);
      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
  },
  gameOver: function() {
    this.game.state.start('Game');
  },
  playerJump: function() {
    if(this.player.body.blocked.down) {
      this.player.body.velocity.y -= 700;
    }    
  },
  playerDuck: function() {
      //change image and update the body size for the physics engine
      this.player.loadTexture('playerDuck');
      this.player.body.setSize(this.player.duckedDimensions.width, this.player.duckedDimensions.height);
      
      //we use this to keep track whether it's ducked or not
      this.player.isDucked = true;
  },
  render: function()
  {
    this.game.debug.text(this.game.time.fps || '--', 16, 80, "#00ff00", "40px Courier");   
    //this.game.debug.bodyInfo(this.player, 0, 80);   
  }
};

	SideScroller.game.state.add('Boot', BootState);
	SideScroller.game.state.add('Preload', PreloadState);
	SideScroller.game.state.add('Game', GameState);
	SideScroller.game.state.start('Boot');

	$scope.$on('collect', function(event, data){
    if (event.name == 'collect')
    {
			console.log('received '+event.name+" - "+data.name);
    } else if (event.name == 'game:over')
    {
      console.log('game over');
    }
	});
}]);