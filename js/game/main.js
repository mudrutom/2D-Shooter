/**
 * Main script (entry-point) for the 2D Shooter game.
 *
 * Author: Tomas Mudrunka
 */
require.config({
	baseUrl: "js/game"
});

require(["game","users","htmlBuilder"], function(Game, Users, HTMLBuilder) {
	var builder = new HTMLBuilder();

	var users = new Users();
	users.init();

	$('#users, #users a[href="#all-users"]').on('shown', function() {
		var tab = builder.buildUsersTable(users.getAllUsers());
		var content = $('#all-users').find('div.content');
		content.empty().append(tab);
		content.find('button').on('click', function(event) {
			var target = $(event.target);
			users.login(target.attr('data-id'));
			game.setUser(users.loggedUser());
			content.find('tr.info').removeClass('info');
			target.parents('tr').addClass('info');
		});
		var logged = users.loggedUser();
		if (logged) {
			content.find('tr[data-id="' + logged.id + '"]').addClass('info');
			$('#message-score').text("You are logged as " + logged.name + ".");
		}
	});

	$('#users').find('a[href="#new-user"]').on('shown', function() {
		$('#new-user-name').val('').focus();
		$('#new-user').find('.control-group').removeClass('success').removeClass('error');
	});

	$('#new-user').find('form').on('submit', function(event) {
		event.preventDefault();
		var name = $('#new-user-name').val();
		users.newUser(name);
		var group = $(this).find('.control-group').addClass('success');
		setTimeout(function() {
			group.removeClass('success');
		}, 2000);
	});

	var game = new Game();
	var running = false;
	game.init();
	game.setUser(users.loggedUser());
	game.playground.focus();
	game.gameOverCallback = function(result) {
		var time =  Math.round(result.time / 100) / 10;
		users.updateScore(time, result.kills);
		running = false;
		$('#message-score').text("GAME OVER: You've killed " + result.kills + " enemies, in " + time + "s.");
		$('#game-menu').modal('show');
	};

	game.playground.on('keypress', function(event) {
		if (event.which == 0) { // ESC
			$('#game-menu').modal('show');
		}
	});

	if (users.loggedUser()) {
		$('#message-score').text("You are logged as " + users.loggedUser().name + ".");
	} else {
		$('#message-score').text("You must log-in to track your high-scores.");
	}

	var W = $(window);
	var getWidth = function() { return W.width() - 10; };
	var getHeight = function() { return W.height() - 51; };
	W.resize(function() {
		game.resizePlayground(getWidth(), getHeight());
	});

	$('#the-navbar').find('a').on('click', function(event) {
		event.preventDefault();
		game.playground.focus();
	});
	$('#game-menu, #settings, #users, #about').on('hidden', function() {
		game.playground.focus();
	});

	$('#game-begin').on('click', function() {
		game.beginNewGame();
		running = true;
		$('#message-score').text('');
	});
	$('#game-end').on('click', function() {
		if (running) {
			game.endGame();
		}
	});
	$('#game-play').on('click', function() {
		if (running) {
			game.play();
		}
	});
	$('#game-pause').on('click', function() {
		if (running) {
			game.pause();
		}
	});

	$('#settings-save').on('click', function() {
		var playerSpeed = $('#player-speed').val();
		game.setPlayerSpeed(playerSpeed);
		var difficulty = $('#difficulty').val();
		game.setDifficulty(difficulty);
	});

	$('#game-menu').modal('show');
});
