/**
 * Script responsible for basic game mechanics.
 *
 * Author: Tomas Mudrunka
 */

define(["player","shoot","enemyFactory"], function(Player, Shoot, EnemyFactory) {
	// background image pattern
	var bgImg = new Image();
	bgImg.src = 'img/game/bg-texture.jpg';

	/** The Game object. */
	function Game() {
		this.playground = $('#playground');

		var width = $(window).width() - 10;
		var height = $(window).height() - 51;

		this.stage = new Kinetic.Stage({
			container: 'playground',
			width: width,
			height: height
		});

		this.background = new Kinetic.Rect({
			x: 0,
			y: 0,
			width: width,
			height: height,
			stroke: 'black',
			strokeWidth: 4,
			fillPatternImage: bgImg
		});
		this.foreground = new Kinetic.Rect({
			x: 0,
			y: 0,
			width: width,
			height: height,
			fill: 'black',
			opacity: 0.5
		});

		this.firstLayer = new Kinetic.Layer();
		this.mainLayer = new Kinetic.Layer();
		this.lastLayer = new Kinetic.Layer();

		this.text = new Kinetic.Text({
			x: 10,
			y: 10,
			text: 'Health: 20',
			fontSize: 30,
			fill: 'green'
		});

		this.playerGroup = new Kinetic.Group();
		this.player = new Player();
		this.playerHP = 0;

		this.shootGroup = new Kinetic.Group();
		this.shoot = new Shoot();

		this.enemyGroup = new Kinetic.Group();
		this.enemyFactory = new EnemyFactory();
		this.enemies = [];
		this.enemiesHP = [];
		this.enemyIntIds = [];

		this.gameOverCallback = null;
	}

	/**
	 * The Game initialization.
	 */
	Game.prototype.init = function() {
		var self = this;
		var player = this.player;
		var shoot = this.shoot;

		// bind all layers
		this.firstLayer.add(this.background);
		this.mainLayer.add(this.shootGroup);
		this.mainLayer.add(this.enemyGroup);
		this.mainLayer.add(this.playerGroup);
		this.mainLayer.add(this.text);
		this.lastLayer.add(this.foreground);

		const E1 = 0.05; // epsilon for angle comparison
		const E2 = 0.5; // epsilon for position comparison

		// create callback for shooting
		player.shootCallback = function(points) {
			shoot.renderShoot(points);

			var enemies = self.enemies;

			var x = points[2];
			var y = points[3];
			var p = player.getPosition();

			var angle = Math.atan((y - p.y) / (x - p.x));
			if (x >= p.x) {
				angle = -angle;
			}

			// iterate over all enemies
			for (var i = 0; i < enemies.length; i++) {
				var e = enemies[i].getPosition();

				var a = Math.atan((e.y - p.y) / (e.x - p.x));
				if (e.x >= p.x) {
					a = -a;
				}

				if (angle - E1 < a && a < angle + E1) {
					enemies[i].showDamage();
					self.enemiesHP[i]--;
					if (self.enemiesHP[i] < 1) {
						// enemy is dead
						clearInterval(self.enemyIntIds[i]);
						enemies[i].showDeath();
						setTimeout((function() {
							this.destroy();
						}).bind(enemies[i]), 3000);
						enemies.splice(i, 1);
						self.enemiesHP.splice(i, 1);
						self.enemyIntIds.splice(i, 1);
					}
				}
			}

			if (enemies.length < 1) {
				self.addEnemies(10);
			}
		};
		player.init(this.mainLayer, this.playerGroup, this.foreground, this.playground);

		shoot.init(this.shootGroup, this.foreground);

		// create callback for enemy attack
		var attackCallback = function(x, y) {
			var p = player.getPosition();
			if (x - E2 < p.x && p.x < x + E2 && y - E2 < p.y && p.y < y + E2 && self.playerHP > 0) {
				player.showDamage();
				self.playerHP--;
				if (self.playerHP < 1) {
					player.gameOver();
					if (self.gameOverCallback) {
						setTimeout(function() {
							self.gameOverCallback();
						}, 3000);
					}
				}
				self.text.setText('Health: ' + self.playerHP);
			}
		};
		this.enemyFactory.init(this.mainLayer, this.enemyGroup, this.foreground, attackCallback);

		// add layers to the stage
		this.stage.add(this.firstLayer);
		this.stage.add(this.mainLayer);
		this.stage.add(this.lastLayer);
	};

	/**
	 * Adds given number of enemies into the game.
	 * @param number
	 */
	Game.prototype.addEnemies = function(number) {
		var player = this.player;
		for (var i = 0; i < number; i++) {
			var enemy = this.enemyFactory.newEnemy();
			enemy.id = this.enemies.length;
			var intId = setInterval((function() {
				this.goTo(player.getPosition());
			}).bind(enemy), Math.random() * 800 + 200);
			this.enemies.push(enemy);
			this.enemiesHP.push(10);
			this.enemyIntIds.push(intId);
		}
	};

	/**
	 * Resize the playground.
	 * @param width new width
	 * @param height new height
	 */
	Game.prototype.resizePlayground = function(width, height) {
		this.stage.setWidth(width);
		this.stage.setHeight(height);
		this.background.setWidth(width);
		this.background.setHeight(height);
		this.foreground.setWidth(width);
		this.foreground.setHeight(height);
		this.stage.draw();
	};

	/**
	 * Begins new game.
	 */
	Game.prototype.beginNewGame = function() {
		// clean-up before start
		for (var i = 0; i < this.enemies.length; i++) {
			this.enemies[i].destroy();
			clearInterval(this.enemyIntIds[i]);
		}
		this.enemies = [];
		this.enemiesHP = [];
		this.enemyIntIds = [];

		// start new game
		this.playerHP = 20;
		this.player.gameBegin();
		this.addEnemies(10);

		this.foreground.setOpacity(0.0);
		this.lastLayer.draw();
	};

	/**
	 * Will play/resume the game.
	 */
	Game.prototype.play = function() {
		this.player.start();
		for (var i = 0; i < this.enemies.length; i++) {
			this.enemies[i].start();
		}
		this.foreground.setOpacity(0.0);
		this.lastLayer.draw();
	};

	/**
	 * Will pause the game.
	 */
	Game.prototype.pause = function() {
		this.player.stop();
		for (var i = 0; i < this.enemies.length; i++) {
			this.enemies[i].stop();
		}
		this.foreground.setOpacity(0.5);
		this.lastLayer.draw();
	};

	/**
	 * Sets moving speed of the Player.
	 * @param speed number
	 */
	Game.prototype.setPlayerSpeed = function(speed) {
		this.player.setSpeed(speed);
	};

	/**
	 * Sets moving speed of enemies.
	 * @param speed number
	 */
	Game.prototype.setEnemySpeed = function(speed) {
		for (var i = 0; i < this.enemies.length; i++) {
			this.enemies[i].setSpeed(speed);
		}
	};

	return Game;
});
