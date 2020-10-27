var Scoring = new function(){
  function findShape(shape, useColor, wsColor=-1){
// 	  console.log("Ny form")
    var result = [];
    shape = shape.slice();
	// Don't have a wsColor voxel as the first voxel... Put them to the end.
	var tries=0
	while(shape[0].c==wsColor && tries<shape.length) {
		shape.push(shape.shift())
		tries++
	}
    var padding = null;
	// Make sure one voxel is at position 0
    shape.forEach(function(voxel){
      if(!padding){
        padding = voxel.p.slice();
      }
      voxel.p.forEach(function(n,i){
        voxel.p[i] = n - padding[i];
      });
    });
    var foundVoxels = [];
    for(var rotation = 0; rotation < 4; rotation++){//4
// 		console.log("Ny rotation")
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
			//console.log("SUCCESS")
          if(foundVoxels.indexOf(v) == -1){
            foundVoxels.push(v);
            result.push(v.position.toArray());
          }
        }// else console.log("Failure");
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
		// Does a voxel exist at this position (if useColor, then: with the same color as the original)?
// 		   if( v.position.equals(sp)) {console.log(v.position) 
// 		   console.log(sp)}
        return v.position.equals(sp) && ((!useColor || s.c == wsColor ) || (v.material.color.getHex() == s.c ));
      });
//  	   console.log(s)
	// If this was the wsColor and there is a voxel here, it is wrong... (ws is not implemented)
       return (s.c == wsColor) ? res : !res; //s.ws || 
    });

    return !noMatch;
  }

  this.find = findShape;
}();
