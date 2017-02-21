/*

TODO:
[ ] Stop using an angle, and just use a vector for both position and rotation
[ ] Stop doing game logic within draw functions
[ ] Garbage collection can be complicated. Be sure you're actually removing projectiles.

*/

var gameState;

var player1;
var player2;

var explosionImage;
var explosions = [];

var panelWidth = window.innerWidth
var panelHeight = 90;

var rotateSpeed = 5;

var
  lastMouseX = 0;
  WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight - panelHeight,
  FPS = 60; // Frames per second

// Debug flags
var
  DISPLAY_HITBOX = false,
  DISPLAY_DEBUG = true;

function preload() {
  lastMouseX = mouseX;
  
  /*
  explosionImage = loadImage("assets/explode.gif",
  function() {},
  function(e) {console.log("Error loading image because: " + e);});
  */
}

function setup() {
  createCanvas(WIDTH, HEIGHT + panelHeight);
  player1 = new Player();
  player2 = new Player();
  
  player1.defaultX = WIDTH / 3;
  player2.defaultX = WIDTH * 2/3;
  
  player1.location.x = player1.defaultX;
  player2.location.x = player2.defaultX;
  
  gameState = new GameState();
  
  explosionImage = loadGif("assets/explode.gif");
  imageMode(CENTER);
  
}

function draw() {
  background(0, 0, 0);
  fill(255, 255, 255);
  //stroke(255, 255, 255);
  stroke(0, 0, 0);
  
  handleInput();
  
  gameState.display();
  
  detectCollisions();
  
  displayDebug();
  
  displayPanel();
  
  displayExplosions();
  
  // Collision detection is gonna be there for now, but will be moved into Player objects later
  //var hit = collideRectRect(player1.location.x - 20, player1.location.y - 20, 40, 40,
    //player2.location.x - 20, player2.location.y - 20, 40, 40);
  //var hit = collideCircleCircle(player1.location.x, player1.location.y, 20, player2.location.x, player2.location.y, 20);
  //if(hit) {
  //  console.log("Collision detected");
  //}
  
}

function displayExplosions() {
  explosions.forEach(function(explosion) {
    explosion.draw();
  });
  if(explosions.length > 0) {
    for(var i = 0; i < explosions.length; i++) {
      if(explosions[i] != null) {
        if(explosions[i].done) {
          //console.log("Culling exlposion animation at frame: " + i);
          explosions.splice(i, 1);
        }
      }
    }
  }
}

function displayPanel() {
  fill(128, 128, 128);
  //color(255, 255, 255);
  //stroke(255, 255, 255);
  rect(0, HEIGHT, panelWidth, panelHeight);
  
  // TODO just make this a function (or not, perfect is the enemy of good...)
  // Display player 1
  //fill(0, 255, 0);
  fill(128, 128, 128);
  stroke(0, 0, 0);
  rect(0, HEIGHT, 150, panelHeight);
  var t = [];
  t.push("Player 1");
  t.push("Score: " + player1.score);
  t.push("Health: " + player1.health);
  t.push("Weapon alignment:");
  fill(0, 255, 0);
  text(t.join("\n"), 10, HEIGHT + 20);

  // Display player 2
  fill(128, 128, 128);
  stroke(0, 0, 0);
  rect(WIDTH - 150, HEIGHT, 150, panelHeight);
  var t = [];
  t.push("Player 2");
  t.push("Score: " + player2.score);
  t.push("Health: " + player2.health);
  t.push("Weapon alignment:");
  fill(0, 0, 255);
  text(t.join("\n"), WIDTH - 150 + 10, HEIGHT + 20);
  
}

function explosionAnimation(x, y) {
  this.x = x;
  this.y = y;
  this.frame = 0;
  //this.explosionImage = loadGif("assets/explode.gif");
  this.done = false;
//  if(explosionImage.loaded()) {
//    this.explosionImage = explosionImage.copy();
//    this.explosionImage.pause();
//  }

  this.draw = function() {
    if(explosionImage.loaded()) {
      //image(this.explosionImage, this.x, this.y, 30, 30);
      //console.log(this.frame + " " + this.explosionImage.totalFrames());
      if(this.frame < explosionImage.totalFrames() - 1) {
        explosionImage.frame(parseInt(this.frame));
        image(explosionImage, this.x, this.y, 30, 30);
        this.frame += 0.33;
      } else {
        //console.log("We're done here");
        this.done = true;
      }
    }
  }
  
  
}

function displayDebug() {
  /*
  
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
  */
  
  if(!DISPLAY_DEBUG) {
    return;
  }
  
  var debugDisplay = [];
  
  //debugDisplay.push("player1 projectiles: " + player1.basicBullets[0].velocity);
  //debugDisplay.push("player2 projectiles: " + player2.basicBullets[0].velocity);
  debugDisplay.push("GameState: " + gameState.state);
  debugDisplay.push("Player1 Location: " + player1.location);
  debugDisplay.push("Player1 Velocity: " + player1.velocity);
  debugDisplay.push("Player2 Location: " + player2.location);
  debugDisplay.push("Player2 Velocity: " + player2.velocity);
  debugDisplay.push(explosions);

  fill(255, 255, 255);
  text(debugDisplay.join("\n"), 10, 10);
  
}

function detectCollisions() {
  // Much room for this to be prettier and more efficient and stuff
  // Detect player1's collision with player2
  //var hit = collideCircleCircle(player1.location.x, player1.location.y, 20, player2.location.x, player2.location.y, 20);
  //if(hit) {
    //console.log("Collision detected");
  //}
  
  // TODO: Remove projectiles more cleanly, and atomically.
  
  // Detect player1's projectile collisions with player2
  // Don't wanna do foreach right now...
  /*
  if(player1.basicBullets.length > 0) {
    for(var i = 0; i < player1.basicBullets.length; i++) {
      var hit = collideCircleCircle(
        player1.basicBullets[i].location.x, player1.basicBullets[i].location.y, 20,
        player2.location.x, player2.location.y, 20
        );
      if(hit) {
        console.log("Hit by: " + player1.basicBullets[i].parent);
        console.log("Removing element " + i + " from " + player1.basicBullets);
        player2.hit(player1.basicBullets[i]);
        player1.basicBullets.splice(i, 1);
      }
    }
  }
  */
  player1.detectCollisions(player2);
  player2.detectCollisions(player1);
  
}

function handleInput() {
  
  // Player 1
  if(keyIsDown(LEFT_ARROW)) {
    player1.angle -= rotateSpeed;
  }
  if(keyIsDown(RIGHT_ARROW)) {
    player1.angle += rotateSpeed;
  }
  if(keyIsDown(UP_ARROW)) {
    player1.thrust();
  }
  if(keyIsDown(DOWN_ARROW)) {
    player1.retro();
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
  if(keyIsDown(83)) {
    player2.retro();
  }
  
  if(keyIsDown(82)) {
    player1.angle = 0;
    player1.velocity.x = 0;
    player1.velocity.y = 0;
    player1.location.x = player1.defaultX;
    player1.location.y = HEIGHT / 2;
    
    player2.angle = 0;
    player2.velocity.x = 0;
    player2.velocity.y = 0;
    player2.location.x = player2.defaultX;
    player2.location.y = HEIGHT / 2;
    //console.log("Reset player angles");
  }
}

function mouseClicked() {
  //console.log("Bullet list:");
  //player1.basicBullets.forEach(function(bullet) {
    //console.log(bullet);
  //});
  //image(explosionImage, mouseX, mouseY);
  //console.log("Dumping relevant game state data:");
  //console.log(player1);
  //console.log(player2)
  
  console.log("Making new explosion at: " + mouseX, mouseY);
  
  explosions.push(new explosionAnimation(mouseX, mouseY));
}

// I'm using this fuction to capture key presses because they are naturally limited by the OS
function keyPressed() {
  if(gameState.state == "play") {
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
  if(gameState.state == "attract") {
    if(keyCode == 49) {
      gameState.setPlayer1Start();
    }
    if(keyCode == 50) {
      gameState.setPlayer2Start();
    }
  }
}

function mouseMoved() {
    if(gameState.state == "play") {
      //console.log(mouseX, lastMouseX);
      if(lastMouseX < mouseX) {
        player1.angle += 10;
      }
      else if(lastMouseX > mouseX) {
        player1.angle -= 10;
      }
    }
      
    lastMouseX = mouseX;
}

function windowResized() {
  return;
  
  WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight - panelHeight,
  resizeCanvas(WIDTH, HEIGHT);
}

function GameState() {
    
    this.state = "attract";
    this.player1Start = false;
    this.player2Start = false;
    
    this.setPlayer1Start = function() {
      console.log("Player 1 ready");
      this.player1Start = true;
      if(this.player2Start && this.player1Start) {
        this.setStatePlay();
      }
    }
    
    this.setPlayer2Start = function() {
      console.log("Player 2 ready");
      this.player2Start = true;
      if(this.player2Start && this.player1Start) {
        this.setStatePlay();
      }
    }
    
    this.setStateAttract = function() {
      this.state = "attract";
      this.player1Start = false;
      this.player2Start = false;
    }
    
    this.setStatePlay = function() {
      this.state = "play";
    }
    
    this.display = function() {
      if(this.state == "play") {
        player1.display();
        player2.display();
      }
      if(this.state == "attract") {
        s = 
        "Players press start to begin\n";
        if(this.player1Start) {
          s = s.concat("Player 1 READY\n");
        } else {
          s = s.concat("Player 1 Press start\n");
        }
        if(this.player2Start) {
          s = s.concat("Player 2 READY\n");
        } else {
          s = s.concat("Player 2 Press start\n");
        }
        
        
        text(s, WIDTH / 2, HEIGHT / 2);
      }
    }
    
}

function Player() {
  this.x = 0;
  this.y = 0;
  this.width = 30;
  this.height = 30;
  this.angle = 0;
  this.velocity = createVector(0, 0).limit(1);
  this.location = createVector(WIDTH / 2, HEIGHT / 2);
  this.basicBullets = [];
  this.health = 100;
  this.defaultX;
  this.defaultY;
  this.collisionCooldown = 0;
  this.score = 0;
  
  this.update = function() {
    
  }
  
  this.display = function() {
    
    if(this.collisionCooldown > 0) {
      this.collisionCooldown--;
    }
    
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
    
    if(DISPLAY_DEBUG) {
      // Display health stats
      //text(this.health, this.location.x, this.location.y);
      s = this.velocity + "\n";
      s = s + this.collisionCooldown + "\n";
      s = s + this.location + "\n";
      text(s, this.location.x, this.location.y);
    }
    
    push();
    
    translate(this.location.x, this.location.y);
    rotate(radians(this.angle));
    
    // TODO make nice sprites or something later
    
    // Differentiate color based on which player we are
    if(this == player1) {
      fill(0, 255, 0);
    } else {
      fill(0, 0, 255);
    }
    ellipse(0, 0, 10, 10);
    
    stroke(255, 0, 0);
    line(0, 0, 10, 0);
    
    pop();
    
    stroke(0, 0, 0);
    fill(255, 255, 255);
    
    this.basicBullets.forEach(function(bullet) {
      bullet.draw();
    });
    
  }
  
  this.detectCollisions = function(otherShip) {
    
    // Detect other ship collisions
    var hit = collideCircleCircle(
      this.location.x, this.location.y, this.width,
      otherShip.location.x, otherShip.location.y, otherShip.width
      );
    if(this.collisionCooldown > 0) {
      hit = false;
    }
    if(hit) {
      // Do collision
      tmpOtherShipVelocity = otherShip.velocity.copy();
      otherShip.velocity.x = this.velocity.x;
      otherShip.velocity.y = this.velocity.y;
      this.velocity.x = tmpOtherShipVelocity.x;
      this.velocity.y = tmpOtherShipVelocity.y;

      otherShip.collisionCooldown = 50;
      this.collisionCooldown = 50;
      
    }
    
    // Detect bullet collisions
    if(this.basicBullets.length > 0) {
      for(var i = 0; i < this.basicBullets.length; i++) {
        var hit = collideCircleCircle(
          this.basicBullets[i].location.x, this.basicBullets[i].location.y, this.basicBullets[i].width,
          otherShip.location.x, otherShip.location.y, this.basicBullets[i].height
          );
        if(hit) {
          otherShip.hit(this.basicBullets[i]);
          this.basicBullets.splice(i, 1);
        }
      }
    }
    
  }
  
  this.hit = function(bullet) {
    // Deduct damage from bullet, but just hard code value for now
    this.health -= bullet.damage;
    if(this.health < 0) {
      this.health = 0;
    }
    
    // Get pushed by torpedo
    var bulletVelocity = bullet.velocity;
    bulletVelocity.div(2);
    
    this.velocity.add(bulletVelocity);
    // Impose a speed limit, for sanity's sake
    // TODO use p5.Vector.limit() instead probably...
    if(this.velocity.mag() > 2) {
      this.velocity.setMag(2);
    }
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
  
  this.retro = function() {
    var v = p5.Vector.fromAngle(radians(this.angle));
    v.div(48);
    if(this.velocity.mag() < -2) {
      this.velocity.setMag(-2);
    }
    this.velocity.sub(v);
  }
}

function BasicBullet(player) {
  this.width = 20;
  this.height = 20;
  this.damage = 12;
  
  // Reference to player that we fired from
  this.parent = player;
  
  this.ttl = 150;
  
  // First, match the player
  this.location = player.location.copy();
  //this.velocity = createVector();
  this.velocity = player.velocity.copy();
  this.angle = player.angle; // This is probably redundant and I can get it from v
  // Then, add onto that
  var v = p5.Vector.fromAngle(radians(player.angle));
  // Just have a zero vector, to make it easier
  //v = createVector();
  
  
  v.mult(3);

  this.velocity.add(v);
  // Have a minimum velocity. If our ship's velocity would make our projectile's velocity
  // too low, then just use the velocity as if the ship were still
  if(this.velocity.mag() < 2) {
    console.log("Adjusted magnitude");
    //this.velocity.setMag(2);
    this.velocity = v.copy();
  }

  this.draw = function() {
    
    // Purge bullet if it has existed too long
    if(--this.ttl < 0) {
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
    
    /*
    ellipse(0, 0, 5);
    stroke(0, 255, 0);
    line(0, 0, this.width, 0);
    line(0, 0, 0, this.height);
    */
    
    // Will probably end up going with this
    stroke(255, 255, 255);
    fill(255, 0, 0);
    ellipse(0, 0, 5);
    
    pop();
    
    if(DISPLAY_DEBUG) {
      console.log(DISPLAY_DEBUG);
      // Show velocity
      text(this.velocity, this.location.x, this.location.y);
    }
    
    //this.velocity.mult(1.05);
        // Impose a speed limit, for sanity's sake
    // TODO use p5.Vector.limit() instead probably...
    //if(this.velocity.mag() > 2) {
      //this.velocity.setMag(2);
    //}
    
  }
}
