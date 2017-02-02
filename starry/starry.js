var player;

var
  WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  FPS = 60; // Frames per second

function preload() {
  
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

function windowResized() {
  WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  resizeCanvas(WIDTH, HEIGHT);
}

function Player() {
  this.x = 200;
  this.y = 200;
  
  this.display = function() {
    
    ellipse(this.x, this.y, 20, 20);
  }
}