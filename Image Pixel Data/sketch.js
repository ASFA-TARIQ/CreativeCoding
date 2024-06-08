var img, x, y;
function preload() {
img = loadImage("img 2.jpg");
}

function setup() {
createCanvas (500, 350);
background(0);
noStroke();
}

function draw() {
background(0);
x = mouseX;
y = mouseY;
image( img, 0, 0);
var c = get(x, y);
fill(c);
rectMode(CENTER); 
rect(x, y, 30, 30);

  
}