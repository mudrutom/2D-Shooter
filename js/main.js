(function() {
var stage = new Kinetic.Stage({
	container: 'testground',
	width: 600,
	height: 600
});

var layer = new Kinetic.Layer();

var zombieAnimation = {
	stand: [
		{ x:   0, y: 0, width: 128, height: 128 },
		{ x: 128, y: 0, width: 128, height: 128 },
		{ x: 256, y: 0, width: 128, height: 128 },
		{ x: 384, y: 0, width: 128, height: 128 }
	],
	walk: [
		{ x:  512, y: 0, width: 128, height: 128 },
		{ x:  640, y: 0, width: 128, height: 128 },
		{ x:  768, y: 0, width: 128, height: 128 },
		{ x:  896, y: 0, width: 128, height: 128 },
		{ x: 1024, y: 0, width: 128, height: 128 },
		{ x: 1152, y: 0, width: 128, height: 128 },
		{ x: 1280, y: 0, width: 128, height: 128 },
		{ x: 1408, y: 0, width: 128, height: 128 }
	],
	attack: [
		{ x: 1536, y: 0, width: 128, height: 128 },
		{ x: 1664, y: 0, width: 128, height: 128 },
		{ x: 1792, y: 0, width: 128, height: 128 },
		{ x: 1920, y: 0, width: 128, height: 128 }
	],
	bite: [
		{ x: 2048, y: 0, width: 128, height: 128 },
		{ x: 2176, y: 0, width: 128, height: 128 },
		{ x: 2304, y: 0, width: 128, height: 128 },
		{ x: 2432, y: 0, width: 128, height: 128 }
	],
	block: [
		{ x: 2560, y: 0, width: 128, height: 128 },
		{ x: 2688, y: 0, width: 128, height: 128 }
	],
	die: [
		{ x: 2816, y: 0, width: 128, height: 128 },
		{ x: 2944, y: 0, width: 128, height: 128 },
		{ x: 3072, y: 0, width: 128, height: 128 },
		{ x: 3200, y: 0, width: 128, height: 128 },
		{ x: 3328, y: 0, width: 128, height: 128 },
		{ x: 3456, y: 0, width: 128, height: 128 }
	],
	death: [
		{ x: 3584, y: 0, width: 128, height: 128 },
		{ x: 3712, y: 0, width: 128, height: 128 },
		{ x: 3840, y: 0, width: 128, height: 128 },
		{ x: 3968, y: 0, width: 128, height: 128 },
		{ x: 4096, y: 0, width: 128, height: 128 },
		{ x: 4224, y: 0, width: 128, height: 128 },
		{ x: 4352, y: 0, width: 128, height: 128 }
	]
};

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
var enemyAnimation = {
	walk: [
		{ x:   0, y:   0, width: 100, height: 100 },
		{ x: 100, y:   0, width: 100, height: 100 },
		{ x: 200, y:   0, width: 100, height: 100 },
		{ x: 300, y:   0, width: 100, height: 100 },
		{ x: 400, y:   0, width: 100, height: 100 },
		{ x:   0, y: 100, width: 100, height: 100 },
		{ x: 100, y: 100, width: 100, height: 100 },
		{ x: 200, y: 100, width: 100, height: 100 },
		{ x: 300, y: 100, width: 100, height: 100 },
		{ x: 400, y: 100, width: 100, height: 100 }
	],
	stand: [
		{ x:   0, y: 200, width: 100, height: 100 },
		{ x: 100, y: 200, width: 100, height: 100 },
		{ x: 200, y: 200, width: 100, height: 100 },
		{ x: 300, y: 200, width: 100, height: 100 },
		{ x: 400, y: 200, width: 100, height: 100 },
		{ x:   0, y: 300, width: 100, height: 100 },
		{ x: 100, y: 300, width: 100, height: 100 },
		{ x: 200, y: 300, width: 100, height: 100 },
		{ x: 300, y: 300, width: 100, height: 100 },
		{ x: 400, y: 300, width: 100, height: 100 }
	],
	attack: [
		{ x:   0, y: 400, width: 100, height: 100 },
		{ x: 100, y: 400, width: 100, height: 100 },
		{ x: 200, y: 400, width: 100, height: 100 },
		{ x: 300, y: 400, width: 100, height: 100 },
		{ x: 400, y: 400, width: 100, height: 100 },
		{ x:   0, y: 500, width: 100, height: 100 },
		{ x: 100, y: 500, width: 100, height: 100 },
		{ x: 200, y: 500, width: 100, height: 100 },
		{ x: 300, y: 500, width: 100, height: 100 },
		{ x: 400, y: 500, width: 100, height: 100 }
	]
};

var playerImg = new Image();
playerImg.onload = function() {
	var walk = new Kinetic.Sprite({
		x: 20,
		y: 20,
		image: playerImg,
		animation: 'walk',
		animations: playerAnimation,
		frameRate: 7
	});
	var stand = new Kinetic.Sprite({
		x: 200,
		y: 20,
		image: playerImg,
		animation: 'stand',
		animations: playerAnimation,
		frameRate: 7
	});

	// add the shape to the layer
	layer.add(walk);
	layer.add(stand);
	// add the layer to the stage
	stage.add(layer);
	// start sprite animation
	walk.start();
	stand.start();
};
playerImg.src = 'img/player-sprite.png';

var enemyImg = new Image();
enemyImg.onload = function() {
	var walk = new Kinetic.Sprite({
		x: 20,
		y: 200,
		image: enemyImg,
		animation: 'walk',
		animations: enemyAnimation,
		frameRate: 7
	});
	var stand = new Kinetic.Sprite({
		x: 200,
		y: 200,
		image: enemyImg,
		animation: 'stand',
		animations: enemyAnimation,
		frameRate: 7
	});
	var attack = new Kinetic.Sprite({
		x: 380,
		y: 200,
		image: enemyImg,
		animation: 'attack',
		animations: enemyAnimation,
		frameRate: 7
	});

	// add the shape to the layer
	layer.add(walk);
	layer.add(stand);
	layer.add(attack);
	// add the layer to the stage
	stage.add(layer);
	// start sprite animation
	walk.start();
	stand.start();
	attack.start();
};
enemyImg.src = 'img/enemy-sprite.png';

var zombieImg = new Image();
zombieImg.onload = function() {
	var walk = new Kinetic.Sprite({
		x: 20,
		y: 400,
		image: zombieImg,
		animation: 'walk',
		animations: zombieAnimation,
		frameRate: 7
	});
	var stand = new Kinetic.Sprite({
		x: 200,
		y: 400,
		image: zombieImg,
		animation: 'stand',
		animations: zombieAnimation,
		frameRate: 7
	});
	var attack = new Kinetic.Sprite({
		x: 380,
		y: 400,
		image: zombieImg,
		animation: 'bite',
		animations: zombieAnimation,
		frameRate: 7
	});

	// add the shape to the layer
	layer.add(walk);
	layer.add(stand);
	layer.add(attack);
	// add the layer to the stage
	stage.add(layer);
	// start sprite animation
	walk.start();
	stand.start();
	attack.start();
};
zombieImg.src = 'img/zombie-sprite.png';
})();
