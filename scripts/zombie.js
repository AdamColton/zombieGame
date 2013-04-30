var Zombies = {
  list: new List(),
  targets: new List(),
  frames: 0,
  update: function() {
    Zombies.frames++;
    if (Zombies.frames % 1000 == 0) { Settings.zombies++; }
    //reset grid, currently this is only used for civilians to run away
    Zombies.grid = new Grid();
    //update all Zombies and remove any that are dead or too far away
    Zombies.list.methodMap("update");
    Zombies.list.filter(function(zombie){return zombie.health <= 0;}).map(function(zombie){Zombies.list.remove(zombie); if (Math.random() < Settings.dropPrizeRate) new Prize(zombie.location);});
    Zombies.list.filter(function(zombie){return (Distance(Hero.location, zombie.location) > Settings.screenSize.x * 3);}).map(function(zombie){Zombies.list.remove(zombie);});
    //if the number of zombies has fallen below the target, try to get the number back up (
    var zombiesShortOfGoal = Settings.zombies - Zombies.list.length;
    for(var i=0; i<zombiesShortOfGoal; i++){
      Zombies.tryToAddZombie();
    }
    Prizes.update();
  },
  getNextUpdate: function(){ return rand(10,30); },
  init: function(){
    for(var i=0; i<Settings.zombies; i++){
      Zombies.tryToAddZombie();
    }
  },
  tryToAddZombie: function(){
    var l = Hero.location.add(new Polar(Math.random()*Settings.screenSize.x*1.5 + Settings.screenSize.x, Math.random()*2*Settings.pi).toInts());
    if (typeof City  == "undefined" || !City.grid.occupied(l)){
      r = Math.random();
      if (r > 0.8){ //0.8
        new SuperZombie(l);
      } else if (r > 0.6){ //0.6
        new SquirrelZombie(l);
      } else {
        new NormalZombie(l);
      }
    }
  },
  damaged: function(weapon, trajectory) {
    var trajectorySizeCopy = new Vector(trajectory.size.x, trajectory.size.y).setMagnitude(15);
    this.location = this.location.add( trajectorySizeCopy );
    this.health -= weapon.damage;
  },
  zombieUpdate: function() {
    this.nextUpdate--;
    if (this.nextUpdate <= 0){
      this.nextUpdate = Zombies.getNextUpdate();
      var d;
      if (this.target && this.target.health > 0){
        // Try to attack target
        d = Distance(this.target.collisionBox.location, this.collisionBox.location);
        if (d < Settings.zombieAttackRange){
          if (d < Settings.zombieDamageRange) { this.target.damaged(this.attackDamage); }
        } else {
          //target is out of attack range
          this.target = null;
        }
      } else {
        // Not currently chasing, look for something to chase
        var self = this;
        this.target = Zombies.targets.match(function(target){return Distance(self.location, target.location)< Settings.zombieAttackRange;});
      }
      this.dir = Zombies.getDir(this);
    }
    this.location = this.location.add(this.dir);
    this.collisionBox.location = this.location.add(this.collisionBox.offset);
    this.shadow.location = this.location.add(this.shadow.offset);
    if (typeof City != "undefined" && City.grid.occupied(SpriteCenter(this.collisionBox))) City.grid.get(SpriteCenter(this.collisionBox)).remove = true;
    Mobile.append(this);
    Zombies.grid.add(this);
    Screen.append(this,3);
    Screen.append(this.shadow,2);
  },
  getDir: function(zombie) {
    var dir;
    if (zombie.target){
      // run at target
      dir = SpriteCenter(zombie.target).subtract(SpriteCenter(zombie)).setMagnitude(zombie.attackSpeed);
    } else {
      // wander in the general direction of the hero
      dir = new Polar(zombie.meanderSpeed, Hero.location.subtract(zombie.location).angle() + 2*(Math.random() - 0.5));
    }
    return dir;
  },
  getShadow: function(zombie) {
    return {
      image: zombie.shadowImg,
      location: zombie.location,
      size: zombie.shadowSize,
      offset: zombie.shadowOffset
    };
  },
  constructor: function(zombie, location){
    zombie.health = zombie.zombieHealth;
    zombie.location = location;
    zombie.nextUpdate = Zombies.getNextUpdate();
    zombie.dir = Zombies.getDir(zombie);
    zombie.shadow =  Zombies.getShadow(zombie);
    zombie.collisionBox = {
      location: zombie.location.add(zombie.collisionOffset),
      size: zombie.collisionSize, 
      offset: zombie.collisionOffset
    }
    zombie.listNode = Zombies.list.append(zombie);
    //scale to increase difficulty as game proceeds
    zombie.zombieHealth *= 1 + Zombies.frames / Settings.zombiesDoubleInHealth;
    zombie.meanderSpeed *= 1 + Zombies.frames / Settings.zombiesDoubleInSpeed;
    zombie.attackSpeed *= 1 + Zombies.frames / Settings.zombiesDoubleInSpeed;
    zombie.attackDamage *= 1 + Zombies.frames / Settings.zombiesDoubleInDamage;
  }
};

function AbstractZombie(proto) {
  proto.update = Zombies.zombieUpdate;
  proto.damaged = Zombies.damaged;
}

function NormalZombie(location) {
  Zombies.constructor(this, location);
}
AbstractZombie(NormalZombie.prototype);
NormalZombie.prototype.image = new ResourceManager.image("img/zombies/zombie.png");
NormalZombie.prototype.shadowImg = new ResourceManager.image("img/zombies/zombieShadow.png");
NormalZombie.prototype.zombieHealth = 12;
NormalZombie.prototype.meanderSpeed = 1;
NormalZombie.prototype.attackSpeed = 3;
NormalZombie.prototype.attackDamage = 5;
NormalZombie.prototype.size = new Vector(40,60);
NormalZombie.prototype.shadowSize = new Vector(50,80);
NormalZombie.prototype.shadowOffset = new Vector(-12,-3);
NormalZombie.prototype.collisionSize = new Vector(40,40);
NormalZombie.prototype.collisionOffset = new Vector(0,40);

function SuperZombie(location) {
  Zombies.constructor(this, location);
}
AbstractZombie(SuperZombie.prototype);
SuperZombie.prototype.image = new ResourceManager.image("img/zombies/superZombie.png");
SuperZombie.prototype.shadowImg = new ResourceManager.image("img/zombies/zombieShadow.png");
SuperZombie.prototype.zombieHealth = 25;
SuperZombie.prototype.meanderSpeed = 1;
SuperZombie.prototype.attackSpeed = 5;
SuperZombie.prototype.attackDamage = 10;
SuperZombie.prototype.size = new Vector(40,60);
SuperZombie.prototype.shadowSize = new Vector(50,80);
SuperZombie.prototype.shadowOffset = new Vector(-12,-3);
SuperZombie.prototype.collisionSize = new Vector(40,40);
SuperZombie.prototype.collisionOffset = new Vector(0,40);

function SquirrelZombie(location) {
  Zombies.constructor(this, location);
}
AbstractZombie(SquirrelZombie.prototype);
SquirrelZombie.prototype.image = new ResourceManager.image("img/zombies/squirrel.png");
SquirrelZombie.prototype.shadowImg = new ResourceManager.image("img/zombies/squirrelShadow.png");
SquirrelZombie.prototype.zombieHealth = 4;
SquirrelZombie.prototype.meanderSpeed = 1;
SquirrelZombie.prototype.attackSpeed = 4;
SquirrelZombie.prototype.attackDamage = 1;
SquirrelZombie.prototype.size = new Vector(20,20);
SquirrelZombie.prototype.shadowSize = new Vector(20,10);
SquirrelZombie.prototype.shadowOffset = new Vector(0,15);
SquirrelZombie.prototype.collisionSize = new Vector(20,20);
SquirrelZombie.prototype.collisionOffset = new Vector(0,0);

function zombieCollision(z1, z2) {
  return (SpriteLeft(z1) < SpriteRight(z2) && SpriteRight(z1) > SpriteLeft(z2) && SpriteTop(z1)+40 < SpriteBottom(z2) && SpriteBottom(z1) > SpriteTop(z2)+40);
}

var Prizes = {
  prizes: new List(),
  text: new List(),
  library:{
    money: new ResourceManager.image("img/text/moneyPrize.png"),
    ammo: new ResourceManager.image("img/text/ammoPrize.png")
  },
  update: function(){
    var i = 0;
    var remove = [];
    
    //Update prizes, remove expired prizes and award collected prizes
    Prizes.prizes.methodMap("update");
    Prizes.prizes.filter(Prizes.heroCollision).map(Prizes.award);
    Prizes.prizes.filter(Prizes.expired).map(Prizes.remove);
    
    //Update prize text and remove expired
    Prizes.text.methodMap("update");
    Prizes.text.filter(Prizes.expired).map(Prizes.textRemove);
  },
  expired: function(prize){ return prize.life < 0; },
  remove: function(prize){ Prizes.prizes.remove(prize); },
  textRemove: function(prize){ Prizes.text.remove(prize); },
  heroCollision: function(prize){ return SpriteCollision(prize, Hero); },
  award: function(prize){
    PrizePack[rand(PrizePack.length)](prize.location);
    Prizes.remove(prize);
  }
}
function Prize(location){
  this.location = location;
  this.collisionBox = this;
  this.life = this.lifespan;
  Prizes.prizes.append(this);
}
Prize.prototype.bigImage = new ResourceManager.image("img/prize.png");
Prize.prototype.smallImage = new ResourceManager.image("img/prizeFlash.png");
Prize.prototype.image = Prize.prototype.bigImage;
Prize.prototype.size = new Vector(20,20);
Prize.prototype.lifespan = 400;
Prize.prototype.update = function(){
  this.life -= 1;
  // Make the prize blink to indicate expiration
  if ((this.life <= this.lifespan*.25 && parseInt(this.life/3) % 2 == 0) || (this.lifespan*.25 < this.life && this.life <= this.lifespan*.5 && parseInt(this.life/6) % 2 == 0)){
    this.image = this.smallImage;
  } else {
    this.image = this.bigImage;
  }
  Screen.append(this, 5);
}

function PrizeText(image, location){
  this.image = image;
  this.location = location;
  this.life = this.lifespan;
  Prizes.text.append(this);
}
PrizeText.prototype.size = new Vector(50,15); //just an estimate, but good enough
PrizeText.prototype.lifespan = 80;
PrizeText.prototype.update = function(){
  this.location.y -= 1;
  this.life--;
  Screen.append(this, 5);
}

// PrizePack is a list of prizes factories
var PrizePack = [
  function(location){
    if (typeof City != "undefined"){
      Hero.money += rand(City.tiles.length);
    } else {
      Hero.money += 10 + rand(20);
    }
    new PrizeText(Prizes.library.money, location);
  }
];

Zombies.targets.append(Hero);