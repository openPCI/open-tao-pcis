var Scoring = new function(){
  function findShape(shape, useColor, wsColor){
    var result = [];
    shape = shape.slice();
    var padding = null;
    shape.forEach(function(voxel){
      if(!padding){
        padding = voxel.p.slice();
      }
      voxel.p.forEach(function(n,i){
        voxel.p[i] = n - padding[i];
      });
    });
    var foundVoxels = [];
    for(var rotation = 0; rotation < 4; rotation++){
      var a = new THREE.Vector3( 0, 1, 0 );
      var s = shape.map(function(v){
        var vec = new THREE.Vector3();
        var p = vec.fromArray(v.p).applyAxisAngle( a, rotation * (Math.PI/2) ).toArray().map(function(i){ return Math.round(i); });
        return {
          p : p,
          c : v.c,
          ws: v.ws
        };
      });
      voxels.forEach(function(v){
        if(checkShapeAt(s, v.position, useColor, wsColor)){
          if(foundVoxels.indexOf(v) == -1){
            foundVoxels.push(v);
            result.push(v.position.toArray());
          }
        };
      });
    }
    return result;
  }

  function checkShapeAt(shape, position, useColor, wsColor){
    var sp = new THREE.Vector3();

    var noMatch = shape.some(function(s){
      sp.fromArray(s.p);
      sp = position.clone().add(sp);

      var res = voxels.some(function(v){
        return v.position.equals(sp) && (!useColor || v.material.color.getHex() == s.c);
      });
      return (s.ws || s.c == wsColor) ? res : !res;
    });

    return !noMatch;
  }

  this.find = findShape;
}();
