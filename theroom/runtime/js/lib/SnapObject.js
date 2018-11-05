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
    snappers.forEach(function(snapper){
      snapper.getWorldQuaternion(rotation);


      var v = new THREE.Vector3(0,1,0);
      v.applyQuaternion(rotation);
      var snapperPos = snapper.getWorldPosition( new THREE.Vector3() );
      var raycaster = new THREE.Raycaster( snapperPos, v, 0, 1);
      var result = raycaster.intersectObjects(otherSnappers);

      if(result.length){
        var otherPos = result[0].object.getWorldPosition( new THREE.Vector3() )
        console.log(result[0]);

        snapper.snapped = result[0].object;
        result[0].object.snapped = snapper;

        snapperPos.sub(otherPos);
        snapperPos.multiplyScalar(0.9);
        object.position.sub(snapperPos);
        snapped = true;
        movingObjectOffset = null;
      }
    });

    return snapped;
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
      console.log(useBehavior);
      group.pointSnap = true;
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
      setTimeout(function(){
        ignoreSnapping = false;
      }, 1000);
      ignoreSnapping = true;

    },
    onDragEnd: function(){

    }
  };
}();
