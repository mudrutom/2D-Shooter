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
		$('#all-users').find('div.content').empty().append(tab);
	});

	$('#users').find('a[href="#new-user"]').on('shown', function() {
		$('#new-user-name').val('');
		$('#new-user').find('.control-group').removeClass('success').removeClass('error');
	});

	$('#new-user').find('form').on('submit', function() {
		var name = $('#new-user-name').val();
		users.newUser(name);
		var group = $(this).find('.control-group').addClass('success');
		setTimeout(function() {
			group.removeClass('success');
		}, 2000);
	});

	var game = new Game();
	game.init();
	game.playground.focus();
	game.gameOverCallback = function(result) {
		$('#dialog-message').text("GAME OVER: You've killed " + result.kills + " enemies!");
		$('#game-menu').modal('show');
	};

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
	$('#game-menu, #settings, #users').on('hidden', function() {
		game.playground.focus();
	});
	$('form').on('submit', function(event) {
		event.preventDefault();
	});

	$('#game-begin').on('click', function() {
		game.beginNewGame();
	});
	$('#game-play').on('click', function() {
		game.play();
	});
	$('#game-pause').on('click', function() {
		game.pause();
	});

	$('#settings-save').on('click', function() { // TODO validate integer values /^\d+$/
		var playerSpeed = $('#player-speed').val();
		game.setPlayerSpeed(playerSpeed);
		var difficulty = $('#difficulty').val();
		game.setDifficulty(difficulty);
	});

	$('#game-menu').modal('show');
});
