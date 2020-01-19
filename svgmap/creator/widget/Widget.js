

/*
 Build by Wiquid's PCI Generator for TAO platform Free to use 
 */

define([
    'taoQtiItem/qtiCreator/widgets/interactions/customInteraction/Widget',
    'svgmap/creator/widget/states/states'
], function(Widget, states){
    'use strict';

    var svgmapWidget = Widget.clone();

     svgmapWidget.initCreator = function(){
        
        this.registerStates(states);
        
        Widget.initCreator.call(this);
    };
    
    return svgmapWidget;
});
