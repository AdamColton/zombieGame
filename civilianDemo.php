<?php
  $version = 96;
?>
<html>
  <head>
    <title>Civilian Demo</title>
    <script src="scripts/vector.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/linkedList.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/grid.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/sprite.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/mobile.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/main.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/screen.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/loading.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/background.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/hero.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/zombie.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/weapons.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/fixed.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/menu.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/civilian.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/city.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/hud.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/crosshair.js?<?=$version?>" type="text/javascript"></script>
    <script src="scripts/input.js?<?=$version?>" type="text/javascript"></script>
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
        new Merchant(new Vector(100,0));

        Demo.mode = Demo.Wait;
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
          Screen.append(ResourceManager.loadingScreen, 1);
          Screen.append({
            draw: "fixedtext",
            location: new Vector(100,400),
            text: "Press Space to start (after reading the instructions)",
            font: "20pt sans-serif",
            color: "rgb(255,0,0)",
          }, 2);
          Screen.draw();
          Demo.mode();
        },
        Wait: function(){
          if (input.space) Demo.mode = Demo.GameLoop;
        },
        GameLoop: function(){
            if (Hero.health <=0 ) Demo.mode = Demo.GameOver;
            Mobile.update()
            Hero.update();
            Zombies.update();
            Civilians.update();
            City.update();
            Fixed.update();
            Weapons.selected.update();
            background.update();
            Mobile.resolve();
            MenuManager.update();
            HUD.update();
            crosshair.update();
            Screen.draw();
        },
        GameOver: function(){
          Screen.append(GameOver,1);
          crosshair.update();
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
    <h3>Instructions</h3>
    <ul>
      <li>Move: Arrow keys or WASD</li>
      <li>Fire: Left mouse button</li>
      <li>Drop Structure: Right mouse button</li>
      <li>Remove Structure: Backspace or Delete (with the cursor over the civilian you want to talk to)</li>
      <li>Change Selected Structure: Scroll</li>
      <li>Change Weapon: Q/E</li>
      <li>Talk to Civilian: Space (with the cursor over the civilian you want to talk to)</li>
      <li>Reload: R</li>
    </ul>
    <div>
      The goal of the game is to build a stronghold to survive as long as you can.
      You will be able to save civilians, some of them can help you out - move
      the cursor over them and hit space to buy from them. Dropping structures (turret guns and barricades)
      can help fortify your stronghold. You will start the game stocked with 2 turret guns 
      and 5 barricades, which can be used right away (right click). Some zombies will drop loot in the form
      of money or ammo. Try to get this as large as possible.
    </div>
    <table>
      <tr>
        <td><img src="img/zombies/zombie.png" /></td>
        <td>Bad!</td>
      </tr>
      <tr>
        <td><img src="img/zombies/superZombie.png" /></td>
        <td>Really Bad!</td>
      </tr>
      <tr>
        <td><img src="img/hero.png" /></td>
        <td>Good!</td>
      </tr>
      <tr>
        <td><img src="img/merchant.png" /></td>
        <td>Merchant (move your cursor over them and hit space to talk). You start with a merchant in your base.</td>
      </tr>
      <tr>
        <td><img src="img/doctor.png" /></td>
        <td>Doctor (move your cursor over them and hit space to talk). You cannot be healed until you rescue a doctor. Keep a look out for grey dots on the mini-map.</td>
      </tr>
      <tr>
        <td><img src="img/weapons/pistol.png" /></td>
        <td>Pistol: Starting weapon, unlimited ammo. Short range, low power, slow fire rate.</td>
      </tr>
      <tr>
        <td><img src="img/weapons/grenade.png" /></td>
        <td>Grenade: You can pick up grenades right away, but you don't start with any.</td>
      </tr>
      <tr>
        <td><img src="img/weapons/automatic.png" /></td>
        <td>Automatic: Slightly less powerful than the pistol, but a much higher fire rate. You will get the automatic after you've saved one civilian (not the merchant you start with).</td>
      </tr>
      <tr>
        <td><img src="img/weapons/shotgun.png" /></td>
        <td>Shotgun: Fires a blast of ammo capable of hitting several targets, doing a whole lot of damage and knocking a zombie clear across a room. Also awarded for saving civilians (but I won't say how many)</td>
      </tr>
      <tr>
        <td><img src="img/weapons/shotgun.png" /></td>
        <td>Rifle: Only holds 3 shots but with a fast reload, it's not a problem. Very high damage and range. Also awarded.</td>
      </tr>
      <tr>
        <td><img src="img/weapons/minigun.png" /></td>
        <td>Minigun: It's a mini-gun. You get it when you save a bunch of people.</td>
      </tr>
      <tr>
        <td><img src="img/3dBarricade.png" /></td>
        <td>Barricade. This can take quite a bit damage before being destroyed - 8x as much as a turret.</td>
      </tr>
      <tr>
        <td><img src="img/turretGun.png" /></td>
        <td>Turret. Does damage to zombies as they approach. This cannot take much damage. It's also prone to being swarmed.</td>
      </tr>
      <tr>
        <td><img src="img/superTurretIcon.png" /></td>
        <td>Super Turret. Turret guns big brother. Does more damage, faster and over a wider range.</td>
      </tr>
      <tr>
        <td><img src="img/barrel.png" /></td>
        <td>Barrel. This gas filled barrel will detonate when a zombie attacks it.</td>
      </tr>
    </table>
  </body>
</html>