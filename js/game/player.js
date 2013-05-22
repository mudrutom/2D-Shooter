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
			offset: [50,70],
			image: img,
			animation: 'stand',
			animations: playerAnimation,
			frameRate: 12
		});

		this.speed = 3;

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
		var shootCallback = this.shootCallback;
		var width = playerLayer.getWidth();
		var height = playerLayer.getHeight();

		// move player to the center
		player.setX(width/2);
		player.setY(height/2);

		// add player to the layer
		playerLayer.add(player);

		// bind mouse-move to rotate the player
		foreground.on('mousemove', function(event) {
			var x = event.layerX || event.x;
			var y = event.layerY || event.y;
			var angle = Math.atan((y - player.getY()) / (x - player.getX()));
			player.setRotation(angle);
			if (x >= player.getX()) {
				player.rotateDeg(-90);
			} else {
				player.rotateDeg(90);
			}
		});

		// bind mouse-click to shooting
		foreground.on('click', function(event) {
			var x = event.layerX || event.x;
			var y = event.layerY || event.y;
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
		var moveAnim = new Kinetic.Animation(function() {
			// moving the Player
			var move = speed();
			if (moving['up'] && 0 < player.getY()) {
				player.move(0, Math.max(-move, -player.getY()));
			}
			if (moving['down'] && player.getY() < height) {
				player.move(0, Math.min(move,  height - player.getY()));
			}
			if (moving['left'] && 0 < player.getX()) {
				player.move(Math.max(-move, -player.getX()), 0);
			}
			if (moving['right'] && player.getX() < width) {
				player.move(Math.min(move,  width - player.getX()), 0);
			}
		}, playerLayer);
		moveAnim.start();
	};

	/**
	 * Sets moving speed of the Player.
	 * @param speed number
	 */
	Player.prototype.setSpeed = function(speed) {
		this.speed = speed;
		this.sprite.stop();
		this.sprite.setFrameRate(speed * 4);
		this.sprite.start();
	};

	/**
	 * Returns position of the Player.
	 * @returns {{x: *, y: *}} X Y coordinates
	 */
	Player.prototype.getPosition = function() {
		return { x: this.sprite.getX(), y: this.sprite.getY() };
	};

	return new Player();
});
