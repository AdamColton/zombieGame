<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>Zombie Game</title>
    </head>
    <body>
      <p>Project in progress - check back later, or take a look at these:</p>
      <ul>
        <li><a href="canvasDemo.php?100">Canvas Demo</a>: Simple experiment to see how many sprites the browser can handle</li>
        <li><a href="screenDemo.php?100">Screen Manager Demo</a>: Set up a framework to handle rendering many
        sprites to the screen in layers. Note that calculation reference frame has all the balls moving and the border
        staying in place, but the camera is set to track the blue ball so it appears stationary.</li>
        <li><a href="logKeys.php">Get Key Numbers</a>: Simple script for getting key event numbers.</li>
        <li><a href="inputDemo.php">Input Demo</a>: Shows what keys the input object tracks and lets you flip their value</li>
        <li><a href="scrollingDemo.php">Background Scrolling Demo</a>: Demonstration of a tiled background that can scroll
        endlessly. Also includes background decorations.</li>
        <li><a href="walkingDemo.php">Walking Demo</a>: Uses input to move a character around a field</li>
        <li><a href="zombieDemo.php">Zombie Demo</a>: Zombies will chase the hero</li>
        <li><a href="mouseDemo.php">Mouse Demo</a>: Registers mouse clicks (right, left and center) and scroll as well as UDLR/WASD keys. Center click will remove a ball.</li>
        <li><a href="weaponsDemo.php">Weapons Demo</a>: Introduces weapons and the ability to shoot zombies.</li>
        <li><a href="fixedDemo.php">Fixed Objects Demo</a>: Introduces fixed objects (barricades and turret guns).</li>
        <li><a href="hudDemo.php">HUD Demo</a>: Introduces a heads up display showing life, ammo and a map.</li>
        <li><a href="cityDemo.php">City Demo</a>: Introduces city tiles which grow to mark safe areas.</li>
        <li><a href="civilianDemo.php">Civilian Demo</a>: Introduces civilians. The base civilian will avoid zombies and try to find safe tiles. Some will act as doctors and merchants.</li>
        <li><a href="UnitTests.php">Unit Tests</a>: Much of this was developed with TDD, here are the tests I used.</li>
      </ul>
      <p>A few months ago (early 2010) I started on a Zombie game using the pygame framework
      after I got a ways into the development I ran into the issue that Pygame could not handle
      the number of sprites that I was using. My recent experiments with canvas show that Chrome
      and Safari are up to the challange (on a decently powered machine) and Firefox does pretty
      well (though the next release looks to improve upon that)*. The list above contains links to
      the experiments I'm writing along the way. Note that on some of them you will see a number
      trailing the URL, this can be adjusted to change the number of sprites.</p>
      
      <p>I have now run this on Firefox 4 and it runs as well, if not better than Chrome.</p>
      
      <h3>To-Do</h3>
      <ul>
        <li>
          Fix collision bug - This has something to do with the location instead of collisionBox.location being used
          as the key for the grid, but I'm not exactly sure.
        </li>
        <li>Sound</li>
        <li>Add a menu after loading screen</li>
        <li>Make a tutorial</li>
        <li>Melee weapons</li>
        <li>Mercnaries</li>
        <li>Repairmen (repair and reload)</li>
        <li>Have turrets run out of ammo</li>
        <li>Barrels</li>
        <li>Re-impliment green tiles - find rectangles and draw with scaling.</li>
        <li>Quick-keys for weapons</li>
        <li>Improve weapon delay use</li>
        <li>Change civilian wander behavior to go to a location, stay there for a while (~3sec) then move again</li>
        <li>Upgrade turrets</li>
      </ul>
    </body>
</html>
