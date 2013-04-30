<html>
  <head>
    <title>Input Demo</title>
    <script src="scripts/vector.js" type="text/javascript"></script>
    <script src="scripts/linkedList.js" type="text/javascript"></script>
    <script src="scripts/sprite.js" type="text/javascript"></script>
    <script src="scripts/main.js" type="text/javascript"></script>
    <script src="scripts/screen.js" type="text/javascript"></script>
    <script src="scripts/input.js" type="text/javascript"></script>
    <script>
      var background = {
        image: new ResourceManager.image("img/background.gif"),
        location: new Vector(0,0),
        size: new Vector(800,600),
        update: function (){
          if (input.mouse.scroll.up){
            this.location.y += 50;
            input.mouse.scroll.up = false;
          }
          if (input.mouse.scroll.down){
            this.location.y -= 50;
            input.mouse.scroll.down = false;
          }
          Screen.append(this, 0);
        }
      }

      var keyIndicator = {
        left_t: new ResourceManager.image("img/arrows/left_t.png"),
        left_f: new ResourceManager.image("img/arrows/left_f.png"),
        right_t: new ResourceManager.image("img/arrows/right_t.png"),
        right_f: new ResourceManager.image("img/arrows/right_f.png"),
        up_t: new ResourceManager.image("img/arrows/up_t.png"),
        up_f: new ResourceManager.image("img/arrows/up_f.png"),
        down_t: new ResourceManager.image("img/arrows/down_t.png"),
        down_f: new ResourceManager.image("img/arrows/down_f.png"),
        left:{
          size: new Vector(100,64),
          location: new Vector(100,250)
        },
        right:{
          size: new Vector(100,64),
          location: new Vector(636,250)
        },
        up:{
          size: new Vector(100,64),
          location: new Vector(350,100)
        },
        down:{
          size: new Vector(100,64),
          location: new Vector(350,436)
        },
        update: function(){
         if(input.left){
           this.left.image = this.left_t;
         } else {
           this.left.image = this.left_f;
         }
         if(input.right){
           this.right.image = this.right_t;
         } else {
           this.right.image = this.right_f;
         }
         if(input.up){
           this.up.image = this.up_t;
         } else {
           this.up.image = this.up_f;
         }
         if(input.down){
           this.down.image = this.down_t;
         } else {
           this.down.image = this.down_f;
         }
          Screen.append(this.left, 1);
          Screen.append(this.right, 1);
          Screen.append(this.up, 1);
          Screen.append(this.down, 1);
        }
      }
      
      var mouseBallManager = {
        redBallImage: new ResourceManager.image("img/ball.png"),
        blueBallImage: new ResourceManager.image("img/blueBall.png"),
        balls: new List(),
        redBallSize: new Vector(30,30),
        blueBallSize: new Vector(40,40),
        addLeftFlag: true,
        addRightFlag: true,
        update: function(){
          var ball = mouseBallManager.balls.first();
          while( ball != mouseBallManager.balls.end){
            Screen.append(ball.payload , 3);
            ball = ball.next;
          }
          if (input.mouse.left.down){
            if (this.addLeftFlag){
              this.addLeftFlag = false;
              var test = this.balls.append( new redBall(new Vector( background.location.x + input.mouse.left.location.x, background.location.y + input.mouse.left.location.y )));
            }
          } else {
            this.addLeftFlag = true;
          }
          if (input.mouse.right.down){
            if (this.addRightFlag){
              this.addRightFlag = false;
              var test = this.balls.append( new blueBall( new Vector( background.location.x + input.mouse.right.location.x, background.location.y + input.mouse.right.location.y )));
            }
          } else {
            this.addRightFlag = true;
          }
          if (input.mouse.center.down){
            var point = new Vector( background.location.x + input.mouse.center.location.x, background.location.y + input.mouse.center.location.y );
            var removeList = [];
            ball = mouseBallManager.balls.first();
            while( ball != mouseBallManager.balls.end){
              if (pointInSprite(ball.payload, point)) removeList.push(ball);
              ball = ball.next;
            }
            for(var i in removeList) mouseBallManager.balls.remove(removeList[i]);
          }
        }
      }
      
      function redBall(location){
        return {
          image: mouseBallManager.redBallImage,
          size: mouseBallManager.redBallSize,
          location: new Vector(location.x - 15, location.y - 15)
        }
      }
      
      function blueBall(location){
        return {
          image: mouseBallManager.blueBallImage,
          size: mouseBallManager.blueBallSize,
          location: new Vector(location.x - 20, location.y - 20)
        }
      }
      
      function init(){
        var canvas = $("canvas");
        Screen.ctx = $("buffer").getContext("2d");
        Screen.buffer = $("buffer");
        Screen.canvasCtx = canvas.getContext("2d");
        
        input.init(canvas);
        
        Screen.follow(background);
        
        ResourceManager.loadingScreen.src = "img/loading.gif";
        ResourceManager.doneLoadingCallback = Demo.start;
        ResourceManager.sendRequests();
      }

      var Demo = {
        start: function(){
          setInterval( Demo.update, Settings.frameDelay );
          Demo.update();
        },
        update: function(){
          background.update();
          mouseBallManager.update();
          keyIndicator.update();
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
  <body onload="init();">
    <canvas
      id="canvas"
      width="800"
      height="600"
    ></canvas>
    <canvas id="buffer" width="800" height="600"></canvas>
  </body>
</html>