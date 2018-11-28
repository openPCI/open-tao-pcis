

/*
Build by Wiquid's PCI Generator for TAO platform Free to use
 */

define([
    'lodash',
    'voxelcraft/creator/widget/Widget',
    'tpl!voxelcraft/creator/tpl/markup'
], function(_, Widget, markupTpl){
    'use strict';

    var _typeIdentifier = 'voxelcraft';

    var voxelcraftCreator = {
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
                colors: '#cc0000\n#cc6900\n#f7ef00\n#afe000\n#00b512\n#00bfa5\n#009bbf\n#008af4\n#ae00f4\n#f400e3\n#f40000\n#cccccc\n#ffffff\n#222222',
                scene: '[]',
                gameUrl: 'https://surveyinfo.au.dk/pci-external/open-tao-pcis/voxelcraft/game/'
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
    return voxelcraftCreator;
});
