
var stage = new Kinetic.Stage({
	container: 'playground',
	width: 800,
	height: 600
});

var layer = new Kinetic.Layer();

var background = new Kinetic.Rect({
	x: 0,
	y: 0,
	width: stage.getWidth(),
	height: stage.getHeight(),
	fill: 'white',
	stroke: 'black'
});

var playerAnimation = {
	walk: [
		{ x:   0, y:   0, width: 120, height: 120 },
		{ x: 120, y:   0, width: 120, height: 120 },
		{ x: 240, y:   0, width: 120, height: 120 },
		{ x: 360, y:   0, width: 120, height: 120 },
		{ x: 480, y:   0, width: 120, height: 120 },
		{ x:   0, y: 120, width: 120, height: 120 },
		{ x: 120, y: 120, width: 120, height: 120 },
		{ x: 240, y: 120, width: 120, height: 120 },
		{ x: 360, y: 120, width: 120, height: 120 },
		{ x: 480, y: 120, width: 120, height: 120 }
	],
	stand: [
		{ x:   0, y: 240, width: 120, height: 120 },
		{ x: 120, y: 240, width: 120, height: 120 },
		{ x: 240, y: 240, width: 120, height: 120 },
		{ x: 360, y: 240, width: 120, height: 120 },
		{ x: 480, y: 240, width: 120, height: 120 },
		{ x:   0, y: 360, width: 120, height: 120 },
		{ x: 120, y: 360, width: 120, height: 120 },
		{ x: 240, y: 360, width: 120, height: 120 },
		{ x: 360, y: 360, width: 120, height: 120 },
		{ x: 480, y: 360, width: 120, height: 120 }
	]
};

var playerImg = new Image();
playerImg.onload = function() {
	player.start();
};
playerImg.src = 'img/player-sprite.png';

var player = new Kinetic.Sprite({
	x: stage.getWidth()/2,
	y: stage.getHeight()/2,
	offset: [60,60],
	image: playerImg,
	animation: 'walk',
	animations: playerAnimation,
	frameRate: 7
});

var playerAnim = new Kinetic.Animation();
playerAnim.node = layer;
playerAnim.start();

var line = new Kinetic.Line({
	points: [0, 0],
	stroke: 'black',
	strokeWidth: 2
});

layer.add(background);
layer.add(player);
layer.add(line);
stage.add(layer);

background.on('click', function(event) {
	var points = [ player.getX() + player.getWidth()/2, player.getY() + player.getHeight()/2, event.layerX, event.layerY ];
	line.setPoints(points);
});

background.on('mousemove', function(event) {
	var angle = Math.atan((event.layerY - player.getY()) / (event.layerX - player.getX()));
	player.setRotation(angle);
	if (event.layerX >= player.getX()) {
		player.rotateDeg(-90);
	} else {
		player.rotateDeg(90);
	}
});

const move = 5;
var playground = $('#playground');
playground.attr('tabIndex', 0);
playground.focus();
playground.keypress(function(event) {
	switch (event.which) {
		case 119: // W
			player.setY(player.getY() - move);
			break;
		case 115: // S
			player.setY(player.getY() + move);
			break;
		case 97: // A
			player.setX(player.getX() - move);
			break;
		case 100: // D
			player.setX(player.getX() + move);
			break;
	}
});
