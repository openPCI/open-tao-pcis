

/*
 Build by Wiquid's PCI Generator for TAO platform Free to use 
 */

define([
    'taoQtiItem/qtiCreator/widgets/interactions/customInteraction/Widget',
    'theroom/creator/widget/states/states'
], function(Widget, states){
    'use strict';

    var theroomWidget = Widget.clone();

     theroomWidget.initCreator = function(){
        
        this.registerStates(states);
        
        Widget.initCreator.call(this);
    };
    
    return theroomWidget;
});
