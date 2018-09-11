
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
            interval: interaction.prop('interval'),
            names: interaction.prop('names'),
            messages: interaction.prop('messages'),
            identifier : interaction.attr('responseIdentifier')
        }));

        //init form javascript
        formElement.initWidget(Sform);

        //init data change callbacks
        formElement.setChangeCallbacks(Sform, interaction, {
            names : function(interaction, value){
                interaction.prop('names', value);
                interaction.triggerPci('cfgChange', ['names',value]);
            },
            messages : function(interaction, value){
                interaction.prop('messages', value);
                interaction.triggerPci('cfgChange', ['messages',value]);
            },
            interval: function(interaction, value){
                interaction.prop('interval', parseInt(value) || 10);
                interaction.triggerPci('cfgChange', ['interval', parseInt(value)]);
            },
            identifier : function(i, value){
                response.id(value);
                interaction.attr('responseIdentifier', value);
            }
        });

    };

    return  brainstormStateQuestion;
});
