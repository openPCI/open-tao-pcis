var Scoring = new (function(){

  /**
   * find - return array of elements defined by type (regex)
   *
   * @param  {type} type description
   * @return {type}      description
   */
   function findByType(type){
     var result = [];
     var regex = new RegExp(type, "i");
     moveables.forEach(function(obj){
       if(regex.test(obj.userData.modelPath)) result.push(obj);
     });
     return result;
   };

  this.find = findByType;

  /**
   * areaTest - Test if objType is in area
   *
   * @param  {type} area    zone blender name
   * @param  {type} objType Objects to test (regex)
   * @return {type}         description
   */
  this.areaTest = function(area, objType){
    var result = 0;
    var areaObjs = [];
    var reg = new RegExp(area ,"i");
    scene.traverse(function(o){
      if(o.name && reg.test(o.name) && /zone/.test(o.name)){
        areaObjs.push(o);
      }
    });

    if(!areaObjs.length) throw "Area not found!"
    var objs = findByType(objType);
    areaObjs.forEach(function(areaObj){
      var areaBB = new THREE.Box3().setFromObject(areaObj);
      for(var i = 0; i<objs.length; i++){
        var objBB = new THREE.Box3().setFromObject(objs[i]);
        if(areaBB.isIntersectionBox(objBB)) result++;
      }
    });
    return result;
  };


  /**
   * collisionTest Test collision between objType1 and objType2
   *
   * @param  {type} objType1 obj type regex
   * @param  {type} objType2 obj type regex
   * @return {type}          description
   */
  this.collisionTest = function(objType1, objType2){
    var collided = [];
    var objs1 = findByType(objType1);
    var objs2 = findByType(objType2);
    var collisions = 0;
    objs1.forEach(function(o1){
      if(collided.indexOf(o1) > -1) return;
      var bb1 = new THREE.Box3().setFromObject(o1);
      objs2.forEach(function(o2){
        if(o1 === o2) return;
        var bb2 = new THREE.Box3().setFromObject(o2);
        if(bb1.intersectsBox(bb2)){
          collisions++;
          collided.push(o2);
        }
      });
    });
    return collisions;
  };


  /**
   * wallSnapObjectTest - description
   *
   * @param  {type} object description
   * @return {type}        description
   */
  function wallSnapObjectTest(object){
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
        return true;
      }
    }
  }

  function pointSnapObjectTest(object){
    var snappers = [];
    var otherSnappers = [];
    var snapped = false;

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
      return true;
    }
  }

  function countUnSnapped(object){
    var snappers = [];
    var otherSnappers = [];
    var snapped = false;

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
    var finalResult = 0;
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
      } else {
        finalResult++;
      }
    });
    return finalResult;
  }

  this.noSnap = function(objType){
    var result = 0;
    var objs = findByType(objType || '');
    objs.forEach(function(o){
      result += countUnSnapped(o);
    });
    return result;
  }

  this.wallSnapTest = function(objType){
    var result = 0;
    var objs = findByType(objType);
    objs.forEach(function(o){
      if(wallSnapObjectTest(o)) result++;
    });
    return result;
  };

  this.objectSnapTest = function(objType){
    var result = 0;
    var objs = findByType(objType);
    objs.forEach(function(o){
      if(pointSnapObjectTest(o)) result++;
    });
    return result;
  }

  this.ACloserThanB = function(objTypeA,objTypeB,targetType){
    var objsA = findByType(objTypeA);
    var objsB = findByType(objTypeB);
    var target = findByType(targetType)[0];
    if(!target) return 0;
    var closestA;
    var closestB;
    var distA = 999999;
    var distB = 999999;

    objsA.forEach(function(o){
      var dist = target.position.distanceTo(o.position);
      if(dist < distA){
        closestA = o;
        distA = dist;
      }
    });

    objsB.forEach(function(o){
      var dist = target.position.distanceTo(o.position);
      if(dist < distB){
        closestB = o;
        distB = dist;
      }
    });

    if(distA < distB) return 1;
    else return 0;
  }

})();
