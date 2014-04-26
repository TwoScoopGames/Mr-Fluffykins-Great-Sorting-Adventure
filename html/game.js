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
		context.strokeStyle = "#00ff00";
		context.strokeRect(this.x, this.y, this.width, this.height);
		for (var i=0; i<this.files.length; i++){
			this.files[i].draw(context);
		}
	};
	conveyor.move = function(elapsedMillis) {
		for (var i=0; i<this.files.length; i++) {
			var file= this.files[i];
			file.vy = .125;
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
var fileHeight = 45;

function addFileToConveyor(type, conveyor) {
	var x = conveyor.x;
	var y = conveyor.y;
	if (conveyor.horizontal) {
		y += (conveyor.height - fileHeight)/2;
	} else {
		x += (conveyor.width - fileWidth)/2;
	}
	var file = new Splat.Entity(x, y, fileWidth, fileHeight);
	if (collidesWithAny(file, conveyor.files)) {
		return false;
	}
	file.draw = function(context) {
		context.fillStyle = "#0000ff";
		context.fillRect(this.x|0, this.y|0, this.width, this.height);
	};
	file.type = type;
	conveyor.files.push(file);
	return true;
}

game.scenes.add("title", new Splat.Scene(canvas, function() {
	// init
	makeConveyor(0, 0, 105, canvas.height, false, "in");
	addFileToConveyor("picture", conveyors[0]);
	this.timers.fileSpawner = new Splat.Timer(undefined, 3000, function(){
		addFileToConveyor("picture", conveyors[0]);
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
	
	for (var i=0; i < conveyors.length; i++){
		conveyors[i].move(elapsedMillis);
	}
	
	player.move(elapsedMillis);
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
