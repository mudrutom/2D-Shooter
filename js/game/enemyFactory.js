/**
 * Script responsible for creating new enemies.
 *
 * Author: Tomas Mudrunka
 */

define(["enemy"], function(Enemy) {

	/** The Enemy-Factory object. */
	function EnemyFactory() {
		this.enemyLayer = null;
		this.enemyGroup = null;
		this.foreground = null;
		this.attackCallback = null;
	}

	/**
	 * The Enemy-Factory initialization.
	 * @param enemyLayer KineticJS Layer
	 * @param enemyGroup KineticJS Group
	 * @param foreground object used to get dimensions
	 * @param attackCallback callback for enemy attacks
	 */
	EnemyFactory.prototype.init = function(enemyLayer, enemyGroup, foreground, attackCallback) {
		this.enemyLayer = enemyLayer;
		this.enemyGroup = enemyGroup;
		this.foreground = foreground;
		this.attackCallback = attackCallback;
	};

	/**
	 * Creates new instance of Enemy.
	 * @returns Enemy new Enemy
	 */
	EnemyFactory.prototype.newEnemy = function() {
		var x = Math.random() * this.foreground.getWidth();
		var y = Math.random() * this.foreground.getHeight();

		var enemy = new Enemy();
		enemy.init(this.enemyLayer, this.enemyGroup);
		enemy.setPosition({ x: x, y: y });
		enemy.attackCallback = this.attackCallback;

		return enemy;
	};

	return EnemyFactory;
});
