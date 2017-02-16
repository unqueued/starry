/*

TODO:
[ ] Stop using an angle, and just use a vector for both position and rotation
[ ] Stop doing game logic within draw functions

*/

var player1;
var player2

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
  player1 = new Player();
}

function draw() {
  background(0, 0, 0);
  
  handleInput();

  player1.display();
  
  displayDebug();
  
}

function displayDebug() {
  var debugInfo = 
    "player1.angle:\n" + nfc(radians(player1.angle), 1, 1) + " (" + nfc(player1.angle, 1, 1) +"\xB0)" +
    "\nVelocity: \n" + player1.velocity +
    "\nMagnitude: " + player1.velocity.mag();
  
  fill(255, 255, 255);
  text(debugInfo, 10, 10);
}

function handleInput() {
  if(keyIsDown(LEFT_ARROW)) {
    player1.angle -= 10;
  }
  if(keyIsDown(RIGHT_ARROW)) {
    player1.angle += 10;
  }
  if(keyIsDown(UP_ARROW)) {
    player1.thrust();
  }
  if(keyIsDown(82)) {
    player1.angle = 0;
    player1.velocity.x = 0;
    player1.velocity.y = 0;
    player1.location.x = WIDTH / 2;
    player1.location.y = HEIGHT / 2;
    console.log("Reset player angle to: " + player1.angle);
  }
}

function mouseClicked() {
  console.log("Bullet list:");
  player1.basicBullets.forEach(function(bullet) {
    console.log(bullet);
  });
}

function keyPressed() {
  if(keyCode == 32) {
    console.log("Fired");
    player1.fire();
  }
}

function mouseMoved() {
    //console.log(mouseX, lastMouseX);
    if(lastMouseX < mouseX) {
      player1.angle += 10;
    }
    else if(lastMouseX > mouseX) {
      player1.angle -= 10;
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
  this.basicBullets = [];
  
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
    
    // Draw the sprite like this: https://p5js.org/reference/#/p5.Vector/fromAngle
    
    push();

    translate(this.location.x, this.location.y);
    rotate(radians(this.angle));

    //triangle(this.x, this.y - 15, this.x - 10, this.y + 10, this.x + 10, this.y + 10);
    
    ellipse(0, 0, 10, 10);
    stroke(255, 0, 0);
    line(0, 0, 10, 0);
    
    pop();
    
    this.basicBullets.forEach(function(bullet) {
      bullet.draw();
    });
  }
  
  this.fire = function() {
    //console.log(this.location);
    // New projective inherits velocity from player
    //this.basicBullets.push(new BasicBullet(this.location, this.velocity));
    this.basicBullets.push(new BasicBullet(this));
  }
  
  this.thrust = function() {
    
    var v = p5.Vector.fromAngle(radians(this.angle));
    
    // Slow the acceleration
    //v.setMag(v.mag()/48);
    v.div(48);
    
    /*
    console.log("---");
    console.log(v);
    v.setMag(v.mag()/48);
    console.log(v);
    console.log(v.mag());
    console.log("---");
    */
    
    // Impose a speed limit, for sanity's sake
    // TODO use p5.Vector.limit() instead probably...
    if(this.velocity.mag() > 2) {
      this.velocity.setMag(2);
    }
    
    this.velocity.add(v);
  }
}

function BasicBullet(player) {
  // First, match the player
  this.location = player.location.copy();
  this.velocity = player.velocity.copy();
  // Then, add onto that
  var v = p5.Vector.fromAngle(radians(player.angle));
  v.mult(3);
  this.velocity.add(v);
  //this.velocity.mult(3);
  
  this.draw = function() {
    
    this.location.add(this.velocity);
    push();
    translate(this.location.x, this.location.y);
    ellipse(0, 0, 5);
    pop();
  }
}