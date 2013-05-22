/**
 * Main script (entry-point) for the 2D Shooter game.
 *
 * Author: Tomas Mudrunka
 */
require.config({
	baseUrl: "js/game"
});

require(["player"], function(player) {

	var playground = $('#playground');
	playground.attr('tabIndex', 0);
	playground.focus();

	var stage = new Kinetic.Stage({
		container: 'playground',
		width: 1400,
		height: 800
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
	};
	player.init(layer, foreground, playground);

	layer.add(shoot);
	layer.add(foreground);

	var animation = new Kinetic.Animation();
	animation.node = layer;
	animation.start();
});
