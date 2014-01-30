// We think we made our point, right?
var Point = Base.extend({
	constructor: function(x, y) {
		this.x = x;
		this.y = y;
	},
	x: 0,
	y: 0
});

// Base for all shapes
var Shape = Base.extend({
	constructor: function(x, y) {
		this.x = x;
		this.y = y;
	},
	x: 0,
	y: 0,
	color: context.strokeStyle,
	lineW: context.lineWidth,
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

// Rectangles
var Rect = Shape.extend({
	constructor: function(x, y, w, h) {
		this.base(x, y);
		this.w = w;
		this.h = h;
	},
	w: 10,
	h: 10,
	draw: function() {
		context.strokeRect(this.x, this.y, this.w, this.h);
	},
	move: function(x, y) {

	}
});

// Circles
var Circle = Shape.extend({
	constructor: function  (x, y, rad) {
		this.base(x, y);
		this.rad = rad;
	},
	rad: 0,
	draw: function () {
		// body...
	}
});

// Straight lines
var Line = Shape.extend({
	// TODO: Implement
});

// Freely drawn lines
var FreeDraw = Shape.extend({

});

// Text
var Texts = Shape.extend({
	// TODO: Implement
});