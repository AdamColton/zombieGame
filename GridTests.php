<html>
  <head>
    <title>Grid Tests</title>
    <script src="scripts/linkedList.js"></script>
    <script src="scripts/vector.js"></script>
    <script src="scripts/grid.js"></script>
    <script>
      var testGrid = new Grid();
      
      function runTests(){
        var v1 = new Vector(10, 10);
        testGrid.get(v1).append("Hello");
        v1 = new Vector (30,25);
        alert( testGrid.get(v1).first().payload );
      }
    </script>
  </head>
  <body onload="runTests();">
    <p>I use a grid of 40x40 pixel tiles for collision detection. Everything in the game has a footprint this size
    (or smaller) so whatever tile you are located in, you can only collide with things in that tile or the 8
    surrounding tiles. The tests here were done to find a method to store these lists.</p>
  </body>
</html>