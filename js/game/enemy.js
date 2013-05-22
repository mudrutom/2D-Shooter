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
			offset: [50,70],
			image: enemyImg,
			animation: 'stand',
			animations: enemyAnimation,
			frameRate: 4
		});

		this.speed = 1;

		this.enemyLayer = null;
		this.moveAnim = null;
	}

	/**
	 * The Enemy initialization.
	 * @param enemyLayer KineticJS Layer
	 */
	Enemy.prototype.init = function(enemyLayer) {
		// app enemy to the layer
		enemyLayer.add(this.sprite);
		this.sprite.start();
		this.enemyLayer = enemyLayer;
	};

	/**
	 * Sets moving speed of the enemy.
	 * @param speed number
	 */
	Enemy.prototype.setSpeed = function(speed) {
		this.speed = speed;
		this.sprite.setFrameRate(speed * 4);
	};

	/**
	 * Sets position of the enemy.
	 * @param position X Y coordinates
	 */
	Enemy.prototype.setPosition = function(position) {
		this.sprite.setX(position.x);
		this.sprite.setY(position.y);
	};

	/**
	 * The enemy will move towards given target.
	 * @param target X Y coordinates
	 */
	Enemy.prototype.goTo = function(target) {
		var self = this;
		var enemy = this.sprite;
		var x = target.x;
		var y = target.y;

		// already at the target
		if (x == enemy.getX() && y == enemy.getY()) {
			enemy.setAnimation('attack');
			return;
		}

		if (this.moveAnim != null) {
			this.moveAnim.stop();
		}
		if (enemy.getAnimation() != 'walk') {
			enemy.setAnimation('walk');
		}

		// rotate towards the target
		var angle = Math.atan((y - enemy.getY()) / (x - enemy.getX()));
		enemy.setRotation(angle);
		if (x >= enemy.getX()) {
			enemy.rotateDeg(-90);
		} else {
			enemy.rotateDeg(90);
		}

		// start moving, then attack when target is reached
		var speed = (function() { return this.speed; }).bind(this);
		this.moveAnim = new Kinetic.Animation(function() {
			var move = speed();
			if (x < enemy.getX()) {
				enemy.move(Math.max(-move, x - enemy.getX()), 0);
			}
			if (enemy.getX() < x) {
				enemy.move(Math.min(move, x - enemy.getX()), 0);
			}
			if (y < enemy.getY()) {
				enemy.move(0, Math.max(-move, y - enemy.getY()));
			}
			if (enemy.getY() < y) {
				enemy.move(0, Math.min(move, y - enemy.getY()));
			}
			if (x == enemy.getX() && y == enemy.getY()) {
				enemy.setAnimation('attack');
				self.moveAnim.stop();
			}
		}, this.enemyLayer);
		this.moveAnim.start();
	};

	return Enemy;
});
