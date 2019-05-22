
/*
Build by Wiquid's PCI Generator for TAO platform Free to use
 */
define(['qtiCustomInteractionContext', 'IMSGlobal/jquery_2_1_1', 'OAT/util/event'], function(qtiCustomInteractionContext, $, event){
    'use strict';



    var voxelcraft = {
        id : -1,
        getTypeIdentifier : function getTypeIdentifier(){
            return 'voxelcraft';
        },
        /**
         * Render the PCI :
         * @param {String} id
         * @param {Node} dom
         * @param {Object} config - json
         */
        initialize : function initialize(id, dom, config, assetManager){
            var that = this;
            function startGame(dom, config, responseContainer){
              if(!that.$iframe){
                that.$iframe = $('<iframe>');
                that.$iframe.attr('allow', 'fullscreen');
                that.$iframe.css('width','100%');
                $(dom).append(that.$iframe);
                that.$iframe.css('height', that.$iframe.width() * 0.56 + 'px');
                that.$iframe[0].focus();


                $(dom).on('mouseover', function(){
                  that.$iframe[0].focus();
                });

              }

  
              window.addEventListener('message', function(event){
                console.log(event);
                switch(event.data.type){
                  case 'ready':
                    that.$iframe[0].contentWindow.postMessage({
                      type :'setPalette',
                      value : config.colors.split('\n')
                    },'*');
                    if(config.scoring)
                      that.$iframe[0].contentWindow.postMessage({
                        type: 'setScoringFunction',
                        value: config.scoring
                      },'*');
                    try {
                      var scene = JSON.parse(config.scene)
                      that.$iframe[0].contentWindow.postMessage({
                        type :'setScene',
                        value : scene
                      },'*');
                    } catch(e){}
                  break;
                  case 'updateResult':
                    _this.responseContainer.base.string = JSON.stringify(event.data.value);
                  break;
                }
              }, false);

              that.$iframe.attr('src', config.gameUrl + '?' + Date.now());

            }

            //add method on(), off() and trigger() to the current object
            event.addEventMgr(this);

            var _this = this;
            this.id = id;
            this.dom = dom;
            this.config = config || {};
            this.responseContainer = {base : {string : ''}};

            //tell the rendering engine that I am ready
            qtiCustomInteractionContext.notifyReady(this);

            var cfgTimeout = 0;

            //listening to dynamic configuration change
            this.on('cfgChange', function(key, value){
              _this.config[key] = value;
              clearTimeout(cfgTimeout);
              cfgTimeout = setTimeout(function(){
                startGame(dom, _this.config, this.responseContainer);
              }, 5000);
            });


            startGame(dom, config, this.responseContainer);
        },
        /**
         * Programmatically set the response following the json schema described in
         * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
         *
         * @param {Object} interaction
         * @param {Object} response
         */
        setResponse : function setResponse(response){
            var Scontainer = $(this.dom),value;
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
          var that = this;
          var onReady = function(event){
            if(state.response && event.data.type == 'ready'){
              that.$iframe[0].contentWindow.postMessage({
                type :'rescore',
                value : JSON.parse(state.response.base.string)
              },'*');
              window.removeEventListener('message', onReady);
            }
          };
          window.addEventListener('message', onReady);
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

    qtiCustomInteractionContext.register(voxelcraft);
});
