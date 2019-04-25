
/*
Build by Wiquid's PCI Generator for TAO platform Free to use
 */
define([
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/interactions/states/Question',
    'taoQtiItem/qtiCreator/widgets/helpers/formElement',
    'taoQtiItem/qtiCreator/editor/simpleContentEditableElement',
    'taoQtiItem/qtiCreator/editor/containerEditor',
    'tpl!svgmap/creator/tpl/propertiesForm',
    'lodash',
    'jquery'
], function(stateFactory, Question, formElement, simpleEditor, containerEditor, formTpl, _, $){
    'use strict';

    var svgmapStateQuestion = stateFactory.extend(Question, function(){

        var $container = this.widget.$container,
            interaction = this.widget.element

        //previewChat($container);

    }, function(){

        var Scontainer = this.widget.$container,
            Sprompt = Scontainer.find('.prompt');

        simpleEditor.destroy(Scontainer);
        containerEditor.destroy(Sprompt);
    });

     svgmapStateQuestion.prototype.initForm = function(){

        var _widget = this.widget,
            Sform = _widget.$form,
            interaction = _widget.element,
            response = interaction.getResponseDeclaration();


        //render the form using the form template
        Sform.html(formTpl({
            serial : response.serial,
            backdrop: interaction.prop('backdrop'),
            poi: interaction.prop('poi'),
            dotresolution: interaction.prop('dotresolution'),
            pathlayer: interaction.prop('pathlayer'),
            identifier : interaction.attr('responseIdentifier'),
            scoring: interaction.prop('scoring')
        }));

        function fileToString(file, callback){
          var reader = new FileReader();
          reader.addEventListener("loadend", function() {
             callback(reader.result);
          });
          reader.readAsText(file);
        }

        Sform.find('.bgupload').on('change', function(){
          fileToString(this.files[0], function(xml){
            Sform.find('.imageurl').val(xml);
            interaction.prop('backdrop', xml);
            interaction.triggerPci('cfgChange', ['backdrop',xml]);
          });
        });

        //init form javascript
        formElement.initWidget(Sform);

        //init data change callbacks
        formElement.setChangeCallbacks(Sform, interaction, {
            backdrop: function(interaction, value){
                interaction.prop('backdrop', value);
                interaction.triggerPci('cfgChange', ['backdrop',value]);
            },
            poi: function(interaction, value){
                interaction.prop('poi', value);
                interaction.triggerPci('cfgChange', ['poi',value]);
            },
            dotresolution: function(interaction, value){
                interaction.prop('dotresolution', value);
                interaction.triggerPci('cfgChange', ['dotresolution',value]);
            },
            pathlayer: function(interaction, value){
                interaction.prop('pathlayer', value);
                interaction.triggerPci('cfgChange', ['pathlayer',value]);
            },
            scoring: function(interaction, value){
                interaction.prop('scoring', value);
                interaction.triggerPci('cfgChange', ['scoring',value]);
            },
            identifier : function(interaction, value){
                response.id(value);
                interaction.attr('responseIdentifier', value);
            }
        });

        window.__updateSvgMapPoi = function(point){
          var val = JSON.parse(interaction.prop('poi'));

          var poiName = prompt('Navngiv interessepunkt');
          if(!poiName) return;

          val[poiName] = point.i;

          var stringified = JSON.stringify(val, null, 2);

          Sform.find('.poifield').val(stringified);
          interaction.prop('poi', stringified);
          interaction.triggerPci('cfgChange', ['poi',stringified]);
        }


    };

    return  svgmapStateQuestion;
});
