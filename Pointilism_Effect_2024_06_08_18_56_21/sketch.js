var img, x, y;
function preload() {
img = loadImage("tree.jpg");
}

function setup() {
createCanvas (400, 400);
background(0);
noStroke();
}
function draw() {
x = random(width);//random place a dot in x position
y = random(height);//randomly place a dot in y position
var c = img.get(x, y);//get the position of the dots in the image
fill(c[0], c[1], c[2], 50);//color depends on the dots ,50 is the transperency value
ellipse (x, y, 30, 30);//shape
}

