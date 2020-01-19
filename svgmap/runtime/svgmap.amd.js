
/*
Build by Wiquid's PCI Generator for TAO platform Free to use
 */

define(['qtiCustomInteractionContext', 'IMSGlobal/jquery_2_1_1', 'OAT/util/event', 'svgmap/runtime/svgmap'], function(qtiCustomInteractionContext, $, event, SvgMap){
    'use strict';


    var svgmap = {
        id : -1,
        getTypeIdentifier : function getTypeIdentifier(){
            return 'svgmap';
        },
        /**
         * Render the PCI :
         * @param {String} id
         * @param {Node} dom
         * @param {Object} config - json
         */
        initialize : function initialize(id, dom, config, assetManager){
          console.log('config', config);
            var that = this;
            function startsvgmap(dom, config, resultObject){
              if(that.svgmap) that.svgmap.destroy();

              var pois = config.poi;
              try { pois = JSON.parse(config.poi); } catch(e){}

              that.svgmap = new SvgMap({
                element: dom,
                dotResolution: parseInt(config.dotresolution),
                pathLayer: config.pathlayer,
                svg: config.backdrop,
                poi: pois,
                scoringFunction: config.scoring,
                editorCallback: window.editor_mode ? function(point){
                  __updateSvgMapPoi(point);
                } : false,
                pathCallback: function(result){
                  resultObject.base.string = JSON.stringify(result);
                }
              });
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


            //listening to dynamic configuration change
            this.on('cfgChange', function(key, value){
                _this.config[key] = value;
              startsvgmap(dom, _this.config);
            });
            startsvgmap(dom, config, this.responseContainer);
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
          if(state.response){
            this.svgmap.setResult(JSON.parse(state.response.base.string));
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

    qtiCustomInteractionContext.register(svgmap);
});
