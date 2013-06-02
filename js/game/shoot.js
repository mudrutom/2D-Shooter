/**
 * Script responsible for rendering Players' shoots.
 *
 * Author: Tomas Mudrunka
 */

define(function() {
	// the number of shoots to render simultaneously
	var num = 5;

	/** The Shoots object. */
	function Shoot() {
		this.shoots = new Array(num);
		this.shootTweens = new Array(num);
		this.sounds = new Array(num);
		for (var i = 0; i < num; i++) {
			this.shoots[i] = new Kinetic.Line({
				points: [-1,-1, -2,-2],
				strokeWidth: 3,
				stroke: '#2d6999',
				shadowColor: 'navy',
				lineCap: 'round',
				opacity: 0.0
			});
		}

		this.foreground = null;
	}

	/**
	 * The Shoots initialization.
	 * @param shootGroup KineticJS Group
	 * @param foreground object used to get dimensions
	 */
	Shoot.prototype.init = function(shootGroup, foreground) {
		for (var i = 0; i < num; i++) {
			shootGroup.add(this.shoots[i]);

			// add shoot animation tween
			this.shootTweens[i] = new Kinetic.Tween({
				node: this.shoots[i],
				opacity: 1.0,
				duration: 0.25,
				easing: Kinetic.Easings.StrongEaseInOut,
				onFinish: function() {
					this.reverse();
				}
			});

			// load gun-shoot sound
			this.sounds[i] = new Audio();
			this.sounds[i].src = 'audio/laser-sound.mp3';
			this.sounds[i].load();
		}

		this.foreground = foreground;
	};

	var currentShoot = 0;

	/**
	 * Returns next available shoot.
	 * @returns {{shoot: *, tween: *}}
	 */
	Shoot.prototype.nextShoot = function() {
		if (currentShoot >= num) {
			currentShoot = 0;
		}
		return {
			shoot: this.shoots[currentShoot],
			tween: this.shootTweens[currentShoot],
			sound: this.sounds[currentShoot++]
		};
	};

	/**
	 * Renders next shoot of the Player.
	 * @param points array of shoot-points
	 */
	Shoot.prototype.renderShoot = function(points) {
		var pX = points[0], pY = points[1];
		var sX = points[2], sY = points[3];
		var dx = pX - sX, dy = pY - sY;

		// compute boundary point
		var x, y;
		if (Math.abs(dx) > Math.abs(dy)) {
			x = (dx > 0) ? -1 : this.foreground.getWidth() + 1;
			y = dy / dx * (x - pX) + pY;
		} else {
			y = (dy > 0) ? -1 : this.foreground.getHeight() + 1;
			x = dx / dy * (y - pY) + pX;
		}
		points.push(x, y);

		var next = this.nextShoot();
		next.shoot.setPoints(points);
		next.tween.play();
		next.sound.play();
	};

	return Shoot;
});
