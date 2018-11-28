var urlPath = '../models/';

var moveables = [];

var scene = new THREE.Scene();
var scenePath;
var boundingbox;
var raycaster = new THREE.Raycaster();
var hudRaycaster = new THREE.Raycaster();
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xeeeeee );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild( renderer.domElement );

// Currently loaded room scene
var room;

// Plane used for mouse hit detection
var movePlane;
var movePlanePosition;
// 3DObject with camera
var lookObject;

// 3DObject Camera object
var cameraObject;

// The scene camera
var camera;

// Mouse coordinates -1 - 1
var mouse = new THREE.Vector2();

// Mouse movement delta
var mouseDelta = new THREE.Vector2();

// Last mouse position
var lastMouse = new THREE.Vector2();

// Left mouse down
var mouseDown = false;

// Currently moving / dragging object
var movingObject;

// Offset relative to mouse coord.
var movingObjectOffset;


// Initialize game HUD
var hud = new GameHud();

var objectBehaviors = [WallSnapObject, PointSnapObject];


function sendMessage(type, value){
  if(window.parent)
    window.parent.postMessage({
      type: type,
      value: value
    },'*');
}

function postResult(){
  sendMessage('updateResult', JSON.stringify(serializeMoveables()));
}

function serializeMoveables(){
  var result = [];
  moveables.forEach(function(o){
    var obj = {
      id: o.userData.modelPath,
      pos: o.position.toArray(),
      rot: o.rotation.toArray()
    }
    result.push(obj);
  });
  return {scene: scenePath, objects: result};
}

function deserializeMoveables(data){
  loadScene(data.scene);
  hud.reset();
  data.objects.forEach(function(info){
    loadGLtf(info.id, function(gltf){
      modifyModel(gltf.scene);
      scene.add(gltf.scene);
      gltf.scene.position.fromArray(info.pos);
      gltf.scene.rotation.fromArray(info.rot);
    })
  });
}

/**
 * Load a GLTF resource from path
 **/
function loadGLtf(path, callback){
  // Instantiate a loader
  var loader = new THREE.GLTFLoader();

  var cb = function(gltf){
    gltf.scene.userData.modelPath = path;
    callback(gltf);
  }

  // Optional: Provide a DRACOLoader instance to decode compressed mesh data
  // THREE.DRACOLoader.setDecoderPath( '/examples/js/libs/draco' );
  // loader.setDRACOLoader( new THREE.DRACOLoader() );

  // Load a glTF resource
  loader.load(
  	// resource URL
  	urlPath + path,
  	// called when the resource is loaded
  	cb,
  	// called while loading is progressing
  	function ( xhr ) {

  		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

  	},
  	// called when loading has errors
  	function ( error ) {
      console.log(error);
  		console.log( 'An error happened' );

  	}
  );
}


/**
 * addLighting - Adds default lighting to scene
 *
 * @param  {THREE.Scene} scene THREEJS Scene object
 * @return {undefined}
 */
function addLighting(scene){
  // Add global light
  var globalLight = new THREE.AmbientLight( 0xffffff, 0.7 );
  scene.add( globalLight );

  // Add DirectionalLight for shadows
  var sunLight = new THREE.DirectionalLight( 0xffffff, 0.3 );
  sunLight.castShadow = true;

  sunLight.target = scene.children[0];
  sunLight.position.y = 30;
  sunLight.position.x = 30;
  sunLight.position.z = 20;

  // Shadow stuff
  sunLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 75, 1, 1, 100 ) );
  sunLight.shadow.mapSize.x = 512;
  sunLight.shadow.mapSize.y = 512;
  sunLight.shadow.bias = 0.0001;

  scene.add(sunLight);
};


/**
 * clearThree - Clears all children form a threejs object (scene / 3dObject). Also disposes gemoetries, textures and materials
 *
 * @param  {THREE.3DObject} obj The object t oclear
 * @return {type}     description
 */
function clearThree(obj){
  while(obj.children.length > 0){
    clearThree(obj.children[0])
    obj.remove(obj.children[0]);
  }
  if(obj.geometry) obj.geometry.dispose()
  if(obj.material) obj.material.dispose()
  if(obj.texture) obj.texture.dispose()
}


function loadExcersize(definitionUrl){
  var xmlhttp = new XMLHttpRequest();

  function readDefinition(json){
    loadScene(json.scene);

    var loadNext = function(){
      var asset = json.assets.shift();
      if(!asset){
        if(json.objects){
          json.objects.forEach(function(object){
            var info = hud.getDroppableByName(object.id);
            if(hud.placeDroppable(info)){
              var prop = info.gltf.scene.clone();
              prop.info = info;
              addMoveable(prop, object.static);
              prop.position.fromArray(object.pos);
              prop.rotation.fromArray(object.rot);
            }
          });
        }
        return;
      }
      loadMoveable(asset.model, asset.count || 1, loadNext);
    }

    loadNext();
  }

  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          readDefinition(JSON.parse(this.responseText));
      }
  };

  xmlhttp.open("GET", urlPath + definitionUrl, true);
  xmlhttp.send();
}

/**
 * loadScene - load a scene and adds it to collision testing
 *
 * @param  {type} file GLTF scene to load
 * @return {undefined}
 */
function loadScene(file){
  clearThree(scene);

  loadGLtf(file, function(gltf){
    scenePath = file;

    movePlane = new THREE.Mesh(new THREE.PlaneBufferGeometry(500, 500, 2, 2),
       new THREE.MeshBasicMaterial( {
           color: 0x248f24, alphaTest: 0, visible: false
    }));
    movePlane.rotation.x = -Math.PI/2;
    scene.add(movePlane);

    gltf.scene.traverse(function(o){
      if(o instanceof THREE.Mesh){
        o.receiveShadow = true;
        o.castShadow = true;
      }
    });
    gltf.scene.collisionStatic = true;
    scene.add(gltf.scene);
    var bbobj = scene.getObjectByName('boundingbox');
    console.log(bbobj);
    if(bbobj){
      boundingbox = new THREE.Box3().setFromObject(bbobj);
      bbobj.parent.remove(bbobj);
    }
    room = gltf.scene;

    addLighting(scene);
    addCameraHelper();
    animate();
  });
}



function setMaterialProps(obj, props){
  if(obj.matPropsSet) return;
  obj.matPropsSet = true;
  obj.traverse(function(o){
    if(!o.material) return;
    var mat = o.material;
    for(var prop in props){
      var value = props[prop];
      if(!mat.defaultProps) mat.defaultProps = {};
      if(typeof mat.defaultProps[prop] === "undefined"){
        if(mat[prop].clone) mat.defaultProps[prop] = mat[prop].clone();
        else mat.defaultProps[prop] = mat[prop] ;
      }
      if(mat[prop].set) mat[prop].set(value);
      else mat[prop] = value;
    }
  });
}

function resetMaterial(obj){
  if(!obj.matPropsSet) return
  obj.matPropsSet = false;
  obj.traverse(function(o){
    if(!o.material) return;
    var mat = o.material;
    if(!mat.defaultProps) return;
    for(var prop in mat.defaultProps){
      if(mat[prop].set) mat[prop].set(mat.defaultProps[prop]);
      else mat[prop] = mat.defaultProps[prop];
    }
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

/**
 * addCameraHelper - Adds the camera helper objects to the scene.
 *
 * @return {type}  description
 */
function addCameraHelper(){
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.z = 10;

  lookObject = new THREE.Object3D();
  cameraObject = new THREE.Object3D();
  rotateObject = new THREE.Object3D();
  cameraObject.position.z = 10;
  rotateObject.rotation.x = 5.5;
  lookObject.add(rotateObject);
  rotateObject.add(cameraObject);
  cameraObject.add(camera);
  scene.add(lookObject);

}


/**
 * addMoveable - add a moveable object to the scene
 *
 * @param  {type} group description
 * @return {type}       description
 */
function addMoveable(group, static){
  // Clone materials.
  group.traverse(function(o){
    if(o instanceof THREE.Mesh){
      o.material = o.material.clone();
    }
  });

  scene.add(group);
  moveables.push(group);
  if(!static){
    objectBehaviors.some(function(b){
      if(b.onObjectLoad(group)){
        group.behavior = b;
        return true;
      }
    });
  } else {
    group.static = true;
  }

  if(movePlanePosition){
    group.position.x = movePlanePosition.x;
    group.position.z = movePlanePosition.z;
  }

}

function removeMoveable(group){
    scene.remove(group);
    if(group.outline) scene.remove(group.outline);
    hud.removeDroppable(group.info)
    moveables = moveables.filter(function(o){
      return o !== group;
    });
}

function modifyModel(scene){
  scene.traverse(function(o){
    if(o instanceof THREE.Mesh){
      if(o.name && /glass/.test(o.name)) return;
      o.receiveShadow = true;
      o.castShadow = true;

      if(o.name && /snap/.test(o.name)){
        o.material.visible = false;
      }
    }
  });
}


/**
 * loadMoveable - Load a GLTF model and put it in the GUI
 *
 * @param  {type} asset description
 * @return {type}       description
 */
function loadMoveable(asset, count, callback){
  loadGLtf(asset, function(gltf){
    // Force shadows on and handle special case with glass
    modifyModel(gltf.scene)

    hud.addDroppable(gltf, count, asset);
    if(callback) callback();
  });

}

var rotate = 0;

function setupInputListeners(){
  window.addEventListener('message', function(event){
    if(event.data && event.data.type){
      switch(event.data.type){
        case 'loadExcersize':
          loadExcersize(event.data.value);
        break;
      }
    }
  }, false);

  window.addEventListener('paste', function(e){
    console.log('test');
    var data = (e.clipboardData || window.clipboardData).getData('text');
    try {
      var serialized = JSON.parse(data);
      if(serialized.scene && serialized.objects){
        deserializeMoveables(serialized);
      }
    } catch(ex){}
  });

  document.getElementById('rotateLeft').addEventListener('mousedown', function(event){
    rotate = -1;
  });
  document.getElementById('rotateRight').addEventListener('mousedown', function(event){
    rotate = 1;
  });

  function addOutline(prop){
    if(prop.outline){
      prop.outline.visible = true;
      return;
    }
    var outline = prop.clone();
    outline.traverse(function(o){
      if(o instanceof THREE.Mesh){
        o.geometry.side = THREE.BackSide;
        o.material = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.BackSide } );
      }
    });
  	outline.position.clone(prop.position);
    outline.rotation.clone(prop.rotation);
  	outline.scale.multiplyScalar(1.05);
    scene.add(outline);
    prop.outline = outline;
  }
  function removeOutline(prop){
    if(prop.outline){
      prop.outline.visible = false;
    }
  }

  window.addEventListener( 'mousedown', function(event){
    if(movingObject) removeOutline(movingObject);
    mouseDown = true;
    movingObject = null;

    for(var i = 0; i < hud.droppables.length; i++){
      var intersects = hudRaycaster.intersectObjects( hud.droppables[i].prop.children );
      if(intersects.length){
        console.log(intersects)
        var hudInfo = hud.droppables[i];
        if(hud.placeDroppable(hudInfo)){
          var prop = hud.droppables[i].gltf.scene.clone();
          prop.info = hudInfo;
          addMoveable(prop);
          addOutline(prop);
          movingObject = prop;
          return;
        }
      }
    }

    for(var i = 0; i < moveables.length; i++){
      var intersects = raycaster.intersectObjects( moveables[i].children );
      if(intersects.length){
        movingObject = moveables[i];
        addOutline(movingObject);
        behavior(movingObject, 'onDragStart', [movingObject]);
        return;
      }
    }
  }, false);


  window.addEventListener( 'mouseup', function(event){
    if(movingObject && boundingbox){
      if(!boundingbox.containsPoint(movingObject.position)){
        removeMoveable(movingObject);
      }
    }
    mouseDown = false;
    movingObjectOffset = null;
    rotate = 0;

    postResult();
  }, false);

  window.addEventListener( 'wheel', function(event){
    var d =  event.deltaY > 0 ? 100 : -100;
    cameraObject.position.z += d/100;
    rotateObject.rotation.x -= d/10000;
    if(rotateObject.rotation.x < 5) rotateObject.rotation.x = 5;
    if(rotateObject.rotation.x > 5.7) rotateObject.rotation.x = 5.7;

    if(cameraObject.position.z < 0) cameraObject.position.z = 0;
    if(cameraObject.position.z > 20) cameraObject.position.z = 20;
    event.preventDefault();
  });

  window.addEventListener( 'mousemove', function ( event ) {
    lastMouse.copy(mouse);
  	// calculate mouse position in normalized device coordinates
  	// (-1 to +1) for both components
  	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    mouseDelta.copy(mouse);
    mouseDelta.sub(lastMouse);
  }, false );

  window.addEventListener( 'keydown', function( event) {
    console.log('key', event);
    if(!movingObject) return;
    if(/Right$/.test(event.key)){
      movingObject.rotation.y -= Math.PI / 2;
    }
    if(/Left$/.test(event.key)){
      movingObject.rotation.y += Math.PI / 2;
    }
    movingObject.outline.rotation.y = movingObject.rotation.y;
    postResult();
  }, false)
}

function behavior(obj, listener, params){
  if(obj.behavior){
    if(obj.behavior[listener]){
      return obj.behavior[listener].apply(obj, params);
    }
  }
}

var animate = function () {
  lookObject.rotation.y += rotate * 0.02;
  // update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );
  hudRaycaster.setFromCamera( mouse, hud.camera );
  hudRaycaster.far = 100;
  hudRaycaster.near = -100

	var intersects = raycaster.intersectObjects( [movePlane] );
  if(intersects.length){
    movePlanePosition = intersects[0].point.clone();
    movePlanePosition.y = 0;
  }
  if(intersects.length && mouseDown){

    if(movingObject){


      var dontMove = behavior(movingObject, 'onDrag', [movingObject, movingObject.position, oldPos]);
      if(!dontMove && !movingObject.static){
        if(!movingObjectOffset) movingObjectOffset = intersects[0].point.clone().sub(movingObject.position);
        var v = movingObject.position.clone().sub(intersects[0].point.clone().sub(movingObjectOffset));
        var dist = v.length();
        v.normalize();
        v.multiplyScalar(dist*0.1);
        v.y = 0;

        var oldPos = movingObject.position.clone();
        movingObject.position.sub(v);


        movingObject.updateMatrix();
        movingObject.updateMatrixWorld(true);


        if(movingObject.outline){
          movingObject.outline.position.copy(movingObject.position);
        }
      }

    } else {
      var v = mouseDelta.clone();
      v.rotateAround(new THREE.Vector2(0,0), lookObject.rotation.y);
      lookObject.position.x -= v.x * 15;
      lookObject.position.z += v.y * 15;
      boundingbox.clampPoint(lookObject.position, lookObject.position);
      mouseDelta.set(0,0);
    }


  }

  hud.render();

	requestAnimationFrame( animate );
	renderer.render( scene, camera );
};

document.addEventListener("DOMContentLoaded", function(){
  setupInputListeners();
  sendMessage('ready', 1)
  if(window === window.parent) loadExcersize('restaurant.json');
});
