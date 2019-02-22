

/*
 Build by Wiquid's PCI Generator for TAO platform Free to use 
 */

define([
    'taoQtiItem/qtiCreator/widgets/interactions/customInteraction/Widget',
    'wordrank/creator/widget/states/states'
], function(Widget, states){
    'use strict';

    var wordrankWidget = Widget.clone();

     wordrankWidget.initCreator = function(){
        
        this.registerStates(states);
        
        Widget.initCreator.call(this);
    };
    
    return wordrankWidget;
});
