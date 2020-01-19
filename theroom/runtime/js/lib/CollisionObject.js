
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



/**
 * collisionTest - Test collision between two objects by raytracing from the vertex "normals".
 *
 * @param  {type} test   Object A
 * @param  {type} target Object B
 * @return {type}        list of collision points
 */
function collisionTest(test, target){
  var testObjects = [];
  var targetObjects = [];
  test.traverse(function(o){
    if(o instanceof THREE.Mesh){
      testObjects.push(o);
    }
  });

  target.traverse(function(o){
    if(o instanceof THREE.Mesh){
      targetObjects.push(o);
    }
  });
  return testObjects.map(function(o){
    return getCollisions(o, targetObjects);
  });
}


/**
 * getCollisions - Test collision between  a THREE.Mesh and a list of THREE.Mesh
 *
 * @param  {type} object        description
 * @param  {type} targetObjects description
 * @return {type}               description
 */
function getCollisions(object, targetObjects){
    var results = [];
    var geometry = object.tmpGeom || (object.geometry instanceof THREE.BufferGeometry ? new THREE.Geometry().fromBufferGeometry( object.geometry ) : object.geometry);
    object.tmpGeom = geometry;
    if(geometry.vertices.length < 25)
    for (var vertexIndex = 0; vertexIndex < geometry.vertices.length; vertexIndex++)
    {

        var localVertex = geometry.vertices[vertexIndex].clone();
        globalVertex = localVertex;
        var obj = object;
        while(obj){
          globalVertex = globalVertex.applyMatrix4(obj.matrix);
          obj=obj.parent;
        }

        var directionVector = globalVertex.sub( object.getWorldPosition( new THREE.Vector3()) );
        var ray = new THREE.Raycaster( object.getWorldPosition( new THREE.Vector3()), directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects( targetObjects );
        collisionResults.forEach(function(res){
          if ( res.distance < directionVector.length() )
          {
            results.push(res);
          }
        });
    }
    return results;
}
