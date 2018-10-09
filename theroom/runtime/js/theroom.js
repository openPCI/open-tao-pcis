var urlPath = '../models/';

var moveables = [];

var scene = new THREE.Scene();
var raycaster = new THREE.Raycaster();
var hudRaycaster = new THREE.Raycaster();
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0xeeeeee );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild( renderer.domElement );
//
// TODO:
// - [X] Camera movement
// - [ ] Item placement
// - [ ] Item Rotation
// - [ ] Scoring
// - [ ] Settings
// - [ ] Postprocessing (outline selected prop) https://threejs.org/examples/webgl_postprocessing_outline.html


var room;
var movePlane;
var lookObject;
var cameraObject;
var camera;
var mouse = new THREE.Vector2();
var hudMouse = new THREE.Vector2();
var mouseDelta = new THREE.Vector2();
var lastMouse = new THREE.Vector2();
var mouseDown = false;
var movingObject;
var movingObjectOffset;
var collisionObjects = [];

var hud = new GameHud();

function loadGLtf(path, callback){
  // Instantiate a loader
  var loader = new THREE.GLTFLoader();

  // Optional: Provide a DRACOLoader instance to decode compressed mesh data
  // THREE.DRACOLoader.setDecoderPath( '/examples/js/libs/draco' );
  // loader.setDRACOLoader( new THREE.DRACOLoader() );

  // Load a glTF resource
  loader.load(
  	// resource URL
  	urlPath + path,
  	// called when the resource is loaded
  	callback,
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
  sunLight.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 1, 100 ) );
  sunLight.shadow.mapSize.x = 512;
  sunLight.shadow.mapSize.y = 512;
  sunLight.shadow.bias = 0.0001;

  scene.add(sunLight);
};

function clearThree(obj){
  while(obj.children.length > 0){
    clearThree(obj.children[0])
    obj.remove(obj.children[0]);
  }
  if(obj.geometry) obj.geometry.dispose()
  if(obj.material) obj.material.dispose()
  if(obj.texture) obj.texture.dispose()
}

function loadScene(file){
  clearThree(scene);
  loadGLtf(file, function(gltf){

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
    collisionObjects.push(gltf.scene);
    scene.add(gltf.scene)
    room = gltf.scene;

    addLighting(scene);
    addCameraHelper();
    animate();
  });
}


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

function getCollisions(object, targetObjects){
    var results = [];
    var geometry = object.geometry instanceof THREE.BufferGeometry ? new THREE.Geometry().fromBufferGeometry( object.geometry ) : object.geometry;
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

function testCollisionObjects(){
  if(!movingObject) return;

  [movingObject].forEach(function(obj, i){
   if(obj.collisionStatic) return;

   obj.traverse(function(o){
     if(o instanceof THREE.Mesh){
       if(o.material && o.material.origOpacity){
         o.material.opacity = o.material.origOpacity;
         o.material.color.set(o.material.origColor);
       }
     }
   });

   var others = collisionObjects.filter(item => item !== obj);

   others.forEach(function(other){
       var test = collisionTest(obj, other);
       test.forEach(function(r){
         v = new THREE.Vector3();
         var hit = false;
         r.forEach(function(t){
           v.add(t.point.clone().sub(obj.position));
           hit = true;
         });
         if(other.collisionStatic){
           v.y=0;
           v.normalize();
           v.multiplyScalar(0.03);

           obj.position.sub(v);
           obj.updateMatrix();
           obj.updateMatrixWorld(true);
        } else {
          obj.traverse(function(o){
            if(o instanceof THREE.Mesh){
              if(o.material && hit){
                if(!o.material.origOpacity){
                  o.material.origColor = o.material.color.clone();
                  o.material.origOpacity = o.material.opacity;
                }

                o.material.opacity = 0.3;

                o.material.color.setHex(0xff0000);
                o.material.transparent = true;
              }
            }
          });
        }
     });

   });
 });
}

function addCameraHelper(){
  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
  camera.position.z = 10;

  lookObject = new THREE.Object3D();
  cameraObject = new THREE.Object3D();
  cameraObject.position.z = 10;
  lookObject.rotation.x = 5;
  lookObject.add(cameraObject);
  cameraObject.add(camera);
  scene.add(lookObject);

}

function addMoveable(group){
  group.traverse(function(o){
    if(o instanceof THREE.Mesh){
      o.material = o.material.clone();
    }
  });
  scene.add(group);
  moveables.push(group);
  collisionObjects.push(group);
}

window.addEventListener( 'mousedown', function(event){
  mouseDown = true;
  movingObject = null;
  console.log(hudMouse);

  for(var i = 0; i < hud.droppables.length; i++){
    var intersects = hudRaycaster.intersectObjects( hud.droppables[i].prop.children );
    if(intersects.length){
      console.log(intersects);
      var prop = hud.droppables[i].gltf.scene.clone();
      addMoveable(prop);
      movingObject = prop;
      return;
    }
  }

  for(var i = 0; i < moveables.length; i++){
    var intersects = raycaster.intersectObjects( moveables[i].children );
    if(intersects.length){
      movingObject = moveables[i];
      return;
    }
  }
}, false);

window.addEventListener( 'mouseup', function(event){
  mouseDown = false;
  movingObjectOffset = null;
}, false);

window.addEventListener( 'mousewheel', function(event){

  cameraObject.position.z += event.deltaY/100;
  event.preventDefault();
});

window.addEventListener( 'mousemove', function ( event ) {
  lastMouse.copy(mouse);
	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  hudMouse.x = ( event.clientX / window.innerWidth ) * hud.width;
  hudMouse.y = ( event.clientY / window.innerHeight ) * hud.height;
  mouseDelta.copy(mouse);
  mouseDelta.sub(lastMouse);
}, false );

window.addEventListener( 'keydown', function( event) {
  if(!movingObject) return;
  if(event.key == "ArrowRight"){
    movingObject.rotation.y -= Math.PI / 2;
  }
  if(event.key == "ArrowLeft"){
    movingObject.rotation.y += Math.PI / 2;
  }
}, false)

var animate = function () {

  // update the picking ray with the camera and mouse position
	raycaster.setFromCamera( mouse, camera );
  hudRaycaster.setFromCamera( mouse, hud.camera );
  hudRaycaster.far = 100;
  hudRaycaster.near = -100

  testCollisionObjects();

  // calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( [movePlane] );
  if(intersects.length && mouseDown){

    if(movingObject){
      if(!movingObjectOffset) movingObjectOffset = intersects[0].point.clone().sub(movingObject.position);
      var test = collisionTest(movingObject, room);
      var hit = false;
      test.forEach(function(r){
        r.forEach(function(t){
          hit = true;
        });
      });
      if(!hit){
        var v = movingObject.position.clone().sub(intersects[0].point.clone().sub(movingObjectOffset));
        var dist = v.length();
        v.normalize();
        v.multiplyScalar(dist*0.1);
        v.y = 0;
        movingObject.position.sub(v);
        movingObject.updateMatrix();
        movingObject.updateMatrixWorld(true);
      }
    } else {
      lookObject.position.x -= mouseDelta.x * 10;
      lookObject.position.z += mouseDelta.y * 10;
      mouseDelta.set(0,0);
    }

  }

  hud.render();

	requestAnimationFrame( animate );
	renderer.render( scene, camera );
};

loadScene('room1.gltf');

loadGLtf('montre.gltf', function(gltf){
  gltf.scene.traverse(function(o){
    if(o instanceof THREE.Mesh){
      if(o.name && /glass/.test(o.name)) return;
      o.receiveShadow = true;
      o.castShadow = true;
    }
  })
  addMoveable(gltf.scene);
})

loadGLtf('montre.gltf', function(gltf){
  gltf.scene.traverse(function(o){
    if(o instanceof THREE.Mesh){
      if(o.name && /glass/.test(o.name)) return;
      o.receiveShadow = true;
      o.castShadow = true;
      o.material.origOpacity = o.material.opacity;
    }
  })

  hud.addDroppable(gltf);
})

loadGLtf('montre2.gltf', function(gltf){
  gltf.scene.traverse(function(o){
    if(o instanceof THREE.Mesh){
      if(o.name && /glass/.test(o.name)) return;
      o.receiveShadow = true;
      o.castShadow = true;
    }
  })

  hud.addDroppable(gltf);
})
