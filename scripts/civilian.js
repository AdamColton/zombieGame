var Civilians = {
  civilians: new List(),
  rescued: 0,
  civilianTypes: [Doctor, Merchant, Civilian],
  update: function(){
    //update Civilians and remove any who have died
    Civilians.civilians.methodMap("update");
    Civilians.civilians.filter(Civilians.isDead).map(Civilians.remove);
    //If there aren't enough civilians try to spawn a new one
    if (Civilians.civilians.length < City.tiles.length / Settings.cityTilesPerCiv){
      var l = Hero.location.add(new Polar(Math.random()*Settings.screenSize.x*2 + Settings.screenSize.x, Math.random()*2*Settings.pi).toInts());
      if (typeof City  == "undefined" || !City.grid.occupied(l)) new Civilians.civilianTypes[rand(Civilians.civilianTypes.length)](l);
    }
  },
  isDead: function(civilian){return civilian.health <= 0;},
  remove: function(civilian){
    Civilians.civilians.remove(civilian);
    Zombies.targets.remove(civilian);
  },
  GetDirectionToMove: function(){
    var moveDirection = new Vector(0,0);
    for(var i=0; i<Mobile.dirs.length; i++){
      if (Zombies.grid.occupied(this.location.add(Mobile.dirs[i]).add(new Vector(30,40)))){
        var t = (new Vector(-Mobile.dirs[i].x,-Mobile.dirs[i].y)).setMagnitude(1);
        moveDirection = moveDirection.add( t );
      }
    }
    moveDirection.setMagnitude(this.speed);
    if (moveDirection.magnitude() == 0){
      var d = Distance(this.location, Hero.location);
      if (d < 30){
        moveDirection = this.location.subtract(Hero.location).setMagnitude(this.speed);
      } else if (d >40 && d < 200 && !this.isSafe){
        moveDirection = Hero.location.subtract(this.location).setMagnitude(this.speed);
      } else if(this.cityMember){
        if (!this.destination || Distance(this.destination,this.collisionBox.location) < 5 || Math.random() < .01) this.destination = City.tiles.get(rand(City.tiles.length)).location;
        moveDirection = this.destination.subtract(this.collisionBox.location).setMagnitude(this.speed/4);
      }
    }
    return moveDirection;
  },
  Damaged: function(damage){
    this.health -= damage;
  },
  civilianUpdate: function(){
    this.location = this.location.add(this.GetDirectionToMove());
    this.isSafe = City.grid.occupied(this.collisionBox.location);
    if (!this.cityMember && this.isSafe){
      Civilians.rescued++;
      this.cityMember = true;
      if (Civilians.rescued == 2 || Civilians.rescued == 4 || Civilians.rescued == 10 || Civilians.rescued == 25 ) Weapons.awardNext();
    }
    this.collisionBox.location = this.location.add(this.collisionBox.offset);
    if (input.space && !MenuManager.paused && pointInSprite(this, localToGlobal(input.mouse.location))){
      MenuManager.setMenu(this.menuHeader, this.menuOptions).activate();
    }
    if (Distance(Hero.location, this.location) > Settings.screenSize.x * 3 && !this.cityMember) this.health = 0;
    Screen.append(this,3);
    Mobile.append(this);
  },
  constructor: function(civilian, location){
    civilian.location = location;
    civilian.health = 100;
    civilian.isSafe = false;
    civilian.cityMember = false;
    civilian.collisionBox = {
      size: new Vector(25,15),
      offset: new Vector(10,40)
    };
    civilian.collisionBox.location = civilian.location.add(civilian.collisionBox.offset);
    Civilians.civilians.append(civilian);
    Zombies.targets.append(civilian);
  }
}

function AbstractCivilian(proto) {
  proto.update = Civilians.civilianUpdate;
  proto.damaged = Civilians.Damaged;
  proto.speed = 5;
  proto.size = new Vector(60,80);
  proto.GetDirectionToMove = Civilians.GetDirectionToMove;
}

function Civilian(location){
  Civilians.constructor(this, location);
}
AbstractCivilian(Civilian.prototype);
Civilian.prototype.image = new ResourceManager.image("img/hero.png");
Civilian.prototype.menuHeader = MenuManager.library.civilian;
Civilian.prototype.menuOptions = [];

function Doctor(location){
  Civilians.constructor(this, location);
}
AbstractCivilian(Doctor.prototype);
Doctor.prototype.image = new ResourceManager.image("img/doctor.png");
Doctor.prototype.menuHeader = MenuManager.library.doctor;
Doctor.prototype.menuOptions = [
  {
    image: MenuManager.library.partialHeal,
    func: doHealing
  },
  {
    image: MenuManager.library.fullHeal,
    func: doFullHealing
  }
];

function Merchant(location){
  Civilians.constructor(this, location);
}
AbstractCivilian(Merchant.prototype);
Merchant.prototype.image = new ResourceManager.image("img/merchant.png");
Merchant.prototype.menuHeader = MenuManager.library.merchant;
Merchant.prototype.menuOptions = [
  {
    image: MenuManager.library.barricade,
    func: buyBarricade
  },
  {
    image: MenuManager.library.turret,
    func: buyTurret
  },
  {
    image: MenuManager.library.barrel,
    func: buyBarrel
  },
  {
    image: MenuManager.library.superTurret,
    func: buySuperTurret
  }
];

function buyBarricade(){
  if (Hero.money >= 50){
    Hero.money -= 50;
    Fixed.droppable.count[1]++;
    Fixed.droppable.selected = 1;
  }
}
function buyTurret(){
  if (Hero.money >= 75){
    Hero.money -= 75;
    Fixed.droppable.count[0]++;
    Fixed.droppable.selected = 0;
  }
}
function buyBarrel(){
  if (Hero.money >= 10){
    Hero.money -= 10;
    Fixed.droppable.count[3]++;
    Fixed.droppable.selected = 3;
  }
}
function buySuperTurret(){
  if (Hero.money >= 1000){
    Hero.money -= 1000;
    Fixed.droppable.count[2]++;
    Fixed.droppable.selected = 2;
  }
}
function doHealing(){
  if (Hero.money >= 10){
    Hero.money -= 10;
    Hero.health += 10;
    if (Hero.health > 100) Hero.health = 100;
  }
}
function doFullHealing(){
  if (Hero.money >= 70){
    Hero.money -= 70;
    Hero.health = 100;
  }
}
