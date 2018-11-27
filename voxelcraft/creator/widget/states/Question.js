
/*
Build by Wiquid's PCI Generator for TAO platform Free to use
 */
define([
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/interactions/states/Question',
    'taoQtiItem/qtiCreator/widgets/helpers/formElement',
    'taoQtiItem/qtiCreator/editor/simpleContentEditableElement',
    'taoQtiItem/qtiCreator/editor/containerEditor',
    'tpl!voxelcraft/creator/tpl/propertiesForm',
    'lodash',
    'jquery'
], function(stateFactory, Question, formElement, simpleEditor, containerEditor, formTpl, _, $){
    'use strict';

    var voxelcraftStateQuestion = stateFactory.extend(Question, function(){

        var $container = this.widget.$container,
            interaction = this.widget.element

        //previewChat($container);

    }, function(){

        var Scontainer = this.widget.$container,
            Sprompt = Scontainer.find('.prompt');

        simpleEditor.destroy(Scontainer);
        containerEditor.destroy(Sprompt);
    });

     voxelcraftStateQuestion.prototype.initForm = function(){

        var _widget = this.widget,
            Sform = _widget.$form,
            interaction = _widget.element,
            response = interaction.getResponseDeclaration();


        //render the form using the form template
        Sform.html(formTpl({
            serial : response.serial,
            colors: interaction.prop('colors'),
            gameUrl: interaction.prop('gameUrl'),
            identifier : interaction.attr('responseIdentifier')
        }));

        //init form javascript
        formElement.initWidget(Sform);

        //init data change callbacks
        formElement.setChangeCallbacks(Sform, interaction, {
            colors : function(interaction, value){
                interaction.prop('colors', value);
                interaction.triggerPci('cfgChange', ['colors',value]);
            },
            scene : function(interaction, value){
                interaction.prop('scene', value);
                interaction.triggerPci('cfgChange', ['scene',value]);
            },
            gameUrl: function(interaction, value){
                interaction.prop('gameUrl', value);
                interaction.triggerPci('cfgChange', ['gameUrl', value]);
            },
            identifier : function(i, value){
                response.id(value);
                interaction.attr('responseIdentifier', value);
            }
        });

    };

    return  voxelcraftStateQuestion;
});
