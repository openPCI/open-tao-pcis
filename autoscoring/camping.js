function score(data){
  var path = data[0];
  var stier = [1,10,186, 48,46];
  var camping = [92,94,68,74,77,80,160];
  var campingvogne = [195,163,190];
  var spisesteder = [217,227];
  var scene = [234,233,232,231,230,229,214,213,212,211,210,209,208,207,228,204,203,202,201,200,198,197,196,195,194,193,192,191,190];

  var stier_visited = 0;
  var camping_visited = 0;
  var spisesteder_visited = 0;
  var slutter_ved_scene = scene.indexOf(path[path.length-1]) > -1;
  path.forEach(function(i){
    stier_visited = stier.indexOf(i) > -1;
    camping_visited = camping.indexOf(i) > -1;
    spisesteder_visited = spisesteder.indexOf(i) > -1;
  });

  return {
    "slutter_ved_scene" : slutter_ved_scene ? 1 : 0,
    "undgik_campingpladser" : camping_visited ? 0 : 1,
    "undgik_stier" : stier_visited ? 0 : 1,
    "undgik_spisesteder" : spisesteder_visited ? 0 : 1
  }
}
