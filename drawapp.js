/* ---------------------------------------------------------------------------*/
/*				   __			 __			   __			 __				  *
 *			      /  /\         /  /\         /  /\         /  /\    		  *
 *			     /  /::\       /  /::\       /  /::\       /  /:/   		  *
 *			    /  /:/\:\     /  /:/\:\     /  /:/\:\     /  /:/_   		  *
 *			   /  /:/  \:\   /  /::\ \:\   /  /::\ \:\   /  /:/ /\ _ 		  *
 *			  /__/:/ \__\:| /__/:/\:\_\:\ /__/:/\:\_\:\ |  |:| /:/ /\		  *
 *			  \  \:\ /  /:/ \__\/~|::\/:/ \__\/  \:\/:/ |  |:|/:/ /:/		  *
 *			   \  \:\  /:/     |  |:|::/       \__\::/   \  \::/_/:/ 		  *
 *			    \  \:\/:/      |  |:|\/        /  /:/     \  \::::/  		  *
 *			     \__\::/       |__|:|~        /__/:/       \__\::/   		  *
 *			         ~~         \__\|         \__\/             		  	  *
 *																			  *
 *     				     - a silly HTML5 app for drawing -			  		  *
/* ---------------------------------------------------------------------------*/

/* ---------------------------------------------------------------------------*/
/*								     INIT   								  */
/* ---------------------------------------------------------------------------*/

// Rather than calling these constantly, lets just save them
var canvas = document.getElementById('canvas'),
	context = canvas.getContext('2d'),
	ghost = document.getElementById('ghost'),
	gcontext = ghost.getContext('2d');

var radius = 1,
	dragging = false,
	redoable = false,
	color = "black",
	mode = 0,
	currShape = '',
	shapeCount = 0;

// Setting the size of the canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ghost.width = window.innerWidth;
ghost.height = window.innerHeight;
// ...and the stroke line
context.lineWidth = radius * 2;
gcontext.lineWidth = context.lineWidth;
// Better make an array for all the objects
var drawn = [],
	undrawn = [];

// Function to recall settings
function recall() {
	context.lineWidth = radius * 2;
	context.strokeStyle = color;
	context.fillStyle = color;
	gcontext.lineWidth = radius * 2;
	gcontext.strokeStyle = color;
	gcontext.fillStyle = color;
}

// Takes care of hindering clearing of the canvas when resizing window
window.onresize = function() {
	//redrawAll();
	var image = context.getImageData(0, 0, canvas.width, canvas.height);
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	context.putImageData(image, 0, 0);
	recall();
}

/* ---------------------------------------------------------------------------*/
/*								     TOOLBAR 								  */
/* ---------------------------------------------------------------------------*/
// Setting the radius function for the radius slider below
var setRadius = function(newRadius) {
	radius = newRadius;
	context.lineWidth = radius * 2;
	gcontext.lineWidth = context.lineWidth;
	$('#radval').html(context.lineWidth);
	$('#radctrl').val(radius);
};
// Now for the radius control
$('#radctrl').mousemove(function() {
	setRadius($('#radctrl').val());
});
$('#radval').mousemove(function() {
	$('#radval').html(context.lineWidth);
});

// Color: Picking a color
$('#swatch').change(function() {
	color = $('#swatch').val();
	context.strokeStyle = color;
	context.fillStyle = color;
	gcontext.strokeStyle = color;
	gcontext.fillStyle = color;
	$('#swatch').css("background-color", color);
});

// Change drawing mode
$(".tool").click(function() {
	mode = $(this).val();
});



/* ---------------------------------------------------------------------------*/
/*								CLEAR AND SAVE 								  */
/* ---------------------------------------------------------------------------*/

// A redraw function for the lot might come in handy
function redrawAll() {
	canvas.width = canvas.width;
	recall();
	for (var i = 0, m = drawn.length; i < m; i++) {
		drawn[i].redraw();
	};
}


function clearCanvas() {
	canvas.width = canvas.width;
	recall();
}

// Clear: A way to clear the canvas
$("#newCanvas").click(function() {
	if (confirm("Are you sure?")) {
		drawn = [];
		undrawn = [];
		clearCanvas();
	}
});

$("#save").click(function saveImage() {

	var saves = [];

	if ($.totalStorage('imgsaves')) {
		saves = $.totalStorage('imgsaves');
	}

	saves.push({
		'name': 'myDrawing',
		'uri': canvas.toDataURL()
	});

	$.totalStorage('imgsaves', saves);

})

var loadImage = function(imguri) {
	clearCanvas();
	var img = new Image();
	img.onload = function() {
		context.drawImage(img, 0, 0); // Or at whatever offset you like
	};
	img.src = imguri;
}

var clearCanvas = function() {
	canvas.width = canvas.width;
	recall();
}

$("#undo").click(function() {
	if (drawn.length > 0) {
		undrawn.push(drawn.pop());
		redrawAll();
		redoable = true;
	} else {
		$('#msg').text("Nothing to undo").fadeIn();
		setTimeout(function() {
			$('#msg').fadeOut(1000);
		}, 2000);		
	}
});
$("#redo").click(function() {
	if (undrawn.length > 0) {
		var temp = undrawn.pop()
		temp.redraw();
		drawn.push(temp);
	} else {
		$('#msg').text("Nothing to redo").fadeIn(1000);
		setTimeout(function() {
			$('#msg').fadeOut(1000);
		}, 2000);
	}

});
/* ---------------------------------------------------------------------------*/
/*								 MOUSE ACTIONS								  */
/* ---------------------------------------------------------------------------*/

$(ghost).mousedown(function(e) {
	dragging = true;
	undrawn = [];
	redoable = false;
	// Following should depend on which mode is selected
	if (mode == 0) {
		currShape = new FreeDraw(e.clientX, e.clientY);
		gcontext.beginPath();
	} else if (mode == 1) {
		currShape = new Line(e.clientX, e.clientY, e.clientX, e.clientY);
	} else if (mode == 2) {
		currShape = new Rect(e.clientX, e.clientY, 0, 0);
	} else if (mode == 3) {
		currShape = new Circle(e.clientX, e.clientY, 0);
	}

});

$(ghost).mouseup(function() {
	dragging = false;
	// Again, depends on modes
	//context.beginPath();
	if (mode < 4) {
		gcontext.closePath();
		drawn.push(currShape);
		currShape.redraw();
		gcontext.clearRect(0, 0, ghost.width, ghost.height);
		currShape = null;
	}

});

// Also depends on modes
$(ghost).mousemove(function(e) {
	if (mode < 4 && dragging) {
		currShape.draw(gcontext, e.clientX, e.clientY);
		if (mode == 0) {
			currShape.path.push([e.clientX, e.clientY]);
		} else {}
	} else if (false) {}
});

/* ---------------------------------------------------------------------------*/
/*							   INITIALIZING VALUES	  						  */
/* ---------------------------------------------------------------------------*/

setRadius(radius);