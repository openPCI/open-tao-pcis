
/*
Build by Wiquid's PCI Generator for TAO platform Free to use
 */
define([
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/interactions/states/Question',
    'taoQtiItem/qtiCreator/widgets/helpers/formElement',
    'taoQtiItem/qtiCreator/editor/simpleContentEditableElement',
    'taoQtiItem/qtiCreator/editor/containerEditor',
    'tpl!wordrank/creator/tpl/propertiesForm',
    'lodash',
    'jquery'
], function(stateFactory, Question, formElement, simpleEditor, containerEditor, formTpl, _, $){
    'use strict';

    var wordrankStateQuestion = stateFactory.extend(Question, function(){

        var $container = this.widget.$container,
            interaction = this.widget.element

        //previewChat($container);

    }, function(){

        var Scontainer = this.widget.$container,
            Sprompt = Scontainer.find('.prompt');

        simpleEditor.destroy(Scontainer);
        containerEditor.destroy(Sprompt);
    });

     wordrankStateQuestion.prototype.initForm = function(){

        var _widget = this.widget,
            Sform = _widget.$form,
            interaction = _widget.element,
            response = interaction.getResponseDeclaration();


        //render the form using the form template
        Sform.html(formTpl({
            serial : response.serial,
            cells: interaction.prop('cells'),
            texts: interaction.prop('texts'),
			descriptions: interaction.prop('descriptions'),
			randomorder: interaction.prop('randomorder'),
			sample: interaction.prop('sample'),
			numGroups: interaction.prop('numGroups')
        }));

        //init form javascript
        formElement.initWidget(Sform);

        //init data change callbacks
        formElement.setChangeCallbacks(Sform, interaction, {
            texts : function(interaction, value){
                interaction.prop('texts', value);
                interaction.triggerPci('cfgChange', ['texts',value]);
            },
            cells : function(interaction, value){
                interaction.prop('cells', value);
                interaction.triggerPci('cfgChange', ['cells',value]);
            },
            descriptions : function(interaction, value){
                interaction.prop('descriptions', value);
                interaction.triggerPci('cfgChange', ['descriptions',value]);
            },
            randomorder : function(interaction, value){
                interaction.prop('randomorder', value);
                interaction.triggerPci('cfgChange', ['randomorder',value]);
            },
            sample: function(interaction, value){
                interaction.prop('sample', value);
                interaction.triggerPci('cfgChange', ['sample',value]);
            },
            numGroups: function(interaction, value){
                interaction.prop('numGroups', value);
                interaction.triggerPci('cfgChange', ['numGroups',value]);
            },
            identifier : function(i, value){
                response.id(value);
                interaction.attr('responseIdentifier', value);
            }
        });

    };

    return  wordrankStateQuestion;
});
