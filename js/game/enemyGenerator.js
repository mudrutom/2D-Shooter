/**
 * Script responsible for generating new enemies and
 * handling game events associated with enemies.
 *
 * Author: Tomas Mudrunka
 */

define(["enemy"], function(Enemy) {
	// Enemy-Generator constants
	var generateInterval = 5000;
	var generateNumber = 5;
	var speedMultiplier = 1.0;
	var healthMultiplier = 3.0;
	var goToIntLength = 10;
	var killThreshold = 30;

	/** The Enemy-Generator object. */
	function EnemyGenerator() {
		this.enemyLayer = null;
		this.enemyGroup = null;
		this.foreground = null;

		this.attackCallback = null;
		this.goToCallback = null;

		this.enemies = [];
		this.enemiesData = [];

		this.difficulty = 1;
		this.killCount = 0;

		this.cleanerQueue = [];

		this.generatorIntId = null;
		this.enemyGoToIntId = null;
		this.cleanerIntId = null;
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
		}
		this.enemies = [];
		this.enemiesData = [];

		this.killCount = 0;

		this.cleanerQueue = [];

		if (this.generatorIntId != null) {
			clearInterval(this.generatorIntId);
			this.generatorIntId = null;
		}
		if (this.enemyGoToIntId != null) {
			clearInterval(this.enemyGoToIntId);
			this.enemyGoToIntId = null;
		}
		if (this.cleanerIntId != null) {
			clearInterval(this.cleanerIntId);
			this.cleanerIntId = null;
		}
	};

	/**
	 * Starts generating new enemies and starts all enemies.
	 */
	EnemyGenerator.prototype.start = function() {
		var self = this;

		// set-up enemy-generator interval
		this.generatorIntId = setInterval(function() {
			self.newEnemies(generateNumber);
		}, generateInterval);

		// set-up enemy-go-to interval
		var data = this.enemiesData;
		this.enemyGoToIntId = setInterval(function() {
			for (var i = 0; i < data.length; i++) {
				if (data[i].timeout-- <= 0) {
					data[i].timeout = data[i].intLength;
					self.goToCallback.call(self.enemies[i]);
				}
			}
		}, 300);

		// set-up cleaner interval
		var queue = this.cleanerQueue;
		this.cleanerIntId = setInterval(function() {
			for (var i = 0; i < queue.length; i++) {
				if (queue[i].timeout-- <= 0) {
					queue[i].enemy.destroy();
					queue.splice(i, 1);
					i--;
				}
			}
		}, 500);

		// start-up enemies
		for (var i = 0; i < this.enemies.length; i++) {
			this.enemies[i].start();
		}
		this.newEnemies(generateNumber);
	};

	/**
	 * Stops generating new enemies and stops all enemies.
	 */
	EnemyGenerator.prototype.stop = function() {
		if (this.generatorIntId != null) {
			clearInterval(this.generatorIntId);
			this.generatorIntId = null;
		}
		if (this.enemyGoToIntId != null) {
			clearInterval(this.enemyGoToIntId);
			this.enemyGoToIntId = null;
		}
		if (this.cleanerIntId != null) {
			clearInterval(this.cleanerIntId);
			this.cleanerIntId = null;
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
		if (--this.enemiesData[id].HP < 1) {
			// the enemy was killed
			this.enemies[id].showDeath();

			// schedule clean-up of the enemy
			this.cleanerQueue.push({
				enemy: this.enemies[id],
				timeout: 6
			});

			this.enemies.splice(id, 1);
			this.enemiesData.splice(id, 1);

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

		var metadata = {
			HP: this.difficulty * healthMultiplier,
			timeout: goToIntLength / this.difficulty,
			intLength: goToIntLength / this.difficulty
		};

		this.enemies.push(enemy);
		this.enemiesData.push(metadata);

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
