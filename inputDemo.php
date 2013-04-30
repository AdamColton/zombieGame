<html>
  <head>
    <title>Input Demo</title>
    <script src="scripts/vector.js" type="text/javascript"></script>
    <script src="scripts/input.js" type="text/javascript"></script>
    <script>
      function display(){
        var output = "Up: " + input.up;
        output += "<br />Down: " + input.down;
        output += "<br />Left: " + input.left;
        output += "<br />Right: " + input.right;
        output += "<br />q: " + input.q;
        output += "<br />e: " + input.e;
        output += "<br />r: " + input.r;
        document.getElementById("display").innerHTML = output;
      }
      
      function init(){
        input.init(document.getElementById("body"));
        setInterval(display, 100);
      }
    </script>
  </head>
  <body onload="init();" id="body">
    <div id="display"></div>
  </body>
</html>