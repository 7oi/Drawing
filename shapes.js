/*--------------------------------------------------------------------------------------*/
/*      ___           ___           ___           ___           ___           ___ 		*
 *     /\  \         /\__\         /\  \         /\  \         /\  \         /\  \    	*
 *    /::\  \       /:/  /        /::\  \       /::\  \       /::\  \       /::\  \   	*
 *   /:/\ \  \     /:/__/        /:/\:\  \     /:/\:\  \     /:/\:\  \     /:/\ \  \  	*
 *  _\:\~\ \  \   /::\  \ ___   /::\~\:\  \   /::\~\:\  \   /::\~\:\  \   _\:\~\ \  \ 	*
 * /\ \:\ \ \__\ /:/\:\  /\__\ /:/\:\ \:\__\ /:/\:\ \:\__\ /:/\:\ \:\__\ /\ \:\ \ \__\	*
 * \:\ \:\ \/__/ \/__\:\/:/  / \/__\:\/:/  / \/__\:\/:/  / \:\~\:\ \/__/ \:\ \:\ \/__/	*
 *  \:\ \:\__\        \::/  /       \::/  /       \::/  /   \:\ \:\__\    \:\ \:\__\  	*
 *   \:\/:/  /        /:/  /        /:/  /         \/__/     \:\ \/__/     \:\/:/  /  	*
 *    \::/  /        /:/  /        /:/  /                     \:\__\        \::/  /   	*
 *     \/__/         \/__/         \/__/                       \/__/         \/__/    	*
 *																						*
 *						- Classes for all them shapley objects -						*
/*--------------------------------------------------------------------------------------*/


/* ---------------------------------------------------------------------------*/
/*							    THE SHAPE OBJECT  							  */
/*								- mother of all 							  */
/* ---------------------------------------------------------------------------*/
var Shape = Base.extend({
	constructor: function(x, y) {
		this.x = x;
		this.y = y;
		this.n = shapeCount;
		shapeCount++;
		this.color = context.strokeStyle;
		this.lineW = context.lineWidth;
	},
	x: 0,
	y: 0,
	n: 0,
	color: "",
	lineW: 0,
	redraw: function() {
		context.closePath();
		context.lineWidth = this.lineW;
		context.strokeStyle = this.color;
		context.fillStyle = this.color;
		dragging = true;
		this.special();
		context.beginPath();
		dragging = false;
		recall();
	},
	special: function () {
		var nothing = 0;
	}
});

/* ---------------------------------------------------------------------------*/
/*							    THE RECT OBJECT  							  */
/*						  - the square in the family 						  */
/* ---------------------------------------------------------------------------*/
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

/* ---------------------------------------------------------------------------*/
/*							    THE CIRCLE OBJECT  							  */
/*							 - all round all around 						  */
/* ---------------------------------------------------------------------------*/
var Circle = Shape.extend({
	constructor: function(x, y, rad) {
		this.base(x, y);
		this.rad = rad;
	},
	rad: 0,
	draw: function() {
		context.arc(this.x, this.y, this.rad, 0, Math.PI * 2);
		context.stroke();
		context.closePath();
	},
	special: function () {
		this.draw();
	}
});

/* ---------------------------------------------------------------------------*/
/*							    THE LINE OBJECT  							  */
/*								- gone straight 							  */
/* ---------------------------------------------------------------------------*/
var Line = Shape.extend({
	constructor: function(x, y, endX, endY) {
		this.base(x, y);
		this.endX = endX;
		this.endY = endY;
	},
	endX: 0,
	endY: 0,
	draw: function() {
		context.beginPath();
		context.lineTo(this.x, this.y);
		context.lineTo(this.endX, this.endY);
		context.stroke();
		context.closePath();
	},
	special: function  () {
		this.draw();
	}
});

/* ---------------------------------------------------------------------------*/
/*							  THE FREEDRAW OBJECT  							  */
/*							 - the carefree hippie							  */
/* ---------------------------------------------------------------------------*/
var FreeDraw = Shape.extend({
	constructor: function(x, y) {
		this.base(x, y);
		path = new Array();
		this.draw(x, y);
	},
	path: [],
	draw: function(x, y) {
		if (dragging) {
			context.lineTo(x, y);
			context.stroke();
			context.beginPath();
			context.arc(x, y, radius, 0, Math.PI * 2);
			context.fill();
			context.beginPath();
			context.moveTo(x, y);
		}
	},
	special: function() {
		for(var i = 0, m = this.path.length; i < m; i++) {
			context.lineTo(this.path[i][0], this.path[i][1]);
			context.stroke();
		}
	}
});

/* ---------------------------------------------------------------------------*/
/*							    THE TEXT OBJECT  							  */
/*								  - the nerd 								  */
/* ---------------------------------------------------------------------------*/
var Texts = Shape.extend({
	// TODO: Implement
});