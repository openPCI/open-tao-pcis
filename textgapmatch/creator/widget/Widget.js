

/*
 Build by Wiquid's PCI Generator for TAO platform Free to use 
 */

define([
    'taoQtiItem/qtiCreator/widgets/interactions/customInteraction/Widget',
    'textgapmatch/creator/widget/states/states'
], function(Widget, states){
    'use strict';

    var textgapmatchWidget = Widget.clone();

     textgapmatchWidget.initCreator = function(){
        
        this.registerStates(states);
        
        Widget.initCreator.call(this);
    };
    
    return textgapmatchWidget;
});
