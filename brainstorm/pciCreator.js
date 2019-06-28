

/*
Build by Wiquid's PCI Generator for TAO platform Free to use
 */

define([
    'lodash',
    'brainstorm/creator/widget/Widget',
    'tpl!brainstorm/creator/tpl/markup'
], function(_, Widget, markupTpl){
    'use strict';

    var _typeIdentifier = 'brainstorm';

    var brainstormCreator = {
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
            return {
                nickname: "Dig",
                messages: "10;Anne;red;Besked efter ti sekunder\n15;Lars;green;Besked efter femten sekunder\n16;Igor;#00a8a7;Besked efter seksten sekunder",
                timeLimit: 60,
                startText: 'Klik her når du er klar til at brainstorme',
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
        },
        /**
         * (required) Gives the qti pci xml template
         *
         * @returns {function} handlebar template
         */
        getMarkupTemplate : function(){
            return markupTpl;
        },
        /**
         * (optional) Allows passing additional data to xml template
         *
         * @returns {function} handlebar template
         */
        getMarkupData : function(pci, defaultData){
            defaultData.prompt = pci.data('prompt');
            return defaultData;
        }
    };

    //since we assume we are in a tao context, there is no use to expose the a global object for lib registration
    //all libs should be declared here
    return brainstormCreator;
});
