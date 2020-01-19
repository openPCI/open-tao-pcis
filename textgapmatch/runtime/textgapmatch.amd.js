
/*
Build by Wiquid's PCI Generator for TAO platform Free to use
 */

define(['qtiCustomInteractionContext', 'IMSGlobal/jquery_2_1_1', 'OAT/util/event', 'textgapmatch/runtime/gapmatch','textgapmatch/runtime/DragDropTouch'], function(qtiCustomInteractionContext, $, event, GapMatch){
    'use strict';



    var textgapmatch = {
        id : -1,
        getTypeIdentifier : function getTypeIdentifier(){
            return 'textgapmatch';
        },
        /**
         * Render the PCI :
         * @param {String} id
         * @param {Node} dom
         * @param {Object} config - json
         */
        initialize : function initialize(id, dom, config, assetManager){
            var that = this;
            function startGapmatch(dom, config, resultObject){
              if(that.gapmatch) that.gapmatch.destroy();
              that.gapmatch = new GapMatch(dom, {
                image: config.backdrop,
                dropzones: config.dropzones instanceof Array ? config.dropzones : JSON.parse(config.dropzones),
                strings: config.strings.split('\n'),
                editor: window.editor_mode,
                infiniteTexts: config.infiniteTexts,
                maxDropped : parseInt(config.maxDropped),
                droppedStyle: config.droppedStyle,
                numbering: config.numbering,
                onChange: function(result){
                  resultObject.base.string = JSON.stringify(result);
                },
                editorCallback: function(dropzones){
                  if(window.editor_mode){
                    // This is absolutely a hack, because this shouldn't be a thing in TAO.
                    window.__updateDropzones(dropzones);
                  }
                }
              });
            }

            event.addEventMgr(this);

            var _this = this;
            this.id = id;
            this.dom = dom;
            this.config = config || {};
            this.responseContainer = {base : {string : ''}};

            //tell the rendering engine that I am ready
            qtiCustomInteractionContext.notifyReady(this);

            //listening to dynamic configuration change
            this.on('cfgChange', function(key, value){
                _this.config[key] = value;
              startGapmatch(dom, _this.config, _this.responseContainer);
            });
            startGapmatch(dom, config, this.responseContainer);
        },
        /**
         * Programmatically set the response following the json schema described in
         * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
         *
         * @param {Object} interaction
         * @param {Object} response
         */
        setResponse : function setResponse(response){
        },
        /**
         * Get the response in the json format described in
         * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
         *
         * @param {Object} interaction
         * @returns {Object}
         */
        getResponse : function getResponse(){
            return this.responseContainer;
        },
        /**
         * Remove the current response set in the interaction
         * The state may not be restored at this point.
         *
         * @param {Object} interaction
         */
        resetResponse : function resetResponse(){

            var Scontainer = $(this.dom);

        },
        /**
         * Reverse operation performed by render()
         * After this function is executed, only the inital naked markup remains
         * Event listeners are removed and the state and the response are reset
         *
         * @param {Object} interaction
         */
        destroy : function destroy(){

            var Scontainer = $(this.dom);
            Scontainer.off().empty();
        },
        /**
         * Restore the state of the interaction from the serializedState.
         *
         * @param {Object} interaction
         * @param {Object} serializedState - json format
         */
        setSerializedState : function setSerializedState(state){
          if(state.response){
            this.gapmatch.setResult(JSON.parse(state.response.base.string));
          }
        },
        /**
         * Get the current state of the interaction as a string.
         * It enables saving the state for later usage.
         *
         * @param {Object} interaction
         * @returns {Object} json format
         */
        getSerializedState : function getSerializedState(){
            return {};
        }
    };

    qtiCustomInteractionContext.register(textgapmatch);
});
