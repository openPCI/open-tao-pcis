# Voxelcraft
The Voxelcraft exercise is a simple 3D building game, where a test-taker can
build anything out of cubes.

## Functional scoring
Exercises can be scored by a function. This function can make use of the scoring API for voxelcraft.
Or alternatively you can access the THREE.js scene and do your own custom scoring.

| Function | Description |
|----------|-------------|
| Scoring.find(shape, useColor, wsColor) | The shape argument is a voxel shape array (you can copy+paste in the voxelcraft editor to get these). if `useColor` is true then the shape must match in colors. If wsColor is set, then empty space will be matched with voxels in `shape` that matches wsColor. |

# Structure
The Voxelcraft PCI relies on an iframe that calls the voxelcraft construction files. These files cannot be part of the PCI itself, so they have to be placed somewhere else. In this setup, the game folder is placed in a folder in your TAO instance called openPICs/voxelcraft/game. You need to place a .htaccess-file in the openPICs folder with the content 

> RewriteEngine off

This prevent TAO from rewriting the URL. 

The URL to this folder is https://your.tao.domain/taosubfolder/openPICs/voxelcraft/game. But you can place it whereever you want, also at other domains.
