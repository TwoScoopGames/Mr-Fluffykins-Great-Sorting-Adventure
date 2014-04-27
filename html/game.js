var canvas = document.getElementById("canvas");

var manifest = {
	"images": {
		"bg": "img/bg.png",
		"email": "img/mail.png",
		"email-good": "img/mail-good.png",
		"email-bad": "img/mail-bad.png",
		"picture": "img/photo.png",
		"picture-good": "img/photo-good.png",
		"picture-bad": "img/photo-bad.png",
		"video": "img/video.png",
		"video-good": "img/video-good.png",
		"video-bad": "img/video-good.png",
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
	},
	"sounds": {
		"pickUpFile": "sound/pickUpFile.wav",
		"placeFileOnConveyor": "sound/placeFile.wav",
		"shred": "sound/shred.wav",
		"processFile": "sound/processFile.wav",
		"placeFileOut": "sound/placeFileOut.wav",
		"step1": "sound/step1.wav",
		"step2": "sound/step2.wav"
	},
	"fonts": {
	},
	"animations": {
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
		}
	}
};

var game = new Splat.Game(canvas, manifest);

var score = 0;

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

var shredder = new Splat.Entity(776, 541, 108, 60);
shredder.draw = function(context) {
	context.fillStyle = "#665866";
	context.fillRect(this.x, this.y, this.width, this.height);
};

var batchedFiles = [];
var batchedTotes = [];

function generateBatch() {
	for (var i = 0; i < 3; i++) {
		var type = randomElement(fileTypes);
		batchedFiles.push(createFile(type));
		batchedTotes.push(createTote(type+"-good"));
	}
	var type = randomElement(fileTypes);
	var file = createFile(type);
	file.bad = true;
	batchedFiles.push(file);
}

var floorObstacles = [
	new Splat.Entity(0, 0, 108, canvas.height), //left conveyor
	new Splat.Entity(canvas.width - 108, 0, 108, canvas.height), //right conveyor
	new Splat.Entity(243,108,639,60), //top machine
	new Splat.Entity(243,324,639,60), //middle machine
	new Splat.Entity(243, 540, 417, 60), //bottom machine
	new Splat.Entity(774, 540, 108, 60) // shredder
];


var lastClick = [];
//variable that tells whether the player will move toward the last selected point 
var moveByClick = false;


function getNextFile(){
	if (batchedFiles.length === 0) {
		generateBatch();
	}
	return removeRandomElement(batchedFiles);
}

function getNextTote(){
	return removeRandomElement(batchedTotes);
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

function setLastClick() {
	lastClick[0] = game.mouse.x;
	lastClick[1] = game.mouse.y;
	moveByClick = true;
}
function lastClickX() {
	return lastClick[0];
}
function lastClickY() {
	return lastClick[1];
}

function isInside(container, item) {
	return item.x >= container.x
			&& item.x + item.width <= container.x + container.width
			&& item.y >= container.y
			&& item.y + item.height <= container.y + container.height;
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
	conveyor.draw = function(context){
		for (var i = 0; i < this.files.length; i++) {
			this.files[i].draw(context);
		}
	};
	conveyor.move = function(elapsedMillis) {
		for (var i=0; i<this.files.length; i++) {
			var file= this.files[i];
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
			collidesWithAny(file, this.files, function(other) {
				file.resolveCollisionWith(other);
			});
			if (file.y > canvas.height) {
				this.files.splice(i, 1);
				i--;
				score += 10;
				console.log(score);
			}
			if (file.lastX < this.x + this.dropOffWidth && file.x >= this.x + this.dropOffWidth){
				file.type += file.bad ? "-bad" : "-good";
				game.sounds.play("processFile");
			}
		}
	}
	conveyor.horizontal = horizontal;
	conveyor.type = type;
	conveyor.files = [];
	conveyor.dropOffWidth = dropOffWidth;
	conveyor.enclosedWidth = enclosedWidth;

	conveyors.push(conveyor);
}

/**
*	Create a line between two points that the entity moves along 
*@param {@link Entity} myEntity The entity that i being moved
*@param {number} x The ending X-coordinate
*@param {number} y The ending Y-coordinate
*@param {number} s The speed at which the entity moves
**/
function createMovementLine(myEntity, x, y, mySpeed) {
	var startX = myEntity.x;
	var startY = myEntity.y;
	var endX = x - (myEntity.width/2);
	var endY = y - (myEntity.height/2);
	var errMargin = 10;

	/**
	* adjust the velocity of the entity in the x direction
	**/
	if (endX > (startX + errMargin)) {
		myEntity.vx = mySpeed;
	} else if (endX < (startX - errMargin)) {
		myEntity.vx = -mySpeed;
	} else {
		myEntity.vx = 0;
	}

	/**
	* adjust the velocity of the entity in the x direction
	**/
	if(endY > (startY + errMargin)) {
		myEntity.vy = mySpeed;
	} else if (endY < (startY - errMargin)) {
		myEntity.vy = -mySpeed;
	} else {
		myEntity.vy = 0;
	}
}
/**
*	verifies that moving along a given path does not carry a given entity into another entity 
*@param {@link Entity} myEnt The entity that is being moved
*@param {number} elapsedMillis The number of milliseconds since the last frame.
*@param {@link Entity} entArray The Array of potential obstructing Entities
**/
function validateAndMove(myEnt, elapsedMillis, entArray) {
	myEnt.move(elapsedMillis);

	for(var i = 0; i < entArray.length; i++) {
		var thisEnt = entArray[i];
		if (myEnt.collides(thisEnt)) {
			myEnt.resolveCollisionWith(thisEnt);
		}
	}
}
/**
*	sorts Entities by virtual z-axis and draws them in order so that those closer to the viewer are drawn over those further away
*@param {@link external:CanvasRenderingContext2D} context browser native that allows interaction with the canvas
*@param {@link Entity} entities array of drawable entities

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
	var file = new Splat.Entity(0, 0, fileWidth, fileHeight);
	file.draw = function(context) {
		context.drawImage(game.images.get(this.type), this.x, this.y);
	};
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

function addFileToConveyor(file, conveyor, ignoreType) {
	if (!ignoreType && file.type != conveyor.type) {
		return false;
	}
	var x = conveyor.x;
	var y = conveyor.y;
	if (conveyor.horizontal) {
		y += (conveyor.height - file.height) / 2;
	} else {
		x += (conveyor.width - file.width) / 2;
	}
	file.x = x;
	file.y = y;

	if (collidesWithAny(file, conveyor.files)) {
		return false;
	}

	conveyor.files.push(file);
	return true;
}

function randomElement(array) {
	var pos = Math.random() * array.length |0;
	return array[pos];
}

function removeRandomElement(array) {
	var pos = Math.random() * array.length |0;
	return array.splice(pos,1)[0];
}

game.scenes.add("title", new Splat.Scene(canvas, function() {
	// init

	// derive conveyor speed from conveyor animation speed
	conveyorSpeed = 3 / game.animations.get("conveyor-left").frames[0].time;
	makeConveyor(0, 0, 105, canvas.height, false, "in", 0, 0);
	makeConveyor(243, 93, 639, 39, true, "picture", 54, 369);
	makeConveyor(243, 309, 639, 39, true, "video", 102, 276);
	makeConveyor(243, 525, 417, 39, true, "email", 54, 138);
	makeConveyor(canvas.width - 108, 0, 108, canvas.height, false, "out", canvas.height, canvas.height);

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

	this.playerWalk.current = "down";

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

	this.player = new Splat.AnimatedEntity(150, 250, 65, 20, this.playerWalk, -10, -85);
	this.player.frictionX = 0.5;
	this.player.frictionY = 0.5;
	var oldPlayerDraw = this.player.draw;

	this.player.draw = function(context){
		oldPlayerDraw.call(this,context);
		if (this.file && this.sprite.current !== "up"){
			this.file.draw(context);
		}
	}

	this.playerHands = new Splat.Entity(this.player.x, this.player.y, 30, 30);

	var machinePhoto = game.images.get("machine-only-photo");
	var machineVideo = game.images.get("machine-only-video");
	var machineMail = game.images.get("machine-only-mail");
	//var machinePhoto = game.images.get("shredder");
	this.drawables = [
		new Splat.AnimatedEntity(297,30, machinePhoto.width, machinePhoto.height, machinePhoto, 0, 0 ),
		new Splat.AnimatedEntity(345, 153, machineVideo.width, machineVideo.height, machineVideo,0,0),
		new Splat.AnimatedEntity(297, 432, machineMail.width, machineMail.height, machineMail,0,0),
		//new Splat.Entity(777,465,0,0),// add shredder image when its created
		this.player
	];

	this.timers.fileSpawner = new Splat.Timer(undefined, 3000, function() {
		var file = getNextFile();
		if (!addFileToConveyor(file, conveyors[0], true)) {
			batchedFiles.push(file);
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
}, function(elapsedMillis) {
	// simulation

	if (game.mouse.consumePressed(0)) {
		setLastClick();
	}

	var playerSpeed = 0.7;
	if (game.keyboard.isPressed("left") || game.keyboard.isPressed("a")) {
		moveByClick = false;
		this.player.vx = -playerSpeed;
	}
	if (game.keyboard.isPressed("right") || game.keyboard.isPressed("d")) {
		moveByClick = false;
		this.player.vx = playerSpeed;
	}
	if (game.keyboard.isPressed("up") || game.keyboard.isPressed("w")) {
		moveByClick = false;
		this.player.vy = -playerSpeed;
	}
	if (game.keyboard.isPressed("down") || game.keyboard.isPressed("s")) {
		moveByClick = false;
		this.player.vy = playerSpeed;
	}

	if (moveByClick) {
		createMovementLine(this.player, lastClickX(), lastClickY(), playerSpeed);
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
	var currAnim = this.player.sprite.getCurrent();
	this.player.width = currAnim.setWidth;
	this.player.height = currAnim.setHeight;
	this.player.spriteOffsetX = currAnim.setSpriteOffsetX;
	this.player.spriteOffsetY = currAnim.setSpriteOffsetY;
	if (Math.abs(this.player.vx) < animationTolerance && Math.abs(this.player.vy) < animationTolerance) {
		this.playerWalk.reset();
		this.playerCarry.reset();
		this.timers.playStep.stop();
	}
	else {
		this.timers.playStep.start();
	}
	this.player.sprite = this.player.file ? this.playerCarry : this.playerWalk;

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

	// Pick up files
	for (var i = 0; i < conveyors.length; i++) {
		var me = this.player;
		collidesWithAny(this.playerHands, conveyors[i].files, function(other) {
			if (me.file) {
				return;
			}

			if (!canPickupFile(other, conveyors[i])) {
				return;
			}
			var pos = conveyors[i].files.indexOf(other);
			conveyors[i].files.splice(pos, 1);
			me.file = other;
			game.sounds.play("pickUpFile");
		});
	}

	var me = this.player;
	var myHands = this.playerHands;

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
	if (this.player.file
		&& this.playerHands.collides(shredder)
		&& this.player.file.type.indexOf("-bad") > 0) {
			this.player.file = undefined;
			game.sounds.play("shred");
	}

	// player holding file
	if (this.player.file) {
		this.player.file.x = this.player.x + this.player.sprite.getCurrent().carryOffsetX;
		this.player.file.y = this.player.y + this.player.sprite.getCurrent().carryOffsetY;
	}

	game.animations.get("conveyor-left").move(elapsedMillis);
	game.animations.get("conveyor-right").move(elapsedMillis);
}, function(context) {
	// draw
	context.drawImage(game.images.get("bg"), 0, 0);

	game.animations.get("conveyor-left").draw(context, 0, 0);
	var anim = game.animations.get("conveyor-right");
	anim.draw(context, canvas.width - anim.width, 0);

	shredder.draw(context);

	var drawables = this.drawables.slice(0);
	drawables = drawables.concat(conveyors);
	drawEntities(context, drawables);

	context.font= "50px mono";
	context.fillStyle = "#ffffff";
	context.fillText(score, 950, 50);
}));

function centerText(context, text, offsetX, offsetY) {
	var w = context.measureText(text).width;
	var x = offsetX + (canvas.width / 2) - (w / 2) |0;
	var y = offsetY |0;
	context.fillText(text, x, y);
}

game.scenes.switchTo("loading");
