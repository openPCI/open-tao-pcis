var Scoring = new function(){

  function findShape(shape, useColor){
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

    voxels.forEach(function(v){
      if(checkShapeAt(shape, v.position, useColor)){
        result.push(v.position.toArray());
      };
    });
    return result;
  }

  function checkShapeAt(shape, position, useColor, wsColor){
    var sp = new THREE.Vector3();
    var bb = new THREE.Box3();
    var noMatch = shape.some(function(s){
      sp.fromArray(s.p);
      sp = position.clone().add(sp);

      var res = voxels.some(function(v){
        bb.setFromObject(v);
        var bbCheck = bb.containsPoint(sp);
        return bb.containsPoint(sp) && (!useColor || v.material.color.getHex() == s.c);
      });

      return s.ws || s.c == wsColor ? res : !res;
    });

    return !noMatch;
  }

  this.find = findShape;

}();
