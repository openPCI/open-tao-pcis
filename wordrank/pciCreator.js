

/*
Build by Wiquid's PCI Generator for TAO platform Free to use
 */

define([
    'lodash',
    'wordrank/creator/widget/Widget',
    'tpl!wordrank/creator/tpl/markup'
], function(_, Widget, markupTpl){
    'use strict';

    var _typeIdentifier = 'wordrank';

    var wordrankCreator = {
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
                cells: "3,5,3",
                texts: 'Tekst 1\nTekst 2\nTekst 3\nTekst 4',
				randomorder: true,
				descriptions: "-,,+",
				sample: 0,
				numGrups: 1
            };
        },
        /**
         * (optional) Callback to execute on the
         * Used on new pci instance creation
         *
         * @returns {Object}
         */
        afterCreate : function(pci){
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
    return wordrankCreator;
});
