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
		context.arc(this.x, this.y, this.rad, 0, Math.PI * 2);
		context.stroke();
		context.closePath();
	}
});

// Straight lines
var Line = Shape.extend({
	constructor: function  (x, y, endX, endY) {
		this.base(x, y);
		this.endX = endX;
		this.endY = endY;
	},
	endX: 0,
	endY: 0,
	draw: function  () {
		context.beginPath();
		context.lineTo(this.x, this.y);
		context.lineTo(this.endX, this.endY);
		context.stroke();
		context.closePath();
	}
});

// Freely drawn lines
var FreeDraw = Shape.extend({
	constructor: function  (x, y) {
		this.base(x, y);
		path[0] = new Point(x, y);
	},
	path: [],
	draw: function () {
		context.beginPath();
		for (var i = 0, n = path.length; i < n; i++) {
			context.lineTo(path[i].x, path[i].y);
		};
		context.stroke();
		context.closePath();
	},
	putPoint: function(e) {
	if (dragging) {
		context.lineTo(e.clientX, e.clientY);
		context.stroke();
		context.beginPath();
		context.arc(e.clientX, e.clientY, radius, 0, Math.PI * 2);
		context.fill();
		context.beginPath();
		context.moveTo(e.clientX, e.clientY);
	}
}
});

// Text
var Texts = Shape.extend({
	// TODO: Implement
});