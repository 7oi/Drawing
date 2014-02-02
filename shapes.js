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
	draw: function () {
		// Different between shapes
	},
	redraw: function() {
		context.beginPath();
		context.lineWidth = this.lineW;
		context.strokeStyle = this.color;
		context.fillStyle = this.color;
		this.special();
		context.closePath();
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
	},
	contains: function(mx, my) {
		return (this.x <= mx) && (this.x + this.w >= mx) &&
			(this.y <= my) && (this.y + this.h >= my);
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
		ctx.beginPath();
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
		ctx.clearRect(0, 0, ghost.width, ghost.height);
		ctx.beginPath();
		ctx.lineTo(this.x, this.y);
		ctx.lineTo(this.endX, this.endY);
		ctx.stroke();
		ctx.closePath();
	},
	special: function() {
		context.beginPath();
		context.lineTo(this.x, this.y);
		context.lineTo(this.endX, this.endY);
		context.stroke();
		context.closePath();
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
		//ctx.beginPath();
		ctx.lineTo(x, y);
		ctx.moveTo(x, y);
		ctx.stroke();
		//ctx.closePath();
		//ctx.arc(x, y, radius, 0, Math.PI * 2);
		//ctx.beginPath();
		//ctx.moveTo(x, y);
		//ctx.fill();
		//1ctx.closePath();
	},
	special: function() {
		context.beginPath();
		for (var i = 0, m = this.path.length; i < m; i++) {
			context.lineTo(this.path[i][0], this.path[i][1]);
			context.moveTo(this.path[i][0], this.path[i][1]);
		}
		context.stroke();
		context.closePath();

	}
});

/* ---------------------------------------------------------------------------*/
/*							    THE TEXT OBJECT  							  */
/*								  - the nerd 								  */
/* ---------------------------------------------------------------------------*/
var Texts = Shape.extend({
	constructor: function(x, y, txt, w, h) {
		this.base(x, y);
		this.font = context.font;
		this.txt = txt;
		this.w = w;
		this.lineH = h;
		this.h = h;
	},
	font: "",
	txt: "",
	w: 0,
	h: 0,
	lineH: 0,
	draw: function() {
		this.wrapText(this.txt, this.x, this.y, this.w, this.lineH);
	},

	special: function() {
		context.font = this.font;
		this.draw();
		recall();
	},

	// Nifty function borrowed from:
	// http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
	wrapText: function(txt, x, y, w, lineHeight) {
		var words = this.txt.split(' ');
		var line = '';

		for (var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			var metrics = context.measureText(testLine);
			var testWidth = metrics.width;
			if (testWidth > w && n > 0) {
				context.fillText(line, x, y);
				line = words[n] + ' ';
				y += lineHeight;
				this.h += lineHeight;
			} else {
				line = testLine;
			}
		}
		context.fillText(line, x, y);
	},
	contains: function(mx, my) {
		return (this.x <= mx) && (this.x + this.w >= mx) &&
			(this.y <= my) && (this.y + this.h >= my);
	}
});