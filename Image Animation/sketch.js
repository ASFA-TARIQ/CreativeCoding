
var numFrames = 14
var frame = 0
var images = new Array(numFrames);
var bg;

function preload() {
    bg = loadImage("scenery.jpg"); 
    images[0] = loadImage("butterfly 1.png");
    images[1] = loadImage("butterfly 2.png");
    images[2] = loadImage("butterfly 3.png");
    images[3] = loadImage("butterfly 4.png");
    images[4] = loadImage("butterfly 5.png");
    images[5] = loadImage("butterfly 6.png");
    images[6] = loadImage("butterfly 7.png");
    images[7] = loadImage("butterfly 8.png");
    images[8] = loadImage("butterfly 9.png");
    images[9] = loadImage("butterfly 10.png");
    images[10] = loadImage("butterfly 11.png");
    images[11] = loadImage("butterfly 12.png");
    images[12] = loadImage("butterfly 13.png");
    images[13] = loadImage("butterfly 14.png");

}

function setup() {
  createCanvas(600, 400);
  frameRate(15);
  background(255);
}

function draw() {

  background(bg);
  frame++;
  if (frame == numFrames) frame = 0;
  image(images[frame], mouseX - 75, mouseY - 100);
}




