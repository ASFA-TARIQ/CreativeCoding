// Global variables
var table;
var data = [];
var labels = [];
let selected = -1;
let selectedAngle = 0;
let graphX, graphY; // graph
let title = "Population by Continent 2024";
let colors = []; // array to store random colors

// Acquiring Data from a CSV file
function preload() {
  table = loadTable("Population.csv", "csv", "header");
}

function setup() {
  createCanvas(600, 400);
  labels = table.getColumn("labels");
  data = table.getColumn("data").map(Number); // Convert data to numbers
  graphX = width / 2 + 50; // Shift graph to the right
  graphY = height / 2 + 20; // Shift graph down to make space for title
  
  // Generate random colors for each data segment
  for (let i = 0; i < data.length; i++) {
    colors.push(color(random(255), random(255), random(255)));
  }
}

// Function draw for background color
function draw() {
  background(255);
  drawTitle();
  drawDonutGraph();
  drawLabels();
}

// Function to display title
function drawTitle() {
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(24); // Set title text size
  text(title, width / 2, 30); // Positioning the title
}

// Function to draw the shape of the data donut
function drawDonutGraph() {
  let start = 0;
  let stop = 0;
  let sum = data.reduce((a, b) => a + b, 0); // Calculate the sum of data
  noFill();
  strokeWeight(50);
  strokeCap(SQUARE);
  
  let angle = atan2(mouseY - graphY, mouseX - graphX);
  angle = angle < 0 ? angle + TWO_PI : angle;
  selected = -1;
  let w = 200;
  let d = dist(mouseX, mouseY, graphX, graphY);
  push();
  translate(graphX, graphY);
  for (let i = 0; i < data.length; i++) {
    start = stop;
    stop = start + map(data[i], 0, sum, 0, TWO_PI);
    stroke(colors[i]);
    let ww = w;
    if (angle > start && angle < stop && d < w / 1.8) {
      if (dist(mouseX, mouseY, graphX, graphY) < w * 0.7) {
        selected = i;
        selectedAngle = start + (stop - start) / 3;
      }
      ww *= 1.1;
    }
    arc(0, 0, ww, ww, start, stop);
  }
  pop();
}

// Function to display a continent's population as user hovers
function drawLabels() {
  if (selected > -1) {
    fill(0);
    textAlign(LEFT, CENTER);
    textSize(16); // Set label text size
    let labelText = `Continent: ${labels[selected]}\nPopulation: ${data[selected]}%`;
    text(labelText, 10, height / 2); // Display labels in a fixed area
  }
}

// Function for mouse press
function mousePressed() {
  selected++;
  selected %= data.length;
}


