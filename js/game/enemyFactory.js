/**
 * Script responsible for creating new enemies.
 *
 * Author: Tomas Mudrunka
 */

define(["enemy"], function(Enemy) {

	/** The Enemy-Factory object. */
	function EnemyFactory() {
		this.enemyGroup = null;
		this.attackCallback = null;
	}

	/**
	 * The Enemy-Factory initialization.
	 * @param enemyGroup KineticJS Group
	 * @param attackCallback callback for enemy attacks
	 */
	EnemyFactory.prototype.init = function(enemyGroup, attackCallback) {
		this.enemyGroup = enemyGroup;
		this.attackCallback = attackCallback;
	};

	/**
	 * Creates new instance of Enemy.
	 * @returns Enemy new Enemy
	 */
	EnemyFactory.prototype.newEnemy = function() {
		var x = Math.random() * this.enemyGroup.getWidth();
		var y = Math.random() * this.enemyGroup.getHeight();

		var enemy = new Enemy();
		enemy.init(this.enemyGroup);
		enemy.setPosition({ x: x, y: y });
		enemy.attackCallback = this.attackCallback;

		return enemy;
	};

	return new EnemyFactory();
});
