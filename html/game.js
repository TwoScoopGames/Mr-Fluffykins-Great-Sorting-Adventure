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

game.scenes.add("title", new Splat.Scene(canvas, function() {
	// init
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

	context.fillStyle = "#93cbcd";
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = "#ffffff";
	context.font = "50px mono";
	centerText(context, "Ludum Dare 29", 0, (canvas.height / 2));

	player.draw(context);
}));

function centerText(context, text, offsetX, offsetY) {
	var w = context.measureText(text).width;
	var x = offsetX + (canvas.width / 2) - (w / 2) |0;
	var y = offsetY |0;
	context.fillText(text, x, y);
}

game.scenes.switchTo("loading");
