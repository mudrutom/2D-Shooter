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
			frameRate: 10
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

		// move player to the center
		player.setX(playerLayer.getWidth()/2);
		player.setY(playerLayer.getHeight()/2);

		// app player to the layer
		playerLayer.add(player);

		// bind mouse-move to rotate the player
		foreground.on('mousemove', function(event) {
			var angle = Math.atan((event.layerY - player.getY()) / (event.layerX - player.getX()));
			player.setRotation(angle);
			if (event.layerX >= player.getX()) {
				player.rotateDeg(-90);
			} else {
				player.rotateDeg(90);
			}
		});

		// bind mouse-click to shooting
		foreground.on('click', function(event) {
			if (shootCallback) {
				var points = [ player.getX(), player.getY(), event.layerX, event.layerY ];
				shootCallback(points);
			}
		});

		// bind key-press to move the player
		var moving = [];
		var isMoving = function() { return moving['up'] || moving['down'] || moving['left'] || moving['right']; };
		var speed = (function() { return this.speed; }).bind(this);
		playground.on('keydown', function(event) {
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
			var move = speed();
			if (moving['up'] && 0 < player.getY()) {
				player.move(0, -move);
			}
			if (moving['down'] && player.getY() < playerLayer.getHeight()) {
				player.move(0, move);
			}
			if (moving['left'] && 0 < player.getX()) {
				player.move(-move, 0);
			}
			if (moving['right'] && player.getX() < playerLayer.getWidth()) {
				player.move(move, 0);
			}
		}, playerLayer);
		moveAnim.start();
	};

	return new Player();
});
