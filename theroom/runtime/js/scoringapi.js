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

  function zoneRotationCheck(area, objType, rotation){
    var objs = findByArea(area, objType);
    var wrongOrientation = 0;
    objs.forEach(function(o){
      var y = o.rotation._y;
      while(y >= Math.PI * 2){
        y -= Math.PI * 2;
      }
      while(y < 0) y += Math.PI * 2;
      if(Math.abs(y - rotation) > 0.01) wrongOrientation++;
    });
    return wrongOrientation;
  }
  this.zoneRotationCheck = zoneRotationCheck;

  function findByArea(area, objType){
    var result = [];
    var areaObjs = [];
    var reg = new RegExp(area ,"i");
    scene.traverse(function(o){
      if(o.name && reg.test(o.name) && /zone/.test(o.name)){
        areaObjs.push(o);
      }
    });

    if(!areaObjs.length) throw "Area " + area + " not found!"
    var objs = findByType(objType);
    areaObjs.forEach(function(areaObj){
      var areaBB = new THREE.Box3().setFromObject(areaObj);
      for(var i = 0; i<objs.length; i++){
        var objBB = new THREE.Box3().setFromObject(objs[i]);
        if(areaBB.isIntersectionBox(objBB)) result.push(objs[i])
      }
    });
    return result;
  }
  this.findByArea = findByArea;

  /**
   * areaTest - Test if objType is in area
   *
   * @param  {type} area    zone blender name
   * @param  {type} objType Objects to test (regex)
   * @return {type}         description
   */
  this.areaTest = function(area, objType){
    return findByArea(area, objType).length;
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
      if(/snap/.test(o.name)){
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
      var raycaster = new THREE.Raycaster( snapperPos, v, 0, 1);
      var result = raycaster.intersectObjects(targetObjects);
      if(result.length){
        return 1;
      }
    }
    return 0;
  }

  function pointSnapObjectTest(object){
    var snappers = [];
    var otherSnappers = [];
    var snapped = false;

    object.traverse(function(o){
      if(/snap/.test(o.name)){
        snappers.push(o);
        o.material.side = THREE.DoubleSide;
      }

    });

    scene.children.forEach(function(o){
      if(o.pointSnap && o != object){
        o.traverse(function(p){
          if(p.snapPoint){
            otherSnappers.push(p);
            p.material.side = THREE.DoubleSide;
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
      return 1;
    }
    return 0;
  }

  function countUnSnapped(object){
    var snappers = [];
    var otherSnappers = [];
    var snapped = false;
    object.updateMatrixWorld();
    object.traverse(function(o){
      if(/snap/.test(o.name)){
        snappers.push(o);
      }
    });

    scene.children.forEach(function(o){
      if(o.pointSnap && o != object){
        o.updateMatrixWorld();
        o.traverse(function(p){
          if(p.snapPoint){
            otherSnappers.push(p);
            p.material.side = THREE.DoubleSide;
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
      var snapperPos = new THREE.Vector3();
      snapperPos.setFromMatrixPosition( snapper.matrixWorld );
      snapped = false;
      otherSnappers.forEach(function(other){
        var pos = new THREE.Vector3();
        pos.setFromMatrixPosition(other.matrixWorld);
        var dist = snapperPos.clone().sub(pos).length();

        if(dist < 1){
          snapped = true;
        }
      });

      if(!snapped) finalResult++;
      // snapper.getWorldQuaternion(rotation);
      // var v = new THREE.Vector3(0,1,0);
      // v.applyQuaternion(rotation);
      // var snapperPos = snapper.getWorldPosition( new THREE.Vector3() );
      // var raycaster = new THREE.Raycaster( snapperPos, v, 0, 1);
      // var result = raycaster.intersectObjects(otherSnappers);
      // if(!result.length){
      //   finalResult++;
      // }
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


  function closestDistance(from, to){
    var res = [];
    var froms = findByType(from);
    var tos = findByType(to);
    froms.forEach(function(obj){
      var dist = 99999999;
      tos.forEach(function(other){
        if(obj == other) return;
        var d = obj.position.clone().sub(other.position).length();
        if(d < dist){
          dist = d;
        }
      });
      res.push(dist);
    });

    return res;
  }

  this.closestDistance = closestDistance;


  /**
   * closerThanOthers - Returns 1 if `type` object is closer to `target` than `others` objects
   *
   * @param  {type} type   Object
   * @param  {type} others Other objects
   * @param  {type} target target object
   * @return {type}        description
   */
  function closerThanOthers(type, others, target){
    var obj = findByType(type)[0];
    var otherObjs = findByType(others);
    var targetObj = findByType(target)[0];

    if(!obj) return 0;
    if(!targetObj) return 0;

    var dist = 9999999999;
    otherObjs.forEach(function(o){
      if(o == targetObj || o == obj) return;
      var d = o.position.clone().sub(targetObj.position).length();
      if(d < dist) dist = d;
    });
    var objDist = obj.position.clone().sub(targetObj.position).length();
    return objDist <= dist ? 1 : 0;
  }

  this.closerThanOthers = closerThanOthers;

  function ACloserThanB(objTypeA,objTypeB,targetType){
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
  this.ACloserThanB = ACloserThanB;


  /**
   * lineOfSight - Return the number of objType objects that have line of sight to point
   *
   * @param  {type} objType description
   * @param  {type} point   description
   * @return {type}         description
   */
  function lineOfSight(objType, point){

    var objs = findByType(objType);
    var res = objs.length;

    var targetObjects = [];
    room.traverse(function(o){
      if(o instanceof THREE.Mesh){
        targetObjects.push(o);
      }
    });

    objs.forEach(function(o){
      var raycaster = new THREE.Raycaster(o.position);
      raycaster.ray.lookAt(point);
      raycaster.far = o.position.clone().sub(point).length();
      var result = raycaster.intersectObjects( targetObjects )
      if(result.length){
        res--;
      }
    });

    return res;
  }
  this.lineOfSight = lineOfSight;

  function objZoneTest(objType, area, otherType, useRoom){
    var collisions = 0;
    var otherObjs = findByType(otherType);
    var objs = findByType(objType);
    var others = []
    if(useRoom){
        room.traverse(function(o){
          if(!(o instanceof THREE.Mesh)) return;
          if(o.name && o.name.indexOf('zone') > -1) return;
          others.push(o);
        });
    }
    otherObjs.forEach(function(o){
      o.children.forEach(function(o){
        if(o.name && o.name.indexOf('zone') > -1) return;
        others.push(o);
      });
    });

    objs.forEach(function(object){
      var objAreas = [];
      object.traverse(function(o){
        if(o.name && o.name.indexOf('zone') > -1){
          if(o.name.indexOf(area) > -1){
            objAreas.push(o);
          }
        }
      });
      objAreas.some(function(area){
        var areaBox = new THREE.Box3();
        var otherBox = new THREE.Box3();
        areaBox.setFromObject(area);
        return others.some(function(other){
          if(object.children.indexOf(other) > -1) return;
          otherBox.setFromObject(other);
          if(otherBox.intersectsBox(areaBox)){
            collisions++;
            return true;
          }
        });
      });
    });
    return collisions;
  }
  this.objZoneTest = objZoneTest;

})();
