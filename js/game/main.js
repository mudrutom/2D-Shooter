/**
 * Main script (entry-point) for the 2D Shooter game.
 *
 * Author: Tomas Mudrunka
 */
require.config({
	baseUrl: "js/game"
});

require(["player","enemy"], function(player, Enemy) {
	var W = $(window);
	var getWidth = function() { return W.width() - 10; };
	var getHeight = function() { return W.height() - 51; };

	var playground = $('#playground');
	playground.attr('tabIndex', 0);
	playground.focus();

	var stage = new Kinetic.Stage({
		container: 'playground',
		width: getWidth(),
		height: getHeight()
	});

	var layer = new Kinetic.Layer({
		width: stage.getWidth(),
		height: stage.getHeight()
	});

	var background = new Kinetic.Rect({
		x: 0,
		y: 0,
		width: stage.getWidth(),
		height: stage.getHeight(),
		stroke: 'black',
		strokeWidth: 4
	});
	var bgImg = new Image();
	bgImg.onload = function() {
		background.setFillPatternImage(this);
	};
	bgImg.src = 'img/game/bg-texture.jpg';

	var foreground = new Kinetic.Rect({
		x: 0,
		y: 0,
		width: stage.getWidth(),
		height: stage.getHeight()
	});
	var shoot = new Kinetic.Line({
		points: [0, 0],
		stroke: 'black',
		strokeWidth: 2
	});

	stage.add(layer);
	layer.add(background);

	player.shootCallback = function(points) {
		shoot.setPoints(points);

		var x = points[2], y = points[3];
		var p = player.getPosition();
		var e1 = enemy1.getPosition();
		var e2 = enemy2.getPosition();

		var angle = Math.atan((y - p.y) / (x - p.x));
		if (x >= p.x) {
			angle = -angle;
		}
		var a1 = Math.atan((e1.y - p.y) / (e1.x - p.x));
		if (e1.x >= p.x) {
			a1 = -a1;
		}
		var a2 = Math.atan((e2.y - p.y) / (e2.x - p.x));
		if (e2.x >= p.x) {
			a2 = -a2;
		}

		if (angle - 0.05 < a1 && a1 < angle + 0.05) {
			enemy1.showDamage();
		}
		if (angle - 0.05 < a2 && a2 < angle + 0.05) {
			enemy2.showDamage();
		}
	};
	player.init(layer, foreground, playground);

	var enemy1 = new Enemy();
	enemy1.init(layer);
	enemy1.setPosition({ x: 100, y: 100 });
	setInterval(function() {
		enemy1.goTo(player.getPosition());
	}, 1500);
	var enemy2 = new Enemy();
	enemy2.init(layer);
	enemy2.setPosition({ x: 1300, y: 700 });
	setInterval(function() {
		enemy2.goTo(player.getPosition());
	}, 2500);
	var attackCallback = function(x, y) {
		var p = player.getPosition();
		if (x - 0.1 < p.x && p.x < x + 0.1 && y - 0.1 < p.y && p.y < y + 0.1) {
			player.showDamage();
		}
	};
	enemy1.attackCallback = attackCallback;
	enemy2.attackCallback = attackCallback;

	layer.add(shoot);
	layer.add(foreground);

	$('#the-navbar').find('a').on('click', function(event) {
		event.preventDefault();
		playground.focus();
	});

	$('#game-play').on('click', function() {
		player.start();
		enemy1.start();
		enemy2.start();
	});
	$('#game-pause').on('click', function() {
		player.stop();
		enemy1.stop();
		enemy2.stop();
	});

	$('#settings').on('hide', function() {
		playground.focus();
	});
	$('#settings-save').on('click', function() {
		var playerSpeed = $('#player-speed').val();
		player.setSpeed(playerSpeed);
		var enemySpeed = $('#enemy-speed').val();
		enemy1.setSpeed(enemySpeed);
		enemy2.setSpeed(enemySpeed);

		$('#settings').modal('hide');
	});

	W.resize(function() {
		var w = getWidth();
		var h = getHeight();

		stage.setWidth(w);
		stage.setHeight(h);
		layer.setWidth(w);
		layer.setHeight(h);
		background.setWidth(w);
		background.setHeight(h);
		foreground.setWidth(w);
		foreground.setHeight(h);
	});

});
