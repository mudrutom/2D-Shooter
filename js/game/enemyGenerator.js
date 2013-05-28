/**
 * Script responsible for generating new enemies and
 * handling game events associated with enemies.
 *
 * Author: Tomas Mudrunka
 */

define(["enemy"], function(Enemy) {
	// Enemy-Generator constants
	const generateInterval = 5000;
	const generateNumber = 5;
	const speedMultiplier = 1.0;
	const healthMultiplier = 3.0;
	const goToInterval = 2000;
	const killThreshold = 30;

	/** The Enemy-Generator object. */
	function EnemyGenerator() {
		this.enemyLayer = null;
		this.enemyGroup = null;
		this.foreground = null;

		this.attackCallback = null;
		this.goToCallback = null;

		this.enemies = [];
		this.enemiesHP = [];
		this.enemyIntIds = [];

		this.difficulty = 1;
		this.killCount = 0;

		this.generateIntId = null;
	}

	/**
	 * The Enemy-Generator initialization.
	 * @param enemyLayer KineticJS Layer
	 * @param enemyGroup KineticJS Group
	 * @param foreground object used to get dimensions
	 * @param attackCallback callback for enemy attacks
	 * @param goToCallback callback for go-to target
	 */
	EnemyGenerator.prototype.init = function(enemyLayer, enemyGroup, foreground, attackCallback, goToCallback) {
		this.enemyLayer = enemyLayer;
		this.enemyGroup = enemyGroup;
		this.foreground = foreground;
		this.attackCallback = attackCallback;
		this.goToCallback = goToCallback;
	};

	/**
	 * Performs clean-up of the enemy generator.
	 */
	EnemyGenerator.prototype.clean = function() {
		for (var i = 0; i < this.enemies.length; i++) {
			this.enemies[i].destroy();
			clearInterval(this.enemyIntIds[i]);
		}
		this.enemies = [];
		this.enemiesHP = [];
		this.enemyIntIds = [];

		this.killCount = 0;

		if (this.generateIntId != null) {
			clearInterval(this.generateIntId);
			this.generateIntId = null;
		}
	};

	/**
	 * Starts generating new enemies and starts all enemies.
	 */
	EnemyGenerator.prototype.start = function() {
		var generator = this;
		var newEnemies = function() {
			generator.newEnemies(generateNumber);
		};
		this.generateIntId = setInterval(newEnemies, generateInterval);

		for (var i = 0; i < this.enemies.length; i++) {
			this.enemies[i].start();
		}
		newEnemies();
	};

	/**
	 * Stops generating new enemies and stops all enemies.
	 */
	EnemyGenerator.prototype.stop = function() {
		if (this.generateIntId != null) {
			clearInterval(this.generateIntId);
			this.generateIntId = null;
		}

		for (var i = 0; i < this.enemies.length; i++) {
			this.enemies[i].stop();
		}
	};

	/**
	 * Handles the enemy-hit event, decreases its HP.
	 * @param id numeric id/index of the enemy
	 */
	EnemyGenerator.prototype.handleEnemyHit = function(id) {
		this.enemies[id].showDamage();
		if (--this.enemiesHP[id] < 1) {
			// the enemy was killed
			this.enemies[id].showDeath();
			clearInterval(this.enemyIntIds[id]);

			setTimeout((function() {
				this.destroy();
			}).bind(this.enemies[id]), 3000);

			this.enemies.splice(id, 1);
			this.enemiesHP.splice(id, 1);
			this.enemyIntIds.splice(id, 1);

			if (++this.killCount % killThreshold == 0) {
				this.incrementDifficulty();
			}
		}
	};

	/**
	 * Returns an array of all enemies in the game.
	 * @returns {Array} Enemy array
	 */
	EnemyGenerator.prototype.getEnemies = function() {
		return this.enemies;
	};

	/**
	 * Creates given number of Enemies with random position.
	 * @param number number of new enemies
	 */
	EnemyGenerator.prototype.newEnemies = function(number) {
		for (var i = 0; i < number; i++) {
			this.newRandomEnemy();
		}
	};

	/**
	 * Creates new instance of Enemy with random position.
	 * @returns Enemy new Enemy
	 */
	EnemyGenerator.prototype.newRandomEnemy = function() {
		var x, y;
		if (Math.random() < 0.5) {
			x = Math.random() * this.foreground.getWidth();
			y = (Math.random() < 0.5) ? 0 : this.foreground.getHeight();
		} else {
			x = (Math.random() < 0.5) ? 0 : this.foreground.getWidth();
			y = Math.random() * this.foreground.getHeight();
		}

		return this.newEnemy(x, y);
	};

	/**
	 * Creates new instance of Enemy with given position.
	 * @param x X coordinate
	 * @param y Y coordinate
	 * @returns Enemy new Enemy
	 */
	EnemyGenerator.prototype.newEnemy = function(x, y) {
		var enemy = new Enemy();
		enemy.id = this.enemies.length;
		enemy.init(this.enemyLayer, this.enemyGroup);
		enemy.setSpeed(this.difficulty * speedMultiplier);
		enemy.setPosition({ x: x, y: y });
		enemy.attackCallback = this.attackCallback;

		// set-up go-to interval
		var goTo = (this.goToCallback) ? this.goToCallback.bind(enemy) : null;
		var intId = setInterval(goTo, goToInterval / this.difficulty + Math.random() * 200);

		this.enemies.push(enemy);
		this.enemiesHP.push(this.difficulty * healthMultiplier);
		this.enemyIntIds.push(intId);

		return enemy;
	};

	/**
	 * Set a difficulty of newly generated enemies.
	 * @param difficulty number > 0
	 */
	EnemyGenerator.prototype.setDifficulty = function(difficulty) {
		this.difficulty = difficulty;
	};

	/**
	 * Increases difficulty of newly generated enemies.
	 */
	EnemyGenerator.prototype.incrementDifficulty = function() {
		this.difficulty++;
	};

	return EnemyGenerator;
});
