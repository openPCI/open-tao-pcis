

/*
Build by Wiquid's PCI Generator for TAO platform Free to use
 */

define([
    'lodash',
	'i18n',
    'brainstorm/creator/widget/Widget',
    'tpl!brainstorm/creator/tpl/markup'
], function(_,__, Widget, markupTpl){
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
                nickname: __("You"),
                messages: __("10;Anne;red;Message in red after 10 seconds\n15;Lars;green;Message in green after 15 seconds\n16;Igor;#00a8a7;Message in color #00a8a7 after 16 seconds"),
                timeLimit: 60,
                startText: __('Click here when you are ready to brainstorm'),
                endText: __('Time is up. Go to next task.')
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
