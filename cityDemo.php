<html>
  <head>
    <title>City Demo</title>
    <script src="scripts/vector.js" type="text/javascript"></script>
    <script src="scripts/linkedList.js" type="text/javascript"></script>
    <script src="scripts/grid.js" type="text/javascript"></script>
    <script src="scripts/sprite.js" type="text/javascript"></script>
    <script src="scripts/mobile.js" type="text/javascript"></script>
    <script src="scripts/main.js" type="text/javascript"></script>
    <script src="scripts/screen.js" type="text/javascript"></script>
    <script src="scripts/loading.js" type="text/javascript"></script>
    <script src="scripts/background.js" type="text/javascript"></script>
    <script src="scripts/hero.js" type="text/javascript"></script>
    <script src="scripts/zombie.js" type="text/javascript"></script>
    <script src="scripts/weapons.js" type="text/javascript"></script>
    <script src="scripts/fixed.js" type="text/javascript"></script>
    <script src="scripts/city.js" type="text/javascript"></script>
    <script src="scripts/hud.js" type="text/javascript"></script>
    <script src="scripts/crosshair.js" type="text/javascript"></script>
    <script src="scripts/input.js" type="text/javascript"></script>
    <script type="text/javascript">
      function startDemo(){
        var canvas = $("canvas");
        Screen.ctx = $("buffer").getContext("2d");
        Screen.buffer = $("buffer");
        Screen.canvasCtx = canvas.getContext("2d");

        Screen.follow(Hero);
        Screen.update();
        background.initilizeDecorations();

        Zombies.init();
        
        //Build starting City
        for(var x=-80; x<=80; x+=40){
          for(var y=-80; y<=80; y+=40){
            GreenTile(new Vector(x,y));
          }
        }
        new TurretGun(new Vector(-120,-120));
        new TurretGun(new Vector(-120,120));
        new TurretGun(new Vector(120,-120));
        new TurretGun(new Vector(120,120));
        
        new Barricade(new Vector(160,120));
        new Barricade(new Vector(160,160));
        new Barricade(new Vector(120,160));
        
        new Barricade(new Vector(160,-120));
        new Barricade(new Vector(160,-160));
        new Barricade(new Vector(120,-160));
        
        new Barricade(new Vector(-160,120));
        new Barricade(new Vector(-160,160));
        new Barricade(new Vector(-120,160));
        
        new Barricade(new Vector(-160,-120));
        new Barricade(new Vector(-160,-160));
        new Barricade(new Vector(-120,-160));
        
        input.init(canvas);

        ResourceManager.doneLoadingCallback = function(){setInterval( Demo.update, Settings.frameDelay );Demo.update();}
        //ResourceManager.doneLoadingCallback = function(){Demo.update();}
        ResourceManager.sendRequests();
      }
      
      var GameOver = {
        image: new ResourceManager.image("img/game_over.gif"),
        location: new Vector(0,0),
        draw: "fixed"
        
      }

      var Demo = {
        update: function(){
          if (Hero.health >0 ){
            Mobile.update()
            Hero.update();
            HUD.update();
            crosshair.update();
            Zombies.update();
            City.update();
            Fixed.update();
            Weapons.selected.update();
            background.update();
            Mobile.resolve();
            Screen.draw();
          } else {
            Screen.append(GameOver,1);
            Screen.draw();
          }
        }
      }
      
    </script>
    <style>
      #buffer{
        display: none;
      }
      canvas{
        cursor: none;
      }
    </style>
  </head>
  <body onload="startDemo();">
    <canvas
      id="canvas"
      width="800"
      height="600"
    ></canvas>
    <canvas id="buffer" width="800" height="600"></canvas>
  </body>
</html>