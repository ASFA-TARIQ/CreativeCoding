var img, x, y;
function preload() {
img = loadImage("Pointalism effect pic.jpg");
}

function setup() {
createCanvas (300, 430);
background(0);
noStroke();
}

function draw() {
x = random(width);
y = random(height);
var c = img.get(x, y);
fill(c[0], c[1], c[2], 100);
triangle(x, y - 20, x - 20, y + 20, x + 20, y + 20);

}