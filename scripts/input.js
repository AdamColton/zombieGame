var input = {
  up: false,
  down: false,
  left: false,
  right: false,
  e: false,
  q: false,
  r: false,
  space: false,
  esc: false,
  enter: false,
  backspace: false,
  mouse:{
    right: {
      down: false,
      location: new Vector(0,0)
    },
    left: {
      down: false,
      location: new Vector(0,0)
    },
    center: {
      down: false,
      location: new Vector(0,0)
    },
    scroll: {
      up: false,
      down: false
    },
    location: new Vector(0,0)
  },
  keyEvent:function(e, val){
    switch(input.getKeynum(e)){
      case 38:
      case 87:
        input.up = val;
        break;
      case 40:
      case 83:
        input.down = val;
        break;
      case 37:
      case 65:
        input.left = val;
        break;
      case 39:
      case 68:
        input.right = val;
        break;
      case 69:
        input.e = val;
        break;
      case 81:
        input.q = val;
        break;
      case 82:
        input.r = val;
        break;
      case 27:
        input.esc = val;
        break;
      case 13:
        input.enter = val;
        break;
      case 32:
        input.space = val;
        break;
      case 8:
      case 46:
        input.backspace = val;
        break;
      case 17:
      case 116:
      case 123:
        //Allows the user to hit F5 or ctrl+F5
        return true;
    }
    return false;
  },
  keydownEvent:function(e){
    return input.keyEvent(e, true);
  },
  keyupEvent:function(e){
    return input.keyEvent(e, false);
  },
  mousedownEvent:function(e){
    if (e.button === 0) { input.updateMouseButtonDown(input.mouse.left, e); }
    if (e.button == 2) { input.updateMouseButtonDown(input.mouse.right, e); }
    if (e.button == 1) { input.updateMouseButtonDown(input.mouse.center, e); }
    return false;
  },
  mouseupEvent:function(e){
    if (e.button === 0) { input.updateMouseButtonUp(input.mouse.left); }
    if (e.button == 2) { input.updateMouseButtonUp(input.mouse.right); }
    if (e.button == 1) { input.updateMouseButtonUp(input.mouse.center); }
    return false;
  },
  mousewheelEvent:function(e){
    if ( e.wheelDelta > 0 || e.detail < 0 ) { input.mouse.scroll.up = true; }
    if ( e.wheelDelta < 0 || e.detail > 0 ) { input.mouse.scroll.down = true; }
    return false;
  },
  mousemoveEvent:function(e){
    input.mouse.location.x = e.layerX - e.currentTarget.offsetLeft;
    input.mouse.location.y = e.layerY - e.currentTarget.offsetTop;
    input.target.onmousemove = null;
    setTimeout(input.setMouseMoveEventCapture, 25);
  },
  setMouseMoveEventCapture: function(){
    input.target.onmousemove = input.mousemoveEvent;
  },
  updateMouseButtonDown:function(button, event){
    button.down = true;
    button.location.x = event.layerX - event.currentTarget.offsetLeft;
    button.location.y = event.layerY - event.currentTarget.offsetTop;
  },
  updateMouseButtonUp:function(button){
    button.down = false;
  },
  getKeynum: function(e){
    if(window.event){
      // IE
      return e.keyCode;
    }else if(e.which){
      // Netscape/Firefox/Opera
      return e.which;
    }
  },
  init: function(target){
    input.target = target;
    window.onkeydown = input.keydownEvent;
    window.onkeyup = input.keyupEvent;
    
    target.addEventListener('mousewheel', input.mousewheelEvent, true);
    target.addEventListener('DOMMouseScroll', input.mousewheelEvent, true);
    target.onmousedown = input.mousedownEvent;
    target.onmouseup = input.mouseupEvent;
    target.oncontextmenu = function(){return false;}
    input.target.onmousemove = input.mousemoveEvent;
  }
};