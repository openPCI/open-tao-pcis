function createAABBVertices ( mesh ) {
    var vertices = [];
    var helper = new THREE.BoundingBoxHelper(mesh, 0xff0000);
    helper.update();
    var max = helper.box.max;
    var min = helper.box.min;

    vertices.push(new THREE.Vector3(max.x, max.y, max.z));
    vertices.push(new THREE.Vector3(min.x, max.y, max.z));
    vertices.push(new THREE.Vector3(min.x, min.y, max.z));
    vertices.push(new THREE.Vector3(max.x, min.y, max.z));
    vertices.push(new THREE.Vector3(max.x, max.y, min.z));
    vertices.push(new THREE.Vector3(min.x, max.y, min.z));
    vertices.push(new THREE.Vector3(min.x, min.y, min.z));
    vertices.push(new THREE.Vector3(max.x, min.y, min.z));

    return vertices;
}

function checkObjectCollisions ( mesh, objects, callback ) {

    for ( var vertexIndex = 0; vertexIndex < mesh.geometry.vertices.length; vertexIndex++ ) {

        var localVertex = mesh.geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4( mesh.matrix );
        var directionVector = globalVertex.sub( mesh.position );
        var angle = mesh.velocity.angleTo( directionVector);

        if ( angle <= Math.PI/2) {

            raycaster.set( mesh.position, directionVector.clone().normalize() );
            var collisionResults = raycaster.intersectObjects( objects.children );

            if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
                callback( mesh, collisionResults[0] );
                break;
            }
        }
    }
}
