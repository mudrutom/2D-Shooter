/**
 * Main script (entry-point) for the 2D Shooter game.
 *
 * Author: Tomas Mudrunka
 */
require.config({
	baseUrl: "js/game"
});

require(["game"], function(game) {
	game.init();
	game.addEnemies(2);
	game.playground.attr('tabIndex', 0);
	game.playground.focus();

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

	$('#game-play').on('click', function() {
		game.play();
	});
	$('#game-pause').on('click', function() {
		game.pause();
	});

	$('#settings').on('hide', function() {
		game.playground.focus();
	});
	$('#settings-save').on('click', function() {
		var playerSpeed = $('#player-speed').val();
		game.setPlayerSpeed(playerSpeed);
		var enemySpeed = $('#enemy-speed').val();
		game.setEnemySpeed(enemySpeed);

		$('#settings').modal('hide');
	});
});
