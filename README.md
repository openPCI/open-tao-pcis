# openPCIs

In this repository you will find a collection of PCIs (Portable Custom Interaction) modules for TAO and other such products that
supports the QTI and PCI standards for Question and Tests Interoperability.

## Use with tao
To install the PCIs:

- Download them as .zip files from the [builds/ directory](builds/)
- Log in to your TAO community edition installation

### in TAO 3.4:
- Select Portable Custom Interactions from the settings menu in the right upper corner
- Click 'Add Interaction'
- Either drag the zip-files to the designated drop area or find them by pressing 'Browse...'

### in TAO 3.3:
- Go to Items -> Authoring (Any item)
- Expand 'Custom interactions'
- Click 'Manage Custom Interactions'
- Click 'Add Interaction'
- Either drag the zip-files to the designated drop area or find them by pressing 'Browse...'

## Game hacks for Voxelcraft and The Room
These PCIs rely on an iframe that imports a game folder. These files cannot be part of the PCI itself, so they have to be placed somewhere else. In this setup, the game folder is placed in a folder in your TAO instance called openPICs/voxelcraft/game or openPICs/theroom/game. You need to place a .htaccess-file in the openPICs folder with the content

> RewriteEngine off

This prevents TAO from rewriting the URL.

The URL to this folder is https://your.tao.domain/taosubfolder/openPICs/theroom/game. But you can place it whereever you want, also at other domains.

## Building
In order to build the PCI interactions, you must run the `./build.sh` script. Requires zip CLI utility.
