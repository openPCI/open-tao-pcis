# open-tao-pcis

In this repository you will find a collection of
PCI (Portable Custom Interaction) modules for TAO and other such products that
supports the QTI and PCI standards for Question and Tests Interoperability.

## Use with tao
To install the PCIs:

- Download them as .zip files from the [builds/ directory](builds/)
- Log in to your TAO community edition installation
- Go to Items -> Authoring (Any item)
- Expand 'Custom interactions'
- Click 'Manage Custom Interactions'
- Click 'Add Interaction'
- Either drag the zip-files to the designated drop area or find them by pressing 'Browse...'

## Building
In order to build the PCI interactions, you must run the `./build.sh` script. Requires zip CLI utility.

## Scoring
Some of the PCIs have an auto scoring option as part of the code. Others should be scored by human scorers; use OpenHumanScoring https://github.com/openPCI/OpenHumanScoring. And some PCIs can be scored automatically in R using OpenPCIScoring: https://github.com/openPCI/OpenPCIScoring.
