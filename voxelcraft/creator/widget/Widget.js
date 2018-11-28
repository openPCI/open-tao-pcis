

/*
 Build by Wiquid's PCI Generator for TAO platform Free to use 
 */

define([
    'taoQtiItem/qtiCreator/widgets/interactions/customInteraction/Widget',
    'voxelcraft/creator/widget/states/states'
], function(Widget, states){
    'use strict';

    var voxelcraftWidget = Widget.clone();

     voxelcraftWidget.initCreator = function(){
        
        this.registerStates(states);
        
        Widget.initCreator.call(this);
    };
    
    return voxelcraftWidget;
});
