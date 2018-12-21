

/*
Build by Wiquid's PCI Generator for TAO platform Free to use
 */

define([
    'lodash',
    'svgmap/creator/widget/Widget',
    'tpl!svgmap/creator/tpl/markup'
], function(_, Widget, markupTpl){
    'use strict';

    var _typeIdentifier = 'svgmap';

    var svgmapCreator = {
        /**
         * (required) Get the typeIdentifier of the custom interaction
         *
         * @returns {String}
         */
        getTypeIdentifier : function(){
            return _typeIdentifier;
        },

        /**
         * (required) Get the widget prototype
         * Used in the renderer
         *
         * @returns {Object} Widget
         */
        getWidget : function(){
            console.log('getWidget', arguments, Widget);
            window.editor_mode = true;
            return Widget;
        },

        /**
         * (optional) Get the default properties values of the pci.
         * Used on new pci instance creation
         *
         * @returns {Object}
         */
        getDefaultProperties : function(pci){
            console.log('getDefaultProperties', arguments);
            return {
                nickname: "Dig",
                messages: "10;Anne;red;Besked efter ti sekunder\n15;Lars;green;Besked efter femten sekunder\n16;Igor;#00a8a7;Besked efter seksten sekunder",
                timeLimit: 60,
                startText: 'Klik her når du er klar til at svgmape',
                endText: 'Tiden er gået, gå til næste opgave.'
            };
        },
        /**
         * (optional) Callback to execute on the
         * Used on new pci instance creation
         *
         * @returns {Object}
         */
        afterCreate : function(pci){
            //do some stuff
            console.log('afterCreate', arguments);
        },
        /**
         * (required) Gives the qti pci xml template
         *
         * @returns {function} handlebar template
         */
        getMarkupTemplate : function(){
            console.log('getMarkupTemplate', arguments);
            return markupTpl;
        },
        /**
         * (optional) Allows passing additional data to xml template
         *
         * @returns {function} handlebar template
         */
        getMarkupData : function(pci, defaultData){
            console.log('getMarkupData', arguments);
            defaultData.prompt = pci.data('prompt');
            return defaultData;
        }
    };

    //since we assume we are in a tao context, there is no use to expose the a global object for lib registration
    //all libs should be declared here
    return svgmapCreator;
});
