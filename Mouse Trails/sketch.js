//Function setup
function setup() {
  // createCanvas(width, height)
  createCanvas(700, 600);
  noStroke();
  background("#fff");
}

//Function draw
function draw() {
  //For mouse interaction
  let brushDiameter = dist(mouseX, mouseY, pmouseX, pmouseY);
  if (mouseIsPressed) {
    noStroke();
    // Generate random values for red, green, and blue components for fill color
    let randomRedFill = random(255);
    let randomGreenFill = random(255);
    let randomBlueFill = random(255);
    // fill(red, green, blue, alpha) 0 - 255
    fill(randomRedFill, randomGreenFill, randomBlueFill, 128);
    // circle(x, y, diameter)
    circle(mouseX, mouseY, brushDiameter); 
  } else {
    noFill();
    // Generate random values for red, green, and blue components for stroke color
    let randomRedStroke = random(255);
    let randomGreenStroke = random(255);
    let randomBlueStroke = random(255);
    stroke(randomRedStroke, randomGreenStroke, randomBlueStroke); 
    // stroke(red, green, blue) 0 - 255
    circle(mouseX, mouseY, brushDiameter);
  }
}
