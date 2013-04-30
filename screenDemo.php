 <html>
  <head>
    <title>Screen Manager Demo</title>
    <script src="scripts/vector.js" type="text/javascript"></script>
    <script src="scripts/linkedList.js" type="text/javascript"></script>
    <script src="scripts/sprite.js" type="text/javascript"></script>
    <script src="scripts/main.js" type="text/javascript"></script>
    <script src="scripts/screen.js" type="text/javascript"></script>
    <script>
      var backgroundSprite = {
        location: new Vector(0,0),
        size: new Vector(800,600)
      }
        
      function startDemo(){
        Screen.ctx = $("buffer").getContext("2d");
        Screen.buffer = $("buffer");
        Screen.canvasCtx = $("canvas").getContext("2d");
        
        var redBall = new ResourceManager.image("img/ball.png");
        backgroundSprite.image = new ResourceManager.image("img/background.gif");
        
        var redBallSize = new Vector(30,30);
        var ballCount = parseInt(window.location.href.split('?')[1]);
        for(var i=0; i<ballCount; i++){
          Demo.balls.append( new Ball(redBall, redBallSize) );
        }
        
        var theBlueBall = new Ball( new ResourceManager.image("img/blueBall.png"), new Vector(40,40) );
        Demo.balls.append(theBlueBall);
        
        Screen.follow(theBlueBall);
        
        ResourceManager.doneLoadingCallback = function(){setInterval( Demo.update, Settings.frameDelay );}
        ResourceManager.sendRequests();
      }

      var Demo = {
        balls: new List(),
        update: function(){
          var ball = Demo.balls.first();
          while(ball != Demo.balls.end){
            ball.payload.update();
            ball = ball.next;
          }
          Screen.append(backgroundSprite,0);
          Screen.ctx.fillStyle = "rgb(255,255,255)";
          Screen.ctx.fillRect (0, 0, Settings.screenSize.x, Settings.screenSize.y);
          Screen.draw();
        }
      };

      function Ball(img, size){
        return {
          location: new Vector(rand(Settings.screenSize.x - size.x), rand(Settings.screenSize.y - size.y)),
          size: size,
          velocity: new Polar( 5, Math.random()*2*Settings.pi),
          image: img,
          drawFixed: false,
          update: function(){
            this.location.x += this.velocity.x;
            this.location.y += this.velocity.y;
            if (this.location.x < 0){
              this.location.x = -this.location.x;
              this.velocity.x = -this.velocity.x;
            }
            if (this.location.x > Settings.screenSize.x - this.size.x){
              this.location.x = (2*(Settings.screenSize.x - this.size.x)) - this.location.x;
              this.velocity.x = -this.velocity.x;
            }
            if (this.location.y < 0){
              this.location.y = -this.location.y;
              this.velocity.y = -this.velocity.y;
            }
            if (this.location.y > Settings.screenSize.y - this.size.y){
              this.location.y = (2*(Settings.screenSize.y - this.size.y)) - this.location.y;
              this.velocity.y = -this.velocity.y;
            }
            Screen.append(this, 1);
          },
          log: function(){
            console.log(this.location.x + ", " + this.location.y);
          }
        }
      }

      function rand(n){ return Math.floor(Math.random() * n);}
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