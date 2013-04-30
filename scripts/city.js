var City = {
  tiles: new List(),
  grid: new SingleGrid(),
  greenTile: new ResourceManager.image("img/greenTile.png"),
  redTile: new ResourceManager.image("img/redTile.png"),
  update: function(){
    City.tiles.methodMap("update");
    City.tiles.filter(City.remove).methodMap("removeTile");
  },
  dirs: [ new Vector(-40, 0), new Vector(40, 0), new Vector(0, -40), new Vector(0, 40) ],
  remove: function(tile){
    return tile.remove
  }
}

function Tile(location){
  this.location = GridLocation(location);
  this.image = City.redTile;
  this.life = 0;
  this.remove = false;
  this.collisionBox = this;
  City.tiles.append(this);
  City.grid.add(this);
}
Tile.prototype.size = new Vector(40,40);
Tile.prototype.safeDelay = Settings.cityGrowRate;
Tile.prototype.update = function(){
  if (this.life % 100 == 0 && this.life >= Tile.prototype.safeDelay){
    this.image = City.greenTile;
    for(var i=0; i<City.dirs.length; i++){
      if(!City.grid.occupied(this.location.add(City.dirs[i]))){
        new Tile(this.location.add(City.dirs[i]));
      }
    }
  }
  //if (this.life < Tile.prototype.safeDelay) Screen.append(this, 2);
  if (Screen.onScreen(this)) this.life++;
}
Tile.prototype.removeTile = function(){
  City.grid.remove(this);
  City.tiles.remove(this);
}

function GreenTile(location){
  var tile = new Tile(location);
  tile.life = Tile.prototype.safeDelay;
}