/*

TODO:
[ ] Stop using an angle, and just use a vector for both position and rotation
[ ] Stop doing game logic within draw functions
[ ] Garbage collection can be complicated. Be sure you're actually removing projectiles.

*/

var player1;
var player2

var
  lastMouseX = 0;
  WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight,
  FPS = 60; // Frames per second

// Debug flags
var
  DISPLAY_HITBOX = true;

function preload() {
  lastMouseX = mouseX;
}

function setup() {
  createCanvas(WIDTH, HEIGHT);
  player1 = new Player();
  player2 = new Player();
}

function draw() {
  background(0, 0, 0);
  
  handleInput();

  player1.display();
  player2.display();
  
  detectCollisions();
  
  displayDebug();
  
  // Collision detection is gonna be there for now, but will be moved into Player objects later
  //var hit = collideRectRect(player1.location.x - 20, player1.location.y - 20, 40, 40,
    //player2.location.x - 20, player2.location.y - 20, 40, 40);
  //var hit = collideCircleCircle(player1.location.x, player1.location.y, 20, player2.location.x, player2.location.y, 20);
  //if(hit) {
  //  console.log("Collision detected");
  //}
  
}

function displayDebug() {
  var debugInfoPlayer1 = 
    "player1.angle:\n" + nfc(radians(player1.angle), 1, 1) + " (" + nfc(player1.angle, 1, 1) +"\xB0)" +
    "\nVelocity: \n" + player1.velocity +
    "\nMagnitude: " + player1.velocity.mag();
  
  debugInfoPlayer1 += 
    "player2.angle:\n" + nfc(radians(player2.angle), 1, 1) + " (" + nfc(player2.angle, 1, 1) +"\xB0)" +
    "\nVelocity: \n" + player2.velocity +
    "\nMagnitude: " + player2.velocity.mag();
  
  fill(255, 255, 255);
  text(debugInfoPlayer1, 10, 10);
  //text(debugInfoPlayer2, 10, 100);
}

function detectCollisions() {
  // Much room for this to be prettier and more efficient and stuff
  // Detect player1's collision with player2
  var hit = collideCircleCircle(player1.location.x, player1.location.y, 20, player2.location.x, player2.location.y, 20);
  if(hit) {
    //console.log("Collision detected");
  }
  
  // TODO: Remove projectiles more cleanly, and atomically.
  
  // Detect player1's projectile collisions with player2
  // Don't wanna do foreach right now...
  if(player1.basicBullets.length > 1) {
    for(var i = 0; i < player1.basicBullets.length; i++) {
        var hit = collideCircleCircle(
          player1.basicBullets[i].location.x, player1.basicBullets[i].location.y, 20,
          player2.location.x, player2.location.y, 20
          );
          if(hit) {
            //console.log("Hit by: " + player1.basicBullets[i].parent);
            //console.log("Removing element " + i + " from " + player1.basicBullets);
            player1.basicBullets.splice(i, 1);
          }
    }
  }
  
}

function handleInput() {
  
  // Player 1
  if(keyIsDown(LEFT_ARROW)) {
    player1.angle -= 10;
  }
  if(keyIsDown(RIGHT_ARROW)) {
    player1.angle += 10;
  }
  if(keyIsDown(UP_ARROW)) {
    player1.thrust();
  }
  
  if(keyIsDown(65)) {
    player2.angle -= 10;
  }
  if(keyIsDown(68)) {
    player2.angle += 10;
  }
  if(keyIsDown(87)) {
    player2.thrust();
  }
  
  if(keyIsDown(82)) {
    player1.angle = 0;
    player1.velocity.x = 0;
    player1.velocity.y = 0;
    player1.location.x = WIDTH / 2;
    player1.location.y = HEIGHT / 2;
    
    player2.angle = 0;
    player2.velocity.x = 0;
    player2.velocity.y = 0;
    player2.location.x = WIDTH / 2;
    player2.location.y = HEIGHT / 2;
    //console.log("Reset player angles");
  }
}

function mouseClicked() {
  //console.log("Bullet list:");
  player1.basicBullets.forEach(function(bullet) {
    //console.log(bullet);
  });
}

// I'm using this fuction to capture key presses because they are naturally limited by the OS
function keyPressed() {
  if(keyCode == 32) {
    player1.fire();
  }
  if(keyCode == 86) {
    player2.fire();
  }
  if(keyCode == 83) {
    player1.velocity.setMag(0);
    player2.velocity.setMag(0);
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
    
    if(DISPLAY_HITBOX) {
      
      // First display hitbox at location without transformations
      fill(255, 0, 0);
      //rect(this.location.x - 20, this.location.y - 20, 40, 40);
      ellipse(this.location.x, this.location.y, 20);
      
      // Then, display hitbox at loaction with transformations
      push();
      
      translate(this.location.x, this.location.y);
      rotate(radians(this.angle));
      
      fill(0, 255, 0);
      //rect(0, 0, 50, 50);
      
      pop();
      
      fill(255, 255, 255);
    }
    
    push();

    translate(this.location.x, this.location.y);
    rotate(radians(this.angle));

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
    
    // Impose a speed limit, for sanity's sake
    // TODO use p5.Vector.limit() instead probably...
    if(this.velocity.mag() > 2) {
      this.velocity.setMag(2);
    }
    
    this.velocity.add(v);
  }
}

function BasicBullet(player) {
  this.width = 30;
  this.height = 30;
  
  // Reference to player that we fired from
  this.parent = player;
  
  this.ttl = 20;
  
  // First, match the player
  this.location = player.location.copy();
  this.velocity = player.velocity.copy();
  this.angle = player.angle; // This is probably redundant and I can get it from v
  // Then, add onto that
  var v = p5.Vector.fromAngle(radians(player.angle));
  v.mult(3);
  this.velocity.add(v);
  
  this.draw = function() {
    
    if(--this.ttl < 0) {
      //console.log(this + " died");
      //console.log("Removing: " + this.parent.basicBullets.indexOf(this));
      this.parent.basicBullets.splice(this.parent.basicBullets.indexOf(this), 1);
    }
    
    this.location.add(this.velocity);
    
    if(DISPLAY_HITBOX) { // To disable it...
      
      // First display hitbox at location without transformations
      fill(255, 0, 0);
      ellipse(this.location.x, this.location.y, this.width, this.height);
      
      // Then, display hitbox at loaction with transformations
      /*
      push();
      
      translate(this.location.x, this.location.y);
      rotate(radians(this.angle));
      
      fill(0, 255, 0);
      rect(0, 0, 30, 30);
      
      pop();
      */
      // Actually, I'm not gonna bother with that for right now.
      
      
      fill(255, 255, 255);
    }
    
    push();
    translate(this.location.x, this.location.y);
    rotate(radians(this.angle));
    ellipse(0, 0, 5);
    stroke(0, 255, 0);
    line(0, 0, 20, 0);
    line(0, 0, 0, 10);
    pop();
    
  }
}