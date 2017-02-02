var
  WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  FPS = 60; // Frames per second

function preload() {
  
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  
}

function draw() {
  background(0, 0, 0);
}

function keyPressed() {
  if(keyCode === ENTER) {
    console.log("Hey");
  }
}

function windowResized() {
WIDTH = window.innerWidth,
HEIGHT = window.innerHeight,
resizeCanvas(WIDTH, HEIGHT);
}
