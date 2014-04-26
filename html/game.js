var canvas = document.getElementById("canvas");

var manifest = {
	"images": {
		"bg": "img/bg.png"
	},
	"sounds": {
	},
	"fonts": {
	},
	"animations": {
	}
};

var game = new Splat.Game(canvas, manifest);

var player = new Splat.Entity(100, 100, 50, 50);
player.draw = function(context) {
	context.fillStyle = "#ff0000";
	context.fillRect(this.x, this.y, this.width, this.height);
};
player.frictionX = 0.5;
player.frictionY = 0.5;

var conveyors = [];

function resetPosition(entity){
	entity.x = entity.lastX;
	entity.y = entity.lastY;
}

function isInside(container, item){
	return item.x >= container.x
			&& item.x + item.width <= container.x + container.width
			&& item.y >= container.y
			&& item.y + item.height <= container.y + container.height;
}

function collidesWithAny(item, otherItems, collisionHandler) {
	var foundCollision = false;
	for (var i = 0; i < otherItems.length; i++){
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

function makeConveyor(x, y, width, height, horizontal, type) {
	var conveyor = new Splat.Entity(x, y, width, height);
	conveyor.draw = function(context){
		context.strokeStyle = fileColors[type];
		context.strokeRect(this.x, this.y, this.width, this.height);
		for (var i=0; i<this.files.length; i++){
			this.files[i].draw(context);
		}
	};
	conveyor.move = function(elapsedMillis) {
		for (var i=0; i<this.files.length; i++) {
			var file= this.files[i];
			if (this.horizontal) {
				file.vx = .125;
				file.vy = 0;
			}
			else {
				file.vx = 0;
				file.vy = .125;
			}
			file.move(elapsedMillis);
			if (!isInside(this, file)) {
				resetPosition(file);
			}
			collidesWithAny(file, this.files, function(other) {
				file.resolveCollisionWith(other);
			});
		}
	}
	conveyor.horizontal = horizontal;
	conveyor.type = type;
	conveyor.files = [];
	
	conveyors.push(conveyor);
}

var files = [];
var fileWidth = 45;
var fileHeight = 39;

var fileTypes = ["picture","video","email"];
var fileColors = {"picture":"#ff00ff", "video":"#00ff00", "email":"#0000ff"};

function createFileOnConveyor(type, conveyor) {
	var file = new Splat.Entity(0, 0, fileWidth, fileHeight);
	file.draw = function(context) {
		context.fillStyle = fileColors[type];
		context.fillRect(this.x|0, this.y|0, this.width, this.height);
	};
	file.type = type;
	return addFileToConveyor(file, conveyor, true);
}

function addFileToConveyor(file, conveyor, ignoreType) {
	if (!ignoreType && file.type != conveyor.type) {
		return false;
	}
	var x = conveyor.x;
	var y = conveyor.y;
	if (conveyor.horizontal) {
		y += (conveyor.height - fileHeight)/2;
	} else {
		x += (conveyor.width - fileWidth)/2;
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
	var pos = Math.random()*array.length|0;
	return array[pos];
}

game.scenes.add("title", new Splat.Scene(canvas, function() {
	// init
	makeConveyor(0, 0, 105, canvas.height, false, "in");
	makeConveyor(243, 93, 639, 39, true, "picture");
	makeConveyor(225, 240, 650, 100, true, "email");
	makeConveyor(225, 480, 400, 100, true, "video");

	this.timers.fileSpawner = new Splat.Timer(undefined, 3000, function(){
		createFileOnConveyor(randomElement(fileTypes), conveyors[0]);
		this.reset();
		this.start();
	});
	this.timers.fileSpawner.start();
}, function(elapsedMillis) {
	// simulation

	var playerSpeed = 0.7;
	if (game.keyboard.isPressed("left") || game.keyboard.isPressed("a")) {
		player.vx = -playerSpeed;
	}
	if (game.keyboard.isPressed("right") || game.keyboard.isPressed("d")) {
		player.vx = playerSpeed;
	}
	if (game.keyboard.isPressed("up") || game.keyboard.isPressed("w")) {
		player.vy = -playerSpeed;
	}
	if (game.keyboard.isPressed("down") || game.keyboard.isPressed("s")) {
		player.vy = playerSpeed;
	}

	for (var i=0; i < conveyors.length; i++) {
		conveyors[i].move(elapsedMillis);
	}

	player.move(elapsedMillis);

	for (var i = 0; i < conveyors.length; i++) {
		collidesWithAny(player, conveyors[i].files, function(other){
			if (player.file) {
				return;
			}

			var pos = conveyors[i].files.indexOf(other);
			conveyors[i].files.splice(pos,1);
			player.file = other;
		});
	}

	if (player.file) {
		collidesWithAny(player, conveyors, function(other){
			if(addFileToConveyor(player.file, other)) {
				player.file = undefined;
			}
		});
	}

}, function(context) {
	// draw
	context.drawImage(game.images.get("bg"), 0, 0);

	player.draw(context);
	for (var i=0; i < conveyors.length; i++){
		conveyors[i].draw(context);
	}
}));

function centerText(context, text, offsetX, offsetY) {
	var w = context.measureText(text).width;
	var x = offsetX + (canvas.width / 2) - (w / 2) |0;
	var y = offsetY |0;
	context.fillText(text, x, y);
}

game.scenes.switchTo("loading");
