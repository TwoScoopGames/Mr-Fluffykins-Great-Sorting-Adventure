var canvas = document.getElementById("canvas");

var manifest = {
	"images": {
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

function isInside(container, item){
	return item.x >= container.x
			&& item.x + item.width <= container.x + container.width
			&& item.y >= container.y
			&& item.y + item.height <= container.y + container.height;
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
	conveyor.move = function(elapsedMillis){
		for (var i=0; i<this.files.length; i++){
			var file= this.files[i];
			file.vy = .125;
			file.move(elapsedMillis);
			if (!isInside(this, file)){
				file.x = file.lastX;
				file.y = file.lastY;
			}
		}
	}
	conveyor.horizontal = horizontal;
	conveyor.type = type;
	conveyor.files = [];
	
	conveyors.push(conveyor);
}

var files = [];

function spawnFile(type){
	var file = new Splat.Entity(10,10,30,30);
	file.draw = function(context) {
		context.fillStyle = "#0000ff";
		context.fillRect(this.x, this.y, this.width, this.height);
	};
	file.type = type;
	conveyors[0].files.push(file);
}

game.scenes.add("title", new Splat.Scene(canvas, function() {
	// init
	makeConveyor(0, 0, 50, canvas.height, false, "in");
	spawnFile("picture");
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

	context.fillStyle = "#7a5230";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "#ffffff";
	context.font = "50px mono";
	centerText(context, "Ludum Dare 29", 0, (canvas.height / 2));

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
