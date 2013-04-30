<html>
  <head>
    <title>Background Scrolling</title>
    <script src="scripts/vector.js" type="text/javascript"></script>
    <script src="scripts/linkedList.js" type="text/javascript"></script>
    <script src="scripts/sprite.js" type="text/javascript"></script>
    <script src="scripts/main.js" type="text/javascript"></script>
    <script src="scripts/screen.js" type="text/javascript"></script>
    <script src="scripts/loading.js" type="text/javascript"></script>
    <script src="scripts/background.js" type="text/javascript"></script>
    <script>
      var mockSprite = {
        location: new Vector(0,0),
        size: new Vector(10,10),
      }
      
      function startDemo(){
        Screen.ctx = $("buffer").getContext("2d");
        Screen.buffer = $("buffer");
        Screen.canvasCtx = $("canvas").getContext("2d");
        
        Screen.follow(mockSprite);
        background.initilizeDecorations();
        
        ResourceManager.doneLoadingCallback = function(){setInterval( Demo.update, Settings.frameDelay );Demo.update();}
        ResourceManager.sendRequests();
      }
      
      var Demo = {
        velocity: new Polar(5, Math.random()*2*Settings.pi),
        update: function(){
          mockSprite.location = mockSprite.location.add(Demo.velocity);
          background.update();
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