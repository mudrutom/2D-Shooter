/**
 * Main script (entry-point) for the 2D Shooter game.
 *
 * Author: Tomas Mudrunka
 */
require.config({
	baseUrl: "js/game"
});

require(["game"], function(Game) {
	var game = new Game();
	game.init();
	game.playground.attr('tabIndex', 0);
	game.playground.focus();
	game.gameOverCallback = function() {
		game.pause();
		$('#dialog-message').text("GAME OVER: You've died!");
		$('#dialog').modal('show');
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

	$('#game-begin').on('click', function() {
		game.beginNewGame();
	});
	$('#game-play').on('click', function() {
		game.play();
	});
	$('#game-pause').on('click', function() {
		game.pause();
	});

	$('#dialog, #settings').on('hidden', function() {
		game.playground.focus();
	});
	$('#settings-save').on('click', function() {
		var playerSpeed = $('#player-speed').val();
		game.setPlayerSpeed(playerSpeed);
		var enemySpeed = $('#enemy-speed').val();
		game.setEnemySpeed(enemySpeed);
	});

	$('#dialog').modal('show');
});
