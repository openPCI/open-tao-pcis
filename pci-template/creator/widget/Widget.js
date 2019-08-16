

/*
 Build by Wiquid's PCI Generator for TAO platform Free to use 
 */

define([
    'taoQtiItem/qtiCreator/widgets/interactions/customInteraction/Widget',
    'brainstorm/creator/widget/states/states'
], function(Widget, states){
    'use strict';

    var brainstormWidget = Widget.clone();

     brainstormWidget.initCreator = function(){
        
        this.registerStates(states);
        
        Widget.initCreator.call(this);
    };
    
    return brainstormWidget;
});
