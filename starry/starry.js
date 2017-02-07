/*

TODO:
[ ] Stop using an angle, and just use a vector for both position and rotation
[ ] Stop doing game logic within draw functions

*/

var player;

var
  lastMouseX = 0;
  WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  FPS = 60; // Frames per second

function preload() {
  lastMouseX = mouseX;
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  player = new Player();
}

function draw() {
  background(0, 0, 0);
  
  // Need to figure out degrees issue
  //angleMode(DEGREES);
  var v = p5.Vector.fromAngle(radians(player.angle));
  console.log(v);
  
  push();
  translate(WIDTH / 2, HEIGHT / 2);
  rect(50, 50, 50, 50);
  fill(255, 0, 0);
  stroke(150);
  line(50, 50, 80, 80);
  line(0, 0, v.x*20, v.y*20);
  console.log("X: " + v.x*20);
  pop();
  
  handleInput();

  //player.display();
  
  displayDebug();
  
}

function displayDebug() {
  var debugInfo = 
    "Angle: " + player.angle;
  
  fill(255, 255, 255);
  text(debugInfo, 10, 10);
}

function handleInput() {
  if(keyIsDown(LEFT_ARROW)) {
    player.angle -= 10;
  }
  if(keyIsDown(RIGHT_ARROW)) {
    player.angle += 10;
  }
  if(keyIsDown(UP_ARROW)) {
    //console.log("Thrust");
    player.thrust();
  }
  if(keyIsDown(82)) {
    //console.log("Reset");
    player.angle = 0;
    player.velocity.x = 0;
    player.velocity.y = 0;
    player.location.x = WIDTH / 2;
    player.location.y = HEIGHT / 2;
    console.log("Reset player angle to: " + player.angle);
  }
}

/*
function mouseClicked() {
  console.log("Infodump");
  console.log("Angle: " + player.angle);
}
*/


// Going to handle this with keyIsDown instead, but don't like it being
// in the draw() function, as I can't rely on draw() to be called consistently.
/*
function keyPressed() {
  if(keyCode === ENTER) {
    //console.log("Hey");
    player.angle = PI/3;
  }
  if(keyCode == 37) {
    console.log("Left");
    //player.x--;
    player.angle -= 20;
    
  }
}
*/

function mouseMoved() {
    //console.log(mouseX, lastMouseX);
    if(lastMouseX < mouseX) {
      player.angle += 10;
    }
    else if(lastMouseX > mouseX) {
      player.angle -= 10;
    }
      
    lastMouseX = mouseX;
}

function windowResized() {
  WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  resizeCanvas(WIDTH, HEIGHT);
}

function Player() {
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.velocity = createVector(0, 0).limit(1);
  this.location = createVector(WIDTH / 2, HEIGHT / 2);
  
  this.update = function() {
    
  }
  
  this.display = function() {
    
    this.location.add(this.velocity);
    
    if(this.location.x < 0) {
      this.location.x = WIDTH;
    }
    if(this.location.y < 0) {
      this.location.y = HEIGHT;
    }
    if(this.location.x > WIDTH) {
      this.location.x = 0;
    }
    if(this.location.y > HEIGHT) {
      this.location.y = 0;
    }
    
    /*
    if(this.location.x < 0 || this.location.x > WIDTH || this.location.y < 0 || this.location.y > HEIGHT) {
      //this.velocity.x = 0;
      //this.velocity.y = 0;
      this.location.x = WIDTH / 2;
      this.location.y = HEIGHT / 2;
    }
    */
    
    // Draw the sprite like this: https://p5js.org/reference/#/p5.Vector/fromAngle
    
    push();

    translate(this.location.x, this.location.y);
    rotate(radians(this.angle));

    triangle(this.x, this.y - 15, this.x - 10, this.y + 10, this.x + 10, this.y + 10);
    
    fill(255, 0, 0);
    //angleV = p5.Vector.fromAngle(this.angle);
    line(0, 0, 10, 0);
    
    pop();
  }
  
  this.thrust = function() {
    
    console.log(p5.Vector.fromAngle(radians(this.angle)));
    
    //this.velocity.add(p5.Vector.fromAngle(this.angle));
    
    // Just use clamp() or map() or something. ALSO, don't limit components
    // just limit magnitude
    
    // Also, I think this might be causing the problem...
    /*
    if(this.velocity.x > 2) {
      this.velocity.x = 2;
    }
    if(this.velocity.x < -2) {
      this.velocity.x = -2;
    }
    if(this.velocity.y < -2) {
      this.velocity.y = -2;
    }
    if(this.velocity.y > 2) {
      this.velocity.y = 2;
    }
    */
    
    //console.log("Velocity: " + this.velocity);
    /*
    console.log("Velocity: " + this.velocity);
    this.velocity.rotate(radians(this.angle));
    console.log("Velocity: " + this.velocity);
    */
  }
}