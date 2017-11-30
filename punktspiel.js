let player = 1;

function setup() {
	createCanvas(window.innerWidth, window.innerHeight);	
}

function draw() {
	background(255);
	drawGrid();
	fill(0, 255, 255);
	ellipse(Math.round(mouseX / 20) * 20, Math.round(mouseY / 20) * 20, spacing / 4, spacing / 4);
}

let spacing = 20;

function drawGrid() {
	try {
		for(var i = 0; i < height / spacing; i++) {
			line(0, i * spacing + spacing, width, i * spacing + spacing);
		}
		for(var i = 0; i < width / spacing; i++) {
			line(i * spacing + spacing, 0, i * spacing + spacing, height);
		}
		return true;
	} catch(e) {
		console.log(e);
		return false;
	}
}
