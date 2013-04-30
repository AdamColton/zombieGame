function $(elId){ return document.getElementById(elId); }
function rand(n){ return Math.floor(Math.random() * n);}
function map(f, arr){
  var l =[];
  for(var i=0; i<arr.length; i++){
    l.push(f(arr[i]));
  }
  return l;
}

var ResourceManager = {
  requests: [],
  doneLoadingCallback: null,
  loaded:0,
  loadingScreen: {
    image: new Image(),
    src: null,
    loaded: false,
    update: null
  },
  updateLoadingScreen: null,
  image: function(path){
    var img = new Image();
    ResourceManager.requests.push( {img: img, path: path} );
    return img;
  },
  sendRequests: function(){
    if (ResourceManager.loadingScreen.src != null && ResourceManager.loadingScreen.loaded == false){
      ResourceManager.loadingScreen.image.onload = function(){
        ResourceManager.loadingScreen.loaded = true;
        Screen.update(); 
        ResourceManager.sendRequests();
      }
      ResourceManager.loadingScreen.image.src = ResourceManager.loadingScreen.src+"?"+Settings.imageVersion;
    } else if (ResourceManager.requests.length == 0){
      ResourceManager.doneLoadingCallback();
    } else {
      var request = ResourceManager.requests.pop();
      request.img.onload = ResourceManager.sendRequests;
      request.img.src = request.path+"?"+Settings.imageVersion;
      ResourceManager.loaded++;
      if (ResourceManager.loadingScreen.update != null) ResourceManager.loadingScreen.update();
    }
  }
}

var Settings = {
  pi: 3.14159265358979323,
  screenSize: new Vector(800, 600),
  frameDelay: 25,
  layers: 7, //Background, city, background Decorations, shadows, prizes, characters + bullets, display
  radarEnabled: true,
  shadowsEnabled: true,
  heroWalkSpeed: 5,
  backgroundTileImages: 100,
  grassColor: [56,133,5],
  decorationsPerTile: 10,
  zombies: 30,
  zombieAttackRange: 280,
  zombieDamageRange: 53,
  zombieRemoveDistance: 3,
  bulletDamage: 5,
  bulletSpeed: 10,
  bulletLifeSpanInFrames: 30,
  weaponFireDelay: 15,
  recycleRate: 0.10,
  dropPrizeRate: .2,
  cityTilesPerCiv: 25,
  cityGrowRate: 1000,
  zombiesDoubleInDamage: 100000.0,
  zombiesDoubleInSpeed: 1000000.0,
  zombiesDoubleInHealth: 2000000.0,
  frameDelayIncreaseZombieCount: 2000,
  imageVersion: "9"
};