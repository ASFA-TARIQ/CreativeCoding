let mic; 
let xCurrentPos = 0; // Variable to track current position that is initially set to 0
let backgroundImage; // Variable to store the background image

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  mic = new p5.AudioIn(); // Make audio in object
  mic.start(); // Start the mic
  
  // Draw background image initially
  image(backgroundImage, 0, 0, windowWidth, windowHeight);
}

function preload() {
  // Load the background image
  backgroundImage = loadImage('Img 1.jpg');
}

function draw() {
  let micLevel = mic.getLevel(); // Get the current microphone level
  
  if (xCurrentPos > width) {
    xCurrentPos = 0; // Reset x position when it exceeds the canvas width
    // Clear the background to avoid overdraw
    clear();
    // Set background image
    image(backgroundImage, 0, 0, windowWidth, windowHeight);
  }
  
  noFill(); // Do not fill shapes (we are drawing lines)
  
  strokeRed = map(micLevel, 0, 1, 0, 255); // Map mic level to a red color intensity (not used in stroke)
  stroke(255); // Set stroke color to white
  
  const yStart = height; // Start y position at the bottom of the canvas
  const yLineHeight = map(micLevel, 0, 0.5, 0, height); // Map mic level to a line height
  const yEnd = yStart - yLineHeight; // Calculate the end y position of the line
  
  // Draw a vertical line based on mic level
  line(xCurrentPos, yStart, xCurrentPos, yEnd);
  
  xCurrentPos = xCurrentPos + 1; // Move to the next x position
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // Redraw background image after resizing
  image(backgroundImage, 0, 0, windowWidth, windowHeight);
}

function mousePressed() {
  // Request fullscreen mode when the canvas is clicked
  let fs = fullscreen();
  fullscreen(!fs);
}

