// Rather than calling these constantly, lets just save them
var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

// Some initialitation
var radius = 10,
	dragging = false
	color = "black";
// Setting the size of the canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// ...and the stroke line
context.lineWidth = radius * 2;

// Better make an array for all the objects
var drawn = [];

// Keeps the settings
// context.restore() and .save() instead?!?
function recall () {
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

// -------------- Controls -----------------
// Setting the radius function for the radius slider below
var setRadius = function(newRadius) {
	radius = newRadius;
	context.lineWidth = radius * 2;
	$('#radval').html(context.lineWidth);
	$('#radctrl').val(radius);
};
// Now for the radius control
$('#radctrl').mouseup(function() {
	setRadius($('#radctrl').val());
});
$('#radval').mousemove(function() {
	$('#radval').html($('#radctrl').val() * 2);
});

// Color: Picking a color
$('#swatch').change(function() {
	color = $('#swatch').val();
	context.strokeStyle = color;
	context.fillStyle = color;
	$('#swatch').css("background-color", color);
});

// Clear: A way to clear the canvas
$("#clear").click(function() {
	canvas.width = canvas.width;
	recall();
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


// Should be a function within freedraw shape
var putPoint = function(e) {
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

// ------------------ Mouse --------------------

$(canvas).mousedown(function(e) {
	dragging = true;
	// Following should depend on which mode is selected
	putPoint(e);
});

$(canvas).mouseup(function() {
	dragging = false;
	// Again, depends on modes
	context.beginPath();
});

// Also depends on modes
$(canvas).mousemove(putPoint);

// ------------------- Initializing values ----------------
setRadius(radius);
$('#swatch').css("background-color", color);
