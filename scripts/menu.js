var MenuManager = {
  draw: "fixed",
  location: new Vector(0,0),
  paused: false,
  delay: 0,
  library: {
    barricade: new ResourceManager.image("img/menu/barricade.png"),
    civilian: new ResourceManager.image("img/menu/civilian.png"),
    close: new ResourceManager.image("img/menu/close.png"),
    doctor: new ResourceManager.image("img/menu/doctor.png"),
    fullHeal: new ResourceManager.image("img/menu/fullHeal.png"),
    merchant: new ResourceManager.image("img/menu/merchant.png"),
    partialHeal: new ResourceManager.image("img/menu/partialHeal.png"),
    paused: new ResourceManager.image("img/menu/paused.png"),
    superTurret: new ResourceManager.image("img/menu/superTurret.png"),
    barrel: new ResourceManager.image("img/menu/barrel.png"),
    turret: new ResourceManager.image("img/menu/turret.png")
  },
  main: function(){
    MenuManager.update();
    var i,j;
    for(i=0; i<MenuManager.screenshot.length; i++){
      for(j=0; j<MenuManager.screenshot[i].length; j++){
        Screen.drawSprites[i][j] = MenuManager.screenshot[i][j];
      }
    }
    Screen.append(MenuManager.header,5);
    for(i=0; i<MenuManager.options.length; i++){
      Screen.append(MenuManager.options[i],5)
      if (input.mouse.left.down && pointInSprite(MenuManager.options[i], input.mouse.location) && MenuManager.delay <= 0){
        if (typeof MenuManager.options[i].func != "undefined") MenuManager.options[i].func();
        MenuManager.delay = 5;
      }
    }
    HUD.update();
    crosshair.update();
    Screen.draw();
  },
  activate: function(){
    MenuManager.startMenu = true;
    MenuManager.paused = true;
    Demo.mode = MenuManager.main;
  },
  deactivate: function(){
    MenuManager.paused = false;
    MenuManager.delay = 20;
    Demo.mode = Demo.GameLoop;
  },
  update: function(){
    MenuManager.delay--;
    if (input.esc && !MenuManager.paused && MenuManager.delay < 0){
      MenuManager.setMenu(MenuManager.library.paused, []);
      MenuManager.activate();
    } else if (input.esc && MenuManager.paused && MenuManager.delay < 0){
      MenuManager.deactivate();
    }
    if (MenuManager.startMenu){
      MenuManager.startMenu = false;
      MenuManager.delay = 20;
      getScreenshot();
    }
  },
  setMenu:function(headerImage, optionsArr){
    MenuManager.header = {
      image: headerImage,
      draw : "fixed",
      location: new Vector(90,10)
    };
    MenuManager.options = [{
      image: MenuManager.library.close,
      draw: "fixed",
      location: new Vector(587,320),
      size: new Vector(160,120),
      func: MenuManager.deactivate
    }];
    for(var i=0; i<optionsArr.length; i++){
      MenuManager.options.push({
        image: optionsArr[i].image,
        draw: "fixed",
        location: new Vector(45+((i%4)*180),190+Math.floor(i/4)*130),
        size: new Vector(160,120),
        func: optionsArr[i].func
      });
    }
    return MenuManager;
  },
  text: "",
  options: ""
}

function getScreenshot(){
  var i,j;
  MenuManager.screenshot = [];
  for(i=0; i<Screen.drawSprites.length; i++){
    MenuManager.screenshot.push([]);
    for(j=0; j<Screen.drawSprites[i].length; j++){
      MenuManager.screenshot[i][j] = Screen.drawSprites[i][j];
    }
  }
}

function Cheat(){
  Fixed.droppable.count[0] += 20;
  Fixed.droppable.count[1] += 20;
}