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
		context.beginPath();
		context.lineWidth = this.lineW;
		context.strokeStyle = this.color;
		context.fillStyle = this.color;
		this.special();
		context.beginPath();
		recall();
	},
	special: function() {
		// Does nothing for the base class
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
	draw: function(ctx, mouseX, mouseY) {
		ctx.clearRect(0, 0, ghost.width, ghost.height);
		this.w = mouseX - this.x;
		this.h = mouseY - this.y;
		ctx.strokeRect(this.x, this.y, this.w, this.h);
	},
	special: function() {
		context.strokeRect(this.x, this.y, this.w, this.h);
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
	draw: function(ctx, mouseX, mouseY) {
		ctx.clearRect(0, 0, ghost.width, ghost.height);
		this.rad = Math.sqrt(Math.pow(this.x - mouseX, 2) + Math.pow(this.y - mouseY, 2));
		ctx.arc(this.x, this.y, this.rad, 0, Math.PI * 2);
		ctx.stroke();
	},
	special: function() {
		context.arc(this.x, this.y, this.rad, 0, Math.PI * 2);
		context.stroke();
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
	draw: function(ctx, mouseX, mouseY) {
		if (dragging) {
			this.endX = mouseX;
			this.endY = mouseY;
		}
		ctx.beginPath();
		//ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x, this.y);
		//ctx.moveTo(this.endX, this.endY);
		ctx.lineTo(this.endX, this.endY);
		ctx.stroke();
		ctx.closePath();
	},
	special: function() {
		this.draw(context);
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
	},
	path: [],
	draw: function(ctx, x, y) {
		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.fill();
	},
	special: function() {
		for (var i = 0, m = this.path.length; i < m; i++) {
			this.draw(context, this.path[i][0], this.path[i][1]);
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