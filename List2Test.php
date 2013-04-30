<html>
  <head>
    <title>List 2 test</title>
    <script src="scripts/linkedList2.js" type="text/javascript"></script>
    <script>
    window.onload = function(){
      var testObj = {foo:"bar"};
      var testList = new List();
      testList.append(testObj);
      testList.remove(testObj);
      
      console.log(testList);
    }
    </script>
  </head>
  <body>
  This is a test of the new list system. The old list was a linked list which required a lot of node management.
  The new design uses guids to register objects.
  </body>
</html>