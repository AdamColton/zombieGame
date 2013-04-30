<html>
  <head>
    <title>Weapons Demo</title>
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
    <script src="scripts/crosshair.js" type="text/javascript"></script>
    <script src="scripts/input.js" type="text/javascript"></script>
    <script type="text/javascript">
      function startDemo(){
        var canvas = $("canvas");
        Screen.ctx = $("buffer").getContext("2d");
        Screen.buffer = $("buffer");
        Screen.canvasCtx = canvas.getContext("2d");

        Screen.follow(Hero);
        background.initilizeDecorations();

        Zombies.init();
        input.init(canvas);
        
        ResourceManager.loadingScreen.src = "img/loading.gif";

        ResourceManager.doneLoadingCallback = function(){setInterval( Demo.update, Settings.frameDelay );Demo.update();}
        //ResourceManager.doneLoadingCallback = function(){Demo.update();}
        ResourceManager.sendRequests();
      }

      var Demo = {
        update: function(){
          Mobile.update()
          Hero.update();
          crosshair.update();
          Zombies.update();
          Weapons.selected.update();
          background.update();
          Mobile.resolve();
          Screen.draw();
        }
      }
      
      //Settings.zombies = 5;
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