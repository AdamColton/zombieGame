var background = {
  image: new ResourceManager.image("img/background/background.png"),
  decorations: [],
  decorationResources: [],
  decorationCount: 100,
  location: new Vector(0,0),
  tiles: null,
  size: new Vector(800, 600),
  update:function(){
    var center = ScreenCenter();
    if (center.x - background.location.x < -background.size.x/2) background.location.x -= background.size.x;
    if (center.x - background.location.x > background.size.x/2) background.location.x += background.size.x;
    if (center.y - background.location.y < -background.size.y/2) background.location.y -= background.size.y;
    if (center.y - background.location.y > background.size.y/2) background.location.y += background.size.y;
    var i;
    for(i=0; i<background.tiles.length; i++){
      background.tiles[i].location = background.location.subtract(background.tiles[i].offset);
      Screen.append(background.tiles[i], 0);
    }
    for(i=0; i<background.decorations.length; i++){
      background.decorations[i].update();
    }
  },
  decorationUpdate: function(){
    var dist = ScreenCenter().subtract(SpriteCenter(this)).magnitude();
    if (dist > 2*Settings.screenSize.x){
      var di = rand(background.decorationResources.length); //Decoration Index
      this.size = background.decorationResources[di].size;
      this.image = background.decorationResources[di].image;
      this.location = SpriteCenter(Screen._follow).add(new Polar(Math.random()*Settings.screenSize.x + Settings.screenSize.x, Math.random()*2*Settings.pi)).toInts();
    }
    Screen.append(this, 1);
  },
  initilizeDecorations: function(){
    var i;
    var offsets = [
      new Vector(0,0),
      new Vector(800,0),
      new Vector(0,600),
      new Vector(800,600)
    ];
    background.tiles = [];
    for(i=0; i<offsets.length; i++){
      background.tiles.push({
        location: null,
        size: background.size,
        image: background.image,
        drawFixed: false,
        offset: offsets[i]
      });
    }
    for(i=0; i<background.decorationCount; i++){
      var di = rand(background.decorationResources.length); //Decoration Index
      var decoration = {
        location: SpriteCenter(Screen._follow).add(new Polar(Math.random()*Settings.screenSize.x*3 , Math.random()*2*Settings.pi)).toInts(),
        update: background.decorationUpdate
      };
      decoration.size = background.decorationResources[di].size;
      decoration.image = background.decorationResources[di].image;
      background.decorations.push(decoration);
    }
  }
};

function adddecorationResources(path, size){
  var resource = {
    size: size,
    image: new ResourceManager.image(path)
  };
  background.decorationResources.push(resource);
}
adddecorationResources("img/background/flower1.png", new Vector(10,10));
adddecorationResources("img/background/flower2.png", new Vector(30,30));
adddecorationResources("img/background/rock1.png", new Vector(30,30));
adddecorationResources("img/background/rock2.png", new Vector(30,30));
adddecorationResources("img/background/skeleton.png", new Vector(60,54));
adddecorationResources("img/background/skull.png", new Vector(15,13));