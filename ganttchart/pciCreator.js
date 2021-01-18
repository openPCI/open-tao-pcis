/*
Build by Wiquid's PCI Generator for TAO platform Free to use
 */

define([
    'lodash',
	'i18n',
    'gantt/creator/widget/Widget',
    'tpl!gantt/creator/tpl/markup'
], function(_,__, Widget, markupTpl){
    'use strict';

    var _typeIdentifier = 'gantt';
	var s=new Date()
	var m=(s.getMonth()+1)
	var startDate=m+"/"+s.getDate()+"/"+s.getFullYear()
    var pciCreator = {
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
              period: 30,
              weekDays: true,
              months: true,
              disableWeekends: true,
              startDate: startDate,
              useHours: false,
              useHalfHours: false,
              showTimeRange: false,
              dayStart: 8,
              weekNumHack: false,
              dayEnd: 16,
              tasks: __("Task #1;#F00\nTask #2;#0F0\nTask #3;#00f")
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
    return pciCreator;
});
