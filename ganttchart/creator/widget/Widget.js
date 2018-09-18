

/*
 Build by Wiquid's PCI Generator for TAO platform Free to use 
 */

define([
    'taoQtiItem/qtiCreator/widgets/interactions/customInteraction/Widget',
    'gantt/creator/widget/states/states'
], function(Widget, states){
    'use strict';

    var ganttWidget = Widget.clone();

     ganttWidget.initCreator = function(){
        
        this.registerStates(states);
        
        Widget.initCreator.call(this);
    };
    
    return ganttWidget;
});
