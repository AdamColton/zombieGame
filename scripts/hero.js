var Hero = {
  location: new Vector(0,0),
  size: new Vector(60,80),
  image: new ResourceManager.image("img/walking.png"),
  frame: 0,
  state: 0,
  draw: "sprite",
  walkSpeed: 5,
  health: 100,
  maxHealth: 100,
  money: 10,
  shadow: {
    location: new Vector(0,0),
    size: new Vector(60,80),
    image: new ResourceManager.image("img/walkingShadow.png"),
    draw: "sprite",
    frame: 0,
    state:0,
    drawFixed: false,
    offset: new Vector(0,-1)
  },
  collisionBox: {
    location: new Vector(0,0),
    size: new Vector(25,15),
    offset: new Vector(10,40)
  },
  update: function(){
    Screen.append(this,3);
    var dir = new Vector(0,0);
    if (input.up && !input.down) {
      dir.y = -1;
    }
    if (!input.up && input.down){
      dir.y = 1;
    }
    if (input.left && !input.right){
      dir.x = -1;
    }
    if (!input.left && input.right){
      dir.x = 1;
    }
    dir.setMagnitude(Hero.walkSpeed);
    if (dir.magnitude() > 0) Hero.setSprite(dir);
    this.location = this.location.add(dir);
    this.shadow.location = this.location.add(this.shadow.offset);
    this.collisionBox.location = this.location.add(this.collisionBox.offset);
    Screen.append(this.shadow,2);
    Mobile.append(Hero);
  },
  setSprite: function(dir){
    Hero.frame = (Hero.frame + 1) % 50;
    if (dir.x > 0) {
      if (dir.y > 0) Hero.state = 6;
      if (dir.y < 0) Hero.state = 4;
      if (dir.y == 0) Hero.state = 0;
    } else if (dir.x < 0){
      if (dir.y > 0) Hero.state = 7;
      if (dir.y < 0) Hero.state = 5;
      if (dir.y == 0) Hero.state = 2;
    } else {
      if (dir.y > 0) Hero.state = 1;
      if (dir.y < 0) Hero.state = 3;
    }
    Hero.shadow.frame = Hero.frame;
    Hero.shadow.state = Hero.state;
  },
  damaged: function(d){
    Hero.health -= d;
  }
};