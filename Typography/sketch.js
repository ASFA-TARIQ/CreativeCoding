let defaultFontSize = 32;
let backgroundImage;
var font;

function preload() {
  // Load the background image
  backgroundImage = loadImage('typography image.jpg');
  font = loadFont("CormorantGaramond-Light.ttf"); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);
  textSize(defaultFontSize);
}

function draw() {
  background(backgroundImage);

  // Calculate font size based on mouse position
  let distance = dist(mouseX, mouseY, width / 2, height / 2);
  let fontSize = map(distance, 0, width / 2, defaultFontSize * 0.5, defaultFontSize * 2);

  // Set text properties
  fill(255); // Set a single color for the text (white)
  textSize(fontSize);

  // Draw text
  text('"All our dreams can come true, \nif we have the courage to pursue them." \n\nWalt Disney', width / 2, height / 2);
}
