let carX = 250; // Initial x-coordinate of the car

function setup() {
  createCanvas(500, 400);
}

function draw() {
  background("#3399FF");
  
  //Road
  fill("#000000");
  rect(0,300,500,60);
  
  //road line 1
  fill("#FFFFFF");
  rect(50,325,60,10);
  
  //road line 2
  fill("#FFFFFF");
  rect(150,325,60,10);
  
  //road line 3
  fill("#FFFFFF");
  rect(250,325,60,10);
  
  //road line 4
  fill("#FFFFFF");
  rect(350,325,60,10);
  
  //road line 5
  fill("#FFFFFF");
  rect(450,325,60,10);
  
  
  //Base
  fill("#1B2479");
  rect(80 + carX, 250, 370, 70);
  
  //Roof
  fill("#B5B1A9")
  rect(90 + carX, 320, 350, 6);
  fill("#AEE2FF")
  rect(170 + carX, 200, 140, 50);//Window
  rect(240 + carX, 200, 0, 50);//Window
  fill("#FFFFFF")
  triangle(170 + carX, 200, 110 + carX, 250, 170 + carX, 250);
  triangle(310 + carX, 200, 410 + carX, 250, 310 + carX, 250);
  
  //Wheels
  fill("#000000")
  ellipse(150 + carX, 320, 60, 60);//front
  ellipse(380 + carX, 320, 60, 60);//back
  fill("#B5B1A9")
  ellipse(380 + carX, 320, 30, 30);
  ellipse(150 + carX, 320, 30, 30);
  ellipse(90 + carX, 324, 5, 10);
  
  //Headlight
  fill("#FFDF07") 
  ellipse(80 + carX, 260, 5, 20);
  fill("#FFFFFF")
  rect(440 + carX, 260, 10, 25);
  
  // Update carX based on mouse position
  let targetX = mouseX - 250; // Adjust the initial offset
  carX += (targetX - carX) * 0.1; // Smoothing the movement
}
