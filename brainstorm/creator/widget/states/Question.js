
/*
Build by Wiquid's PCI Generator for TAO platform Free to use
 */
define([
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/interactions/states/Question',
    'taoQtiItem/qtiCreator/widgets/helpers/formElement',
    'taoQtiItem/qtiCreator/editor/simpleContentEditableElement',
    'taoQtiItem/qtiCreator/editor/containerEditor',
    'tpl!brainstorm/creator/tpl/propertiesForm',
    'lodash',
    'jquery'
], function(stateFactory, Question, formElement, simpleEditor, containerEditor, formTpl, _, $){
    'use strict';

    var brainstormStateQuestion = stateFactory.extend(Question, function(){

        var $container = this.widget.$container,
            interaction = this.widget.element

        //previewChat($container);

    }, function(){

        var Scontainer = this.widget.$container,
            Sprompt = Scontainer.find('.prompt');

        simpleEditor.destroy(Scontainer);
        containerEditor.destroy(Sprompt);
    });

     brainstormStateQuestion.prototype.initForm = function(){

        var _widget = this.widget,
            Sform = _widget.$form,
            interaction = _widget.element,
            response = interaction.getResponseDeclaration();


        //render the form using the form template
        Sform.html(formTpl({
            serial : response.serial,
            timeLimit: interaction.prop('timeLimit'),
            nickname: interaction.prop('nickname'),
            messages: interaction.prop('messages'),
            identifier : interaction.attr('responseIdentifier')
        }));

        //init form javascript
        formElement.initWidget(Sform);

        //init data change callbacks
        formElement.setChangeCallbacks(Sform, interaction, {
            messages : function(interaction, value){
                interaction.prop('messages', value);
                interaction.triggerPci('cfgChange', ['messages',value]);
            },
            timeLimit: function(interaction, value){
                interaction.prop('timeLimit', parseInt(value) || 60);
                interaction.triggerPci('cfgChange', ['timeLimit', parseInt(value)]);
            },
            nickname: function(interaction, value){
                interaction.prop('nickname', value);
                interaction.triggerPci('cfgChange', ['nickname',value]);
            },
            startText: function(interaction, value){
                interaction.prop('startText', value);
                interaction.triggerPci('cfgChange', ['startText',value]);
            },
            endText: function(interaction, value){
                interaction.prop('endText', value);
                interaction.triggerPci('cfgChange', ['endText',value]);
            },
            identifier : function(i, value){
                response.id(value);
                interaction.attr('responseIdentifier', value);
            }
        });

    };

    return  brainstormStateQuestion;
});
