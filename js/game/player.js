/**
 * Script responsible for rendering the Player and
 * for handling interactions with the user.
 *
 * Author: Tomas Mudrunka
 */

define(function() {
	// animation frames in the player sprite
	const playerAnimation = {
		walk: [
			{ x:   0, y:   0, width: 120, height: 120 },
			{ x: 120, y:   0, width: 120, height: 120 },
			{ x: 240, y:   0, width: 120, height: 120 },
			{ x: 360, y:   0, width: 120, height: 120 },
			{ x: 480, y:   0, width: 120, height: 120 },
			{ x:   0, y: 120, width: 120, height: 120 },
			{ x: 120, y: 120, width: 120, height: 120 },
			{ x: 240, y: 120, width: 120, height: 120 },
			{ x: 360, y: 120, width: 120, height: 120 },
			{ x: 480, y: 120, width: 120, height: 120 }
		],
		stand: [
			{ x:   0, y: 240, width: 120, height: 120 },
			{ x: 120, y: 240, width: 120, height: 120 },
			{ x: 240, y: 240, width: 120, height: 120 },
			{ x: 360, y: 240, width: 120, height: 120 },
			{ x: 480, y: 240, width: 120, height: 120 },
			{ x:   0, y: 360, width: 120, height: 120 },
			{ x: 120, y: 360, width: 120, height: 120 },
			{ x: 240, y: 360, width: 120, height: 120 },
			{ x: 360, y: 360, width: 120, height: 120 },
			{ x: 480, y: 360, width: 120, height: 120 }
		]
	};

	/** The Player object. */
	function Player() {
		var self = this;

		var img = new Image();
		img.onload = function() {
			self.sprite.start();
		};
		img.src = 'img/game/player-sprite.png';

		this.sprite = new Kinetic.Sprite({
			x: 0,
			y: 0,
			offset: [50,50],
			image: img,
			animation: 'stand',
			animations: playerAnimation,
			frameRate: 12
		});
		this.circle = new Kinetic.Circle({
			x: 0,
			y: 0,
			offset: [-10,15],
			radius: 15,
			fill: 'red',
			opacity: 0.0
		});
		this.tween = null;

		this.speed = 4;

		this.moveAnim = null;

		this.shootCallback = null;
	}

	/**
	 * The Player initialization.
	 * @param playerLayer KineticJS Layer
	 * @param foreground object used for binding mouse-events
	 * @param playground object used for binding key-events
	 */
	Player.prototype.init = function(playerLayer, foreground, playground) {
		var player = this.sprite;
		var circ = this.circle;
		var shootCallback = this.shootCallback;
		var width = function() { return playerLayer.getWidth(); };
		var height = function() { return playerLayer.getHeight() };

		// move player to the center
		player.setX(width()/2);
		player.setY(height()/2);
		circ.setX(width()/2);
		circ.setY(height()/2);

		// add player to the layer
		playerLayer.add(player);
		playerLayer.add(circ);

		// add damage animation tween
		this.tween = new Kinetic.Tween({
			node: circ,
			opacity: 0.5,
			duration: 0.5,
			easing: Kinetic.Easings.StrongEaseOut,
			onFinish: function() {
				this.reverse();
			}
		});

		// bind mouse-move to rotate the player
		foreground.on('mousemove', function(event) {
			var x = event.layerX || event.x || event.clientX;
			var y = event.layerY || event.y || event.clientY;
			var angle = Math.atan((y - player.getY()) / (x - player.getX()));
			player.setRotation(angle);
			circ.setRotation(angle);
			if (x >= player.getX()) {
				player.rotateDeg(-90);
				circ.rotateDeg(-90);
			} else {
				player.rotateDeg(90);
				circ.rotateDeg(90);
			}
		});

		// bind mouse-click to shooting
		foreground.on('click', function(event) {
			var x = event.layerX || event.x || event.clientX;
			var y = event.layerY || event.y || event.clientY;
			if (shootCallback) {
				var points = [ player.getX(), player.getY(), x, y ];
				shootCallback(points);
			}
		});

		// bind key-press to move the player
		var moving = [];
		var isMoving = function() { return moving['up'] || moving['down'] || moving['left'] || moving['right']; };
		var speed = (function() { return this.speed; }).bind(this);
		playground.on('keydown', function(event) {
			// handle key-down events
			var wasMoving = isMoving();
			switch (event.which) {
				case 87: // W
					moving['up'] = true;
					break;
				case 83: // S
					moving['down'] = true;
					break;
				case 65: // A
					moving['left'] = true;
					break;
				case 68: // D
					moving['right'] = true;
					break;
			}
			if (!wasMoving && isMoving()) {
				player.setAnimation('walk');
			}
		});
		playground.on('keyup', function(event) {
			// handle key-uo events
			var wasMoving = isMoving();
			switch (event.which) {
				case 87: // W
					delete moving['up'];
					break;
				case 83: // S
					delete moving['down'];
					break;
				case 65: // A
					delete moving['left'];
					break;
				case 68: // D
					delete moving['right'];
					break;
			}
			if (wasMoving && !isMoving()) {
				player.setAnimation('stand');
			}
		});
		this.moveAnim = new Kinetic.Animation(function() {
			// moving the Player
			var dx, dy, move = speed();
			if (moving['up'] && 0 < player.getY()) {
				dy = Math.max(-move, -player.getY());
				player.move(0, dy);
				circ.move(0, dy);
			}
			if (moving['down'] && player.getY() < height()) {
				dy = Math.min(move, height() - player.getY());
				player.move(0, dy);
				circ.move(0, dy);
			}
			if (moving['left'] && 0 < player.getX()) {
				dx = Math.max(-move, -player.getX());
				player.move(dx, 0);
				circ.move(dx, 0);
			}
			if (moving['right'] && player.getX() < width()) {
				dx = Math.min(move, width() - player.getX());
				player.move(dx, 0);
				circ.move(dx, 0);
			}
		}, playerLayer);
		this.moveAnim.start();
	};

	/**
	 * Starts the PLayers' animation.
	 */
	Player.prototype.start = function() {
		this.sprite.start();
		this.moveAnim.start();
	};

	/**
	 * Stops the Players' animation.
	 */
	Player.prototype.stop = function() {
		this.sprite.stop();
		this.moveAnim.stop();
	};

	/**
	 * Sets moving speed of the Player.
	 * @param speed number
	 */
	Player.prototype.setSpeed = function(speed) {
		this.speed = speed;
		this.sprite.stop();
		this.sprite.setFrameRate(speed * 3);
		this.sprite.start();
	};

	/**
	 * Returns position of the Player.
	 * @returns {{x: *, y: *}} X Y coordinates
	 */
	Player.prototype.getPosition = function() {
		return { x: this.sprite.getX(), y: this.sprite.getY() };
	};

	/**
	 * Starts 'damage' animation.
	 */
	Player.prototype.showDamage = function() {
		this.tween.play();
	};

	return new Player();
});
