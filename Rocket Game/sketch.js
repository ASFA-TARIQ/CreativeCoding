var w, a, s, d, f, g;
var keys = {w: false, a: false, s: false, d: false, f: false, g: false};
var p1, p2;
var items, particles, stars, star;
var playTimer, gameOverTimer, curTime, timeLeft, gameTime, startTime, interval;  // three minutes
var pause = true; gameOver = false; var home = true;
var activity, combos;
var fadeSp = 1;  // speed at which background stars fade/flicker
var maxStarW = 2;   // maximum size for background stars
var mode = 0;
let bgMusic;

// function for adding background music
function preload() {
    bgMusic = loadSound('music.mp3');
}

// CLASSES 
// Player class
var Player = function( player ) {
  this.x = width/2; this.y = height/2;
  this.ox = width/2; this.oy = height/2;  // other player's position
  this.vx = 0; this.vy = 0;  // velocity
  this.ax = 0; this.ay = 1;  // acceleration
  this.w = 35;
  this.lw = 20; this.uw = 20; this.rw = 20;  // width of each balloon

    // Set different colors based on player number
    if (player === 1) {
        this.bodyColor = color(128,0,128); // rocket body color for player 1
    } else if (player === 2) {
        this.bodyColor = color(0, 0, 255); // rocket body color for player 2
    }
 
  this.health = 100;
  this.points = 0;
  this.left = false; this.right = false; this.up = false;
  this.lc = color(255, 0, 0);
  this.rc = color(255, 0, 0);
  this.uc = color(255, 0, 0);
  this.upperBound = this.w - 20;
  this.combo = 1;  // multiplier for combo points
  this.player = player
  
  // Function draw to draw the rocket
  this.drawPlayer = function() {
    stroke(0); strokeWeight(2);
    fill(this.bodyColor);
    ellipse(this.x, this.y-20, this.w, 60);

    fill(this.uc);
    ellipse(this.x, this.y+10, this.uw, this.uw);
    fill(this.lc);
    ellipse(this.x-20, this.y, this.lw, this.lw);
    fill(this.rc);
    ellipse(this.x+20, this.y, this.rw, this.rw);
  }
  
  // Function for when the players moves there rocket
  this.move = function() {
    // Move from input.
    var thrustMin = 10; var thrustDec = 1;
    var thrustMax = 16; var thrustInc = 5;
    var p;
    
    // THRUSTER CONTROLLS
    // Right thruster -- for moving left
    if (this.left) {
      if (this.vx > 0) { this.vx -= 0.5; }
      if (this.up) { this.vy -= 0.5; }
      this.ax -= 1; this.ay -= 1;
      p = new Particle(this.x+40, this.y, random(1, 4), random(1, 4));
      particles.push(p);
      if (this.rw > thrustMin) { this.rw -= thrustDec; }  // for gradual squishing
    } else if (this.vx < 0) {
      this.vx += 0.5; this.ax = 0; this.ay = 1;  
    } else { this.ay = 1; 
      if (this.rw < thrustMax) { this.rw += thrustInc; } }  // for gradual expansion
    
    // Left thruster -- for moving right
    if (this.right) {
      this.ax += 1; this.ay -= 1;
      p = new Particle(this.x-40, this.y, random(-4,-1), random(1, 4));
      particles.push(p);
      if (this.lw > thrustMin) { this.lw -= thrustDec; }  // for gradual squishing
    } else if (this.vx > 0) {
      this.vx -= 0.5; this.ax = 0; this.ay = 1;  
    } else { this.ay = 1; 
      if (this.lw < thrustMax) { this.lw += thrustInc; } }  // for gradual expansion
    
    // Middle thruster -- for moving up
    if (this.up) {
      this.ay -= 1.5;
      p = new Particle(this.x, this.y+20, 0, random(-3, 3), random(1, 4));
      particles.push(p);
      if (this.uw > thrustMin) { this.uw -= thrustDec; }  // for gradual squishing
    } else if (this.vy < 0) {
      this.vy += 0.5; this.ay = 1; 
    } else { this.ay = 1; 
      if (this.uw < thrustMax) { this.uw += thrustInc; } }  // for gradual expansion
    
    // COLLISION
    
    // Near other player.
    var dx = this.ox - this.x;
    var dy = this.oy - this.y;
    if (abs(dx) < 3*this.w/2 && abs(dy) < 3*this.w/2) {  // collided = true; 
      this.vx -= dx*0.3;
      this.vy -= dy*0.3; }
    
    // Check if out of bounds.
    if (this.x > width - this.w/2) {  // off right side!
        this.x = width - this.w/2; 
        this.vx *= -1;  }
    if (this.x < 0 + this.w/2) {  // off left side!
        this.x = 0 + this.w/2; 
        this.vx *= -1; }
    
    if (this.y < this.upperBound) {  // off the top!
        this.y = this.upperBound; 
        this.vy *= -1; }  
    if (this.y > height - this.w/2) {  // don't fall out the bottom!
        this.vx *= 0.8;
        this.vy *= 0.8;
        this.y = height - this.w/2; 
        this.vy *= -1; }

    
    var a,c;
    // Check for items.
    for (var b = 0; b < items.length; b++) {
      var inXBounds = false; var inYBounds = false;
      if (this.x > items[b].x-items[b].w/2-this.w/2 && this.x < items[b].x+items[b].w/2+this.w/2) { 
        inXBounds = true; }
      if (this.y > items[b].y-items[b].w/2-this.w/2 && this.y < items[b].y+items[b].w/2+this.w/2) { 
        inYBounds = true; }
      if (inXBounds && inYBounds) {
        if (items[b].type == 'point') {
          if (this.combo > 1) { 
            c = new Combo(this.combo, this.player); combos.push(c);
            a = new Status('point', items[b].x, items[b].y, str(items[b].p) + " x " + str(this.combo)); activity.push(a); }
          else { a = new Status('point', items[b].x, items[b].y, str(items[b].p)); activity.push(a); }
          this.points += items[b].p * this.combo; 
          this.combo++; this.combo = constrain(this.combo, 0, 10); }
        if (items[b].type == 'owie') { 
          this.combo = 1;  
          this.health += items[b].h; 
          a = new Status('owie', items[b].x, items[b].y, items[b].h);
          activity.push(a);  }
        if (items[b].type == 'boost') { 
          this.health += items[b].h;
          a = new Status('boost', items[b].x, items[b].y, items[b].h);
          activity.push(a);  }
        this.health = constrain(this.health, 0, 100);
        items.splice(b, 1); }
    }
    
    // UPDATE PLAYER POSITION
    this.vx += this.ax;
    this.vx = constrain(this.vx, -15, 15);
    this.vy += this.ay;
    this.vy = constrain(this.vy, -15, 10);
    
    this.x += this.vx;
    this.y += this.vy; 
  }
}

// Varriable particle
var Particle = function( fx, fy, vx, vy ) {
  this.fx = fx; this.fy = fy;
  this.x = fx; this.y = fy;
  this.vy = vy; this.vx = vx;
  this.w = random(5, 15);
  this.alpha = 255;
  
  this.move = function() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 15;
    this.aplha = constrain(this.aplha, 0, 255);
  }
  
  // Function for the fire from the rocket 
  this.drawParticle = function() {
    noStroke();
    this.c = color(255,165,0, this.alpha);
    fill(this.c)
    ellipse(this.x, this.y, this.w, this.w);
  }
  
  // function for drawing stars as the background of the game
  this.drawStar = function() {
    noStroke(); fill(255, this.alpha);
    ellipse(this.x, this.y, this.w, this.w);
  }
  
  // Fuction for stars to fade
  this.fade = function() {
    this.alpha += random(-fadeSp, fadeSp);
    this.alpha = constrain(this.alpha, 0, 200);
  }
}

// variable items
var Item = function() {
  this.x = width/2; this.y = height/2;
  this.vx = 0; this.vy = 0;
  this.w = 50;
  this.lxBound = this.x-this.w/2;
  this.rxBound = this.x+this.w/2;
  this.tyBound = this.y-this.w/2;
  this.byBound = this.y+this.w/2;
  this.r = 255; this.g = 255; this.b = 255; this.alpha = 255;
  this.c = color(this.r, this.g, this.b, this.alpha);
  this.p = 0;
  this.types = ["point", "owie", "boost"];
  this.type = null;
  this.timer = 0;
  
  this.drawItem = function() {
    // Blink if near end time.
    if (this.timer < 51) { 
        this.alpha = 255; // At 0-50 seconds, set alpha to 255.
    } else if (this.timer < 53) { 
        this.alpha = 0;   // At 51-52 seconds, set alpha to 0 (blink off).
    } else if (this.timer < 56) { 
        this.alpha = 255; // At 53-55 seconds, set alpha to 255 (blink on).
    } else if (this.timer < 58) { 
        this.alpha = 0;   // At 56-57 seconds, set alpha to 0 (blink off).
    } else if (this.timer < 60) { 
        this.alpha = 255; // At 58-59 seconds, set alpha to 255 (blink on).
    }
    
    this.c = color(this.r, this.g, this.b, this.alpha);
    fill(this.c); noStroke();
    ellipse(this.x, this.y, this.w, this.w);
  }
}

// Class status
var Status = function( type, x, y, val ) {
  this. x = x; this.y = y;
  this.type = type; this.val = val;
  this.alpha = 255; this.size = 40;
}

// Class combo
// Points a person gains
var Combo = function( combo, player ) {
  this.alpha = 255; this.size = 30;
  this.player = player;
  this.c = combo;
}



// Function setup
function setup() { 
  createCanvas(windowWidth, windowHeight);
  background(0);
  frameRate(90);
  // Play the background music
    bgMusic.loop();
  pause = true; gameOver = false;
  
  stars = [];
  for (var i = 0; i < 100; i++) {
    addBGStar();
  }
  
  homeScreen();
} 

// Fuction for each player
function initPlayers() {
  // Init players.
  p1 = new Player(1);
  p1.x = width/3;
  p1.c = color(255, 180, 0, 255);
  
  p2 = new Player(2);
  p2.x = 2*width/3;
  p2.c = color(0, 180, 255, 255);
  
  p1.ox = p2.x; p1.oy = p2.y;
  p2.ox = p1.x; p2.oy = p1.y;
}

// Function for home screen
function homeScreen() {
  background(72,61,139);
  textSize(28);  
  noStroke(); 
  textStyle(BOLD); 
  fill(255,255,255); 
  textAlign(CENTER);
  
  var s = "WELCOME!\nTap to play\n";
  text(s, width/2, height/2 - 3 * textAscent(s));
  
  s = "DOWN to pause the game";
  textSize(24); 
  textStyle(NORMAL); 
  textAlign(CENTER);
  text(s, width/2, height/2);
  
  s = "Player 1\n← to move LEFT\n↑ to move UP\n→ to move RIGHT"; 
  textAlign(LEFT);
  text(s, width/2-2*textWidth(s)/5, height/2+5+textAscent(s)); 
  
  s = "Player 2\nA to move LEFT\nW to move UP\nD to move RIGHT"; 
  textAlign(RIGHT);
  text(s, width/2+2*textWidth(s)/5, height/2+5+textAscent(s));

}

// Function for game over screen
function gameOverScreen() {
  background(72,61,139);
  textSize(28); 
  noStroke(); 
  blendMode(LIGHTEST); 
  textStyle(BOLD); 
  fill(255,255,255,180); 
  textAlign(CENTER);
  var s = "GAME OVER\n";
  text(s, width/2, height/2 - 4*textAscent(s));
  if (p1.points > p2.points || p2.health === 0) { s = "Player 1 Wins!"; }
  else if (p2.points > p1.points || p1.health === 0) { s = "Player 2 Wins!"; }
  else { s = ""; }
  fill(255,255,255,255);
  text(s, width/2, height/2 - 2*textAscent(s));
  textSize(24); textStyle(NORMAL); fill(255,255,255,180);
  s = "Tap to go back to start";
  text(s, width/2, height/2);
  blendMode(BLEND); textAlign(LEFT); 
}

// Fuction for when the game is paused
function pauseScreen() {
  background(72,61,139);
  textSize(28);  
  noStroke(); 
  blendMode(LIGHTEST); 
  textStyle(BOLD); 
  fill(255,255,255,180); 
  textAlign(CENTER);
  var s = "PAUSED\n";
  text(s, width/2, height/2 - 3*textAscent(s));
  textSize(24); textStyle(NORMAL);
  s = "DOWN to unpause\nUP to go back to restart";
  text(s, width/2, height/2);
  blendMode(BLEND); textAlign(LEFT);  
}

function addItem( x, y, t ) {
  // Create a new item on the screen.
  var boop = new Item();
  boop.x = x; boop.y = y;
  boop.type = boop.types[t];
  
  var c;  // for colour of boop
  if (boop.type == "point") {
    boop.p = round(random(1,10));
    boop.h = 0;
    c = map(boop.p, 1, 10, 150, 255);
    boop.r = 50; boop.g = c; boop.b = 50;
    boop.c = color(boop.r, boop.g, boop.b, boop.alpha);
    boop.w = 80 - 5*boop.p; }
  
  if (boop.type == "boost") {
    boop.p = 0;
    boop.h = round(random(1,10));
    c = map(boop.p, 1, 10, 150, 255);
    boop.r = 50; boop.g = 50; boop.b = c;
    boop.c = color(boop.r, boop.g, boop.b, boop.alpha);
    boop.w = 20; }
  
  if (boop.type == "owie") {
    boop.p = 0;
    boop.h = round(random(-15,-1));
    c = map(boop.h, -10, -1, 255, 150);
    boop.r = c; boop.g = 50; boop.b = 50;
    boop.c = color(boop.r, boop.g, boop.b, boop.alpha);
    boop.w = 20 + 4*abs(boop.h); }
    
  boop.lxBound = boop.x-boop.w/2;
  boop.rxBound = boop.x+boop.w/2;
  boop.tyBound = boop.y-boop.w/2;
  boop.byBound = boop.y+boop.w/2;
  
  items.push(boop);
}

// fuction for time 
function convertSec( s ) {
  var m = floor(s / 60);
  var sec = s % 60;
  return nf(m, 2) + ':' + nf(sec, 2);
}

// Fuction for adding stars in the background
function addBGStar() {
  star = new Particle(0, 0, 0, 0);
  star.x = random(0, width);
  star.y = random(0, height);
  star.w = random(1,maxStarW);
  star.alpha = random(5,195);
  stars.push(star);
}

//function draw
function drawHUD(h1, h2) {
  var hy = 30;
  var hHeight = 30;
  noStroke();
  
  // Set player colors
  var player1Color = color(188,143,143);  // Color for Player 1
  var player2Color = color(60,179,113);  // Color   for Player 2
  
  // Draw backgrounds for player info
  fill(player1Color); 
  ellipse(40, 0, 190);
  fill(player2Color); 
  ellipse(width - 40, 0, 190);
  
  var h1x = 15;  // 'Player 1' text x-position
  var h2x = width - 15;  // 'Player 2' text x-position
  var pText = 22;  // Vertical position of points text
  
  // Draw Player 2 information
  fill(0); 
  textSize(20);
  textAlign(RIGHT);  
  textStyle(BOLD); 
  text("Player 2", h2x, pText);
  
  fill(255); 
  textStyle(NORMAL); 
  text(str(p2.points), h2x, hy + hHeight + 5 + textAscent(str(p2.points)));
  
  // Draw Player 1 information
  fill(0); 
  textAlign(LEFT); 
  textStyle(BOLD); 
  text("Player 1", h1x, pText);
  
  fill(255); 
  textStyle(NORMAL); 
  text(str(p1.points), h1x, hy + hHeight + 5 + textAscent(str(p1.points)));
  
  // Draw the time left in the center
  var t = str(timeLeft); 
  textAlign(CENTER); 
  textStyle(NORMAL); 
  textSize(30); 
  fill(255);
  text(t, width / 2, 10 + textAscent(t));
  
  // Map health values to colors and draw health bars
  var h1c = map(h1, 0, 255,0,0); 
  var h2c = map(h2, 0, 255,0,0);
  
  fill(h1c, 0, 128 - h1 / 2, 150); 
  rect(h1x, hy, h1 * 3, hHeight);
  
  fill(h2c, 0, 128 - h2 / 2, 150); 
  rect(h2x, hy, -1 * (h2 * 3), hHeight);
}


// Function to display points 
function displayPoints( i, x, y, alpha, s ) {
  // When player gets points, display briefly near player (or HUD?).
  var p = i.val;
  textSize(s); 
  textStyle(BOLD); 
  blendMode(NORMAL); 
  noStroke();
  fill(0, 255, 150, i.alpha);
  text(p, x, y);
}

function displayCombo( c, x, y, alpha, s ) {
  // When player gets combo points, display briefly under HUD.
  textSize(s); 
  textStyle(BOLD); 
  blendMode(NORMAL); 
  textAlign(CENTER);
  fill(255, 150, 0, alpha);  stroke(255, 255, 255, alpha/1.3); strokeWeight(3);
  var t = "COMBO +" +  str(c);
  text(t, x, y);
}

// Fuction for displaying lives each player have left
function displayHealth( i, x, y, alpha, s ) {
  // When player gains/loses lealth, display briefly near player (or HUD?).
  var h = i.val;
  var t = i.type;
  if (t == "owie") { fill(255, 0, 255, alpha); }
  if (t == "boost") { fill(0, 150, 255, alpha); }
  textSize(s); 
  textStyle(BOLD); 
  blendMode(NORMAL);  
  noStroke();
  text(str(h), x, y);
}

function draw() { 
  background(10); 
  
  if (floor(random(30)) === 0) { addBGStar(); }
  
  for (var s = 0; s < stars.length; s++) {
    stars[s].fade();
    stars[s].drawStar();
    if (stars[s].alpha < 5) { stars.splice(s, 1); }
  }
  
  if (home && !gameOver) {  // we're at the home screen
    homeScreen();
  }
    
  if (!pause && !gameOver && !home) {  // we're playing the game!
    playTimer+=1.7; //console.log(playTimer);
    curTime = gameTime - floor(playTimer / 100); //console.log(curTime);
    timeLeft = convertSec(curTime);
    
    // Spawn items.
    var spawn = floor(random(100));
    var type;
    if (spawn === 0) {
      // Spawn an item.
      var ix = random(80, width-40);
      var iy = random(80, height-40);
      
      // Check if intersecting players. upperbound, w
      var onP1x = false; var onP1y = false;
      var onP2x = false; var onP2y = false;
      if (ix > p1.x-p1.w && ix < p1.x+p1.w) { onP1x = true; }
      if (ix > p2.x-p2.w && ix < p2.x+p2.w) { onP2x = true; }
      if (iy > p1.y-p1.w && iy < p1.y+p1.w) { onP1y = true; }
      if (iy > p2.y-p2.w && iy < p2.y+p2.w) { onP2y = true; }
      if (onP1x && onP1y) { 
        ix = random(80, width-40);
        iy = random(80, height-40); }
      else if (onP2x && onP2y) { 
        ix = random(80, width-40);
        iy = random(80, height-40); }
          
      var bob = floor(random(10));
      if (bob < 7) {
        type = floor(random(2));
        addItem(ix, iy, type); 
      } else { 
        type = 2;
        addItem(ix, iy, type);
      }
    }
    
    // Update players.
    p1.move(); 
    p2.move();
    p1.ox = p2.x; p1.oy = p2.y;
    p2.ox = p1.x; p2.oy = p1.y;
    
    if (p1.health === 0 || p2.health === 0) { gameOver = true; }
  } 
  
  if (!home) {  // still display players and HUD
    drawHUD(p1.health, p2.health);

    for (var j = 0; j < items.length; j++) {
      if (!pause && items[j].type == "owie" && mode == 1) {
        items[j].vx += random(-0.5, 0.5); constrain(items[j].vx, -1, 1);
        items[j].vy += random(-0.5, 0.5); constrain(items[j].vy, -1, 1);
        items[j].x += items[j].vx; constrain(items[j].x, items[j].w/2, width-items[j].w/2);
        items[j].y += items[j].vy; constrain(items[j].y, items[j].w/2, height-items[j].w/2); }
      items[j].drawItem();
      if (!pause) { items[j].timer++; }
      if (items[j].timer === 490) { items.splice(j, 1); } }

    for (var i = 0; i < particles.length; i ++) {
      // Draw thruster particles.
      if (!pause) { particles[i].move(); }
      particles[i].drawParticle();
      if (particles[i].alpha === 0) { particles.splice(i, 1); } }

    p1.drawPlayer(); p2.drawPlayer();
    if (curTime <= 0) { gameOver = true; pause = true; }
    
    // Display combo points.
    var combo;
    for (var c = 0; c < combos.length; c++) {
      if (combos[c].player == 1) {  
        combos[c].x = 30+textWidth("COMBO! +" + str(combo));
        combos[c].y = 100; }
      if (combos[c].player == 2) { 
        combos[c].x = width-30-textWidth("COMBO! +" + str(combo));
        combos[c].y = 100; }
      displayCombo(combos[c].c, combos[c].x, combos[c].y, combos[c].alpha, combos[c].size);
      if (!pause) { combos[c].alpha -= 3; }  // update when playing
      if (combos[c].alpha < 0) { combos.splice(c, 1); }
    }
    
    // Display point activity.
    for (var a = 0; a < activity.length; a++) {
      if (activity[a].type == 'point') { displayPoints(activity[a], activity[a].x, activity[a].y, activity[a].alpha, activity[a].size); }
      if (activity[a].type == 'owie' || 
          activity[a].type == 'boost') { displayHealth(activity[a], activity[a].x, activity[a].y, activity[a].alpha, activity[a].size); }
      if (!pause) { activity[a].alpha -= 10; activity[a].size--; }  // update when playing
      if (activity[a].alpha < 0) { activity.splice(a, 1); }
    }
  
  }
  
  if (pause && !gameOver && !home) {  
    pauseScreen(); }
  
  if (gameOver && !home) { 
    gameOverTimer++;
    gameOverScreen(); 
  }
}

//Fuction for when user restarts the game
function reset() {
  clear();
  home = true;
  setup();
}

// Function for initializing game
function start() {
  // Init players.
  initPlayers();
  
  particles = []; items = []; combos = []; activity = []; 
  
  gameTime = 60; timeLeft = gameTime;  // seconds
  curTime = 0;
  playTimer = 0; gameOverTimer = 0;
  pause = false;
  home = false;
  gameOver = false;
}


// Fuction for when a key is pressed
function keyPressed() {
  if (gameOver && !home && (gameOverTimer > 60) && 
      (key == 'A' || key == 'W' || key == 'D' || keyCode == LEFT_ARROW || keyCode == UP_ARROW || keyCode == RIGHT_ARROW)) { 
    gameOver = false; 
    reset(); 
  }
  else if (home && !gameOver) { 
    start(); 
  }
  else if (keyCode == UP_ARROW && !gameOver && pause) {  
    gameOver = false; 
    reset(); 
  }
  else if (keyCode == DOWN_ARROW && !gameOver && !home) { 
    pause = !pause; 
  }  // pause the game

  if (keyCode == LEFT_ARROW) { 
    p1.left = true; 
  }
  if (keyCode == UP_ARROW) { 
    p1.up = true; 
  }
  if (keyCode == RIGHT_ARROW) { 
    p1.right = true; 
  }
  
  if (key == 'A') { 
    p2.left = true;
  }
  if (key == 'W') { 
    p2.up = true;  
  }
  if (key == 'D') { 
    p2.right = true; 
  }
}

// fuction when a person releases a key
function keyReleased() {
  if (keyCode == LEFT_ARROW) { 
    p1.left = false;  
  }
  if (keyCode == UP_ARROW) { 
    p1.up = false; 
  }
  if (keyCode == RIGHT_ARROW) { 
    p1.right = false; 
  }
  
  if (key == 'A') { 
    p2.left = false; 
  }
  if (key == 'W') { 
    p2.up = false; 
  }
  if (key == 'D') { 
    p2.right = false; 
  }
}