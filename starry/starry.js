/*

TODO:
[ ] Stop using an angle, and just use a vector for both position and rotation
[ ] Stop doing game logic within draw functions
[ ] Garbage collection can be complicated. Be sure you're actually removing projectiles.
[ ] For the asynchronous stuff (like waiting between the gameover and continue states, maybe use callbacks)
May also want to use callbacks for other stuff, as well.
I think this would be much better if it were async more.
Some more stuff --
Also, use setTimeout() function.
MAke it easier to reset Players
Try to do nearly everythign with getter/setters.
This should alleviate some of the issues with the code becoming speghetti.
https://forum.processing.org/two/discussion/14798/how-to-split-a-p5-js-sketch-into-multiple-files
https://www.youtube.com/watch?v=Yk18ZKvXBj4
https://github.com/processing/p5.js/wiki/p5.js,-node.js,-socket.io
http://ability.nyu.edu/p5.js-speech/
https://forum.processing.org/two/discussion/9707/creating-threads-in-processing
http://javascript.info/tutorial/settimeout-setinterval
[x] Implement turboboost
[x] Implement sheilds for both players
[x] Implement health bars
[ ] Straifing
[ ] Make bigger
[x] Maybe have background
[ ] Scale entire thing up
[ ] Remove bottom rectangels
[ ] Fix text in other text screens

*/

var gameState;

var player1;
var player2;

var explosionImage;
var explosions = [];

var panelWidth = window.innerWidth
var panelHeight = 90;

var rotateSpeed = 5;

var totalHealth = 100;

var backgroundImage;

var
  lastMouseX = 0;
  WIDTH = window.innerWidth,
  HEIGHT = window.innerHeight - panelHeight,
  FPS = 60; // Frames per second

// Debug flags
var
  DISPLAY_HITBOX = false,
  DISPLAY_DEBUG = false;

function preload() {
  lastMouseX = mouseX;
}

function setup() {
  createCanvas(WIDTH, HEIGHT + panelHeight);
  player1 = new Player();
  player2 = new Player();

  player1.defaultLocation.x = WIDTH / 3;
  player1.defaultLocation.y = HEIGHT / 2;

  player2.defaultLocation.x = WIDTH * 2/3;
  player2.defaultLocation.y = HEIGHT / 2;

  // Put this inside the ship class
  player1.resetLocation();
  player2.resetLocation();
  
  gameState = new GameState();
  
  explosionImage = loadGif("https://raw.githubusercontent.com/unqueued/starry/master/starry/assets/explode.gif");
  //explosionImage = loadGif("assets/explode.gif");
  imageMode(CENTER);
  
  //backgroundImage = loadImage("assets/nebula1.jpg",
  backgroundImage = loadImage("https://raw.githubusercontent.com/unqueued/starry/master/starry/assets/nebula1.jpg",
  function() {console.log("succeeded in loading");},
  function(e) {console.log("Failed to load because: "+e); } );

}

function draw() {
  background(0, 0, 0);
  fill(255, 255, 255);
  stroke(0, 0, 0);

  imageMode(CORNER);
  image(backgroundImage, 0, 0, WIDTH, HEIGHT + panelHeight);
  imageMode(CENTER);
  
  handleInput();
  
  gameState.display();
    
  displayDebug();
  
  displayPanel();
  
  displayExplosions();

}

function displayExplosions() {
  explosions.forEach(function(explosion) {
    explosion.draw();
  });
  if(explosions.length > 0) {
    for(var i = 0; i < explosions.length; i++) {
      if(explosions[i] != null) {
        if(explosions[i].done) {
          explosions.splice(i, 1);
        }
      }
    }
  }
}

function displayPanel() {
  var playerPanelWidth = 400; //250;
  var playerPanelMarginX = 10;
  var playerPanelMarginY = 20;

  fill(128, 128, 128);
  //rect(0, HEIGHT, panelWidth, panelHeight);
  
  // TODO just make this a function (or not, perfect is the enemy of good...)
  
  // Display player 1
  fill(128, 128, 128);
  stroke(0, 0, 0);
  //rect(0, HEIGHT, playerPanelWidth, panelHeight);
  var t = [];
  t.push("Player 1");
  t.push("Score: " + player1.score);
  fill(238, 154, 0);
  textSize(20);
  text(t.join("\n"), playerPanelMarginX, HEIGHT + playerPanelMarginY);
  // Sheild
  //arc(140, HEIGHT + 40, 60, 60, 0, /*PI+QUARTER_PI*/ map(player1.power, 0, 100, 0, 2*PI), PIE);
  //text(player1.sheildMessage, playerPanelWidth - 270, HEIGHT + playerPanelMarginY);
  textSize(15);
  text(player1.sheildMessage,
    (playerPanelWidth / 100) * 25,
    HEIGHT + playerPanelMarginY
    );
  fill(255);
  rect(
    (playerPanelWidth / 100) * 25,
    HEIGHT + 40,
    (playerPanelWidth / 100) * 30,
    30
    );
  fill(238, 154, 0);
  rect(
    (playerPanelWidth / 100) * 25,
    HEIGHT + 40,
    map(player1.power, 0, 100, 0, (playerPanelWidth / 100) * 30),
    30
    );
  fill(255);
  /*
  rect(
    (playerPanelWidth / 100) * 30,
    HEIGHT + playerPanelMarginY+15,
    map(player1.power, 0, 100, 0, 70),
    20
    );
*/
  textSize(12);
  fill(238, 154, 0);
  // Boost
  textSize(15);
  text(
    "Boost status: " + player1.boostMessage + " " + player1.boostPower + "%",
    //playerPanelWidth - 140,
    playerPanelWidth - (playerPanelWidth / 100) * 35,
    HEIGHT + playerPanelMarginY
  );
  fill(255);
  rect(
    playerPanelWidth - (playerPanelWidth / 100) * 35,
    HEIGHT + 40,
    (playerPanelWidth / 100) * 30,
    30
    );
  fill(238, 154, 0);
  rect(
    playerPanelWidth - (playerPanelWidth / 100) * 35,
    HEIGHT + 40,
    map(player1.boostPower, 0, 100, 0, (playerPanelWidth / 100) * 30),
    30
    );
  /*
  rect(
    playerPanelWidth - 140, HEIGHT + playerPanelMarginY+15, map(player1.boostPower, 0, 100, 0, 70), 20
    );
  rect(playerPanelWidth - 270, HEIGHT + playerPanelMarginY+15, map(player1.power, 0, 100, 0, 70), 20);
  */
  //fill(238, 154, 0);
  fill(255);
  textSize(12);
  fill(255);

  // Display player 2
  fill(128, 128, 128);
  stroke(0, 0, 0);
  //rect(WIDTH - playerPanelWidth, HEIGHT, playerPanelWidth, panelHeight);
  var t = [];
  t.push("Player 2");
  t.push("Score: " + player2.score);
  fill(255, 0, 191);
  textSize(20);
  text(t.join("\n"), (WIDTH - playerPanelWidth) + playerPanelMarginX, HEIGHT + playerPanelMarginY);
  // Sheild
  //arc(140, HEIGHT + 40, 60, 60, 0, /*PI+QUARTER_PI*/ map(player1.power, 0, 100, 0, 2*PI), PIE);
  //text(player1.sheildMessage, playerPanelWidth - 270, HEIGHT + playerPanelMarginY);
  textSize(15);
  text(player1.sheildMessage,
    (WIDTH - playerPanelWidth) + (playerPanelWidth / 100) * 25,
    HEIGHT + playerPanelMarginY
    );
  fill(255);
  rect(
    (WIDTH - playerPanelWidth) + (playerPanelWidth / 100) * 25,
    HEIGHT + 40,
    (playerPanelWidth / 100) * 30,
    30
    );
  fill(255, 0, 191);
  rect(
    (WIDTH - playerPanelWidth) + (playerPanelWidth / 100) * 25,
    HEIGHT + 40,
    map(player2.power, 0, 100, 0, (playerPanelWidth / 100) * 30),
    30
    );

  // Boost
  textSize(15);
  fill(255, 0, 191);
  text(
    "Boost status: " + player2.boostMessage + " " + player2.boostPower + "%",
    //playerPanelWidth - 140,
    panelWidth - (playerPanelWidth / 100) * 35,
    HEIGHT + playerPanelMarginY
  );
  fill(255);
  rect(
    panelWidth - (playerPanelWidth / 100) * 35,
    HEIGHT + 40,
    (playerPanelWidth / 100) * 30,
    30
    );
  fill(255, 0, 191);
  rect(
    panelWidth - (playerPanelWidth / 100) * 35,
    HEIGHT + 40,
    map(player2.boostPower, 0, 100, 0, (playerPanelWidth / 100) * 30),
    30
    );
  /*
  rect(
    playerPanelWidth - 140, HEIGHT + playerPanelMarginY+15, map(player1.boostPower, 0, 100, 0, 70), 20
    );
  rect(playerPanelWidth - 270, HEIGHT + playerPanelMarginY+15, map(player1.power, 0, 100, 0, 70), 20);
  */
  //fill(238, 154, 0);
  fill(255);
  textSize(12);
  fill(255);

  /*
  // OLD code
  fill(128, 128, 128);
  stroke(0, 0, 0);
  rect(WIDTH - playerPanelWidth, HEIGHT, playerPanelWidth, panelHeight);
  var t = [];
  t.push("Player 2");
  t.push("Score: " + player2.score);
  fill(0, 0, 255);
  textSize(20);
  text(t.join("\n"), WIDTH - playerPanelWidth + playerPanelMarginX, HEIGHT + playerPanelMarginY);
  textSize(12);
  // Sheild
  text(player2.sheildMessage, WIDTH - 270, HEIGHT + playerPanelMarginY);
  fill(255);
  rect(WIDTH - 270, HEIGHT + playerPanelMarginY+15, map(player2.power, 0, 100, 0, 70), 20);
  fill(0, 0, 255);
  //rect(this.location.x - 20, this.location.y - 30, map(this.health, 0, this.totalHealth, 0, 40), 8);
  // Boost
  text(
    "Boost status: " + player2.boostMessage + " " + player1.boostPower + "%",
    WIDTH - 140, HEIGHT + playerPanelMarginY
  );
  fill(255);
  rect(
    WIDTH - 140, HEIGHT + playerPanelMarginY+15, map(player2.boostPower, 0, 100, 0, 70), 20
    );
  fill(0, 0, 255);
  */
}

// I could make a few variations of this, or, at least, let me specify a gif to use
function explosionAnimation(x, y) {
  this.x = x;
  this.y = y;
  this.frame = 0;
  this.done = false;


  this.draw = function() {
    if(explosionImage.loaded()) {
      if(this.frame < explosionImage.totalFrames() - 1) {
        explosionImage.frame(parseInt(this.frame));
        image(explosionImage, this.x, this.y, 30, 30);
        this.frame += 0.33;
      } else {
        this.done = true;
      }
    }
  }
}

function displayDebug() {
  
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

// TODO: enable sheilds even when controls disabled

function handleInput() {
  //console.log(keyCode + "  pressed");

  if(gameState.state != "play") {
    return;
  }
  // Disable all controls except for sheild, so that
  // player can activate sheilds during a boost

  // Player 1
  if(player1.inputEnabled) {
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
    if(keyIsDown(80) || keyIsDown(51)) {
      player1.engageBoost();
    }
  }
  if(keyIsDown(89) || keyIsDown(52)) {
    player1.raiseSheilds();
  } else {
    player1.lowerSheilds();
  }
  
  if(player2.inputEnabled) {
    if(keyIsDown(65)) {
      player2.angle -= rotateSpeed;
    }
    if(keyIsDown(68)) {
      player2.angle += rotateSpeed;
    }
    if(keyIsDown(87)) {
      player2.thrust();
    }
    if(keyIsDown(83)) {
      player2.retro();
    }
    if(keyIsDown(71) || keyIsDown(53)) {
      player2.engageBoost();
    }
  }
  if(keyIsDown(72) || keyIsDown(54)) {
    player2.raiseSheilds();
  } else {
    player2.lowerSheilds();
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
  }
}

function mouseClicked() {
  console.log("Making new explosion at: " + mouseX, mouseY);
  
  explosions.push(new explosionAnimation(mouseX, mouseY));

  // Should probably do a thing that dumps game state to console on click
}

function keyPressed() {
  if(gameState.state == "play") {
    if(keyCode == 32 || keyCode == 73) {
      player1.fire();
    }
    if(keyCode == 86 || keyCode == 76) {
      player2.fire();
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
  if(keyCode == 48) {
    DISPLAY_DEBUG = !DISPLAY_DEBUG;
  }
}

function mouseMoved() {
    if(gameState.state == "play") {
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
    this.continueCountdown = 0;
    
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

    this.testFunc = function() {

    }
    
    this.setStatePlay = function() {
      player1.resetAll();
      player2.resetAll();

      //console.log(this.state);
      this.state = "play";
      //console.log(this.state);
    }
    
    this.setStateGameOver = function(player) {
      this.state = "gameover";
      //this.continueCountdown = 30;
      
      // Reset that player
      player.location = player.defaultLocation.copy();
      if(player == player1) {
        console.log("Player 2 wins this round");
        player2.score++;
      } else {
        console.log("Player 1 wins this round");
        player1.score++;
      }
      //console.log("Player lost, here is player: " + player.location, player.velocity);

      // This is quite messy.
      var self = this;
      setTimeout(
        function() {
        self.state = "attract";
        self.player1Start = false;
        self.player2Start = false;        
      }, 1000);
    }
    
    this.display = function() {

      if(this.state == "gameover") {
        
        // Wait until countdown to start new match
        //console.log("Continue countdown: " + this.continueCountdown);
        //if(this.continueCountdown < 1) {
        //  this.setStateContinue();
        //}
        //this.continueCountdown--;
        
        if(player1.health < 1) {
          text("Player2 wins!", WIDTH / 2, HEIGHT / 2);
        } else {
          text("Player1 wins!", WIDTH / 2, HEIGHT / 2);
        }

        // Maybe remove this
        //player1.display();
        //player2.display();
      }

      if(this.state == "play") {
        player1.display();
        player2.display();

        //player1.stopBoost();
        //player2.stopBoost();

        player1.sheild = 0;
        player2.sheild = 0;

        detectCollisions();
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
        
        textSize(19);
        textAlign(CENTER, CENTER);
        text(s, WIDTH / 2, HEIGHT / 2);

        textAlign(LEFT, TOP);
        textSize(12);
      }
    }
    
    this.setStateContinue = function() {
      console.log("Continuing...");
    }
}


/*

PLAYER CLASS

*/

function Player() {
  this.x = 0;
  this.y = 0;
  this.width = 30;
  this.height = 30;
  this.angle = 0;
  this.speedLimit = 2;
  this.velocity = createVector(0, 0).limit(1);
  this.defaultLocation = createVector(0, 0);
  this.location = createVector(0, 0);
  this.basicBullets = [];
  this.totalHealth = totalHealth;
  this.health = this.totalHealth;
  this.collisionCooldown = 0;
  this.score = 0;
  this.power = 0;
  this.maxPower = 100;
  this.sheildIsUp = false;
  this.enabled = true;
  this.visible = true;
  this.damage = 40;
  this.sheildMessage = "";
  this.boostChargeID;
  this.boostMessage = "";
  this.boostReady = true;
  //this.speedLimit = true;
  this.boostPower = 100;
  this.inputEnabled = true;

  this.display = function() {

    // I shouldn't have to disable this, but I will
    // Execution should never reach here once I change the game state
    if(!this.enabled) {
      console.log("!!!! This should never be executed!");
      return;
    }

    // I think perhaps this should be somewhere external
    this.basicBullets.forEach(function(bullet) {
      bullet.draw();
    });
    
    // Update location
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
    
    // Draw sheilds
    if(this.sheildIsUp) {
      stroke(255);
      fill(0);
      ellipse(this.location.x, this.location.y, this.width + 10);
    }
    
    fill(255);
    stroke(0);
    
    // Display rotated ship sprite
    push();
    
    translate(this.location.x, this.location.y);
    rotate(radians(this.angle));
    
    // TODO make nice sprites or something later
    
    // Differentiate color based on which player we are
    if(this == player1) {
      fill(238, 133, 0);
    } else {
      fill(255, 0, 191);
    }
    
    // Make this relative to player size
    triangle(-8, -12, -8, 12, 20, 0);
    
    ellipse(0, 0, 10, 10);
    stroke(255, 0, 0);
    line(0, 0, 10, 0);
    
    fill(255, 255, 255);
    
    pop();
    
    // Health bar
    stroke(255, 255, 255);
    rect(this.location.x - 20, this.location.y - 30, 40, 8);
    stroke(0, 0, 0);
    fill(0, 255, 0);
    //rect(this.location.x - 10, this.location.y - 20, 20, 5);
    rect(this.location.x - 20, this.location.y - 30, map(this.health, 0, this.totalHealth, 0, 40), 8);
    
    stroke(0, 0, 0);
    fill(255, 255, 255);
    

    // Update logic
    
    if(this.collisionCooldown > 0) {
      this.collisionCooldown--;
    }
    
    if(this.power < this.maxPower && !this.sheildIsUp) {
      this.power++;
    }
  }

  this.engageBoost = function() {
    // I'm going to try a different strategy with this type of charging
    // mechanism, as oppposed to the sheild mechanism.
    if(this.boostReady) {
      // Increase velocity and suspend speed limit
      console.log("Boost!");
      //this.boostReady = false;
      //this.boostPower = 0;

      this.startBoost();
    } else {
      console.log("Can't boost, charging");
      //this.boostMessage = "Charging";
    }

  }

  this.startBoost = function() {
    // Disable inputs, set a timer, and do a thrust
    this.inputEnabled = false;
    this.boostReady = false;
    this.boostPower = 0;

    console.log("Boost started!");

    console.log(this.velocity);
    var v = p5.Vector.fromAngle(radians(this.angle));
    v.mult(3);
    this.velocity.add(v);
    console.log(this.velocity);


    var self = this;
    setTimeout(
      function() {
        console.log("Boost completed");
        self.stopBoost();
      }, 400);
  }

  this.stopBoost = function() {
    this.inputEnabled = true;

    // Re impose speed limit
    if(this.velocity.mag() > this.speedLimit) {
      this.velocity.setMag(this.speedLimit);
    }

    // Engage recharge timer
    console.log("Recharging");
    var self = this;
    this.boostChargeID = setInterval(
      function() {
        //console.log(self);
        if(self.boostPower < 100) {
          self.boostPower++;
        } else {
          console.log("Boost power charging complete");
          clearInterval(self.boostChargeID);
          self.boostReady = true;
          console.log("Done recharging");
        }
        //console.log("Boost power: " + self.boostPower);
      }, 20
      );
  }
  
  this.resetAll = function() {
    this.health = this.totalHealth;
    this.resetLocation();
    this.enabled = true;
    this.basicBullets = [];
  }

  this.resetLocation = function() {
    this.location.x = this.defaultLocation.x;
    this.location.y = this.defaultLocation.y;
    this.velocity = createVector(0, 0);
  }
  // Behavior for sheilds:
  // If sheilds < 10 power, sheilds drop
  // If sheilds are not up, they must be > 50 before can be raise
  // If sheilds are still up <50, they will be lowered at <10

  this.raiseSheilds = function(val = 1) {
    // This is messy asf, so fix it later
    //this.sheildMessage = "";

    if(!this.sheildIsUp && this.power < 50) {
      //console.log("Sheild raising denied, must have >50 power level");
      this.sheildMessage = "ERROR: Not enough power\nNeed to regenerate";
      this.power -= val;
      if(this.power < 1) {
        this.power = 1;
      }
      return;
    }

    if(this.power < 2) {
      //console.log("Sheild failed due to low power");
      this.lowerSheilds();
      this.power -= 1;
      return;
    }
    //console.log("Default behavior");

    this.sheildIsUp = true;
    //this.power--;
    if(this.power > 1) {
      this.power -= 1;
    }
    this.sheildMessage = "Sheild: ACTIVE";
  }
  
  this.lowerSheilds = function() {
    this.sheildIsUp = false;
    if(this.power < 50) {
      this.sheildMessage = "Sheilds: CHARGING";
    } else {
      this.sheildMessage = "Sheilds: READY";
    }
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
    // Now, assign damage
    // REDUNDANT and can be optimized by making a function to handle all damage
    // OR, actually, I can just make the ship object have the same properites as
    // a bullet
    otherShip.hit(this);
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
  
  this.hit = function(bullet, recursiveEval=true) {
    // Deduct damage from bullet, but just hard code value for now
    if(!this.sheildIsUp) {
      this.health -= bullet.damage;
      console.log(bullet.hit);
      if(bullet.hit && recursiveEval) {
        bullet.hit(this, false);
      }
    }
    //console.log("Checking health: " + this.health);
    if(this.health < 1) {
      this.health = 0;
      this.enabled = false;
      explosions.push(new explosionAnimation(bullet.location.x, bullet.location.y));
      gameState.setStateGameOver(this);
      return;
    }
    explosions.push(new explosionAnimation(bullet.location.x, bullet.location.y));
    //console.log("Making explosion at :" + bullet.location.x, bullet.location.y);
    
    // Get pushed by bullet
    var bulletVelocity = bullet.velocity.copy();
    bulletVelocity.div(2);
    
    this.velocity.add(bulletVelocity);
    // Impose a speed limit, for sanity's sake
    // TODO use p5.Vector.limit() instead probably...
    if(this.velocity.mag() > 2) {
      this.velocity.setMag(2);
    }
  }
  
  this.fire = function() {
    this.basicBullets.push(new BasicBullet(this));
  }
  
  this.thrust = function(speedLimit = false) {
    
    console.log("thrust");

    var v = p5.Vector.fromAngle(radians(this.angle));
    
    // Slow the acceleration
    //v.setMag(v.mag()/48);
    v.div(48);
    
    // Impose a speed limit, for sanity's sake
    // TODO use p5.Vector.limit() instead probably...
    if(this.velocity.mag() > this.speedLimit) {
      this.velocity.setMag(this.speedLimit);
    }
    
    this.velocity.add(v);
  }
  
  this.retro = function() {

    var v = p5.Vector.fromAngle(radians(this.angle));
    v.div(48);
    if(this.velocity.mag() < -2) {
      //this.velocity.setMag(-2);
    }
    this.velocity.sub(v);
  }
}

function BasicBullet(player) {
  this.width = 20;
  this.height = 20;
  this.damage = 20;
  
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
  
  
  v.mult(5);

  this.velocity.add(v);
  // Have a minimum velocity. If our ship's velocity would make our projectile's velocity
  // too low, then just use the velocity as if the ship were still
  if(this.velocity.mag() < 2) {
    //console.log("Adjusted magnitude");
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
    
    // Will probably end up going with this
    stroke(255, 255, 255);
    fill(255, 0, 0);
    ellipse(0, 0, 5);
    
    pop();
    
  }
}
