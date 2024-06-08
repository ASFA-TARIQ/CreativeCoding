var img;
function preload() {
img = loadImage("buildings.jpg");
}

function setup () {
createCanvas (400, 200);
background(0);
}

function draw() {
background(0);
image(img, 0, 0);
var v = map(mouseX, 0, width, 0, 5);
filter(BLUR, v);
}