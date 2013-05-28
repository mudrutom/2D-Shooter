/**
 * Script responsible for rendering Players' shoots.
 *
 * Author: Tomas Mudrunka
 */

define(function() {
	// the number of shoots to render simultaneously
	const num = 5;

	/** The Shoots object. */
	function Shoot() {
		this.shoots = new Array(num);
		this.shootTweens = new Array(num);
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
	}

	/**
	 * The Shoots initialization.
	 * @param shootGroup KineticJS Group
	 */
	Shoot.prototype.init = function(shootGroup) {
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
		}
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
			tween: this.shootTweens[currentShoot++]
		};
	};

	/**
	 * Renders next shoot of the Player.
	 * @param points array of shoot-points
	 */
	Shoot.prototype.renderShoot = function(points) {
		var next = this.nextShoot();
		next.shoot.setPoints(points);
		next.tween.play();
	};

	return Shoot;
});
