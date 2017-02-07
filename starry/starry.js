/*

TODO:
Stop using an angle, and just use a vector for both position and rotation

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
  
  handleInput();

  player.display();
}

function handleInput() {
  if(keyIsDown(LEFT_ARROW)) {
    player.angle -= 10;
  }
  if(keyIsDown(RIGHT_ARROW)) {
    player.angle += 10;
  }
  if(keyIsDown(UP_ARROW)) {
    console.log("Thrust");
  }
}


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
    console.log(mouseX, lastMouseX);
    if(lastMouseX < mouseX)
      player.angle += 20;
    else if(lastMouseX > mouseX)
      player.angle -= 20;
      
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
  //this.velocity = createVector(0, 0).limit(5);
  this.velocity = 0;
  
  this.update = function() {
    
  }
  
  this.display = function() {
    push();
    //ellipse(this.x, this.y, 20, 20);
    //rotate(this.angle);
    translate(30, 30);
    rotate(radians(this.angle));
    //translate(30, 30);
    //translate(width/2, height/2);
    triangle(this.x, this.y - 15, this.x - 10, this.y + 10, this.x + 10, this.y + 10);
    //fill(255, 0, 0);
    //rect(this.x, this.y, 10, 10);
    //ellipse(this.x, this.y, 10, 10);
    pop();
  }
}