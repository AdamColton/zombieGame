var Mobile = {
  checkCell:{
    size: new Vector(40,40)
  },
  update: function(){
    this.grid = new Grid();
    this.array = [];
  },
  append: function(mobileSprite){
    this.grid.add(mobileSprite);
    this.array.push(mobileSprite);
  },
  resolve: function(){
    for(var i=0; i < this.array.length; i++){
      if (Screen.onScreen(this.array[i]) || Math.random() < .01) Mobile.checkCollisions(this.array[i]);
    }
  },
  checkCollisions: function(sprite){
    for(i in Mobile.dirs){
      var dir = Mobile.dirs[i];
      var checkLocation = sprite.location.add(dir);
      Mobile.checkCell.location = GridLocation(checkLocation);
      if (SpriteCollision(sprite.collisionBox, Mobile.checkCell)){
        var spritesAtLocation = Mobile.grid.get(checkLocation);
        var checkSprite = spritesAtLocation.first();
        while(checkSprite != spritesAtLocation.end){
          if (sprite != checkSprite.payload && SpriteCollision(sprite.collisionBox, checkSprite.payload.collisionBox)){
            Decollide(sprite, checkSprite.payload);
          }
          checkSprite = checkSprite.next;
        }
      }
    }
  },
  dirs: [new Vector(-40,-40),new Vector(-40,0),new Vector(-40,40),new Vector(0,-40),new Vector(0,0),new Vector(0,40),new Vector(40,-40),new Vector(40,0),new Vector(40,40)]
}