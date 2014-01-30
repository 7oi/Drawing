var Point = Base.extend({
	constructor: function(x, y) {
		this.x = x;
		this.y = y;
	},
	x: 0,
	y: 0
});

var Shape = Base.extend({
	constructor: function(x, y, color, lineW) {
		this.x = x;
		this.y = y;
		this.color = color;
		this.lineW = lineW;
	},
	x: 0,
	y: 0,
	color: "",
	lineW: 1,
/*	path: [],
	draw: function() {
		for (var i = 0, n = path.length; i < n; i++) {

		};
	},*/
	move: function(x, y) {
		/*
		// Find offset
		val movX = x - this.x,
			movY = y - this.y;
		// Move all points
		for (var i = 0, n = path.length; i < n; i++) {
			path[i].x += movX;
			path[i].y += movY;
		};*/

		// Reset shape's x and y
		this.x = x;
		this.y = y;
	}

});

var Rect = Shape.extend({
	constructor: function(x, y, w, h, color, lineW) {
		this.base(x, y, color, lineW);
		this.w = w;
		this.h = h;
	},
	w: 0,
	h: 0,
	draw: function() {
		context.strokeRect(x, y, w, h);
	},
	move: function(x, y) {

	}
});

var Circle = Shape.extend({
	// TODO: Implement
});

var Line = Shape.extend({
	// TODO: Implement
});

var Texts = Shape.extend({
	// TODO: Implement
});