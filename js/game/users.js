/**
 * Script responsible for user management.
 *
 * Author: Tomas Mudrunka
 */

define(function() {

	/** The Users object. */
	function Users() {
		this.allUsers = [];
		this.idCount = 0;

		this.currentUser = null;
	}

	/**
	 * The Users initialization.
	 */
	Users.prototype.init = function() {
		// TODO try to load form LocalStorage
	};

	/**
	 * Persists the Users object into LocalStorage.
	 */
	Users.prototype.persist = function() {
		// TODO persist data
	};

	/**
	 * @returns {Array} all User objects
	 */
	Users.prototype.getAllUsers = function() {
		var all = [];
		for (var key in this.allUsers) {
			if (this.allUsers.hasOwnProperty(key)) {
				all.push(this.allUsers[key]);
			}
		}
		// sort by name
		all.sort(function(one, two) {
			var nameOne = one.name.toLowerCase();
			var nameTwo = two.name.toLowerCase();
			return (nameOne < nameTwo) ? -1 : +1;
		});
		return all;
	};

	/**
	 * @returns {User} currently logged User
	 */
	Users.prototype.loggedUser = function() {
		return this.currentUser;
	};

	/**
	 * Log-in as the giver user.
	 * @param id String User ID
	 */
	Users.prototype.login = function(id) {
		this.currentUser = this.allUsers[id];
	};

	/**
	 * Saves given user.
	 * @param user User object
	 */
	Users.prototype.save = function(user) {
		var id = user.id;
		this.allUsers[id] = user;
		this.persist();
	};

	/**
	 * Creates and saves new User object.
	 * @param name String user-name
	 * @returns {User} new User object
	 */
	Users.prototype.newUser = function(name) {
		var id = 'u' + this.idCount++;
		var user = new User(id, name);
		this.save(user);
		return user;
	};

	/**
	 * Updates score of the logged user.
	 * @param score Number
	 */
	Users.prototype.updateScore = function(score) {
		if (score > this.currentUser.highScore) {
			this.currentUser.highScore = score;
		}
	};

	/** The User object. */
	function User(id, name) {
		this.id = id;
		this.name = name;
		this.highScore = null;
	}

	return Users;
});
