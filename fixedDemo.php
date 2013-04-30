<html>
  <head>
    <title>Fixed Demo</title>
    <script src="scripts/vector.js" type="text/javascript"></script>
    <script src="scripts/linkedList.js" type="text/javascript"></script>
    <script src="scripts/grid.js" type="text/javascript"></script>
    <script src="scripts/sprite.js" type="text/javascript"></script>
    <script src="scripts/mobile.js" type="text/javascript"></script>
    <script src="scripts/main.js" type="text/javascript"></script>
    <script src="scripts/screen.js" type="text/javascript"></script>
    <script src="scripts/background.js" type="text/javascript"></script>
    <script src="scripts/hero.js" type="text/javascript"></script>
    <script src="scripts/zombie.js" type="text/javascript"></script>
    <script src="scripts/weapons.js" type="text/javascript"></script>
    <script src="scripts/fixed.js" type="text/javascript"></script>
    <script src="scripts/crosshair.js" type="text/javascript"></script>
    <script src="scripts/input.js" type="text/javascript"></script>
    <script type="text/javascript">
      function startDemo(){
        console.log(console);
        console.debug();
        Screen.ctx = $("buffer").getContext("2d");
        Screen.buffer = $("buffer");
        var canvas = $("canvas")
        Screen.canvasCtx = canvas.getContext("2d");

        Screen.follow(Hero);
        background.initilizeDecorations();

        Zombies.init();
        input.init(canvas);
        
        new TurretGun(new Vector(100,0));
        new Barricade(new Vector(100,100));

        ResourceManager.loadingScreen.src = "img/loading.gif";
        ResourceManager.doneLoadingCallback = function(){setInterval( Demo.update, Settings.frameDelay );Demo.update();}
        //ResourceManager.doneLoadingCallback = function(){Demo.update();}
        ResourceManager.sendRequests();
      }

      var Demo = {
        update: function(){
          Mobile.update();
          Hero.update();
          crosshair.update();
          Zombies.update();
          Fixed.update();
          Weapons.selected.update();
          background.update();
          Mobile.resolve();
          Screen.draw();
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