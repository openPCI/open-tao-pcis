
/*
Build by Wiquid's PCI Generator for TAO platform Free to use
 */
define([
    'taoQtiItem/qtiCreator/widgets/states/factory',
    'taoQtiItem/qtiCreator/widgets/interactions/states/Question',
    'taoQtiItem/qtiCreator/widgets/helpers/formElement',
    'taoQtiItem/qtiCreator/editor/simpleContentEditableElement',
    'taoQtiItem/qtiCreator/editor/containerEditor',
    'tpl!textgapmatch/creator/tpl/propertiesForm',
    'lodash',
    'jquery'
], function(stateFactory, Question, formElement, simpleEditor, containerEditor, formTpl, _, $){
    'use strict';

    var textgapmatchStateQuestion = stateFactory.extend(Question, function(){

        var $container = this.widget.$container,
            interaction = this.widget.element


    }, function(){

        var Scontainer = this.widget.$container,
            Sprompt = Scontainer.find('.prompt');

        simpleEditor.destroy(Scontainer);
        containerEditor.destroy(Sprompt);
    });

     textgapmatchStateQuestion.prototype.initForm = function(){

        var _widget = this.widget,
            Sform = _widget.$form,
            interaction = _widget.element,
            response = interaction.getResponseDeclaration();


        //render the form using the form template
        Sform.html(formTpl({
            serial : response.serial,
            strings: interaction.prop('strings'),
            backdrop: interaction.prop('backdrop'),
            dropzones: interaction.prop('dropzones'),
            identifier : interaction.attr('responseIdentifier'),
            maxDropped: interaction.prop('maxDropped'),
            droppedStyle: interaction.prop('droppedStyle'),
            infiniteTexts: interaction.prop('infiniteTexts')
        }));

        function _arrayBufferToBase64( buffer ) {
            var binary = '';
            var bytes = new Uint8Array( buffer );
            var len = bytes.byteLength;
            for (var i = 0; i < len; i++) {
                binary += String.fromCharCode( bytes[ i ] );
            }
            return window.btoa( binary );
        }

        function createDataUrl(file, callback){
          var reader = new FileReader();
          reader.addEventListener("loadend", function() {
             callback('data:' + file.type + ';base64,' + _arrayBufferToBase64(reader.result));
          });
          reader.readAsArrayBuffer(file);
        }

        Sform.find('.bgupload').on('change', function(){
          createDataUrl(this.files[0], function(url){
            Sform.find('.imageurl').val(url);
            interaction.prop('backdrop', url);
            interaction.triggerPci('cfgChange', ['backdrop',url]);
          });
        });

        //init form javascript
        formElement.initWidget(Sform);

        //init data change callbacks
        formElement.setChangeCallbacks(Sform, interaction, {
            strings : function(interaction, value){
                interaction.prop('strings', value);
                interaction.triggerPci('cfgChange', ['strings',value]);
            },
            backdrop : function(interaction, value){
                interaction.prop('backdrop', value);
                interaction.triggerPci('cfgChange', ['backdrop',value]);
            },
            dropzones : function(interaction, value){
                interaction.prop('dropzones', value);
                interaction.triggerPci('cfgChange', ['dropzones',value]);
            },
            maxDropped : function(interaction, value){
                interaction.prop('maxDropped', value);
                interaction.triggerPci('cfgChange', ['maxDropped',value]);
            },
            droppedStyle : function(interaction, value){
                interaction.prop('droppedStyle', value);
                interaction.triggerPci('cfgChange', ['droppedStyle',value]);
            },
            identifier : function(i, value){
                response.id(value);
                interaction.attr('responseIdentifier', value);
            },
            infiniteTexts: function(interaction, value){
              interaction.prop('infiniteTexts', value);
              interaction.triggerPci('cfgChange', ['infiniteTexts',value]);
            }
        });

        window.__updateDropzones = function(dropzones){
          var stringified = JSON.stringify(dropzones, null, 2);
          Sform.find('.dropzones').val(stringified);
          interaction.prop('dropzones', stringified);
          interaction.triggerPci('cfgChange', ['dropzones',stringified]);
        }

    };

    return  textgapmatchStateQuestion;
});
