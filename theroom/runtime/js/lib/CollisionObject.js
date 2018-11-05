
/**
 * testCollisionObjects - on frame handler for collision testing moving object.
 *
 * @return {type}  description
 */
function testCollisionObjects(){
  if(!movingObject) return;

  [movingObject].forEach(function(obj, i){
    if(obj.collisionStatic) return;

    var objHit = false;

    collisionObjects.forEach(function(other){
      if(other === obj) return;
      var test = collisionTest(obj, other);
      test.forEach(function(r){
       v = new THREE.Vector3();
       var hit = false;
       r.forEach(function(t){
         v.add(t.point.clone().sub(obj.position));
         hit = true;
       });
       if(other.collisionStatic){
         v.normalize();
         v.multiplyScalar(0.03);
         obj.position.sub(v);
         obj.updateMatrix();
         obj.updateMatrixWorld(true);
        } else {
          if(hit) objHit = true;
        }
      });
    });
  });
}
