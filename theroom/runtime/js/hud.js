var GameHud = function(){
  var hudRenderer = new THREE.WebGLRenderer( { alpha: true } );
  hudRenderer.setSize( window.innerWidth, window.innerHeight );
  hudRenderer.setClearColor( 0x000055, 0 );

  var hudScale = 25;
  var width = window.innerWidth / hudScale;
  var height = window.innerHeight / hudScale;
  this.width = width;
  this.height = height;
  var hudCamera = new THREE.OrthographicCamera( 0, width, 0, -height, -1, 100 );
  hudCamera.position.z = 5;
  hudRenderer.domElement.className = 'hud';
  document.body.appendChild( hudRenderer.domElement );

  var hudScene = new THREE.Scene()
  var droppableProps = [];
  var droppableByName = {}
  this.droppables = droppableProps;
  this.camera = hudCamera;
  // Add global light
  addLighting(hudScene)

  hudScene.add( hudCamera )

  function hudAddDroppable(gltf, count, name){
    var prop = gltf.scene.clone();
    prop.traverse(function(o){
      if(o instanceof THREE.Mesh){
        o.material = o.material.clone();
      }
    });
    var info = {gltf: gltf, prop: prop, count: count, name: name};

    droppableByName[name] = info;

    prop.info = info;
    prop.rotation.x = Math.PI / 4
    prop.position.y = -4;
    prop.rotation.y = 4;

    prop.position.x = 2 + (4*droppableProps.length);
    prop.scale.setScalar(0.6);
    hudScene.add(prop);
    droppableProps.push(info);
  }

  function placeDroppable(info){
    if(info.count > 0){
      info.count --;
      if(info.count == 0){
        setMaterialProps(info.prop, {opacity: 0.3, transparent: true})
      }
      return true;
    }
    return false;
  }

  function removeDroppable(info){
    resetMaterial(info.prop);
    info.count ++;
  }

  function getDroppableByName(name){
    return droppableByName[name];
  }

  var raycaster = new THREE.Raycaster();


  this.render = function(){
    hudRenderer.render( hudScene, hudCamera );
  }

  this.getDroppableByName = getDroppableByName;
  this.addDroppable = hudAddDroppable;
  this.placeDroppable = placeDroppable;
  this.removeDroppable = removeDroppable;
}
