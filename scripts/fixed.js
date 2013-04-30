var Fixed = {
  fixed: new List(),
  grid: new Grid(),
  update: function(){
    var mouseLocation = localToGlobal(input.mouse.location);
    if ( input.mouse.right.down && Fixed.droppable.delay <0 && Fixed.droppable.count[Fixed.droppable.selected] > 0 ){
      if (Fixed.grid.occupied(mouseLocation) == false){
        if (Fixed.droppable.selected == 0) new TurretGun(mouseLocation);
        if (Fixed.droppable.selected == 1) new Barricade(mouseLocation);
        if (Fixed.droppable.selected == 2) new SuperTurretGun(mouseLocation);
        if (Fixed.droppable.selected == 3) new Barrel(mouseLocation);
        Fixed.droppable.count[Fixed.droppable.selected]--;
        Fixed.droppable.delay = 10;
      }
    }
    if (input.mouse.scroll.up || input.mouse.scroll.down){
      var dir = 1;
      if (input.mouse.scroll.down) dir = -1;
      input.mouse.scroll.up = false;
      input.mouse.scroll.down = false;
      var initVal = Fixed.droppable.selected
      do {
        Fixed.droppable.selected = (Fixed.droppable.selected + 1) % Fixed.droppable.count.length;
      } while(initVal != Fixed.droppable.selected && Fixed.droppable.count[Fixed.droppable.selected] == 0);
    }
    Fixed.droppable.delay --;
    Fixed.fixed.methodMap("update");
    Fixed.fixed.filter(function(fixed){return fixed.health <= 0}).methodMap("remove");
    if ( input.backspace && Fixed.grid.occupied(mouseLocation)){
      Fixed.grid.get(mouseLocation).first().payload.remove();
    }
  },
  dirs: [new Vector(-40,-40),new Vector(-40,0),new Vector(-40,40),new Vector(0,-40),new Vector(0,0),new Vector(0,40),new Vector(40,-40),new Vector(40,0),new Vector(40,40)],
  damaged: function(d){
    this.health -= d;
  },
  droppable: {
    count: [2, 5, 0, 0],
    name: ["Turret", "Barricade", "Super Turret", "Barrel"],
    selected: 0,
    delay: 0 
  },
  remove: function(){
    Fixed.grid.remove(this);
    Fixed.fixed.remove(this);
    Zombies.targets.remove(this);
    this.health = 0;
  }
}

function TurretGun(location){
  this.location = GridLocation(location);
  this.target = null;
  this.delay = 0;
  this.frame = rand(60);
  this.health = this.startingHealth;
  this.shadow = {
    location: this.location.add(this.shadowOffset),
    image: this.shadowImg,
    size: this.shadowSize,
    draw: "sprite",
    state: 0
  }
  this.collisionBox = {
    location: this.location,
    size: TurretGun.prototype.size
  }
  Fixed.fixed.append(this);
  Fixed.grid.add(this);
  Zombies.targets.append(this);
}
TurretGun.prototype.image = new ResourceManager.image("img/turret.png");
TurretGun.prototype.shadowImg = new ResourceManager.image("img/turretShadow.png");
TurretGun.prototype.size = new Vector(40,40);
TurretGun.prototype.shadowSize = new Vector(68,68);
TurretGun.prototype.shadowOffset = new Vector(-16,-13);
TurretGun.prototype.name = "Turret";
TurretGun.prototype.draw = "sprite";
TurretGun.prototype.state = 0;
TurretGun.prototype.range = 140;
TurretGun.prototype.damage = 30;
TurretGun.prototype.startingHealth = 25;
TurretGun.prototype.fireDelay = 45;
TurretGun.prototype.bulletFactory = smallBullet;
TurretGun.prototype.damaged = Fixed.damaged;
TurretGun.prototype.remove = Fixed.remove;
TurretGun.prototype.sound = document.createElement("audio");
TurretGun.prototype.sound.src = "sound/pistol.wav";
TurretGun.prototype.sound.load();
TurretGun.prototype.sound.volume = 0.3;
TurretGun.prototype.update = function(){
  Screen.append(this,3);
  Screen.append(this.shadow,1);
  this.delay--;  

  //Check for collisions - Abstract this, it's shared among all fixed
  var checkLocation;
  var spritesAtLocation;
  for(var i in Fixed.dirs){
    checkLocation = this.location.add(Fixed.dirs[i]);
    spritesAtLocation = Mobile.grid.get(checkLocation);
    for(var checkSprite = spritesAtLocation.first() ; checkSprite != spritesAtLocation.end ; checkSprite = checkSprite.next){
      if (SpriteCollision(this.collisionBox,checkSprite.payload.collisionBox)) Decollide(checkSprite.payload, this);
    }
  }

  //Handle targeting
  if (this.target != null && this.target.health <= 0) this.target = null;
  if (this.target == null){
    for(var zombie = Zombies.list.first() ; zombie != Zombies.list.end ; zombie = zombie.next){
      if (Distance(zombie.payload.collisionBox.location, this.location) < this.range){
        this.target = zombie.payload;
        break;
      }
    }
  }

  //Shoot at target
  if (this.target != null){
    if (this.delay <= 0){
      this.delay = this.fireDelay;
      this.bulletFactory(SpriteCenter(this), SpriteCenter(this.target.collisionBox), this)
      //this.frame = ((SpriteCenter(this).subtract(SpriteCenter(this.target)).angle() + Math.PI) / (Math.PI*2)) * 60;
      this.frame = Math.floor(((SpriteCenter(this).subtract(SpriteCenter(this.target.collisionBox)).angle() + Math.PI) / (Math.PI*2)) * 60 + 15) % 60;
      if (Screen.onScreen(this)) TurretGun.prototype.sound.play();
    }
  } else {
    this.frame = (this.frame+1) % 60;
  }
  this.shadow.frame = this.frame;
}

function SuperTurretGun(location){
  this.location = GridLocation(location);
  this.target = null;
  this.delay = 0;
  this.frame = rand(60);
  this.health = this.startingHealth;
  this.shadow = {
    location: this.location.add(this.shadowOffset),
    image: this.shadowImg,
    size: this.shadowSize,
    draw: "sprite",
    state: 0
  }
  this.collisionBox = {
    location: this.location,
    size: TurretGun.prototype.size
  }
  Fixed.fixed.append(this);
  Fixed.grid.add(this);
  Zombies.targets.append(this);
}
SuperTurretGun.prototype.image = new ResourceManager.image("img/superTurret.png");
SuperTurretGun.prototype.shadowImg = new ResourceManager.image("img/turretShadow.png");
SuperTurretGun.prototype.size = new Vector(40,40);
SuperTurretGun.prototype.shadowSize = new Vector(68,68);
SuperTurretGun.prototype.shadowOffset = new Vector(-16,-13);
SuperTurretGun.prototype.name = "Turret";
SuperTurretGun.prototype.draw = "sprite";
SuperTurretGun.prototype.state = 0;
SuperTurretGun.prototype.range = 200;
SuperTurretGun.prototype.damage = 40;
SuperTurretGun.prototype.startingHealth = 25;
SuperTurretGun.prototype.fireDelay = 10;
SuperTurretGun.prototype.bulletFactory = smallBullet;
SuperTurretGun.prototype.damaged = Fixed.damaged;
SuperTurretGun.prototype.remove = Fixed.remove;
SuperTurretGun.prototype.update = TurretGun.prototype.update


function Barricade(location){
  this.health = this.startingHealth;
  this.location = GridLocation(location);
  this.shadow = {
    location: this.location.add(this.shadowOffset),
    image: this.shadowImg,
    size: Barricade.prototype.size
  };
  this.collisionBox = {
    location: this.location,
    size: this.size
  };
  Fixed.fixed.append(this);
  Fixed.grid.add(this);
  Zombies.targets.append(this);
}
Barricade.prototype.image = new ResourceManager.image("img/3dBarricade.png");
Barricade.prototype.shadowImg = new ResourceManager.image("img/3dBarricadeShadow.png");
Barricade.prototype.size = new Vector(40,40);
Barricade.prototype.shadowSize = new Vector(53,53);
Barricade.prototype.shadowOffset = new Vector(-17,-9);
Barricade.prototype.startingHealth = 200;
Barricade.prototype.name = "Barricade";
Barricade.prototype.damaged = Fixed.damaged;
Barricade.prototype.remove = Fixed.remove;
Barricade.prototype.update = function(){
  Screen.append(this,3);
  Screen.append(this.shadow,1);
  //Check for collisions
  var checkLocation;
  var spritesAtLocation;
  for(var i in Fixed.dirs){
    checkLocation = this.collisionBox.location.add(Fixed.dirs[i]);
    spritesAtLocation = Mobile.grid.get(checkLocation);
    for(var checkSprite = spritesAtLocation.first() ; checkSprite != spritesAtLocation.end ; checkSprite = checkSprite.next){
      if (SpriteCollision(this.collisionBox,checkSprite.payload.collisionBox)) Decollide(checkSprite.payload, this);
    }
  }
}

function Barrel(location){
  this.health = this.startingHealth;
  this.location = GridLocation(location);
  this.shadow = {
    location: this.location.add(this.shadowOffset),
    image: this.shadowImg,
    size: Barricade.prototype.size
  };
  this.collisionBox = {
    location: this.location,
    size: this.size
  };
  Fixed.fixed.append(this);
  Fixed.grid.add(this);
  Zombies.targets.append(this);
}
Barrel.prototype.image = new ResourceManager.image("img/barrel.png");
Barrel.prototype.shadowImg = new ResourceManager.image("img/barrelShadow.png");
Barrel.prototype.size = new Vector(40,40);
Barrel.prototype.shadowSize = new Vector(53,53);
Barrel.prototype.shadowOffset = new Vector(-30,0);
Barrel.prototype.startingHealth = 10;
Barrel.prototype.name = "Barrel";
Barrel.prototype.damaged = function(d){
  this.health -= d;
  if (this.health <= 0){
    var shrapnel = {
      range: 150,
      damage: 5
    }
    for(var i=0; i< 40; i++){
      smallBullet(this.location, this.location.add(new Polar(shrapnel.range,Math.random()*2*3.1415)), shrapnel);
    }
  }
}
Barrel.prototype.remove = Fixed.remove;
Barrel.prototype.update = function(){
  Screen.append(this,3);
  Screen.append(this.shadow,1);
  //Check for collisions
  var checkLocation;
  var spritesAtLocation;
  for(var i in Fixed.dirs){
    checkLocation = this.collisionBox.location.add(Fixed.dirs[i]);
    spritesAtLocation = Mobile.grid.get(checkLocation);
    for(var checkSprite = spritesAtLocation.first() ; checkSprite != spritesAtLocation.end ; checkSprite = checkSprite.next){
      if (SpriteCollision(this.collisionBox,checkSprite.payload.collisionBox)) Decollide(checkSprite.payload, this);
    }
  }
}