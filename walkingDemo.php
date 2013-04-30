<html>
  <head>
    <title>Walking Around</title>
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
    <script src="scripts/input.js" type="text/javascript"></script>
    <script>
      
      function startDemo(){
        var canvas = $("canvas");
        Screen.ctx = $("buffer").getContext("2d");
        Screen.buffer = $("buffer");
        Screen.canvasCtx = canvas.getContext("2d");
        
        Screen.follow(Hero);
        background.initilizeDecorations();
        input.init(canvas);
        
        ResourceManager.doneLoadingCallback = function(){setInterval( Demo.update, Settings.frameDelay );Demo.update();}
        ResourceManager.sendRequests();
      }
      
      var Demo = {
        velocity: new Polar(5, Math.random()*2*Settings.pi),
        update: function(){
          Mobile.update();
          Hero.update();
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
    </style>
  </head>
  <body onload="startDemo();">
    <canvas id="canvas" width="800" height="600"></canvas>
    <canvas id="buffer" width="800" height="600"></canvas>
  </body>
</html>