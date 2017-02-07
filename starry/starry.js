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
  
  player.display();
}

function keyPressed() {
  if(keyCode === ENTER) {
    console.log("Hey");
  }
  if(keyCode == 37) {
    console.log("Left");
    player.x--;
  }
}

function mouseMoved() {
    console.log(mouseX);
}

function windowResized() {
  WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  resizeCanvas(WIDTH, HEIGHT);
}

function Player() {
  this.x = 20;
  this.y = 20;
  this.angle = 0;
  
  this.display = function() {
    push();
    //ellipse(this.x, this.y, 20, 20);
    triangle(this.x, this.y - 20, this.x - 10, this.y, this.x + 10, this.y);
    pop();
  }
}