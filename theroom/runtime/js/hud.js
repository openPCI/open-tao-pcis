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
  this.droppables = droppableProps;
  this.camera = hudCamera;
  // Add global light
  addLighting(hudScene)

  hudScene.add( hudCamera )

  function hudAddDroppable(gltf){
    var prop = gltf.scene.clone();
    var info = {gltf: gltf, prop: prop};

    prop.info = info;
    prop.rotation.x = Math.PI / 4
    prop.position.y = -4;
    prop.rotation.y = 4;

    prop.position.x = 2 + (4*droppableProps.length);

    hudScene.add(prop);
    droppableProps.push(info)
    console.log(hudScene);
  }

  var raycaster = new THREE.Raycaster();


  this.render = function(){
    droppableProps.forEach(function(p){
      //p.prop.rotation.y += 0.005;
    });

    hudRenderer.render( hudScene, hudCamera );
  }

  this.addDroppable = hudAddDroppable;
}
