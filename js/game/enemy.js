/**
 * Script responsible for rendering Enemies.
 *
 * Author: Tomas Mudrunka
 */

define(function() {
	// animation frames in the enemy sprite
	const enemyAnimation = {
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
		this.sprite = new Kinetic.Sprite({
			x: 0,
			y: 0,
			offset: [50,60],
			image: enemyImg,
			animation: 'stand',
			animations: enemyAnimation,
			frameRate: 8
		});
		this.circle = new Kinetic.Circle({
			x: 0,
			y: 0,
			offset: [0,15],
			radius: 12,
			fill: 'red',
			opacity: 0.0
		});
		this.tween = null;

		this.id = null;

		this.speed = 2;

		this.enemyLayer = null;
		this.enemyGroup = null;
		this.moveAnim = null;
		this.paused = false;

		this.attackCallback = null;
		this.attackIntId = null;
	}

	/**
	 * The Enemy initialization.
	 * @param enemyLayer KineticJS Layer
	 * @param enemyGroup KineticJS Group
	 */
	Enemy.prototype.init = function(enemyLayer, enemyGroup) {
		// app enemy to the layer
		enemyGroup.add(this.sprite);
		enemyGroup.add(this.circle);
		this.sprite.start();
		this.enemyLayer = enemyLayer;
		this.enemyGroup = enemyGroup;

		// add damage animation tween
		this.tween = new Kinetic.Tween({
			node: this.circle,
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
		this.moveAnim.start();
	};

	/**
	 * Stops the enemies' animation.
	 */
	Enemy.prototype.stop = function() {
		this.paused = true;
		this.sprite.stop();
		this.moveAnim.stop();
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
		this.circle.setX(position.x);
		this.sprite.setY(position.y);
		this.circle.setY(position.y);
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
		this.tween.play();
	};

	/**
	 * The enemy will move towards given target.
	 * @param target X Y coordinates
	 */
	Enemy.prototype.goTo = function(target) {
		var self = this;
		var enemy = this.sprite;
		var circ = this.circle;
		var x = target.x;
		var y = target.y;

		// already at the target
		if (x == enemy.getX() && y == enemy.getY()) {
			if (enemy.getAnimation() != 'attack') {
				enemy.setAnimation('attack');
			}
			return;
		}

		// do nothing if the game is paused
		if (this.paused) {
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
		circ.setRotation(angle);
		if (x >= enemy.getX()) {
			enemy.rotateDeg(-90);
			circ.rotateDeg(-90);
		} else {
			enemy.rotateDeg(90);
			circ.rotateDeg(90);
		}

		// start moving, then attack when target is reached
		var speed = (function() { return this.speed; }).bind(this);
		this.moveAnim = new Kinetic.Animation(function() {
			var dx, dy, move = speed();
			if (x < enemy.getX()) {
				dx = Math.max(-move, x - enemy.getX());
				enemy.move(dx, 0);
				circ.move(dx, 0);
			}
			if (enemy.getX() < x) {
				dx = Math.min(move, x - enemy.getX());
				enemy.move(dx, 0);
				circ.move(dx, 0);
			}
			if (y < enemy.getY()) {
				dy = Math.max(-move, y - enemy.getY());
				enemy.move(0, dy);
				circ.move(0, dy);
			}
			if (enemy.getY() < y) {
				dy = Math.min(move, y - enemy.getY());
				enemy.move(0, dy);
				circ.move(0, dy);
			}
			if (x == enemy.getX() && y == enemy.getY()) {
				enemy.setAnimation('attack');
				self.moveAnim.stop();
				if (self.attackCallback) {
					// attack in intervals based on speed
					var time = 200 + 2000 / speed();
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

	return Enemy;
});
