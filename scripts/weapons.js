function checkTrajectoryTarget(trajectory, target){
  /* This massive beast does collision detection for bullets. 
   * It looks for the point at which the bullet would cross any
   * of the four borders of it's target. If it crosses them with
   * in the bullets range, it checks what the other axis coordinate
   * is. If the other axis lies on the target, then it's a hit.
   * The function returns null in the case of a miss and a number
   * between 0 and 1 if there's a hit. That number represents where
   * along the trajectory the collision occured.
   */
  var x1, x2, y1, y2;
  if (trajectory.size.y === 0){
    y1 = -1;
    y2 = -1;
  } else {
    y1 = (target.location.y - trajectory.location.y) / (trajectory.size.y);
    y2 = (target.location.y + target.size.y - trajectory.location.y) / (trajectory.size.y);
  }
  if (trajectory.size.x === 0){
    x1 = -1;
    x2 = -1;
  } else {
    x1 = (target.location.x - trajectory.location.x) / (trajectory.size.x);
    x2 = (target.location.x + target.size.x - trajectory.location.x) / (trajectory.size.x);
  }
  var r = null;
  var x,y,m,n,b,c;
  if ( (x1 >0 && x1 <=1) && (r === null || x1 < r) ){
    m = trajectory.size.y / trajectory.size.x;
    b = trajectory.location.y - m*trajectory.location.x;
    y = m * (target.location.x) + b;
    if (y > target.location.y && y < target.location.y + target.size.y){
      r = x1;
    }
  }
  if ( (x2 >0 && x2 <=1) && (r === null || x2 < r) ){
    m = trajectory.size.y / trajectory.size.x;
    b = trajectory.location.y - m*trajectory.location.x;
    y = m * (target.location.x + target.size.x) + b;
    if (y > target.location.y && y < target.location.y + target.size.y){
      r = x1;
    }
  }
  if ( (y1 >0 && y1 <=1) && (r === null || y1 < r) ){
    n = trajectory.size.x / trajectory.size.y;
    c = trajectory.location.x - n*trajectory.location.y;
    x = n * (target.location.y) + c;
    if (x > target.location.x && x < target.location.x + target.size.x){
      r = y1;
    }
  }
  if ( false && (y2 >=0 && y2 <=1) && (r === null || y2 < r) ){
    n = trajectory.size.x / trajectory.size.y;
    c = trajectory.location.x - n*trajectory.location.y;
    x = n * (target.location.y + target.size.y) + c;
    if (x > target.location.x && x < target.location.x + target.size.x){
      r = y1;
    }
  }
  return r;
}

function smallBullet(start, target, weapon){
  //target represents the point the gun was aiming at (in relative space not fixed space).
  var trajectory = {
    location: start,
    size: target.subtract(start).setMagnitude(weapon.range)
  };
  var hitTarget = null;
  var d = 0;
  for(var zombie = Zombies.list.first() ; zombie != Zombies.list.end ;  zombie = zombie.next){
    d = checkTrajectoryTarget(trajectory, zombie.payload);
    if( d && ( hitTarget === null || hitTarget.d > d)){
      hitTarget = {
        d: d,
        target: zombie.payload
      };
    }
  }
  if (hitTarget !== null){
    hitTarget.target.damaged(weapon, trajectory);
    trajectory.size = trajectory.size.divideByNumber(1/hitTarget.d);
  }
  tracer(trajectory);
}

var Tracers = {
  tracers: new List(),
  update: function(){
    var remove = [];
    for(var t = Tracers.tracers.first() ; t != Tracers.tracers.end ; t = t.next){
      if (typeof t.payload.update != "undefined") t.payload.update();
      Screen.append(t.payload, 5);
      t.payload.lifespan--;
      if (t.payload.lifespan <= 0) { remove.push(t.payload); }
    }
    for(var i=0; i<remove.length; i++) { Tracers.tracers.remove(remove[i]); }
  }
};

function tracer(trajectory){
  var t = {
    location: trajectory.location,
    size: trajectory.size,
    draw: "line",
    lifespan: 3
  };
  Tracers.tracers.append(t);
}

function weaponUpdate(){
  this.delay--;
  this.location = Hero.location.add(this.offset);
  if ( input.r ){
    if (this.ammo != "infinite") this.ammo += this.clip;
    this.clip = 0;
  }
  if (this.clip <= 0 && (this.ammo ==  "infinite" || this.ammo > 0)){
    this.loading = true;
    this.delay = this.reloadDelay;
    if (this.ammo ==  "infinite"){
      this.clip = this.clipSize;
    } else {
      if (this.ammo < this.clipSize){
        this.clip = this.ammo;
        this.ammo = 0;
      } else {
        this.ammo -= this.clipSize;
        this.clip = this.clipSize;
      }
    }
  }
  if (this.delay <= 0) this.loading = false;
  if ( input.mouse.left.down && this.clip > 0 && this.delay <= 0 ){
    muzzelFlash.lifespan = 6;
    this.delay = this.fireDelay;
    target = localToGlobal(input.mouse.location);
    this.bulletFactory(this.location.add(this.fireOffset), target, this);
    this.clip--;
    if (this.sound !== undefined){
      this.sound.currentTime = 0;
      this.sound.play();
    }
  }
  if (!this.skipDraw){
    Screen.append(this, 4);
    muzzelFlash.lifespan--;
    muzzelFlash.location = this.location.add(this.fireOffset);
    if (muzzelFlash.lifespan >0) { Screen.append(muzzelFlash, 4); }
  }
  Tracers.update();
  if (input.q && this.delay <= 0){
    Weapons.selected = Weapons.weapons.prev(Weapons.selected);
    Weapons.selected.delay = 10;
  }
  if (input.e && this.delay <= 0){
    Weapons.selected = Weapons.weapons.next(Weapons.selected);
    Weapons.selected.delay = 10;
  }
}

var Weapons = {
  weapons: new List(),
  notYetAwarded:[],
  awardNext: function(){
    if (Weapons.notYetAwarded.length > 0){
      var awardWeapon = Weapons.notYetAwarded.pop();
      Weapons.weapons.append(awardWeapon);
      WeaponPrizeArr.push(awardWeapon);
      if (typeof HUD !== "undefined"){
        HUD.alert = {
          text: "You now have the " + awardWeapon.name,
          draw: "fixedtext",
          location: new Vector(200, 545),
          font: "12pt sans-serif",
          color: "rgb(255,0,0)",
          life: 80
        }
      }
    }
  }
};

var pistol = {
  image: new ResourceManager.image("img/weapons/pistol.png"),
  sound: document.createElement("audio"),
  location: new Vector(0,0),
  offset: new Vector(41,30),
  fireOffset: new Vector(12,0),
  size: new Vector(20,20),
  clipSize: 7,
  fireDelay: 10,
  reloadDelay: 45,
  damage: 5,
  range: 300,
  delay: 0,
  clip: 7,
  ammo: "infinite",
  name: "Pistol",
  loading: false,
  bulletFactory: smallBullet,
  update: weaponUpdate
};
pistol.sound.src = "sound/pistol.wav";
pistol.sound.load();

var automatic = {
  image: new ResourceManager.image("img/weapons/automatic.png"),
  sound: document.createElement("audio"),
  location: new Vector(0,0),
  offset: new Vector(41,30),
  fireOffset: new Vector(42,3),
  size: new Vector(20,20),
  clipSize: 30,
  fireDelay: 3,
  reloadDelay: 60,
  damage: 7,
  range: 400,
  delay: 0,
  clip: 30,
  ammo: 30,
  maxAmmo: 200,
  addAmmo: 30,
  name: "Automatic",
  loading: false,
  bulletFactory: smallBullet,
  update: weaponUpdate
};
automatic.sound.src = "sound/pistol.wav";
automatic.sound.load();

var shotgun = {
  image: new ResourceManager.image("img/weapons/shotgun.png"),
  sound: document.createElement("audio"),
  location: new Vector(0,0),
  offset: new Vector(41,30),
  fireOffset: new Vector(24,0),
  size: new Vector(45,10),
  clipSize: 7,
  fireDelay: 20,
  reloadDelay: 55,
  damage: 3,
  range: 300,
  delay: 0,
  clip: 7,
  ammo: 14,
  maxAmmo: 100,
  addAmmo: 15,
  name: "Shotgun",
  loading: false,
  bulletFactory: function(start, target, weapon){
    target = target.subtract(start).setMagnitude(weapon.range);
    target = start.add(target);
    for(var i=0; i<10; i++){
      smallBullet(start, target.add(new Polar(Math.random()*20,Math.random()*2*3.1415)), weapon);
    }
  },
  update: weaponUpdate
};
shotgun.sound.setAttribute('src','sound/gunshot.wav');
shotgun.sound.load();

var rifle = {
  image: new ResourceManager.image("img/weapons/shotgun.png"),
  sound: document.createElement("audio"),
  location: new Vector(0,0),
  offset: new Vector(41,30),
  fireOffset: new Vector(24,0),
  size: new Vector(45,10),
  clipSize: 3,
  fireDelay: 15,
  reloadDelay: 35,
  damage: 40,
  range: 900,
  delay: 0,
  clip: 3,
  ammo: 15,
  maxAmmo: 100,
  addAmmo: 15,
  name: "Rifle",
  loading: false,
  bulletFactory: smallBullet,
  update: weaponUpdate
};
rifle.sound.setAttribute('src','sound/rifle.wav');
rifle.sound.load();

var grenadeThrower = {
  image: new ResourceManager.image("img/weapons/grenade.png"),
  skipDraw: true,
  offset: new Vector(41,30),
  fireOffset: new Vector(0,0),
  clipSize: 1,
  fireDelay: 10,
  reloadDelay: 10,
  damage: 5,
  range: 300,
  delay: 0,
  clip: 0,
  ammo: 0,
  maxAmmo: 30,
  addAmmo: 5,
  totalLife: 20.0,
  name: "Grenade",
  loading: false,
  bulletFactory: function(start, target, weapon){
    var grenade = {};
    grenade.trajectory = target.subtract(start);
    if (grenade.trajectory.magnitude() > weapon.range) grenade.trajectory.setMagnitude(weapon.range);

    grenade.lifespan = grenadeThrower.totalLife;
    grenade.update = grenadeThrower.grenadeUpdate;

    grenade.image = grenadeThrower.image;
    grenade.size = new Vector(10,10);
    grenade.start = start;
    grenade.location = start;

    Tracers.tracers.append(grenade);
  },
  update: weaponUpdate,
  grenadeUpdate: function(){
    if (this.lifespan == 1){
      var shrapnel = {
        range: 100,
        damage: 5
      }
      for(var i=0; i< 40; i++){
        smallBullet(this.location, this.location.add(new Polar(shrapnel.range,Math.random()*2*3.1415)), shrapnel);
      }
    }
    var l = grenadeThrower.totalLife;
    var hl = grenadeThrower.totalLife/2;
    var s = -100 / (hl*hl);
    var dx = this.trajectory.x * (l-this.lifespan)/l;
    var dy = this.trajectory.y * (l-this.lifespan)/l;
    dy -= ((this.lifespan-hl)*(this.lifespan-hl)*s) + 100;
    this.location = this.start.add( new Vector(dx, dy) );
    Screen.append(this, 4);
  }
};

var minigun = {
  image: new ResourceManager.image("img/weapons/minigun.png"),
  sound: document.createElement("audio"),
  location: new Vector(0,0),
  offset: new Vector(-5,30),
  fireOffset: new Vector(42,3),
  size: new Vector(20,20),
  clipSize: 100,
  fireDelay: 0,
  reloadDelay: 60,
  damage: 60,
  range: 900,
  delay: 0,
  clip: 0,
  ammo: 300,
  maxAmmo: 2000,
  addAmmo: 200,
  name: "Minigun",
  loading: false,
  bulletFactory: smallBullet,
  update: weaponUpdate
};
minigun.sound.setAttribute('src','sound/rifle.wav');
minigun.sound.load();

var muzzelFlash = {
  image: new ResourceManager.image("img/muzzelFlash.png"),
  size: new Vector(8,10),
  location: new Vector(0,0),
  lifespan: 0
};

Weapons.weapons.append(pistol);
Weapons.weapons.append(grenadeThrower);
var WeaponPrizeArr = [grenadeThrower];
Weapons.selected = pistol;

Weapons.notYetAwarded = [minigun, rifle, shotgun, automatic];


PrizePack.push(function(location){
  if (WeaponPrizeArr.length > 0){
    var r = rand(WeaponPrizeArr.length);
    WeaponPrizeArr[r].ammo += WeaponPrizeArr[r].addAmmo;
    if (WeaponPrizeArr[r].ammo > WeaponPrizeArr[r].maxAmmo) WeaponPrizeArr[r].ammo = WeaponPrizeArr[r].maxAmmo;
    new PrizeText(Prizes.library.ammo, location);
  } else {
    new Prize(zombie.location)
  }
});