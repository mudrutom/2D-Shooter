/**
 * Script responsible for rendering Enemies.
 *
 * Author: Tomas Mudrunka
 */

define(function() {
	// animation frames in the enemy sprite
	var enemyAnimation = {
		walk: [
			{ x:   0, y:   0, width: 100, height: 100 },
			{ x: 100, y:   0, width: 100, height: 100 },
			{ x: 200, y:   0, width: 100, height: 100 },
			{ x: 300, y:   0, width: 100, height: 100 },
			{ x: 400, y:   0, width: 100, height: 100 },
			{ x:   0, y: 100, width: 100, height: 100 },
			{ x: 100, y: 100, width: 100, height: 100 },
			{ x: 200, y: 100, width: 100, height: 100 },
			{ x: 300, y: 100, width: 100, height: 100 },
			{ x: 400, y: 100, width: 100, height: 100 }
		],
		stand: [
			{ x:   0, y: 200, width: 100, height: 100 },
			{ x: 100, y: 200, width: 100, height: 100 },
			{ x: 200, y: 200, width: 100, height: 100 },
			{ x: 300, y: 200, width: 100, height: 100 },
			{ x: 400, y: 200, width: 100, height: 100 },
			{ x:   0, y: 300, width: 100, height: 100 },
			{ x: 100, y: 300, width: 100, height: 100 },
			{ x: 200, y: 300, width: 100, height: 100 },
			{ x: 300, y: 300, width: 100, height: 100 },
			{ x: 400, y: 300, width: 100, height: 100 }
		],
		attack: [
			{ x:   0, y: 400, width: 100, height: 100 },
			{ x: 100, y: 400, width: 100, height: 100 },
			{ x: 200, y: 400, width: 100, height: 100 },
			{ x: 300, y: 400, width: 100, height: 100 },
			{ x: 400, y: 400, width: 100, height: 100 },
			{ x:   0, y: 500, width: 100, height: 100 },
			{ x: 100, y: 500, width: 100, height: 100 },
			{ x: 200, y: 500, width: 100, height: 100 },
			{ x: 300, y: 500, width: 100, height: 100 },
			{ x: 400, y: 500, width: 100, height: 100 }
		]
	};

	var enemyImg = new Image();
	enemyImg.src = 'img/game/enemy-sprite.png';

	/** The Enemy object. */
	function Enemy() {
		this.id = null;

		this.enemyLayer = null;

		this.sprite = new Kinetic.Sprite({
			x: 0,
			y: 0,
			offset: [50,60],
			image: enemyImg,
			animation: 'stand',
			animations: enemyAnimation,
			frameRate: 8
		});
		this.blood = new Kinetic.Circle({
			x: 0,
			y: 0,
			offset: [0,15],
			radius: 12,
			fill: '#da4f49',
			opacity: 0.0
		});

		this.damageTween = null;
		this.deathTween = null;

		this.speed = 2;
		this.moveAnim = null;

		this.attackCallback = null;
		this.attackIntId = null;

		this.paused = false;
		this.disabled = false;
	}

	/**
	 * The Enemy initialization.
	 * @param enemyLayer KineticJS Layer
	 * @param enemyGroup KineticJS Group
	 */
	Enemy.prototype.init = function(enemyLayer, enemyGroup) {
		// app enemy to the layer
		enemyGroup.add(this.sprite);
		enemyGroup.add(this.blood);
		this.sprite.start();
		this.enemyLayer = enemyLayer;

		// add damage animation tween
		this.damageTween = new Kinetic.Tween({
			node: this.blood,
			opacity: 0.5,
			duration: 0.5,
			easing: Kinetic.Easings.StrongEaseOut,
			onFinish: function() {
				this.reverse();
			}
		});
	};

	/**
	 * Starts the enemies' animation.
	 */
	Enemy.prototype.start = function() {
		this.paused = false;
		this.sprite.start();
		if (this.moveAnim != null) {
			this.moveAnim.start();
		}
	};

	/**
	 * Stops the enemies' animation.
	 */
	Enemy.prototype.stop = function() {
		this.paused = true;
		this.sprite.stop();
		if (this.moveAnim != null) {
			this.moveAnim.stop();
		}
	};

	/**
	 * Sets moving speed of the enemy.
	 * @param speed number
	 */
	Enemy.prototype.setSpeed = function(speed) {
		this.speed = speed;
		this.sprite.stop();
		this.sprite.setFrameRate(speed * 4);
		this.sprite.start();
	};

	/**
	 * Sets position of the enemy.
	 * @param position X Y coordinates
	 */
	Enemy.prototype.setPosition = function(position) {
		this.sprite.setX(position.x);
		this.blood.setX(position.x);
		this.sprite.setY(position.y);
		this.blood.setY(position.y);
	};

	/**
	 * Returns position of the enemy.
	 * @returns {{x: *, y: *}} X Y coordinates
	 */
	Enemy.prototype.getPosition = function() {
		return { x: this.sprite.getX(), y: this.sprite.getY() };
	};

	/**
	 * Starts 'damage' animation.
	 */
	Enemy.prototype.showDamage = function() {
		this.damageTween.play();
	};

	/**
	 * Starts 'death' animation.
	 */
	Enemy.prototype.showDeath = function() {
		this.disabled = true;

		// create death animation tween
		this.deathTween = new Kinetic.Tween({
			node: this.blood,
			opacity: 0.7,
			radius: 20,
			duration: 2,
			easing: Kinetic.Easings.EaseOut
		});
		this.deathTween.play();

		if (this.moveAnim != null) {
			this.moveAnim.stop();
		}
		this.sprite.stop();
		this.sprite.hide();
	};

	/**
	 * The enemy will move towards given target then
	 * it will attack when the target is reached.
	 * @param target X Y coordinates
	 */
	Enemy.prototype.goTo = function(target) {
		var self = this;
		var enemy = this.sprite;
		var blood = this.blood;
		var x = target.x;
		var y = target.y;

		var E = 5.0; // epsilon for position comparison

		// already at the target
		if (x - E < enemy.getX() && enemy.getX() < x + E && y - E < enemy.getY() && enemy.getY() < y + E) {
			if (enemy.getAnimation() != 'attack') {
				enemy.setAnimation('attack');
			}
			return;
		}

		// do nothing if the game is paused of the enemy is disabled
		if (this.paused || this.disabled) {
			return;
		}

		if (this.moveAnim != null) {
			this.moveAnim.stop();
		}
		if (enemy.getAnimation() != 'walk') {
			enemy.setAnimation('walk');
		}
		if (this.attackIntId != null) {
			clearInterval(this.attackIntId);
			this.attackIntId = null;
		}

		// rotate towards the target
		var angle = Math.atan((y - enemy.getY()) / (x - enemy.getX()));
		enemy.setRotation(angle);
		blood.setRotation(angle);
		if (x >= enemy.getX()) {
			enemy.rotateDeg(-90);
			blood.rotateDeg(-90);
		} else {
			enemy.rotateDeg(90);
			blood.rotateDeg(90);
		}

		// start moving, then attack when the target is reached
		this.moveAnim = new Kinetic.Animation(function() {
			var dx, dy, move = self.speed;
			if (x < enemy.getX()) {
				dx = Math.max(-move, x - enemy.getX());
				enemy.move(dx, 0);
				blood.move(dx, 0);
			}
			if (enemy.getX() < x) {
				dx = Math.min(move, x - enemy.getX());
				enemy.move(dx, 0);
				blood.move(dx, 0);
			}
			if (y < enemy.getY()) {
				dy = Math.max(-move, y - enemy.getY());
				enemy.move(0, dy);
				blood.move(0, dy);
			}
			if (enemy.getY() < y) {
				dy = Math.min(move, y - enemy.getY());
				enemy.move(0, dy);
				blood.move(0, dy);
			}
			if (x - E < enemy.getX() && enemy.getX() < x + E && y - E < enemy.getY() && enemy.getY() < y + E) {
				enemy.setAnimation('attack');
				self.moveAnim.stop();
				if (self.attackCallback) {
					// attack in intervals based on speed
					var time = 200 + 2000 / self.speed;
					var attack = function() {
						if (!self.paused) {
							self.attackCallback(x, y);
						}
					};
					self.attackIntId = setInterval(attack, time);
					attack();
				}
			}
		}, this.enemyLayer);
		this.moveAnim.start();
	};

	/**
	 * Destroys and removes this Enemy instance.
	 */
	Enemy.prototype.destroy = function() {
		this.disabled = true;
		if (this.moveAnim != null) {
			this.moveAnim.stop();
		}
		if (this.damageTween != null) {
			this.damageTween.destroy();
		}
		if (this.deathTween != null) {
			this.deathTween.destroy();
		}
		this.sprite.destroy();
		this.blood.destroy();
	};

	return Enemy;
});
