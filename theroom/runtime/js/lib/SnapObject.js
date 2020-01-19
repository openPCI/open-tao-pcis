var PointSnapObject = function(){
  var ignoreSnapping = false;

  var snapperMaterial = new THREE.Material();
  /**
   * wallSnapObject - Handle snapping objects.
   *
   * @param  {type} object description
   * @return {type}        description
   */
  function pointSnapObject(object){
    var snappers = [];
    var otherSnappers = [];
    var snapped = false;

    snapperMaterial.visible = false;

    object.traverse(function(o){
      if(/obj_snap/.test(o.name)){
        snappers.push(o);
      }
    });

    scene.children.forEach(function(o){
      if(o.pointSnap && o != object){
        o.traverse(function(p){
          if(p.snapPoint){
            otherSnappers.push(p);
          }
        });
      }
    });


    var rotation = new THREE.Quaternion();
    var finalSnapper = null;
    var finalOther = null;
    var finalDist = 9999;
    snappers.forEach(function(snapper){
      snapper.getWorldQuaternion(rotation);
      var v = new THREE.Vector3(0,1,0);
      v.applyQuaternion(rotation);
      var snapperPos = snapper.getWorldPosition( new THREE.Vector3() );
      var raycaster = new THREE.Raycaster( snapperPos, v, 0, 1);
      var result = raycaster.intersectObjects(otherSnappers);
      if(result.length){
        if(result[0].distance < finalDist){
          finalSnapper = snapper;
          finalOther = result[0].object;
          finalDist = result[0].distance;
        }
      }
    });
    if(finalSnapper){
      var otherPos = finalOther.getWorldPosition( new THREE.Vector3() )
      var snapperPos = finalSnapper.getWorldPosition( new THREE.Vector3() );
      finalSnapper.snapped = finalOther;
      finalOther.snapped = finalSnapper;
      snapperPos.sub(otherPos);
      object.position.sub(snapperPos);
    }
  }

  return {
    onObjectLoad: function(group){
      var useBehavior = false;
      group.traverse(function(o){
        if(o instanceof THREE.Mesh){
          if(o.name && /^obj_snap/.test(o.name)){
            useBehavior = true;
            o.material = snapperMaterial;
            o.snapPoint = true;
          }
        }
      });

      group.pointSnap = true;
      group.userData.pointSnap = true;
      return useBehavior;
    },

    onFrame: function(object){

    },
    onDrag: function(movingObject){
      if(ignoreSnapping) return false;
      pointSnapObject(movingObject);
    },
    onMovingCollide: function(object, collisionData){
      return true;
    },
    onDragStart: function(movingObject){

    },
    onDragEnd: function(){

    }
  };
}();
