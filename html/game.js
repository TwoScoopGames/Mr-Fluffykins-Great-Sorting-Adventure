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

var hotspots = [];

function makeHotspot(x, y, type) {
	var hotspot = new Splat.Entity(x, y, 50, 30);
	hotspots.push(hotspot);
	hotspot.draw = function(context){
		context.strokeStyle = "#00ff00";
		context.strokeRect(this.x, this.y, this.width, this.height);
	}
}

game.scenes.add("title", new Splat.Scene(canvas, function() {
	// init
	makeHotspot(300,300, "type1in");
	makeHotspot(300,400, "type1out");
	makeHotspot(400,300, "type2in");
	makeHotspot(400,400, "type2out");
	makeHotspot(500,300, "type3in");
	makeHotspot(500,400, "type3out");
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

	player.move(elapsedMillis);
}, function(context) {
	// draw

	context.fillStyle = "#7a5230";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "#ffffff";
	context.font = "50px mono";
	centerText(context, "Ludum Dare 29", 0, (canvas.height / 2));

	player.draw(context);
	for (var i=0; i<hotspots.length; i++){
		hotspots[i].draw(context);
	}
}));

function centerText(context, text, offsetX, offsetY) {
	var w = context.measureText(text).width;
	var x = offsetX + (canvas.width / 2) - (w / 2) |0;
	var y = offsetY |0;
	context.fillText(text, x, y);
}

game.scenes.switchTo("loading");
