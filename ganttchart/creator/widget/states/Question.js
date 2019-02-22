
/*
Build by Wiquid's PCI Generator for TAO platform Free to use
 */
define([
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/interactions/states/Question',
    'taoQtiItem/qtiCreator/widgets/helpers/formElement',
    'taoQtiItem/qtiCreator/editor/simpleContentEditableElement',
    'taoQtiItem/qtiCreator/editor/containerEditor',
    'tpl!gantt/creator/tpl/propertiesForm',
    'lodash',
    'jquery'
], function(stateFactory, Question, formElement, simpleEditor, containerEditor, formTpl, _, $){
    'use strict';

    var ganttStateQuestion = stateFactory.extend(Question, function(){

        var $container = this.widget.$container,
            interaction = this.widget.element

        //previewChat($container);

    }, function(){

        var Scontainer = this.widget.$container,
            Sprompt = Scontainer.find('.prompt');

        simpleEditor.destroy(Scontainer);
        containerEditor.destroy(Sprompt);
    });

     ganttStateQuestion.prototype.initForm = function(){

        var _widget = this.widget,
            Sform = _widget.$form,
            interaction = _widget.element,
            response = interaction.getResponseDeclaration();


        //render the form using the form template
        Sform.html(formTpl({
            serial : response.serial,
            weekNumHack: interaction.prop('weekNumHack'),
            startDate: interaction.prop('startDate'),
            period: interaction.prop('period'),
            weekDays: interaction.prop('weekDays'),
            months: interaction.prop('months'),
            dayStart: interaction.prop('dayStart'),
            dayEnd: interaction.prop('dayEnd'),
            useHours: interaction.prop('useHours'),
            useHalfHours: interaction.prop('useHalfHours'),
            disableWeekends: interaction.prop('disableWeekends'),
            tasks: interaction.prop('tasks'),
            tasks_str: 'strstr',

            identifier : interaction.attr('responseIdentifier')
        }));

        //init form javascript
        formElement.initWidget(Sform);

        //init data change callbacks
        formElement.setChangeCallbacks(Sform, interaction, {
            startDate : function(interaction, value){
                interaction.prop('startDate', value);
                interaction.triggerPci('cfgChange', ['startDate',value]);
            },
            period : function(interaction, value){
                interaction.prop('period', value);
                interaction.triggerPci('cfgChange', ['period',value]);
            },
            weekDays : function(interaction, value){
                interaction.prop('weekDays', value);
                interaction.triggerPci('cfgChange', ['weekDays',value]);
            },
            weekNumHack : function(interaction, value){
                interaction.prop('weekNumHack', value);
                interaction.triggerPci('cfgChange', ['weekNumHack',value]);
            },
            useHours : function(interaction, value){
                interaction.prop('useHours', value);
                interaction.triggerPci('cfgChange', ['useHours',value]);
            },
            useHalfHours : function(interaction, value){
                interaction.prop('useHalfHours', value);
                interaction.triggerPci('cfgChange', ['useHalfHours',value]);
            },
            showTimeRange : function(interaction, value){
                interaction.prop('showTimeRange', value);
                interaction.triggerPci('cfgChange', ['showTimeRange',value]);
            },
            dayStart : function(interaction, value){
                interaction.prop('dayStart', value);
                interaction.triggerPci('cfgChange', ['dayStart',value]);
            },
            dayEnd : function(interaction, value){
                interaction.prop('dayEnd', value);
                interaction.triggerPci('cfgChange', ['dayEnd',value]);
            },
            months : function(interaction, value){
                interaction.prop('months', value);
                interaction.triggerPci('cfgChange', ['months',value]);
            },
            disableWeekends : function(interaction, value){
              console.log('disableWeekends','cfg change',arguments);
                interaction.prop('disableWeekends', value);
                interaction.triggerPci('cfgChange', ['disableWeekends',value]);
            },
            tasks : function(interaction, value){
                interaction.prop('tasks', value);
                interaction.triggerPci('cfgChange', ['tasks',value]);
            },
            identifier : function(i, value){
                response.id(value);
                interaction.attr('responseIdentifier', value);
            }
        });

    };

    return  ganttStateQuestion;
});
