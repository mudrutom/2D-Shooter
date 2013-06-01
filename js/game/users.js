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
		if (!localStorage) {
			// not-supported
			return;
		}

		var users = localStorage.getItem('users');
		if (users) {
			users = JSON.parse(users);
			for (var i = 0; i < users.length; i++) {
				this.allUsers[users[i].id] = users[i];
			}
		}
		var count = localStorage.getItem('idCount');
		if (count) {
			this.idCount = parseInt(count);
		}
		var current = localStorage.getItem('currentUser');
		if (current) {
			this.currentUser = JSON.parse(current);
		}
	};

	/**
	 * Persists the Users object into LocalStorage.
	 */
	Users.prototype.persist = function() {
		if (!localStorage) {
			// not-supported
			return;
		}

		var users = [];
		for (var key in this.allUsers) {
			if (this.allUsers.hasOwnProperty(key)) {
				users.push(this.allUsers[key]);
			}
		}
		localStorage.setItem('users', JSON.stringify(users));
		localStorage.setItem('idCount', this.idCount);
		localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
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
		// sort by high-score
		all.sort(function(one, two) {
			return scoreComparator(one.highScore, two.highScore);
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
		this.persist();
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
	 * @param time the time played
	 * @param kills the number of kills
	 */
	Users.prototype.updateScore = function(time, kills) {
		var score = new Score(time, kills);
		if (this.currentUser && scoreComparator(score, this.currentUser.highScore) < 0) {
			this.currentUser.highScore = score;
			this.persist();
		}
	};

	/** The User object. */
	function User(id, name) {
		this.id = id;
		this.name = name;
		this.highScore = null;
	}

	/** The Score object. */
	function Score(time, kills) {
		this.time = time;
		this.kills = kills;
	}

	// Score Object comparator
	var scoreComparator = function(one, two) {
		if (!one && !two) return 0;
		if (!one) return +1;
		if (!two) return -1;
		return (one.time < two.time) ? +1 : -1;
	};

	return Users;
});
