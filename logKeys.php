<html>
  <head>
    <title>Log Keys</title>
    <script src="scripts/input.js" type="text/javascript"></script>
    <script>
      function logKey(e){
        if(window.event){
          // IE
          document.getElementById("display").innerHTML += e.keyCode + "<br />";
        }else if(e.which){
          // Netscape/Firefox/Opera
          document.getElementById("display").innerHTML += e.which + "<br />";
        }
      }
    </script>
  </head>
  <body onkeydown="logKey(event);">
    <div id="display"></div>
  </body>
</html>