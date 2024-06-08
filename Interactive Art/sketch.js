//Declaring Variables
let font;
let liner;
let msg = ["Welcome to", "Bath Spa University"];
let bgMusic; // Declare variable for background music

//Preload Function
function preload() {
  font = loadFont("Lora-VariableFont_wght.ttf");
  bgMusic = loadSound("audio.mp3"); // Load background music
}

let shapes = []; // Array to store interactive shapes
let colors = [
  [255, 0, 0], // Red
  [0, 255, 0], // Green
  [0, 0, 255], // Blue
  [255, 255, 0], // Yellow
  [255, 0, 255], // Magenta
  [0, 255, 255], // Cyan
  [255, 165, 0], // Orange
  [128, 0, 128], // Purple
  [255, 192, 203], // Pink
  
];

function setup() {
  createCanvas(windowWidth, windowHeight);
  // Create a new instance of the lineMaker class
  liner = new lineMaker();
  // Set stroke cap to round for smoother lines
  strokeCap(ROUND);

  // Play background music
  bgMusic.loop();
}

function draw() {
  background(30); // Set background color

  // Display and interact with shapes
  for (let shape of shapes) {
    shape.display();
    shape.interact();
  }

  // Update line animation
  liner.update();
}

//lineMaker Class
function lineMaker() {
  // Properties and methods of the lineMaker class...
  this.msgswitch = 0;
  this.target = [];
  this.dart = [];
  this.moving = [];
  this.lerpvel = [];
  this.size = 14;
  this.count = -2;
  this.close = 0.02;

  // Initialization
  let m = msg[this.msgswitch];
  this.anchor = font.textToPoints(m, 0, 0, 10, {
    sampleFactor: 2,
    simplifyThreshold: 0.0,
  });

  let centertext = 0;
  for (let i = 0; i < this.anchor.length; i++) {
    this.anchor[i].x *= this.size;
    this.anchor[i].y *= this.size;
    if (centertext < this.anchor[i].x) {
      centertext = this.anchor[i].x;
    }
    this.moving.push(0);
  }
  let center = windowWidth / 2 - centertext / 2;

  for (let i = 0; i < this.anchor.length; i++) {
    let setx = this.anchor[i].x + center;
    let sety = this.anchor[i].y + windowHeight / 2;

    // Set initial dart positions
    this.target.push(createVector(setx, sety));
    this.dart.push(createVector(windowWidth / 2, windowHeight));

    // Set initial lerp velocities
    this.lerpvel.push(random(0.1, 0.32));
  }

  // Update method to animate the lines
  this.update = function () {
    this.count += 1;
    let last = this.anchor.length - 1;
    let endDist = dist(
      this.target[last].x,
      this.target[last].y,
      this.dart[last].x,
      this.dart[last].y
    );

    // Check if animation should restart
    if (this.count > this.anchor.length && endDist < this.close) {
      this.count = last;
      this.restart();
    }

    // Move darts and draw lines
    this.moving[this.count] = 1;
    for (let i = 0; i < this.anchor.length; i++) {
      let tarx = this.target[i].x;
      let tary = this.target[i].y;
      this.throw(i, tarx, tary);
    }
  };

  // Throw method to move darts and draw lines
  this.throw = function (i, tarx, tary) {
    let dx = this.dart[i].x;
    let dy = this.dart[i].y;
    let tx = tarx;
    let ty = tary;
    let d = dist(dx, dy, tx, ty);

    // Advance the dart towards the target
    if (d > this.close && this.moving[i]) {
      this.dart[i].x = lerp(this.dart[i].x, this.target[i].x, this.lerpvel[i]);
      this.dart[i].y = lerp(this.dart[i].y, this.target[i].y, this.lerpvel[i]);
    }
    push();
    strokeWeight(3);

    if (i > 0) {
      let distBetween = dist(
        this.dart[i].x,
        this.dart[i].y,
        this.dart[i - 1].x,
        this.dart[i - 1].y
      );

      // Draw connecting lines
      if (distBetween < this.size * 2) {
        // Set the font color
        stroke(255); // White color
        strokeWeight(3);
        if (
          this.moving[this.anchor.length - floor(this.anchor.length / 4)]
        ) {
          if (noise(i * 0.02, frameCount * 0.05) < 0.5) {
            stroke(87, 85, 254); // RGB(87, 85, 254)
            strokeWeight(4);
          }
        }
        line(
          this.dart[i].x,
          this.dart[i].y,
          this.dart[i - 1].x,
          this.dart[i - 1].y
        );
      }

      // Draw circles
      if (distBetween > this.size * 4) {
        fill(87, 85, 254); // RGB(87, 85, 254)
        noStroke();
        strokeWeight(5);
        point(this.dart[i].x, this.dart[i].y);
      }
    }
    pop();
  };

  // Restart method to reset animation for the next message
  this.restart = function () {
    this.target = [];
    this.dart = [];
    this.moving = [];
    this.lerpvel = [];
    this.count = 0;

    this.msgswitch += 1;
    if (this.msgswitch > msg.length - 1) {
      this.msgswitch = 0;
    }
    let m = msg[this.msgswitch];
    this.anchor = font.textToPoints(m, 0, 0, 10, {
      sampleFactor: 2,
      simplifyThreshold: 0.0,
    });
    let centertext = 0;
    for (let i = 0; i < this.anchor.length; i++) {
      this.anchor[i].x *= this.size;
      this.anchor[i].y *= this.size;
      if (centertext < this.anchor[i].x) {
        centertext = this.anchor[i].x;
      }
      this.moving.push(0);
    }
    let center = windowWidth / 2 - centertext / 2;
    for (let i = 0; i < this.anchor.length; i++) {
      let setx = this.anchor[i].x + center;
      let sety = this.anchor[i].y + windowHeight / 2;
      this.target.push(createVector(setx, sety));
      this.dart.push(createVector(windowWidth / 2, windowHeight));
      this.lerpvel.push(random(0.1, 0.32));
    }
  };
}

// Shape class for interactive shapes
class Shape {
  constructor(x, y, size, color, shapeType) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.hover = false;
    this.shapeType = shapeType; // Store the type of shape
  }

  display() {
    if (this.hover) {
      fill(255, 0, 0);
    } else {
      fill(this.color);
    }
    // Draw different shapes based on their types
    if (this.shapeType === "circle") {
      ellipse(this.x, this.y, this.size, this.size);
    } else if (this.shapeType === "rectangle") {
      rectMode(CENTER);
      rect(this.x, this.y, this.size, this.size);
    } else if (this.shapeType === "triangle") {
      let h = this.size * (Math.sqrt(3) / 2);
      triangle(this.x, this.y - h / 2, this.x - this.size / 2, this.y + h / 2, this.x + this.size / 2, this.y + h / 2);
    }
    // You can add more conditions for other shapes
  }

  interact() {
    let d;
    // Calculate hover based on shape type
    if (this.shapeType === "circle") {
      d = dist(this.x, this.y, mouseX, mouseY);
    } else if (this.shapeType === "rectangle") {
      // Calculate distance from mouse to closest point on rectangle
      let closestX = constrain(mouseX, this.x - this.size / 2, this.x + this.size / 2);
      let closestY = constrain(mouseY, this.y - this.size / 2, this.y + this.size / 2);
      d = dist(mouseX, mouseY, closestX, closestY);
    } else if (this.shapeType === "triangle") {
      // Calculate distance from mouse to closest point inside triangle (bounding circle)
      let centerX = this.x;
      let centerY = this.y + (this.size * Math.sqrt(3)) / 6;
      d = dist(mouseX, mouseY, centerX, centerY);
    }
    if (d < this.size / 2) {
      this.hover = true;
    } else {
      this.hover = false;
    }
  }
}


// Mouse pressed function to add new shapes
function mousePressed() {
  let randomColor = colors[Math.floor(random(colors.length))];
  let randomShape = random(["circle", "rectangle", "triangle"]); // Choose randomly between circle, rectangle, and triangle
  let newShape = new Shape(mouseX, mouseY, random(20, 50), randomColor, randomShape);
  shapes.push(newShape);
}
