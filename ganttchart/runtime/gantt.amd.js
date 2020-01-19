
/*
Build by Wiquid's PCI Generator for TAO platform Free to use
 */

define(['qtiCustomInteractionContext', 'IMSGlobal/jquery_2_1_1', 'OAT/util/event', 'gantt/runtime/ganttjs/gantt'], function(qtiCustomInteractionContext, $, event, GanttJS){
    'use strict';

    function deserializeConfig(cfg){
      var ret = JSON.parse(JSON.stringify(cfg));

      ret.startDate = /[0-9]{1,2}-[0-9]{1,2}-[0-9]{4}/.test(cfg.startDate) ? new Date(cfg.startDate) : false;
      ret.tasks = cfg.tasks.split('\n').map(function(str){
        return str.split(';');
      });
      return ret;
    }

    var gantt = {
        id : -1,
        getTypeIdentifier : function getTypeIdentifier(){
            return 'gantt';
        },
        /**
         * Render the PCI :
         * @param {String} id
         * @param {Node} dom
         * @param {Object} config - json
         */
        initialize : function initialize(id, dom, config, assetManager){

            //add method on(), off() and trigger() to the current object
            event.addEventMgr(this);

            var _this = this;
            this.id = id;
            this.dom = dom;
            this.config = config || {};
            this.responseContainer = {base : {string : ''}};

            //tell the rendering engine that I am ready
            qtiCustomInteractionContext.notifyReady(this);

            var ganttChart = new GanttJS(dom, deserializeConfig(_this.config));
            this.ganttChart = ganttChart;
            //listening to dynamic configuration change
            this.on('cfgChange', function(key, value){
                _this.config[key] = value;
                _this.ganttChart.destroy();
                _this.ganttChart = new GanttJS(dom, deserializeConfig(_this.config));
            });
        },
        /**
         * Programmatically set the response following the json schema described in
         * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
         *
         * @param {Object} interaction
         * @param {Object} response
         */
        setResponse : function setResponse(response){
          console.log('setResponse',response);
        },
        /**
         * Get the response in the json format described in
         * http://www.imsglobal.org/assessment/pciv1p0cf/imsPCIv1p0cf.html#_Toc353965343
         *
         * @param {Object} interaction
         * @returns {Object}
         */
        getResponse : function getResponse(){
          return {
            base : {
              string : JSON.stringify({
                response: this.ganttChart.getResult().map(function(a){
                  return a.join(', ');
                }).join(';'),
                state: this.ganttChart.getState()
              }).replace(/"/g,"'")
            }
          };
        },
        /**
         * Remove the current response set in the interaction
         * The state may not be restored at this point.
         *
         * @param {Object} interaction
         */
        resetResponse : function resetResponse(){

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
          console.log(state);
            if(state.response){
              var data = JSON.parse(state.response.base.string.replace(/'/g,'"'));
              this.ganttChart.setState(data.state);
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
            return {}
        }
    };

    qtiCustomInteractionContext.register(gantt);
});
