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
  
  v.mult(3);

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
      //console.log(DISPLAY_DEBUG);
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
