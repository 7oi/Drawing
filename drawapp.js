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
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var radius = 10,
	dragging = false,
	redoable = false,
	color = "black",
	mode = 0,
	currShape = ''
shapeCount = 0;

// Setting the size of the canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// ...and the stroke line
context.lineWidth = radius * 2;

// Better make an array for all the objects
var drawn = [],
	undrawn = [];

// Function to recall settings
function recall() {
	context.lineWidth = radius * 2;
	context.strokeStyle = color;
	context.fillStyle = color;
}

// Takes care of hindering clearing of the canvas when resizing window
window.onresize = function() {
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

function clearCanvas () {
	drawn = [];
	undrawn = [];
	canvas.width = canvas.width;
	recall();
}

// Clear: A way to clear the canvas
$("#newCanvas").click(function() {
	if (confirm("Are you sure?")) {
		clearCanvas();
	}
});

// Save: saving the image
// Something fishy going on here
$("#save").click(function saveImage() {
	var data = canvas.toDataURL();

	var request = new XMLHttpRequest();

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
			var response = request.responseText;
			window.open(response, '_blank', 'location=0, menubar=0');
		}
	}
	request.open('POST', 'save.php', true);
	request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	request.send('img=' + data);

	//window.open(data, '_blank', 'location=0, menubar=0');
});

$("#undo").click(function() {
	if (drawn.length > 0) {
		undrawn.push(drawn.pop());
		redrawAll();
		redoable = true;
	} else {
		console.log("Nothing to undo");
	}
});
$("#redo").click(function() {
	if (undrawn.length > 0) {
		var temp = undrawn.pop()
		temp.redraw();
		drawn.push(temp);
	} else {
		console.log("Nothing to redo");
	}

});
/* ---------------------------------------------------------------------------*/
/*								 MOUSE ACTIONS								  */
/* ---------------------------------------------------------------------------*/

$(canvas).mousedown(function(e) {
	dragging = true;
	undrawn = [];
	redoable = false;
	cleared = false;
	// Following should depend on which mode is selected
	if (mode == 0) {
		currShape = new FreeDraw(e.clientX, e.clientY);
		context.closePath();
		currShape.path.push([e.clientX, e.clientY]);
	} else if (mode == 1) {
		currShape = new Line(e.clientX, e.clientY, 300, 300);
	} else if (mode == 2) {
		currShape = new Rect(e.clientX, e.clientY, 50, 50);
	} else if (mode == 3) {
		currShape = new Circle(e.clientX, e.clientY, 100);
	}
	if (mode < 4)
		context.beginPath();
	currShape.draw(e.clientX, e.clientY);
});

$(canvas).mouseup(function() {
	dragging = false;
	// Again, depends on modes
	context.beginPath();
	if (mode < 4)
		drawn.push(currShape);
	currShape = null;
});

// Also depends on modes
$(canvas).mousemove(function(e) {
	if (mode == 0 && dragging) {
		currShape.draw(e.clientX, e.clientY);
		currShape.path.push([e.clientX, e.clientY]);
	}
});

/* ---------------------------------------------------------------------------*/
/*							   INITIALIZING VALUES	  						  */
/* ---------------------------------------------------------------------------*/
setRadius(radius);