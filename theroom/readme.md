# Room (3D)
The room is an creative excersize where test-takers can move around and insert objects.
The excersize is versatile and can be used for many scenarios such as interior design excersizes.
There is support for object snapping, either to walls or to other objects.

# Creating an excersize
Excersizes are defined in JSON files under the excersizes/ folder. This JSON file structure is as follows:
```JSON
{
  "scene" : "my_excersize/room.gltf",
  "scoringFunction" : "function score(){}",
  "assets":[
    {
      "model" : "souvenirbutik/reol1.gltf",
      "count" : 2
    }
  ],
  "objects":[

  ]
}
```
`scene` is the gltf 3d file containing the room of the excersize.
`scoringFunction` can be defined to enable functional scoring. Scoring can be performed using the scoring API or alternatively you can access THREE.js directly.
`assets` is an array containing the objects for the scene. `model` is the path to the gltf 3d object. `count` is the amount of this type that can be inserted into the scene.
`objects` is an array containing all preinserted objects in the scene, along with their position and rotation.
You can generate this array from the function `serializeMoveables()`.

## Creating scenes
There are a few things to keep in mind when creating scenes.
Try to make each wall its own cube in the scene. This will be crucial for boundary box detection used in some functional scoring such as area tests and collision test.
Your scene should have a cube named `boundingbox`, this is the area where test takers can pan the camera and place objects. Keep the floor of the scene at 0 in the vertical axis.

### Areas
Naming anything with `zone` in the name will cause it to be invisible. Zones are for testing placement in functional scoring. You can perform boundary box tests on objects intersecting areas.

## Creating objects
You can create assets for excersizes in any 3D program that supports gltf export such as blender.
There is some special naming conventions that enable certain functionality such as snapping and transparency.

### Glass
Naming anything with `glass` in it will make it transparent.

### Snap points
To create a wall snap, first create a plane. rename it so it starts with `snap`, then rotate the plane so its positive z direction is facing the direction you wish to snap.

To create an object snap is similar, but name the snap plane `obj_snap`, the object will now snap to other objects on their `obj_snap` planes.

*Remember that snaps must be pointed with their up direction towards the snap direction*

### Object Zones
An object zone is a zone attached to a moveable object that you wish to score from. You can test if the zone intersects other objects etc. using the `objZoneTest` scoring function. To create a zone, simply name a box object so it contains the `zone` keyword

## Examples
Please see the excersize/ folder for examples.

# Functional scoring
Scoring can be performed using functional scoring. To do this, simply define a scoringFunction in the excersize definition.
You can use the Scoring API. This API defines the following helper functions for scoring:


| Function        | Description |
| ------------- |---------------|
| Scoring.find(name)      | Finds objects in the scene that matches the `name` regex, this regex is tested against the model file name |
| Scoring.zoneRotationCheck(area, objType, rotation)      | Checks if all objects that matches `objType` regex in the zone `area` has the correct `rotation` |
| Scoring.findByArea(area, objType) | Finds all objects in zone `area` matching `objType`  |
| Scoring.areaTest(area, objType) | Returns the count of objType in the zone `area`      |
| Scoring.collisionTest(typeA, typeB) | Return the count of collisions against typeA and typeB |
| Scoring.noSnap(objType) | Returns the amount of unsnapped objects fitting objType |
| Scoring.wallSnapTest(objType, pointTest) | returns the amount of snapped objects fitting objType. if pointTest is true objects will be checked to see if they snap eachother, regardless wether the snap point is a wall or object snap |
| Scoring.objectSnapTest(objType) | Returns the count of snapped objects fitting `objType` |
| Scoring.closestDistance(from, to) | Returns the shortest distance between objects matching `from` and `to` |
| Scoring.closerThanOthers(type, others, target) | Returns 1 if `type` object is closer to `target` than `others` objects |
| Scoring.ACloserThanB(objTypeA, objTypeB, targetType) | Returns 1 if `objTypeA` is closer to `targetType` than `objTypeB`     |
| Scoring.lineOfSight(objType, point) | returns the count of objects that has direct line of sight to `point`. Point is a THREE.Vector3  |
| Scoring.objZoneTest(objType, area, otherType, useRoom) | Tests wether the object zone `area` in `objType` intersects with `otherType`. if useRoom is true, then room objects will be tested in the zone as well |
