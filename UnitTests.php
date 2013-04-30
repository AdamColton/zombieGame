<html>
  <head>
    <title>Zombie Game Unit Tests</title>
    <script src="scripts/vector.js" type="text/javascript"></script>
    <script src="scripts/linkedList.js" type="text/javascript"></script>
    <script src="scripts/sprite.js" type="text/javascript"></script>
    <script src="scripts/grid.js" type="text/javascript"></script>
    <script src="scripts/main.js" type="text/javascript"></script>
    <script src="scripts/screen.js" type="text/javascript"></script>
    <script src="scripts/hero.js" type="text/javascript"></script>
    <script src="scripts/zombie.js" type="text/javascript"></script>
    <script src="scripts/weapons.js" type="text/javascript"></script>
    <script type="text/javascript">
      var testsPassed = 0;

      function runTests(){
        GeneralTests();
        VectorTests();
        SpriteTests();
        ScreenTests();
        LinkedListTests();
        GridTests();
        
        if ($("errors").innerHTML == "") $("errors").innerHTML = "<li class='pass'>Passed " + testsPassed + "</li>";
      }
      
      function GeneralTests(){
        var arr = [];
        var obj = {};
        assertTrue( arr[10] === undefined, "Undefined: I do think that word means what you think it does");
        assertTrue( obj["foo"] === undefined, "Undefined: I do think that word means what you think it does, at least for objects");
        //This next one throws an error. Use the one that follows it instead
        //assertTrue( DoesNotExist === undefined, "Undefined: I do think that word means what you think it does, at least for random crap");
        assertTrue( typeof DoesNotExist === "undefined", "Undefined: I do think that word means what you think it does, at least for random crap");
      }
      
      function LinkedListTests(){
        var list = new List();
        assertTrue( list.isEmpty(), "List is not empty before anything is added");
        var mockObject1 = {val: 1};
        var mockObject2 = {val: 2};
        list.append(mockObject1);
        assertTrue( typeof mockObject1.guid !== "undefined", "Appended object does not have a guid");
        assertTrue( list.length == 1, "After first append, list length is not 1");
        assertTrue( list.isEmpty() == false, "List is empty after appending mockObject1");
        list.append(mockObject2);
        assertTrue( list.length == 2, "After second append, list length is not 2");
        assertTrue( list.next(mockObject1).val == 2, "The next object after mockObject1 is not mockObject2");
        assertTrue( list.prev(mockObject2).val == 1, "The previous object before mockObject2 is not mockObject1");
        
        
        list.remove(mockObject2);
        assertTrue( list.length == 1, "After two appends and one remove, list length is not 1");
        
      }

      function ScreenTests(){
        var mockSprite = {};
        mockSprite.location = new Vector(10, 20);
        mockSprite.size = new Vector(15,30);
        Screen.ctx = {
          drawImage: function(sprite, x, y){
            console.log("Drawing sprite at " + x + ", " + y);
          }
        };
        Screen.follow(mockSprite);
        Screen.update();
        assertTrue( ScreenTop() == -265, "Screen top is not correct: " + ScreenTop());
        assertTrue( ScreenBottom() == 335, "Screen bottom is not correct: " + ScreenBottom());
        assertTrue( ScreenLeft() == -382, "Screen left is not correct: " + ScreenLeft());
        assertTrue( ScreenRight() == 418, "Screen right is not correct: " + ScreenRight());
        mockSprite.location = new Vector(20, 30);
        Screen.update();
        assertTrue( ScreenTop() == -255, "Screen top is not correct after move: " + ScreenTop());
        assertTrue( ScreenBottom() == 345, "Screen bottom is not correct after move: " + ScreenBottom());
        assertTrue( ScreenLeft() == -372, "Screen left is not correct after move: " + ScreenLeft());
        assertTrue( ScreenRight() == 428, "Screen right is not correct after move: " + ScreenRight());
        assertTrue( Screen.onScreen(mockSprite), "MockSprite is not on screen");
        Screen.append(mockSprite, 1);
        assertTrue( Screen.drawSprites[1][0] == mockSprite, "MockSprite is not registered to draw");
      }

      function SpriteTests(){
        var mockSprite = {};
        mockSprite.location = new Vector(10, 20);
        mockSprite.size = new Vector(15,30);
        assertTrue( SpriteLeft(mockSprite) == 10, "Sprite left is not correct: " + SpriteLeft(mockSprite));
        assertTrue( SpriteRight(mockSprite) == 25, "Sprite right is not correct: " + SpriteRight(mockSprite));
        assertTrue( SpriteTop(mockSprite) == 20, "Sprite top is not correct: " + SpriteTop(mockSprite));
        assertTrue( SpriteBottom(mockSprite) == 50, "Sprite bottom is not correct: " + SpriteBottom(mockSprite));
        var center = SpriteCenter(mockSprite);
        assertTrue( center.x == 17.5, "Sprite center x is not correct: " + center.x);
        assertTrue( center.y == 35, "Sprite center y is not correct: " + center.y);
      }

      function VectorTests(){
        var v1 = new Vector(10,10);
        var v2 = new Vector(3.1415, 1.816);
        assertTrue(v1.x == 10, "Vector does not have correct int X val");
        assertTrue(v1.y == 10, "Vector does not have correct int y val");
        assertTrue(v2.x == 3.1415, "Vector does not have correct float X val");
        assertTrue(v2.y == 1.816, "Vector does not have correct float y val");
        var v1_2 = v1.add(v2);
        assertTrue(v1_2.x == 13.1415, "Vector sum does not have correct float X val");
        assertTrue(v1_2.y == 11.816, "Vector sum does not have correct float y val");
        v1 = new Polar(10,0);
        assertTrue(v1.x == 0, "Polar vector does not have correct X val: " + v1.x);
        assertTrue(v1.y == 10, "Polar vector does not have correct y val: " + v1.y);
        v2 = v2.toInts();
        assertTrue(v2.x == 3, "Vector toInt does not have correct int X val: " + v2.x);
        assertTrue(v2.y == 2, "Vector toInt does not have correct int y val: " + v2.y);
        v1_2 = v1.subtract(v2);
        assertTrue(v1_2.x == -3, "Vector toInt does not have correct int X val: " + v1_2.x);
        assertTrue(v1_2.y == 8, "Vector toInt does not have correct int y val: " + v1_2.y);
        var arr = v1_2.arr();
        assertTrue(arr[0] == -3, "Vector to array does not have correct X val: " + arr[0]);
        assertTrue(arr[1] == 8, "Vector to array does not have correct y val: " + arr[1]);
        assertTrue(!v1.isEqual(v2), "Vector 1 should not equal vector 2");
        assertTrue(v1.isEqual(v1), "Vector 1 should equal vector 1");
        v1 = new Vector(5,4);
        v1 = v1.divideByNumber(2.0);
        assertTrue(v1.x == 2.5, "Vector number division does not have correct X val: " + v1.x);
        assertTrue(v1.y == 2, "Vector number division does not have correct y val: " + v1.y);
        v1 = new Vector(4,3);
        assertTrue(v1.magnitude() == 5, "Vector 1 magnitude is incorrect: " + v1.magnitude());
        assertTrue(0.9272 < v1.angle() && v1.angle() < 0.9273, "Vector 1 angle is incorrect: " + v1.angle());
        v1.setMagnitude(10);
        assertTrue(v1.magnitude() == 10, "Vector 1 magnitude is incorrect after setting: " + v1.magnitude());
        assertTrue(v1.x == 8, "Vector does not have correct int X val: " + v1.x);
        assertTrue(v1.y == 6, "Vector does not have correct int y val: " + v1.y);
        assertTrue(0.9272 < v1.angle() && v1.angle() < 0.9273, "Vector 1 angle is incorrect after magnitude change: " + v1.angle());
        v1.rotate(0.2);
        assertTrue(1.1272 < v1.angle() && v1.angle() < 1.1273, "Vector 1 angle is incorrect after rotation: " + v1.angle());
        v1 = new Vector(1,2);
        v2 = new Vector(5,5);
        assertTrue(Distance(v1,v2) == 5, "Distance calculation between vectors is wrong: " + Distance(v1,v2));
        v1 = new Vector(-3,4);
        assertTrue(v1.magnitude() == 5, "Magnitude 5 is wrong: " + v1.magnitude());
        
      }
      
      function GridTests(){
        var gl = GridLocation(new Vector(10,10));
        assertTrue( gl.x == 0, "GridLocation for 10,10 x is incorrect");
        assertTrue( gl.y == 0, "GridLocation for 10,10 y is incorrect");
        var gl = GridLocation(new Vector(-10,-10));
        assertTrue( gl.x == -40, "GridLocation for -10,-10 x is incorrect");
        assertTrue( gl.y == -40, "GridLocation for -10,-10 y is incorrect");
        var gl = GridLocation(new Vector(-40,-40));
        assertTrue( gl.x == -40, "GridLocation for -40,-40 x is incorrect");
        assertTrue( gl.y == -40, "GridLocation for -40,-40 y is incorrect");
        
        var testGrid = new Grid();
        var mockSprite = {};
        mockSprite.location = new Vector(-100,-100);
        mockSprite.size = new Vector(40,40);
        mockSprite.collisionBox = mockSprite;
        assertTrue( testGrid.occupied(mockSprite.location) == false, "testGrid is reporting that a square is occupied that should not be");
        testGrid.add(mockSprite);
        assertTrue( testGrid.occupied(mockSprite.location) , "testGrid is reporting that a square is not occupied that should be");
      }

      function assertTrue(testBool, error){
        if (testBool){
          $("output").innerHTML += ".";
          testsPassed++;
        } else {
          $("output").innerHTML += "<span class='error'>E</span>";
          $("errors").innerHTML += "<li>" + error + "</li>";
        }
      }
    </script>
    <style type="text/css">
      .error{
        color: red;
      }
      .pass{
        color: green;
      }
    </style>
  </head>
  <body onload="runTests();">
    <div id="output"></div>
    <ul id="errors"></ul>
  </body>
</html>