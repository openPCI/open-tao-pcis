function score(path){
  var stier = [1,10,186, 48,46];
  var camping = [92,94,68,74,77,80,160,148,88,83,80,73,128];
  var campingvogne = [160,195,163,190,171,187];
  var spisesteder = [217,227];
  var scene = [234,233,232,231,230,229,214,213,212,211,210,209,208,207,228,204,203,202,201,200,198,197,196,195,194,193,192,191,190];

  var stier_visited = 1;
  var camping_visited = 1;
  var campingvogne_visited = 1;
  var spisesteder_visited = 1;
  var slutter_ved_scene = scene.indexOf(path[path.length-1]) > -1 ? 1 : 0;
  path.forEach(function(i){
    if(stier.indexOf(i) > -1) stier_visited = 0;
    if(camping.indexOf(i) > -1) camping_visited = 0;
    if(campingvogne.indexOf(i) > -1) campingvogne_visited = 0;
    if(spisesteder.indexOf(i) > -1) spisesteder_visited = 0;
  });

  return {
    "slutter_ved_scene" : slutter_ved_scene,
    "undgik_campingvognspladser" : campingvogne_visited,
    "undgik_campingpladser" : camping_visited,
    "undgik_stier" : stier_visited,
    "undgik_spisesteder" : spisesteder_visited
  }
}
