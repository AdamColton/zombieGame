var crosshair = {
  image: new ResourceManager.image("img/crosshair.png"),
  size: new Vector(30,30),
  location: new Vector(30,30),
  draw: "fixed",
  update: function(){
    crosshair.location.x = input.mouse.location.x - crosshair.size.x / 2;
    crosshair.location.y = input.mouse.location.y - crosshair.size.y / 2;
    Screen.append(this,6);
  }
};