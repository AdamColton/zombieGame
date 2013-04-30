<html>
  <head>
    <title>Canvas Test</title>
    <script>
      function $(elId){ return document.getElementById(elId); }
      function rand(n){ return Math.floor(Math.random() * n);}

      function init(){
        // Set Static properties for Game
        Game.ctx = $("buffer").getContext("2d");
        Game.buffer = $("buffer");
        Game.canvas = $("canvas").getContext("2d");
        Game.ballCount = parseInt(window.location.href.split('?')[1]);

        // Set Static properties for Ball
        Ball.width = 30;
        Ball.height = 30;
        Ball.speed = 15;

        var img = new Image();
        img.src = "img/ball.png";
        for(var i = 0; i<Game.ballCount; i++){
          Game.balls.push(new Ball(img));
        }
        //start the game
        Game.frame();
      }

      var Game = {
        balls: [],
        width: 800,
        height: 600,
        frameDelay: 30,
        frame: function(){
          setTimeout(Game.frame, Game.frameDelay);
          Game.ctx.fillStyle = "rgb(0,0,0)";
          Game.ctx.fillRect (0, 0, 800, 600);
          for(var i=0; i<Game.ballCount; i++){
            Game.balls[i].calculateFrame();
            Game.balls[i].draw(Game.ctx);
          }
          Game.canvas.drawImage(Game.buffer, 0, 0);
        }
      };

      function Ball(img){
        return {
          x: rand(Game.width - Ball.width),
          y: rand(Game.height - Ball.height),
          dx: Math.random()*Ball.speed*2 - Ball.speed,
          dy: Math.random()*Ball.speed*2 - Ball.speed,
          calculateFrame: function(){
            this.x += this.dx;
            this.y += this.dy;
            if (this.x < 0){
              this.x = -this.x;
              this.dx = -this.dx;
            }
            if (this.x > 770){
              this.x = (2*770) - this.x;
              this.dx = -this.dx;
            }
            if (this.y < 0){
              this.y = -this.y;
              this.dy = -this.dy;
            }
            if (this.y > 570){
              this.y = (2*570) - this.y;
              this.dy = -this.dy;
            }
          },
          log: function(){
            console.log(this.x + ", " + this.y)
          },
          draw: function(ctx){
            ctx.drawImage(img, this.x, this.y);
          }
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
    <canvas id="buffer" width="800" height="600"></canvas>
    <canvas id="canvas" width="800" height="600"></canvas>
  </body>
</html>