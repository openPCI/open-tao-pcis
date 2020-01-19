
/*
Build by Wiquid's PCI Generator for TAO platform Free to use
 */

define(['qtiCustomInteractionContext', 'IMSGlobal/jquery_2_1_1', 'OAT/util/event'], function(qtiCustomInteractionContext, $, event){
    'use strict';

    function startBrainstorm(dom, config, resultObject){
      console.log(config)
      var playerName = config.nickname || 'Test-tager';
      var messages = config.messages.split('\n');
      var timeLimit = parseInt(config.timeLimit) || 60;
      var $dom = $(dom);
      var timeouts = [];
      var timeStart;

      $dom.find('.chat').empty();
      $dom.find('.prompt').val('');

      function timestamp(s){
        var m=Math.floor(s/60);
        s-=m*60;
        return (''+m).padStart(2,"0") + ":" + (''+Math.round(s)).padStart(2,"0");
      }

      function writeBotLine(msg, now){
        msg = msg.split(';');
        if(msg.length == 4){
          var t = parseInt(msg[0])*1000;
          setTimeout( function(){
            writeChatLine(t, msg[1], msg[3], false, msg[2]);
          }, now ? 0 : t);
        }
      }

      function writeChatLine(elapsed, name, msg, player, color){
        var $time = $('<span>').text(timestamp(elapsed));
        var $name = $('<span>',{class:'name'}).text(name);
        var $msg = $('<div>').append([/*$time,*/$name, msg]);
        if(player){
          $msg.addClass('is-player');
        }
        if(color) $name.css('color', color);
        $dom.find('.chat').append($msg);
      }

      function endBrainstorm(){
        $dom.find('input').attr('disabled','disabled');
        $dom.find('.chat').addClass('brainstorm-ended');
      }

      function simulate(){
        messages.forEach(function(str){
          writeBotLine(str, true);
        });
      }

      function addUserReply(str){
        var t = (new Date() - timeStart) / 1000;
        resultObject.base.string += "\n" + [timestamp(t), playerName, str].join(';');
        writeChatLine(t, playerName, str, true);
      }

      function start(){
        timeStart = new Date;
        $dom.find('.prompt').on('keypress', function(e){
          if(e.which == 13){
            addUserReply($(this).val());
            $(this).val('');
          }
        });

        messages.forEach(function(str){
          writeBotLine(str)
        });

        var timeLimitTimeout = setTimeout(endBrainstorm,timeLimit*1000);
      }

      if(window.editor_mode){
        simulate();
      } else {
        start();
      }

    }

    var brainstorm = {
        id : -1,
        getTypeIdentifier : function getTypeIdentifier(){
            return 'brainstorm';
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

            //
            console.log('initialize', qtiCustomInteractionContext);

            //listening to dynamic configuration change
            this.on('cfgChange', function(key, value){
              console.log('cfgChange');
                _this.config[key] = value;
              startBrainstorm(dom, _this.config);
            });
            startBrainstorm(dom, config, this.responseContainer);
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

    qtiCustomInteractionContext.register(brainstorm);
});
