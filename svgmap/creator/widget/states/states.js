
/*
Build by Wiquid's PCI Generator for TAO platform Free to use 
 */
define([
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/interactions/customInteraction/states/states',
    'svgmap/creator/widget/states/Question'
], function(factory, states){
    'use strict';
    return factory.createBundle(states, arguments, ['answer', 'correct', 'map']);
});
