var WallSnapObject = function(){

  /**
   * wallSnapObject - Handle snapping objects.
   *
   * @param  {type} object description
   * @return {type}        description
   */
  function wallSnapObject(object){
    var snappers = [];
    var targetObjects = [];
    var snapped = false;
    room.traverse(function(o){
      if(o instanceof THREE.Mesh){
        targetObjects.push(o);
      }
    });

    object.traverse(function(o){
      if(/^snap/.test(o.name)){
        snappers.push(o);
      }
    });

    var rotation = new THREE.Quaternion();
    var snapper;

      for(var i=0; i<snappers.length; i++){
        snapper = snappers[i];
        snapper.getWorldQuaternion(rotation);
        var v = new THREE.Vector3(0,1,0);
        v.applyQuaternion(rotation);
        var snapperPos = snapper.getWorldPosition( new THREE.Vector3() );
        var raycaster = new THREE.Raycaster( snapperPos, v, 0, 0.4);
        var result = raycaster.intersectObjects(targetObjects);
        if(result.length){
          snapperPos.sub(result[0].point);
          object.position.sub(snapperPos);
          return true;
        }
      }
    
  }

  return {
    onObjectLoad: function(group){
      var useBehavior = false;
      group.traverse(function(o){
        if(o instanceof THREE.Mesh){
          if(o.name && /^snap/.test(o.name)){
            useBehavior = true;
            o.visible = false;
          }
        }
      });
      console.log(useBehavior);

      return useBehavior;
    },

    onFrame: function(object){

    },
    onDrag: function(movingObject){
      if(wallSnapObject(movingObject)){
        //resetMaterial(movingObject);
      } else {
        //setMaterialProps(movingObject, {opacity: 0.3, transparent: true})
      }
    },
    onMovingCollide: function(object, collisionData){
      return true; //Ignore collision
    },
    onDragStart: function(){

    },
    onDragEnd: function(){

    }
  };
}();
