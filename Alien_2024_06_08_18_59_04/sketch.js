let stars = [];

//Fuction setup
function setup() {
  createCanvas(650, 490);
  
  // Generate stars with random positions and initial brightness
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: random(width),
      y: random(height),
      size: random(1, 3),
      brightness: random(255) // Random initial brightness
    });
  }
}

//function draw
function draw() {
  background(0); // Set background color

  // Draw stars
  noStroke();
  for (let star of stars) {
    fill(255, 255, 255, star.brightness); 
    ellipse(star.x, star.y, star.size, star.size);
    
    // Update brightness to create twinkling effect
    star.brightness += random(-5, 5);
    star.brightness = constrain(star.brightness, 50, 255); // Keep brightness within bounds
  }

  // Antennas
  stroke(255); // Antenna color
  strokeWeight(2); // Antenna thickness

  // First antenna (curves downwards to the left)
  noFill();
  beginShape();
  curveVertex(320 - 30 + mouseX / 10, 180 - 140); // Start from the head of the alien
  curveVertex(320 - 30 + mouseX / 10, 180 - 140);
  curveVertex(320 - 40 + mouseX / 10, 180 - 80); // Control point
  curveVertex(320 - 50 + mouseX / 10, 180 - 70); // Control point
  curveVertex(320 - 50 + mouseX / 10, 180 - 70);
  endShape();

  // Second antenna (curves downwards to the right)
  beginShape();
  curveVertex(320 + 30 - mouseX / 10, 180 - 140); // Start from the head of the alien
  curveVertex(320 + 30 - mouseX / 10, 180 - 140);
  curveVertex(320 + 40 - mouseX / 10, 180 - 80); // Control point
  curveVertex(320 + 50 - mouseX / 10, 180 - 70); // Control point
  curveVertex(320 + 50 - mouseX / 10, 180 - 70);
  endShape();

  // Antenna balls
  noStroke();
  fill(255); // Antenna ball color
  ellipse(320 - 30 + mouseX / 10, 180 - 140, 10, 10); // First antenna ball
  ellipse(320 + 30 - mouseX / 10, 180 - 140, 10, 10); // Second antenna ball

  // Head
  fill(45, 197, 244);
  ellipse(320, 170, 160, 160);
  ellipse(320, 190, 140, 130);
  
  // Eyes
  fill(252, 238, 33);
  circle(320 + 30, 180 - 25, 50);
  circle(320 - 30, 180 - 25, 50);
  fill(146, 83, 161);
  circle(320 + 30 - 10 + mouseX / 40, 180 - 25, 15);
  circle(320 - 30 - 10 + mouseX / 40, 180 - 25, 15);

  // Mouth
  fill(0);
  arc(320, 200, 35, 25, 0, PI);

  // Body
  fill(45, 197, 244);
  rect(270, 250, 100, 130, 20);

  // Arms and Hands
  fill(45, 197, 244);

  // Left arm and hand
  push();
  translate(260, 280); // Move to the left side of the body
  rotate(radians(-310)); // Tilt left arm
  ellipse(0, 0, 40, 80); // Left arm
  ellipse(0, 60, 40, 40); // Left hand
  pop();

  // Right arm and hand
  push();
  translate(380, 280); // Move to the right side of the body
  rotate(radians(310)); // Tilt right arm
  ellipse(0, 0, 40, 80); // Right arm
  ellipse(0, 60, 40, 40); // Right hand
  pop();

  // Legs
  fill(45, 197, 244);
  rect(280, 370, 20, 80); // Left leg
  rect(340, 370, 20, 80); // Right leg

  // Feet
  fill(45, 197, 244);
  ellipse(290, 450, 40, 20); // Left foot
  ellipse(350, 450, 40, 20); // Right foot
}
