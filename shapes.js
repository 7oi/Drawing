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
		this.w = 0;
		this.h = 0;
		this.n = shapeCount;
		shapeCount++;
		this.color = context.strokeStyle;
		this.lineW = context.lineWidth;
	},
	x: 0,
	y: 0,
	w: 0,
	h: 0,
	n: 0,
	color: "",
	lineW: 0,
	draw: function() {
		// Different between shapes
	},
	redraw: function() {
		context.lineWidth = this.lineW;
		context.strokeStyle = this.color;
		context.fillStyle = this.color;
		context.beginPath();
		this.special(context);
		context.closePath();
		recall();
	},
	special: function(ctx) {
		// Does nothing for the base class
	},
	contains: function(mx, my) {
		return (this.x - this.lineW <= mx) && (this.x + this.w + this.lineW >= mx) &&
			(this.y - this.lineW <= my) && (this.y + this.h + this.lineW >= my);
	},
	move: function (newX, newY) {
		gcontext.clearRect(0, 0, ghost.width, ghost.height);
		this.x = newX;
		this.y = newY;
		this.special(gcontext);

	}
});

/* ---------------------------------------------------------------------------*/
/*							    THE RECT OBJECT  							  */
/*						  - the square in the family 						  */
/* ---------------------------------------------------------------------------*/
var Rect = Shape.extend({
	constructor: function(x, y) {
		this.base(x, y);
	},
	draw: function(ctx, mouseX, mouseY) {
		ctx.clearRect(0, 0, ghost.width, ghost.height);
		this.w = mouseX - this.x;
		this.h = mouseY - this.y;
		ctx.strokeRect(this.x, this.y, this.w, this.h);
	},
	special: function(ctx) {
		ctx.strokeRect(this.x, this.y, this.w, this.h);
	}
});

/* ---------------------------------------------------------------------------*/
/*							    THE CIRCLE OBJECT  							  */
/*							 - all round all around 						  */
/* ---------------------------------------------------------------------------*/
var Circle = Shape.extend({
	constructor: function(x, y) {
		this.base(x, y);
		this.rad = 0;
	},
	rad: 0,
	findRad: function (x, y) {
		return Math.sqrt(Math.pow(this.x - x, 2) + Math.pow(this.y - y, 2));
	},
	draw: function(ctx, mouseX, mouseY) {
		ctx.clearRect(0, 0, ghost.width, ghost.height);
		this.rad = this.findRad(mouseX, mouseY);
		ctx.arc(this.x, this.y, this.rad, 0, Math.PI * 2);
		ctx.stroke();
		ctx.beginPath();
	},
	special: function(ctx) {
		ctx.arc(this.x, this.y, this.rad, 0, Math.PI * 2);
		ctx.stroke();
		ctx.beginPath();
	},
	contains: function  (mouseX, mouseY) {
		return this.findRad(mouseX, mouseY) <= this.rad;
	}
});

/* ---------------------------------------------------------------------------*/
/*							    THE LINE OBJECT  							  */
/*								- gone straight 							  */
/* ---------------------------------------------------------------------------*/
var Line = Shape.extend({
	constructor: function(x, y) {
		this.base(x, y);
	},
	draw: function(ctx, mouseX, mouseY) {
		if (dragging) {
			this.w = mouseX - this.x;
			this.h = mouseY - this.y;
		}
		ctx.clearRect(0, 0, ghost.width, ghost.height);
		ctx.beginPath();
		ctx.lineTo(this.x, this.y);
		ctx.lineTo(mouseX, mouseY);
		ctx.stroke();
		ctx.closePath();
	},
	special: function(ctx) {
		ctx.lineTo(this.x, this.y);
		ctx.lineTo(this.x + this.w, this.y + this.h);
		ctx.stroke();
	},
	contains: function (mx, my) {
		return (this.x - this.lineW <= mx) && (this.x + this.w + this.lineW >= mx) &&
			(this.y - this.lineW <= my) && (this.y + this.h + this.lineW >= my);
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
	special: function(ctx) {
		//context.beginPath();
		for (var i = 0, m = this.path.length; i < m; i++) {
			ctx.lineTo(this.path[i][0], this.path[i][1]);
			ctx.moveTo(this.path[i][0], this.path[i][1]);
		}
		ctx.stroke();
		//context.closePath();

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
		this.lineW = h; // Even though it's called lineW, it'll work
		this.h = h;
	},
	font: "",
	txt: "",
	draw: function() {
		this.wrapText(context, this.txt, this.x, this.y, this.w, this.lineW);
	},

	special: function(ctx) {
		ctx.font = this.font;
		this.wrapText(ctx, this.txt, this.x, this.y, this.w, this.lineW);
		recall();
	},

	// Nifty function borrowed from:
	// http://www.html5canvastutorials.com/tutorials/html5-canvas-wrap-text-tutorial/
	wrapText: function(ctx, txt, x, y, w, lineHeight) {
		var words = this.txt.split(' ');
		var line = '';

		for (var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			var metrics = ctx.measureText(testLine);
			var testWidth = metrics.width;
			if (testWidth > w && n > 0) {
				ctx.fillText(line, x, y);
				line = words[n] + ' ';
				y += lineHeight;
				this.h += lineHeight;
			} else {
				line = testLine;
			}
		}
		ctx.fillText(line, x, y);
	},
	contains: function  (mx, my) {
		return (this.x <= mx) && (this.x + this.w >= mx) &&
			(this.y - this.lineW <= my) && (this.y + this.h - this.lineW >= my);
	}
});