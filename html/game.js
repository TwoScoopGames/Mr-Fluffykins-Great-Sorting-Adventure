var canvas = document.getElementById("canvas");

var manifest = {
	"images": {
		"bg": "img/bg.png",
		"bg-wall": "img/bg-wall.png",
		"bg-intro": "img/title-screen.png",
		"machine-mail": "img/machine-mail.png",
		"machine-photo": "img/machine-photo.png",
		"machine-video": "img/machine-video.png",
		"machine-only-mail": "img/machine-only-mail.png",
		"machine-only-photo": "img/machine-only-photo.png",
		"machine-only-video": "img/machine-only-video.png",
		"tote-email-good": "img/tote-mail.png",
		"tote-email-good-full": "img/tote-mail-full.png",
		"tote-video-good": "img/tote-video.png",
		"tote-video-good-full": "img/tote-video-full.png",
		"tote-picture-good": "img/tote-photo.png",
		"tote-picture-good-full": "img/tote-photo-full.png",
		"tube-top-right": "img/tube-top-right.png",
		"tube-top-left": "img/tube-top-left.png",
		"tube-bottom-right": "img/tube-bottom-right.png"
	},
	"sounds": {
		"intro": "music/intro.mp3",
		"main": "music/main.mp3",
		"win": "music/win.mp3",
		"fail": "music/fail.mp3",
		"pickUpFile": "sound/pickUpFile.wav",
		"placeFileOnConveyor": "sound/placeFile.wav",
		"shred": "sound/shred.wav",
		"processFile": "sound/processFile.wav",
		"placeFileOut": "sound/placeFileOut.wav",
		"step1": "sound/step1.wav",
		"step2": "sound/step2.wav"
	},
	"fonts": {
		"pixelmix1": {
			"embedded-opentype": "font/pixelmix1-webfont.eot",
			"woff": "font/pixelmix1-webfont.woff",
			"truetype": "font/pixelmix1-webfont.ttf",
			"svg": "font/pixelmix1-webfont.svg#pixeladeregular"
		}
	},
	"animations": {
		"email": {
			"strip": "img/mail.png",
			"frames": 1,
			"msPerFrame": 100
		},
		"email-good": {
			"strip": "img/mail-good.png",
			"frames": 1,
			"msPerFrame": 100
		},
		"email-bad": {
			"strip": "img/mail-bad.png",
			"frames": 1,
			"msPerFrame": 100
		},
		"picture": {
			"strip": "img/photo.png",
			"frames": 1,
			"msPerFrame": 100
		},
		"picture-good": {
			"strip": "img/photo-good.png",
			"frames": 1,
			"msPerFrame": 100
		},
		"picture-bad": {
			"strip": "img/photo-bad.png",
			"frames": 1,
			"msPerFrame": 100
		},
		"video": {
			"strip": "img/video.png",
			"frames": 1,
			"msPerFrame": 100
		},
		"video-good": {
			"strip": "img/video-good.png",
			"frames": 1,
			"msPerFrame": 100
		},
		"video-bad": {
			"strip": "img/video-bad.png",
			"frames": 11,
			"msPerFrame": 100
		},
		"conveyor-left": {
			"strip": "img/conveyor-left.png",
			"frames": 6,
			"msPerFrame": 100
		},
		"conveyor-right": {
			"strip": "img/conveyor-right.png",
			"frames": 6,
			"msPerFrame": 100
		},
		"conveyor-email": {
			"strip": "img/machine-conveyor-mail.png",
			"frames": 2,
			"msPerFrame": 100
		},
		"conveyor-picture": {
			"strip": "img/machine-conveyor-photo.png",
			"frames": 2,
			"msPerFrame": 100
		},
		"conveyor-video": {
			"strip": "img/machine-conveyor-video.png",
			"frames": 2,
			"msPerFrame": 100
		},
		"shredder": {
			"strip": "img/shredder.png",
			"frames": 3,
			"msPerFrame": 100
		},
		"player-up": {
			"strip": "img/player-up.png",
			"frames": 4,
			"msPerFrame": 100
		},
		"player-down": {
			"strip": "img/player-down.png",
			"frames": 4,
			"msPerFrame": 100
		},
		"player-left": {
			"strip": "img/player-left.png",
			"frames": 4,
			"msPerFrame": 100
		},
		"player-right": {
			"strip": "img/player-right.png",
			"frames": 4,
			"msPerFrame": 100
		},
		"player-up-carry": {
			"strip": "img/player-up-carry.png",
			"frames": 4,
			"msPerFrame": 100
		},
		"player-down-carry": {
			"strip": "img/player-down-carry.png",
			"frames": 4,
			"msPerFrame": 100
		},
		"player-left-carry": {
			"strip": "img/player-left-carry.png",
			"frames": 4,
			"msPerFrame": 100
		},
		"player-right-carry": {
			"strip": "img/player-right-carry.png",
			"frames": 4,
			"msPerFrame": 100
		},
		"player-clock-in": {
			"strip": "img/player-clock-in.png",
			"frames": 4,
			"msPerFrame": 250
		},
		"mail": {
			"strip": "img/machine-only-mail-anim-f20.png",
			"frames": 20,
			"msPerFrame": 100
		},
		"photo": {
			"strip": "img/machine-only-photo-anim-f29.png",
			"frames": 29,
			"msPerFrame": 100
		},
		"vid": {
			"strip": "img/machine-only-video-anim-f13.png",
			"frames": 13,
			"msPerFrame": 100
		},
		"warning": {
			"strip": "img/warning-backing-up-f2.png",
			"frames": 2,
			"msPerFrame": 250
		}
	}
};

var clockInScript = {
	steps: [
		{command: "moveToPoint", targetX: 246.3613369467028, targetY: 59.74358974358972},
		{command: "playAnimation", name: "player-clock-in", durationMs: 1000},
		{command: "moveToPoint", targetX: 108, targetY: 189.25641025641022 }
		],
	current: -1,
	running : true
};

function runScript(script, scene){
	if (!script.running){
		return;
	}
	var step = script.steps[script.current];
	function isRunning(step){
		if (!step){
			return false;
		}
		else if (step.command == "moveToPoint"){
			return scene.timers.path && scene.timers.path.running;
		}
		else if(step.command == "playAnimation"){
			return scene.timers.animation && scene.timers.animation.running;
		}
		else {
			return false;
		}
	}
	if (isRunning(step)){
		return;
	}
	script.current ++;
	if (script.current >= script.steps.length){
		script.running = false;
		return;
	}
	step = script.steps[script.current];
	function runStep(step){
		if (!step){
			return false;
		}
		else if (step.command == "moveToPoint"){
			movePlayerToPoint(scene, scene.player, step.targetX, step.targetY);
		}
		else if(step.command == "playAnimation"){
			scene.player.sprite = game.animations.get(step.name);
			scene.timers.animation = new Splat.Timer(undefined, step.durationMs, undefined);
			scene.timers.animation.start();
		}
	}
	runStep(step);
}

var game = new Splat.Game(canvas, manifest);

var score = 0;
var hearts = 3;

function AnimationGroup() {
	this.animations = {};
}
AnimationGroup.prototype.add = function(name, animation) {
	this.animations[name] = animation;
	this.current = name;
};
AnimationGroup.prototype.each = function(callback) {
	for (var key in this.animations) {
		if (this.animations.hasOwnProperty(key)) {
			callback(this.animations[key]);
		}
	}
};
AnimationGroup.prototype.move = function(elapsedMillis) {
	this.each(function(animation) {
		animation.move(elapsedMillis);
	});
};
AnimationGroup.prototype.reset = function() {
	this.each(function(animation) {
		animation.reset();
	});
};
AnimationGroup.prototype.draw = function(context, x, y) {
	this.animations[this.current].draw(context, x, y);
};
AnimationGroup.prototype.getCurrent = function() {
	return this.animations[this.current];
};

var stepSounds = ["step1", "step2"];

var conveyors = [];


var shredder = new Splat.Entity(776, 521, 108, 80);

var waves = [
	{
		"video": 1,
		"picture": 1,
		"email": 1,
		"video-bad": 1,
		"picture-bad": 1,
		"email-bad": 1,
	},
	{
		"video": 3,
		"picture": 3,
		"email": 3,
		"video-bad": 2,
		"picture-bad": 2,
		"email-bad": 2,
	}
];
var currentWave = 0;
var batchedFiles = [];
var batchedTotes = [];


function generateGarbageWave(currentWaveInt){
	console.log('generating garbage wave');
	var ranVid = Math.floor(Math.random()*(currentWaveInt+2)) + 1;
	var ranPic = Math.floor(Math.random()*(currentWaveInt+2)) + 1;
	var ranEMail = Math.floor(Math.random()*(currentWaveInt+2)) + 1;
	var ranVidBad = Math.floor(Math.random()*(currentWaveInt+2)) + 3*currentWaveInt;
	var ranPicBad = Math.floor(Math.random()*(currentWaveInt+2)) + 3*currentWaveInt;
	var ranEMailBad = Math.floor(Math.random()*(currentWaveInt+2)) + 3*currentWaveInt;

	return {
		"video": ranVid,
		"picture": ranPic,
		"email": ranEMail,
		"video-bad": ranVidBad,
		"picture-bad": ranPicBad,
		"email-bad": ranEMailBad
	};
}
function generateSpecificWave(currentWaveInt, intFileType){
	console.log('generating Specific Wave');
	switch(intFileType){
		case 0:
			var ranVid = Math.floor(Math.random()*(currentWaveInt+2))*2 + 1;
			var ranPic = 2;
			var ranEMail = 2;
		break;
		case 1:
			var ranVid = 2
			var ranPic = Math.floor(Math.random()*(currentWaveInt+2))*2 + 1;
			var ranEMail = 2
		break;
		case 2:
			var ranVid = 2
			var ranPic = 2
			var ranEMail = Math.floor(Math.random()*(currentWaveInt+2))*2 + 1;
		break;
	}
	


	var ranVidBad = Math.floor(Math.random()*(currentWaveInt+2)) + 1;
	var ranPicBad = Math.floor(Math.random()*(currentWaveInt+2)) + 1;
	var ranEMailBad = Math.floor(Math.random()*(currentWaveInt+2)) + 1;

	return {
		"video": ranVid,
		"picture": ranPic,
		"email": ranEMail,
		"video-bad": ranVidBad,
		"picture-bad": ranPicBad,
		"email-bad": ranEMailBad
	};
}

function generateGenericWave(currentWaveInt){
	console.log('generating Generic Wave');
	var ranVid = Math.floor(Math.random()*(currentWaveInt+2)) + 1;
	var ranPic = Math.floor(Math.random()*(currentWaveInt+2)) + 1;
	var ranEMail = Math.floor(Math.random()*(currentWaveInt+2)) + 1;
	var ranVidBad = Math.floor(Math.random()*(currentWaveInt+2)) + 1;
	var ranPicBad = Math.floor(Math.random()*(currentWaveInt+2)) + 1;
	var ranEMailBad = Math.floor(Math.random()*(currentWaveInt+2)) + 1;

	return {
		"video": ranVid,
		"picture": ranPic,
		"email": ranEMail,
		"video-bad": ranVidBad,
		"picture-bad": ranPicBad,
		"email-bad": ranEMailBad
	};
}

function generateWave(intCurrentWave){
	if (intCurrentWave>0){
		switch (Math.floor(Math.random()*3)){
		case 0:
		return generateGenericWave(intCurrentWave);
		break;
		case 1:
		return generateSpecificWave(intCurrentWave,Math.floor(Math.random()*3));
		break;
		case 2:
		return generateGarbageWave(intCurrentWave);
		break;
		}
	}
	else{
		return generateGenericWave(intCurrentWave);
	}

	
	
	
}

function generateBatch() {
	var wave = waves[currentWave];
	if (currentWave >= 0){//waves.length){
		wave = generateWave(currentWave);
	}
	for (var type in wave) {
		
		for (var i = 0; i < wave[type]; i++) {
			if (type.indexOf("-bad") === -1) {
				batchedFiles.push(createFile(type));
				batchedTotes.push(createTote(type + "-good"));
			} else {
				type = type.substr(0, type.length - 4);
				var file = createFile(type);
				file.bad = true;
				batchedFiles.push(file);
			}
		}
	}
}
		

function getNextFile() {
	if (batchedFiles.length === 0) {
//		generateBatch();
	}
	return removeRandomElement(batchedFiles);
}

function getNextTote() {
	return removeRandomElement(batchedTotes);
}

function adjustRight(x, y, width, height, obstacle) {
	x = obstacle.x + obstacle.width;
	return [x, y];
}
function adjustLeft(x, y, width, height, obstacle) {
	x = obstacle.x - width - 1;
	return [x, y];
}
function adjustUp(x, y, width, height, obstacle) {
	y = obstacle.y - height;
	return [x, y];
}
function adjustDown(x, y, width, height, obstacle) {
	y = obstacle.y + obstacle.height;
	return [x, y];
}
function adjustVertically(x, y, width, height, obstacle) {
	if (y + (height / 2) < obstacle.y + (obstacle.height / 2)) {
		return adjustUp(x, y, width, height, obstacle);
	} else {
		return adjustDown(x, y, width, height, obstacle);
	}
}
function adjustHorizontally(x, y, width, height, obstacle) {
	if (x + (width / 2) < obstacle.x + (obstacle.width / 2)) {
		return adjustLeft(x, y, width, height, obstacle);
	} else {
		return adjustRight(x, y, width, height, obstacle);
	}
}

var floorObstacles = [];

var obstacle = new Splat.Entity(0, -100, 108, canvas.height + 200); //left conveyor
obstacle.adjustClick = adjustRight;
floorObstacles.push(obstacle);

obstacle = new Splat.Entity(canvas.width - 108, -100, 108, canvas.height + 200); //right conveyor
obstacle.adjustClick = adjustLeft;
floorObstacles.push(obstacle);

obstacle = new Splat.Entity(243,108,639,60); //top machine
obstacle.adjustClick = function(x, y, width, height, obstacle) {
	var dropOffWidth = 54;
	var enclosedWidth = 369;
	if (x < obstacle.x + dropOffWidth) {
		return adjustLeft(x, y, width, height, obstacle);
	} else if (x > obstacle.x + obstacle.width - fileWidth) {
		return adjustRight(x, y, width, height, obstacle);
	} else {
		return adjustVertically(x, y, width, height, obstacle);
	}
};
floorObstacles.push(obstacle);

obstacle = new Splat.Entity(243,324,639,60); //middle machine
obstacle.adjustClick = function(x, y, width, height, obstacle) {
	var dropOffWidth = 102;
	var enclosedWidth = 276;
	if (x < obstacle.x + dropOffWidth) {
		return adjustLeft(x, y, width, height, obstacle);
	} else if (x > obstacle.x + obstacle.width - fileWidth) {
		return adjustRight(x, y, width, height, obstacle);
	} else {
		return adjustVertically(x, y, width, height, obstacle);
	}
};
floorObstacles.push(obstacle);

obstacle = new Splat.Entity(243, 540, 417, 60); //bottom machine
obstacle.adjustClick = function(x, y, width, height, obstacle) {
	var dropOffWidth = 54;
	var enclosedWidth = 138;
	if (x < obstacle.x + dropOffWidth) {
		return adjustLeft(x, y, width, height, obstacle);
	} else if (x > obstacle.x + obstacle.width - fileWidth) {
		return adjustRight(x, y, width, height, obstacle);
	} else {
		return adjustVertically(x, y, width, height, obstacle);
	}
};
floorObstacles.push(obstacle);

obstacle = new Splat.Entity(774, 540, 108, 60); // shredder
obstacle.adjustClick = adjustHorizontally;
floorObstacles.push(obstacle);

// obstacle = new Splat.Entity(-100, 0, (canvas.width + 200), 60), // top border
// obstacle.adjustClick = adjustDown;
// floorObstacles.push(obstacle);

obstacle = new Splat.Entity(-100, canvas.height, (canvas.width + 200), 60); // bottom border
obstacle.adjustClick = adjustUp;
floorObstacles.push(obstacle);

obstacle = new Splat.Entity(0, 34, 141, 21); // left of door
obstacle.adjustClick = adjustDown;
floorObstacles.push(obstacle);

obstacle = new Splat.Entity(249, 34, canvas.width, 21); // right of door
obstacle.adjustClick = adjustDown;
floorObstacles.push(obstacle);

function makeIsWalkableForObstacles(player, obstacles) {
	return function(x, y) {
		for (var i = 0; i < obstacles.length; i++) {
			var obstacle = obstacles[i];
			if (playerCollidesWithObstacle(x, y, player.width, player.height, obstacle)) {
				return false;
			}
		}
		return true;
	};
}

function playerCollidesWithObstacle(x, y, width, height, obstacle) {
	return x >= obstacle.x - width &&
		x < obstacle.x + obstacle.width &&
		y >= obstacle.y - height &&
		y < obstacle.y + obstacle.height;
}
var scriptedMoveArray = [];

function makeScriptPathTimer(player, path, targetX, targetY, playerWalk, playerCarry) {
	return new Splat.Timer(function(){
		var pathStep = (this.time * playerSpeed) |0;
		if (pathStep >= path.length) {
			pathStep = path.length - 1;
			this.stop();
			return true;
		}
		var pos = path[pathStep];
		player.lastX = player.x;
		player.lastY = player.y;
		player.x = pos.x;
		player.y = pos.y;

		var pathVx = player.x - player.lastX;
		var pathVy = player.y - player.lastY;
		if (!this.running) {
			// align the target to the aStar grid, which is scaled
			targetX = Math.floor(targetX / 3) * 3;
			targetY = Math.floor(targetY / 3) * 3;
			// overwrite the typical direction with the un-adjusted player's click
			// this makes the player end up facing the direction the player meant him to
			pathVx = targetX - player.x;
			pathVy = targetY - player.y;
		}
		if (pathVy < 0) {
			playerWalk.current = "up";
			playerCarry.current = "up";
		}
		if (pathVx < 0) {
			playerWalk.current = "left";
			playerCarry.current = "left";
		}
		if (pathVx > 0) {
			playerWalk.current = "right";
			playerCarry.current = "right";
		}
		if (pathVy > 0) {
			playerWalk.current = "down";
			playerCarry.current = "down";
		}

	}, undefined, undefined);
}

function makePathTimer(player, path, targetX, targetY, playerWalk, playerCarry, scene) {
	return new Splat.Timer(function() {
		var pathStep = (this.time * playerSpeed) |0;
		if (pathStep >= path.length) {
			pathStep = path.length - 1;
			this.stop();
			if (scene.nextPaths && scene.nextPaths.length > 0){
				var target = scene.nextPaths.shift();
				movePlayerToPoint(scene, player, target.targetX, target.targetY);
			}
		}
		var pos = path[pathStep];
		player.lastX = player.x;
		player.lastY = player.y;
		player.x = pos.x;
		player.y = pos.y;

		var pathVx = player.x - player.lastX;
		var pathVy = player.y - player.lastY;
		if (!this.running) {
			// align the target to the aStar grid, which is scaled
			targetX = Math.floor(targetX / 3) * 3;
			targetY = Math.floor(targetY / 3) * 3;
			// overwrite the typical direction with the un-adjusted player's click
			// this makes the player end up facing the direction the player meant him to
			pathVx = targetX - player.x;
			pathVy = targetY - player.y;
		}
		if (pathVy < 0) {
			playerWalk.current = "up";
			playerCarry.current = "up";
		}
		if (pathVx < 0) {
			playerWalk.current = "left";
			playerCarry.current = "left";
		}
		if (pathVx > 0) {
			playerWalk.current = "right";
			playerCarry.current = "right";
		}
		if (pathVy > 0) {
			playerWalk.current = "down";
			playerCarry.current = "down";
		}

	}, undefined, undefined);
}

function movePlayerToPoint(scene, player, targetX, targetY){
	if (scene.timers.path && scene.timers.path.running){
		if(!scene.nextPaths){
			scene.nextPaths = [];
		}
		scene.nextPaths.push({targetX: targetX, targetY: targetY});
		return;
	}
	var adjusted = adjustClickCoordinate(targetX, targetY, player.width, player.height, floorObstacles);
	scene.path = scene.aStar.search(player.x, player.y, adjusted[0], adjusted[1]);
	if (scene.path.length > 0) {
		var timer = makePathTimer(player, scene.path, targetX, targetY, scene.playerWalk, scene.playerCarry, scene);
		timer.start();
		scene.timers.path = timer;
	}
}


function adjustClickCoordinate(x, y, width, height, obstacles) {
	for (var i = 0; i < obstacles.length; i++) {
		var obstacle = obstacles[i];
		if (playerCollidesWithObstacle(x, y, width, height, obstacle)) {
			if (typeof obstacle.adjustClick === 'function') {
				var adjusted = obstacle.adjustClick(x, y, width, height, obstacle);
				x = adjusted[0];
				y = adjusted[1];
			}
		}
	}
	return [x, y];
}

function canPickupFile(file, conveyor) {
	if (conveyor.horizontal) {
		return file.x >= conveyor.x + conveyor.dropOffWidth + conveyor.enclosedWidth;
	} else {
		return file.y >= conveyor.y + conveyor.dropOffWidth + conveyor.enclosedWidth;
	}
}

function canDropOff(player, conveyor) {
	if (conveyor.horizontal) {
		return player.x + player.width < conveyor.x + conveyor.dropOffWidth;
	} else {
		return player.y + player.height < conveyor.y + conveyor.dropOffWidth;
	}
}

function resetPosition(entity) {
	entity.x = entity.lastX;
	entity.y = entity.lastY;
}

function isInside(container, item) {
	return item.x >= container.x &&
		item.x + item.width <= container.x + container.width &&
		item.y >= container.y &&
		item.y + item.height <= container.y + container.height;
}

function collidesWithAny(item, otherItems, collisionHandler) {
	var foundCollision = false;
	for (var i = 0; i < otherItems.length; i++) {
		if (item === otherItems[i]) {
			continue;
		}
		if (item.collides(otherItems[i])) {
			if(collisionHandler){
				collisionHandler(otherItems[i]);
			}
			foundCollision = true;
		}
	}
	return foundCollision;
}

var conveyorSpeed = 0.03;

function makeConveyor(x, y, width, height, horizontal, type, dropOffWidth, enclosedWidth) {
	var conveyor = new Splat.Entity(x, y, width, height);
	conveyor.draw = function(context) {
		for (var i = 0; i < this.files.length; i++) {
			this.files[i].draw(context);
		}
	};
	conveyor.move = function(elapsedMillis) {
		var scene = game.scenes.get("main");
		for (var i = 0; i < this.files.length; i++) {
			var file = this.files[i];
			if (this.horizontal) {
				file.vx = conveyorSpeed;
				file.vy = 0;
			}
			else {
				file.vx = 0;
				file.vy = conveyorSpeed;
			}
			file.move(elapsedMillis);
			if (!isInside(this, file) && (!file.filled)) {
				resetPosition(file);
			}
			collidesWithAny(file, this.files, file.resolveCollisionWith.bind(file));
			if (file.y > canvas.height) {
				this.files.splice(i, 1);
				i--;
				score += 10;
				if(this.files.length === 0){
					currentWave +=1;
					scene.timers.waveStart.reset();
					scene.timers.waveStart.start();
				}
			}
			if (file.lastX < this.x + this.dropOffWidth && file.x >= this.x + this.dropOffWidth) {
				file.type += file.bad ? "-bad" : "-good";
				file.sprite = game.animations.get(file.type);
				game.sounds.play("processFile");

				
				if (file.type === "email-good" || file.type === "email-bad") {
					scene.timers.mail.reset();
					scene.timers.mail.start();
				}
				if (file.type === "video-good" || file.type === "video-bad") {
					scene.timers.vid.reset();
					scene.timers.vid.start();
				}
				if (file.type === "picture-good" || file.type === "picture-bad") {
					scene.timers.photo.reset();
					scene.timers.photo.start();
				}
			}
		}
	};
	conveyor.horizontal = horizontal;
	conveyor.type = type;
	conveyor.files = [];
	conveyor.dropOffWidth = dropOffWidth;
	conveyor.enclosedWidth = enclosedWidth;

	conveyors.push(conveyor);
}

/**
 * verifies that moving along a given path does not carry a given entity into another entity 
 * @param {Entity} myEnt The entity that is being moved
 * @param {number} elapsedMillis The number of milliseconds since the last frame.
 * @param {Entity} entArray The Array of potential obstructing Entities
 **/
function validateAndMove(player, elapsedMillis, obstacles) {
	player.move(elapsedMillis);

	for (var i = 0; i < obstacles.length; i++) {
		var obstacle = obstacles[i];
		if (player.collides(obstacle)) {
			player.resolveCollisionWith(obstacle);
		}
	}
}

/**
 * sorts Entities by virtual z-axis and draws them in order so that those closer to the viewer are drawn over those further away
 * @param {external:CanvasRenderingContext2D} context browser native that allows interaction with the canvas
 * @param {Entity} entities array of drawable entities
 **/
function drawEntities(context, entities) {
	entities.sort(function(a, b) {
		return (a.y + a.height) - (b.y + b.height);
	});
	for (var i in entities) {
		entities[i].draw(context);
	}
}

var files = [];
var fileWidth = 45;
var fileHeight = 39;
var toteWidth = 63;
var toteHeight = 60;
var playerSpeed = 0.7;
var fileTypes = ["picture", "video", "email"];
var fileColors = {
	"picture": "#ff00ff",
	"video": "#00ff00",
	"email": "#0000ff",
	"picture-bad": "#ff0066",
	"video-bad": "#006600",
	"email-bad": "#000066",
	"picture-good": "#ff00ff",
	"video-good": "#00ff00",
	"email-good": "#0000ff",
	"in": "#ffffff",
	"out": "#ffffff"
};

function createFile(type) {
	var img = game.animations.get(type);
	var file = new Splat.AnimatedEntity(0, 0, fileWidth, fileHeight, img, 0, 0);
	file.type = type;
	return file;
}

function createTote(type) {
	var tote = new Splat.Entity(0, 0, toteWidth, toteHeight);
	tote.draw = function(context) {
		if (this.filled) {
			context.drawImage(game.images.get('tote-'+this.type+'-full'), this.x|0, this.y|0);
		} else {
			context.drawImage(game.images.get('tote-'+this.type), this.x|0, this.y|0);
		}
	};
	tote.type = type;
	return tote;
}

function canAddFileToConveyor(file, conveyor, ignoreType) {
	if (!ignoreType && file.type != conveyor.type) {
		return false;
	}
	var oldX = file.x;
	var oldY = file.y;
	var x = conveyor.x;
	var y = conveyor.y;
	if (conveyor.horizontal) {
		y += (conveyor.height - file.height) / 2;
	} else {
		x += (conveyor.width - file.width) / 2;
	}
	file.x = x;
	file.y = y;

	var success = !collidesWithAny(file, conveyor.files);
	file.x = oldX;
	file.y = oldY;
	return success ? [x, y] : false;
}

function addFileToConveyor(file, conveyor, ignoreType) {
	var coords = canAddFileToConveyor(file, conveyor, ignoreType);
	if (!coords) {
		return false;
	}
	file.x = coords[0];
	file.y = coords[1];

	conveyor.files.push(file);
	return true;
}

function randomElement(array) {
	var pos = Math.random() * array.length |0;
	return array[pos];
}

function removeRandomElement(array) {
	var pos = Math.random() * array.length |0;
	return array.splice(pos, 1)[0];
}

game.scenes.add("title", new Splat.Scene(canvas, function() {
	// init
	game.sounds.stop("fail");
	if (game.sounds.firstPlay) {
		game.sounds.play("intro", true);
	}
}, function(elapsedMillis) {
	// simulation
	if (game.mouse.consumePressed(0)) {
		game.scenes.switchTo("main");
	}
}, function(context) {
	// draw
	context.drawImage(game.images.get("bg-intro"), 0, 0);
}));

game.scenes.add("main", new Splat.Scene(canvas, function() {
	// init
	game.sounds.stop("intro");
	game.sounds.play("main", true);
		
	//reset files to zero
	for (var i = 0; i < conveyors.length; i++) {
		conveyors[i].files = [];
	}
	hearts = 3;
	score = 0;

	// derive conveyor speed from conveyor animation speed
	conveyorSpeed = 3 / game.animations.get("conveyor-left").frames[0].time;
	makeConveyor(0, 0, 105, canvas.height, false, "in", 0, 0);
	makeConveyor(243, 93, 639, 39, true, "picture", 102, 369);
	makeConveyor(243, 309, 639, 39, true, "video", 102, 276);
	makeConveyor(243, 525, 417, 39, true, "email", 102, 138);
	makeConveyor(canvas.width - 108, 0, 108, canvas.height - 60, false, "out", canvas.height, canvas.height);

	this.playerWalk = new AnimationGroup();

	var anim = game.animations.get("player-up");
	anim.setWidth = 65;
	anim.setHeight = 20;
	anim.setSpriteOffsetX = -10;
	anim.setSpriteOffsetY = -85;
	this.playerWalk.add("up", anim);

	anim = game.animations.get("player-down");
	anim.setWidth = 65;
	anim.setHeight = 20;
	anim.setSpriteOffsetX = -10;
	anim.setSpriteOffsetY = -85;
	this.playerWalk.add("down", anim);

	anim = game.animations.get("player-left");
	anim.setWidth = 65;
	anim.setHeight = 20;
	anim.setSpriteOffsetX = 0;
	anim.setSpriteOffsetY = -85;
	this.playerWalk.add("left", anim);

	anim = game.animations.get("player-right");
	anim.setWidth = 65;
	anim.setHeight = 20;
	anim.setSpriteOffsetX = -20;
	anim.setSpriteOffsetY = -85;
	this.playerWalk.add("right", anim);

	this.playerWalk.current = "left";

	this.playerCarry = new AnimationGroup();

	anim = game.animations.get("player-up-carry");
	anim.setWidth = 65;
	anim.setHeight = 20;
	anim.setSpriteOffsetX = -10;
	anim.setSpriteOffsetY = -85;
	anim.carryOffsetX = 0;
	anim.carryOffsetY = 0;
	this.playerCarry.add("up", anim);

	anim = game.animations.get("player-down-carry");
	anim.setWidth = 65;
	anim.setHeight = 20;
	anim.setSpriteOffsetX = -10;
	anim.setSpriteOffsetY = -85;
	anim.carryOffsetX = 21 + anim.setSpriteOffsetX;
	anim.carryOffsetY = 51 + anim.setSpriteOffsetY;
	this.playerCarry.add("down", anim);

	anim = game.animations.get("player-left-carry");
	anim.setWidth = 65;
	anim.setHeight = 20;
	anim.setSpriteOffsetX = 0;
	anim.setSpriteOffsetY = -85;
	anim.carryOffsetX = -fileWidth + anim.setSpriteOffsetX;
	anim.carryOffsetY = 51 + anim.setSpriteOffsetY;
	this.playerCarry.add("left", anim);

	anim = game.animations.get("player-right-carry");
	anim.setWidth = 65;
	anim.setHeight = 20;
	anim.setSpriteOffsetX = -20;
	anim.setSpriteOffsetY = -85;
	anim.carryOffsetX = anim.width + anim.setSpriteOffsetX;
	anim.carryOffsetY = 51 + anim.setSpriteOffsetY;
	this.playerCarry.add("right", anim);

	this.player = new Splat.AnimatedEntity(110, -250, 65, 20, this.playerWalk, -10, -85);
	this.player.frictionX = 0.5;
	this.player.frictionY = 0.5;
	var oldPlayerDraw = this.player.draw;

	this.player.draw = function(context){
		oldPlayerDraw.call(this,context);
		if (this.file && this.sprite.current !== "up"){
			this.file.draw(context);
		}
	};

	this.camera = new Splat.EntityBoxCamera(this.player, canvas.width, 100, canvas.width / 2, canvas.height - 400);
	//redefine move function so that camera can't move past bottom of the screen
	this.camera.move = function(elapsedMillis){
		Splat.EntityBoxCamera.prototype.move.call(this, elapsedMillis);
		if (this.y > 0){
			this.y = 0;
		}
	}
	this.playerHands = new Splat.Entity(this.player.x, this.player.y, 30, 30);

	var machinePhoto = game.images.get("machine-only-photo");
	var machineVideo = game.images.get("machine-only-video");
	var machineMail = game.images.get("machine-only-mail");
	var conveyorPicture = game.animations.get("conveyor-picture");
	var conveyorVideo = game.animations.get("conveyor-video");
	var conveyorEmail = game.animations.get("conveyor-email");

	var shredder = game.animations.get("shredder");
	var mail = game.animations.get("mail");
	var vid = game.animations.get("vid");
	var photo = game.animations.get("photo");
	var door = game.images.get("bg-wall");

	this.drawables = [
		new Splat.AnimatedEntity(244, 31, conveyorPicture.width, conveyorPicture.height-38, conveyorPicture, 0, 0),
		new Splat.AnimatedEntity(244, 157, conveyorVideo.width, conveyorVideo.height-30, conveyorVideo, 0, 0),
		new Splat.AnimatedEntity(243, 432, conveyorEmail.width, conveyorEmail.height-40, conveyorEmail, 0, 0),
		new Splat.AnimatedEntity(774, 462, shredder.width, shredder.height, shredder, 0, 0),
		new Splat.AnimatedEntity(345, 432, mail.width, mail.height, mail, 0, 0),
		new Splat.AnimatedEntity(345, 30, photo.width, photo.height, photo, 0, 0),
		new Splat.AnimatedEntity(345, 153, vid.width, vid.height, vid, 0, 0),
		new Splat.AnimatedEntity(0, 34, door.width, 21, door, 0, -174),
		this.player
	];

	var scene = this;
	this.timers.fileSpawner = new Splat.Timer(undefined, 3000, function() {
		
		var file = getNextFile();
		if (file && !addFileToConveyor(file, conveyors[0], true)) {
			batchedFiles.push(file);
			hearts -= 1;
			if (hearts === 0) {
				game.scenes.switchTo("end");
			}
			scene.timers.flash.reset();
			scene.timers.flash.start();
		}
		this.reset();
		this.start();
	});
	this.timers.fileSpawner.start();
	
	this.timers.toteSpawner = new Splat.Timer(undefined, 3000, function() {
		var tote = getNextTote();
		if (tote) {
			if (!addFileToConveyor(tote, conveyors[4], true)) {
				batchedTotes.push(tote);
			}
		}
		this.reset();
		this.start();
	});
	this.timers.toteSpawner.start();

	this.timers.playStep = new Splat.Timer(undefined, 100, function() {
		game.sounds.play(randomElement(stepSounds));
		this.reset();
		this.start();
	});

	this.timers.shredder = new Splat.Timer(undefined, 2000, undefined);
	this.timers.mail = new Splat.Timer(undefined, 2000, undefined);
	this.timers.vid = new Splat.Timer(undefined, 4500, undefined);
	this.timers.photo = new Splat.Timer(undefined, 8500, undefined);
	this.timers.flash = new Splat.Timer(undefined, 200, undefined);
	this.timers.waveStart = new Splat.Timer(undefined, 2000, generateBatch);
	this.aStar = new Splat.AStar(makeIsWalkableForObstacles(this.player, floorObstacles));
	this.aStar.scaleX = 3;
	this.aStar.scaleY = 3;
//	movePlayerToPoint(scene, this.player, 276.8852755194219, 59.74358974358972);
//	movePlayerToPoint(scene, this.player, 108, 189.25641025641022);
	this.timers.waveStart.start();
}, function(elapsedMillis) {
	// simulation
	runScript(clockInScript, this);
	if (!clockInScript.running){
		if (game.mouse.consumePressed(0)) {
			this.timers.path.stop();
			this.nextPaths = [];
			var targetX = game.mouse.x - (this.player.width / 2 |0) + this.camera.x;
			var targetY = game.mouse.y - (this.player.height / 2 |0) + this.camera.y;
			movePlayerToPoint(this, this.player, targetX, targetY);
		}

		if (game.keyboard.isPressed("left") || game.keyboard.isPressed("a")) {
			if (this.timers.path) {
				this.timers.path.stop();
			}
			this.player.vx = -playerSpeed;
		}
		if (game.keyboard.isPressed("right") || game.keyboard.isPressed("d")) {
			if (this.timers.path) {
				this.timers.path.stop();
			}
			this.player.vx = playerSpeed;
		}
		if (game.keyboard.isPressed("up") || game.keyboard.isPressed("w")) {
			if (this.timers.path) {
				this.timers.path.stop();
			}
			this.player.vy = -playerSpeed;
		}
		if (game.keyboard.isPressed("down") || game.keyboard.isPressed("s")) {
			if (this.timers.path) {
				this.timers.path.stop();
			}
			this.player.vy = playerSpeed;
		}
	}

	var animationTolerance = 0.1;
	if (this.player.vy < -animationTolerance) {
		this.playerWalk.current = "up";
		this.playerCarry.current = "up";
	}
	if (this.player.vx < -animationTolerance) {
		this.playerWalk.current = "left";
		this.playerCarry.current = "left";
	}
	if (this.player.vx > animationTolerance) {
		this.playerWalk.current = "right";
		this.playerCarry.current = "right";
	}
	if (this.player.vy > animationTolerance) {
		this.playerWalk.current = "down";
		this.playerCarry.current = "down";
	}
	var currAnim;
	if (typeof this.player.sprite.getCurrent === "function"){
		currAnim = this.player.sprite.getCurrent();
		this.player.width = currAnim.setWidth;
		this.player.height = currAnim.setHeight;
		this.player.spriteOffsetX = currAnim.setSpriteOffsetX;
		this.player.spriteOffsetY = currAnim.setSpriteOffsetY;
	}
	else {
		currAnim = this.player.sprite;
	}
	
	if (!this.player.moved()) {
		this.playerWalk.reset();
		this.playerCarry.reset();
		this.timers.playStep.stop();
	} else {
		this.timers.playStep.start();
	}
	if (!this.timers.animation || !this.timers.animation.running){
		this.player.sprite = this.player.file ? this.playerCarry : this.playerWalk;
	}

	for (var i = 0; i < conveyors.length; i++) {
		conveyors[i].move(elapsedMillis);
	}

	validateAndMove(this.player, elapsedMillis, floorObstacles);

	var dir = this.player.sprite.current;
	if (dir === "up") {
		this.playerHands.width = 24;
		this.playerHands.height = 70;
		this.playerHands.x = this.player.x + (this.player.width / 2) - 12;
		this.playerHands.y = this.player.y - this.playerHands.height - 13;
	}
	if (dir === "down") {
		this.playerHands.width = 24;
		this.playerHands.height = 70;
		this.playerHands.x = this.player.x + (this.player.width / 2) - 12;
		this.playerHands.y = this.player.y - 13;
	}
	if (dir === "left") {
		this.playerHands.width = 70;
		this.playerHands.height = 14;
		this.playerHands.x = this.player.x - this.playerHands.width + 30;
		this.playerHands.y = this.player.y - 13;
	}
	if (dir === "right") {
		this.playerHands.width = 70;
		this.playerHands.height = 14;
		this.playerHands.x = this.player.x + this.player.width - 30;
		this.playerHands.y = this.player.y - 13;
	}

	var me = this.player;
	var myHands = this.playerHands;

	// Pick up files
	var pickUpFile = function(other) {
		if (me.file) {
			return;
		}

		if (!canPickupFile(other, conveyors[i])) {
			return;
		}

		var canPutOnMachine = false;
		for (var j = 0; j < conveyors.length; j++) {
			canPutOnMachine = canAddFileToConveyor(other, conveyors[j], false);
			if (canPutOnMachine) {
				break;
			}
		}
		if (!canPutOnMachine) {
			for (var f = 0; f < conveyors[4].files.length; f++) {
				if (other.type === conveyors[4].files[f].type && !conveyors[4].files[f].filled) {
					canPutOnMachine = true;
					break;
				}
			}
		}
		if (!canPutOnMachine) {
			canPutOnMachine = other.type.indexOf("-bad") > 0;
		}
		if (!canPutOnMachine) {
			return;
		}

		var pos = conveyors[i].files.indexOf(other);
		conveyors[i].files.splice(pos, 1);
		me.file = other;
		game.sounds.play("pickUpFile");
	};
	for (i = 0; i < conveyors.length; i++) {
		collidesWithAny(this.playerHands, conveyors[i].files, pickUpFile);
	}

	// Drop off files
	if (this.player.file) {
		collidesWithAny(this.playerHands, conveyors, function(other) {
			if (canDropOff(myHands, other) && addFileToConveyor(me.file, other)) {
				me.file = undefined;
				game.sounds.play("placeFileOnConveyor");
			}
		});
	}

	// Out Conveyor
	if (this.player.file) {
		collidesWithAny(this.playerHands, conveyors[4].files, function(other) {
			if (me.file && me.file.type === other.type && !other.filled) {
				me.file = undefined;
				other.filled = true;
				game.sounds.play("placeFileOut");
			}
		});
	}

	// Shredder
	if (this.player.file && this.playerHands.collides(shredder) && this.player.file.type.indexOf("-bad") > 0) {
		this.player.file = undefined;
		game.sounds.play("shred");
		this.timers.shredder.reset();
		this.timers.shredder.start();
	}

	// player holding file
	if (this.player.file) {
		this.player.file.x = this.player.x + this.player.sprite.getCurrent().carryOffsetX;
		this.player.file.y = this.player.y + this.player.sprite.getCurrent().carryOffsetY;
	}

	game.animations.get("conveyor-left").move(elapsedMillis);
	game.animations.get("conveyor-right").move(elapsedMillis);
	game.animations.get("conveyor-picture").move(elapsedMillis);
	game.animations.get("conveyor-video").move(elapsedMillis);
	game.animations.get("conveyor-email").move(elapsedMillis);
	if (this.timers.shredder.running) {
		game.animations.get("shredder").move(elapsedMillis);
	}
	if (this.timers.mail.running) {
		game.animations.get("mail").move(elapsedMillis);
	}
	if (this.timers.vid.running) {
		game.animations.get("vid").move(elapsedMillis);
	}
	if (this.timers.photo.running) {
		game.animations.get("photo").move(elapsedMillis);
	}
	game.animations.get("warning").move(elapsedMillis);

}, function(context) {
	// draw
	context.drawImage(game.images.get("bg"), 0, -497);

	game.animations.get("conveyor-left").draw(context, 0, 0);
	var anim = game.animations.get("conveyor-right");
	anim.draw(context, canvas.width - anim.width, 0);

	var tubeTopRightImage = game.images.get("tube-top-right");
	var tubeTopLeftImage = game.images.get("tube-top-left");
	var drawables = this.drawables.slice(0);
	drawables = drawables.concat(conveyors);
	drawEntities(context, drawables);


	var tubeTopLeft = new Splat.AnimatedEntity(0, 0, tubeTopLeftImage.width, tubeTopLeftImage.height, tubeTopLeftImage, 0, 0);
	var tubeTopRight = new Splat.AnimatedEntity(canvas.width - tubeTopRightImage.width, 0, tubeTopRightImage.width, tubeTopRightImage.height, tubeTopRightImage, 0, 0);
	tubeTopRight.draw(context);
	tubeTopLeft.draw(context);

	var tubeBottomLeft = game.images.get("tube-bottom-right");
	context.drawImage(tubeBottomLeft, canvas.width - tubeBottomLeft.width, canvas.height - tubeBottomLeft.height);
	
	var scene = this;
	this.camera.drawAbsolute(context,function(){
		context.font= "50px pixelmix1";
		context.fillStyle = "#ffffff";
		context.fillText(score, 950, 50);

		context.fillText(hearts, 150, 50);

		if (scene.timers.waveStart.running){
			var alpha = Splat.math.oscillate(scene.timers.waveStart.time,2000);
			context.fillStyle = "rgba(50,50,50," +alpha + ")";
			context.fillRect(0,(canvas.height / 2) - 30, canvas.width, 60);

			context.fillStyle = "rgba(255,255,255," +alpha + ")";
			var waveText = "Shift "+ (currentWave + 1);
			centerText(context, waveText, 0, (canvas.height / 2) + 20);
			
		}

		if (conveyors[0].files.length >= 14) {
			game.animations.get("warning").draw(context, 630, canvas.height - 120);
		}
		drawFlash(context, scene);
	});
	
}));

function drawFlash(context, scene) {
	var flashTime = scene.timers.flash.time;
	var flashLen = scene.timers.flash.expireMillis;

	if (flashTime > 0) {
		var opacity = Splat.math.oscillate(flashTime, flashLen);
		context.fillStyle = "rgba(255, 0, 0, " + opacity + ")";
		context.fillRect(scene.camera.x, scene.camera.y, canvas.width, canvas.height);
	}
}

game.scenes.add("end", new Splat.Scene(canvas, function() {
	// init
	game.sounds.stop("main");
	game.sounds.play("fail");

	this.timers.done = new Splat.Timer(undefined, 6000, function() {
		game.scenes.switchTo("title");
	});
	this.timers.done.start();
}, function(elapsedMillis) {
	// simulation
}, function(context) {
	// draw
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.font = "70px pixelmix1";
	context.fillStyle = "#fff";
	centerText(context, "Game Over", 0, (canvas.height / 2) - 70);
	centerText(context, "Score: " + score, 0, (canvas.height / 2) + 20);
}));

function centerText(context, text, offsetX, offsetY) {
	var w = context.measureText(text).width;
	var x = offsetX + (canvas.width / 2) - (w / 2) |0;
	var y = offsetY |0;
	context.fillText(text, x, y);
}

game.scenes.switchTo("loading");
