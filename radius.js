var setRadius = function(newRadius) {
	radius = newRadius;
	context.lineWidth = radius * 2;
}

var defaultRad = 10,
	interval = 1,
	radSpan = document.getElementById('radval'),
	radVal = document.getElementById('radctrl');
	
document.getElementById('radctrl').value = defaultRad;
document.getElementById('radval').innerHTML = defaultRad * 2;

radVal.addEventListener('mouseup', function() {
	setRadius(radVal.value);
});
radVal.addEventListener('mousemove', function() {
	radSpan.innerHTML = radVal.value * 2;
});

setRadius(defaultRad);