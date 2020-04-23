function lerp(start, end, amt) {
	return start * (1 - amt) + amt * end;
}

// we use this to keep the ship on the screen
function clamp(val, min, max) {
	return val < min ? min : (val > max ? max : val);
}

// bounding box collision detection - it compares PIXI.Rectangles
function rectsIntersect(a, b) {
	var ab = a.getBounds();
	var bb = b.getBounds();
	return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
}

// these 2 helpers are used by classes.js
function getRandomUnitVector() {
	let x = getRandom(-1, 1);
	let y = getRandom(-1, 1);
	let length = Math.sqrt(x * x + y * y);
	if (length == 0) { // very unlikely
		x = 1; // point right
		y = 0;
		length = 1;
	} else {
		x /= length;
		y /= length;
	}

	return {
		x: x,
		y: y
	};
}

function getRandom(min, max) {
	return Math.random() * (max - min) + min;
}

function magnitude(x, y) {
	return Math.sqrt(x * x, y * y);
}

// Function to keep increasing the time
function increaseTimeBy(value) {
	time += value;
	let t = time.toFixed(2);
	timeLabel.text = `Time ${t}`;
}

function roundToPointFive(value) {
	return Math.round(value * 2) / 2;
}

function roundToTwoDP(value) {
	return Math.round(value * 100) / 100;
}