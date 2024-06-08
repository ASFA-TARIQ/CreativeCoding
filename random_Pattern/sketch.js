var grid = 1;
var spacing = 2; // Adjust this value to change the spacing between shapes


function setup() {
  createCanvas(600, 600);
  colorMode(HSB, 100, 200, 50, 50);
}

function draw() {
  background(255);

 for (let x = 0; x < width; x += spacing) {
    for (let y = 0; y < height; y += spacing)  {
      var shape = int(random(0, 4)); // Randomly choose a shape
      
      if (shape === 0) { // Draw a point
        var n = int(random(1, 100));
        var m = random(30, 100);
        strokeWeight(random(8, 12));
        stroke(n, random(30, 100), 100, m);
        point(x * 20, y * 20);
      } else if (shape === 1) { // Draw a triangle
        var n = int(random(1, 200));
        var m = random(30, 100);
        fill(n, random(40, 100), 100, m);
        noStroke();
        triangle(x * 20, y * 20, x * 20 + 20, y * 20, x * 20 + 10, y * 20 + 20);
      } else if (shape === 2) { // Draw a square
        var n = int(random(1, 100));
        var m = random(30, 100);
        fill(n, random(30, 200), 100, m);
        noStroke();
        rect(x * 20, y * 20, 20, 20);
      } else { // Draw a rectangle
        var n = int(random(1, 100));
        var m = random(30, 100);
        fill(n, random(30, 100), 100, m);
        noStroke();
        rect(x * 20, y * 20, 24, 20);
      }
    }
  }
}
