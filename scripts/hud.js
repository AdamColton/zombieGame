var HUD = {
  location: new Vector(0,500),
  size: new Vector(800,100),
  image: new ResourceManager.image("img/hud.png"),
  draw: "fixed",
  radarCenter: new Vector(50,550),
  library:{
    markerSize: new Vector(3,3),
    redMarker: new ResourceManager.image("img/redMarker.png"),
    blackMarker: new ResourceManager.image("img/blackMarker.png"),
    blueMarker: new ResourceManager.image("img/blueMarker.png"),
    greenMarker: new ResourceManager.image("img/greenMarker.png")
  },
  healthbarBackground:{
    image: new ResourceManager.image("img/healthbar_bg.png"),
    location: new Vector( 630, 562),
    draw: "fixed",
    size: new Vector(150, 30)
  },
  healthbarForeground:{
    image: new ResourceManager.image("img/healthbar/100.png"),
    location: new Vector( 630, 563),
    draw: "slice",
    size: new Vector(150, 30),
    slice: new Vector(100,30)
  },
  text:{
    "0" : new ResourceManager.image("img/text/0.png"),
    "1" : new ResourceManager.image("img/text/1.png"),
    "2" : new ResourceManager.image("img/text/2.png"),
    "3" : new ResourceManager.image("img/text/3.png"),
    "4" : new ResourceManager.image("img/text/4.png"),
    "5" : new ResourceManager.image("img/text/5.png"),
    "6" : new ResourceManager.image("img/text/6.png"),
    "7" : new ResourceManager.image("img/text/7.png"),
    "8" : new ResourceManager.image("img/text/8.png"),
    "9" : new ResourceManager.image("img/text/9.png"),
    "Pistol" : new ResourceManager.image("img/text/pistol.png"),
    "Shotgun": new ResourceManager.image("img/text/shotgun.png"),
    "Rifle": new ResourceManager.image("img/text/rifle.png"),
    "Barrel": new ResourceManager.image("img/text/barrel.png"),
    "Automatic": new ResourceManager.image("img/text/automatic.png"),
    "Turret" : new ResourceManager.image("img/text/turret.png"),
    "Super Turret" : new ResourceManager.image("img/text/superTurret.png"),
    "Loading" : new ResourceManager.image("img/text/loading.png"),
    "Grenade" : new ResourceManager.image("img/text/grenade.png"),
    "Minigun" : new ResourceManager.image("img/text/minigun.png"),
    "Barricade" : new ResourceManager.image("img/text/barricade.png")
  },
  clip: {
    location: new Vector(100,575),
    image: new ResourceManager.image("img/text/clip.png"),
    draw: "fixed"
  },
  weaponName: {
    location: new Vector(100,555),
    draw: "fixed"
  },
  fixedName: {
    location: new Vector(300,555),
    draw: "fixed"
  },
  dollar: {
    location: new Vector(500,575),
    draw: "fixed",
    image: new ResourceManager.image("img/text/dollar.png")
  },
  radarDraw: function(dotImage, sprite){
    var v = SpriteCenter(Hero).subtract(SpriteCenter(sprite));
    var d = v.magnitude();
    var radarDistance = Settings.screenSize.y * 2.0;
    if (d < radarDistance){
      var l = (d / radarDistance) * 48;
      //add bubble effect
      l *= 1 + ((radarDistance - d) / (radarDistance)) * 0.7;
      v.setMagnitude(l);
      Screen.append({
        image: dotImage,
        size: HUD.library.markerSize,
        draw: "fixed",
        location: HUD.radarCenter.subtract(v)
      },6)
    }
  },
  alert: {
    life: 0
  },
  radarZombieDraw: function(zombie){HUD.radarDraw(HUD.library.redMarker, zombie);},
  radarFixedDraw: function(fixed){HUD.radarDraw(HUD.library.blackMarker, fixed);},
  radarPrizeDraw: function(fixed){HUD.radarDraw(HUD.library.greenMarker, fixed);},
  radarCivilianDraw: function(fixed){HUD.radarDraw(HUD.library.blueMarker, fixed);},
  update: function(){
    Screen.append(this,6);
    
    // --- Health Bar ---
    Screen.append(this.healthbarBackground,6);
    var barWidth = 3+parseInt(Hero.health*140/100);
    if (barWidth < 1) barWidth = 1;
    this.healthbarForeground.size = new Vector(barWidth,30);
    Screen.append(this.healthbarForeground,6);
    
    // --- Radar ---
    Zombies.list.map(HUD.radarZombieDraw);
    Fixed.fixed.map(HUD.radarFixedDraw);
    Prizes.prizes.map(HUD.radarPrizeDraw);
    if (typeof Civilians != "undefined") Civilians.civilians.map(HUD.radarCivilianDraw);
    
    // --- Clip ---
    Screen.append(HUD.clip, 6);
    if (Weapons.selected.loading){
      Screen.append({
        image: HUD.text.Loading,
        location: new Vector(140,575),
        draw: "fixed"
      },6);
    } else {
      HUD.displayNumber(Weapons.selected.clip, new Vector(140,575));
    }

    // --- Weapon ---
    HUD.weaponName.image = HUD.text[Weapons.selected.name];
    Screen.append(HUD.weaponName, 6);
    if (Weapons.selected.ammo != "infinite") HUD.displayNumber(Weapons.selected.ammo, new Vector(100 + HUD.text[Weapons.selected.name].width,555));

    // --- Fixed ---
    HUD.fixedName.image = HUD.text[Fixed.droppable.name[Fixed.droppable.selected]];
    Screen.append(HUD.fixedName, 6);
    HUD.displayNumber(Fixed.droppable.count[Fixed.droppable.selected], new Vector(300,575));

    // --- Money ---
    Screen.append(HUD.dollar, 6)
    HUD.displayNumber(Hero.money, new Vector(510,575));
    
    // --- Alert ---
    if (HUD.alert.life > 0){
      HUD.alert.life--;
      Screen.append(HUD.alert, 6);
    }
    
  },
  displayNumber: function(n, location){
    n = "" + n; //cast as string
    for(var i=0; i< n.length; i++){
      var tempLocation = location.add( new Vector(i*11, 0) );
      Screen.append({
        location: tempLocation,
        image: HUD.text[n.charAt(i)],
        draw: "fixed"
      },6);
    }
  }
}