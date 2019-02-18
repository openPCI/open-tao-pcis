(function(){
function GapMatchFactory($){
  return function GapMatch(elem, options){
    var $draggingObject;
    var $elem = $(elem);
    var mousePos = {x:0,y:0};
    var clientPos = {x:0,y:0};

    $elem.addClass('gapmatch-wrapper');
    var offset = $elem.offset();
    var dragInterval;
    var alive = true;
    $zones = $('<div>', {class:'gapmatch-zones'});
    var $backdrop = $('<img>', {
      width: '100%',
      draggable: false,
      src: options.image,
      class: 'gapmatch-backdrop'
    });

    $backdrop.on('dragstart', function(event) { event.preventDefault(); });

    $zones.append($backdrop);
    $elem.append($zones);
    var indx = 0;

    if(options.editor){
      var dropzones = options.dropzones || [];
      var start;

      var $helper;

      function createDragHelper(){
        $helper = $('<div>', {
          class: 'gapmatch-editor-dropzone',
          css: {
            left: 0 + '%',
            top: 0 + '%',
            width: 0 + '%',
            height: 0 + '%'
          }
        });
        $zones.append($helper);
      }

      function updateDragHelper(event){
        if(!start) return;
        var end = {x: event.offsetX,y:event.offsetY};
        var tmpStart = {x: start.x, y:start.y};
        if(tmpStart.x > end.x){
          var x = tmpStart.x;
          tmpStart.x = end.x;
          end.x = x;
        }
        if(tmpStart.y > end.y){
          var y = tmpStart.y;
          tmpStart.y = end.y;
          end.y = y;
        }

        var x = tmpStart.x / $elem.width() * 100;
        var y = tmpStart.y / $elem.height() * 100;
        var w = (end.x - tmpStart.x) / $elem.width() * 100;
        var h = (end.y - tmpStart.y) / $elem.height() * 100;
        $helper.css({
          left: x + '%',
          top: y + '%',
          width: w + '%',
          height: h + '%'
        });
      }

      function removeDragHelper(){
        $helper.remove();
      }

      // Update rectangle helper
      $zones.on('mousemove', function(event){
        var offset = $zones.offset();
        event.offsetX = event.clientX - offset.left;
        event.offsetY = event.clientY - offset.top;
        updateDragHelper(event)
      });

      // Show rectangle helper
      $elem.on('mousedown', function(event){
        var offset = $zones.offset();
        event.offsetX = event.clientX - offset.left;
        event.offsetY = event.clientY - offset.top;

        start = {x: event.offsetX, y: event.offsetY};
        createDragHelper();
      });

      // Remove dropzones on doubleclick
      $elem.on('dblclick', '.gapmatch-editor-dropzone', function(e){
        var dropzone = $(this).data('dropzone');
        var rem = -1;

        $(this).remove();

        // Find correct dropzone index in array
        dropzones.forEach(function(d,i){
          if(d[4] == dropzone){ rem = i; }
        })
        dropzones.splice( rem, 1 );

        if(options.editorCallback){
          options.editorCallback(dropzones);
        }
      });

      // Create dropzone on mouseup and evoke callback
      $elem.on('mouseup', function(event){
        var offset = $zones.offset();
        event.offsetX = event.clientX - offset.left;
        event.offsetY = event.clientY - offset.top;

        removeDragHelper();
        indx++;
        var end = {x: event.offsetX,y:event.offsetY};
        if(start){
          if(start.x > end.x){
            var x = start.x;
            start.x = end.x;
            end.x = x;
          }
          if(start.y > end.y){
            var y = start.y;
            start.y = end.y;
            end.y = y;
          }
          var x = start.x / $elem.width() * 100;
          var y = start.y / $elem.height() * 100;
          var w = (end.x - start.x) / $elem.width() * 100;
          var h = (end.y - start.y) / $elem.height() * 100;
          if(w < 2 || h < 2) return;
          dropzones.push([x,y,w,h, "dropzone_"+indx]);
          $zones.append($('<div>', {
            class: 'gapmatch-editor-dropzone',
            data: { dropzone: "dropzone_"+indx },
            css: {
              left: x + '%',
              top: y + '%',
              width: w + '%',
              height: h + '%'
            }
          }));
          start = null;
        }

        if(options.editorCallback){
          options.editorCallback(dropzones);
        }
      });
    }

    var $strings = [];
    options.strings.forEach(function(string,i){
        $strings.push($('<div>', {
          class: 'gapmatch-string',
          attr: { 'data-stringid': i, draggable: "true" },
          text: string
        }));
    });

    var $strings = $('<div>', {
      class: 'gapmatch-strings',
      append: $strings
    });

    $elem.append($strings)

    var $dropzones = []
    options.dropzones.forEach(function(drop, i){
      indx++;
      $dropzones.push($('<div>', {
        data: {dropzone: drop[4] || 'dropzone_' + i},
        class: options.editor ? 'gapmatch-editor-dropzone' : 'gapmatch-dropzone',
        css: {
          left: drop[0]+'%',
          top: drop[1]+'%',
          width: drop[2]+'%',
          height: drop[3]+'%'
        }
      }));
    });

    $zones.append($dropzones);

    function getResult(){
      var result = {};
      $elem.find('.gapmatch-dropzone').each(function(){
        var $dropzone = $(this);
        var label = $dropzone.data('dropzone');
        var strings = [];
        $dropzone.find('.gapmatch-string').each(function(){
          strings.push($(this).text());
        });
        result[label] = strings;
      });
      return result;
    }

    if(!options.editor){
      $elem.on('dragstart', '.gapmatch-string', function(event){
        $draggingObject = $(this);
        $draggingObject.addClass('gapmatch-dragging');
      });

      $elem.on('dragend', '.gapmatch-string', function(event){
        $draggingObject = null;
        $(this).removeClass('gapmatch-dragging');
      });

      $elem.on('dragover', function(event){
        event.preventDefault();
      });
      $elem.on('drop', function(event){
        if(options.infiniteTexts) $draggingObject.remove();
        else $strings.append($draggingObject);
      });

      function getDropSpot($dropzone, event){
        var $before = null;
        $($dropzone.children().get().reverse()).each(function(){
          var $el = $(this);
          var offset = $el.offset();
          var width = $el.width();
          var height = $el.height();

          if(event.pageX < offset.left + width/2 && event.pageY < offset.top + height) $before = $el;
        });
        return $before;
      }

      $elem.on('dragover', '.gapmatch-dropzone, .gapmatch-dropzone > *', function(event){
        event.preventDefault();
      });

      $elem.on('drop', '.gapmatch-dropzone, .gapmatch-dropzone > *', function(event){
        event.stopPropagation();
        $draggingObject.removeClass('gapmatch-dragging');
        if(!$draggingObject) return;
        var $insert = $draggingObject;
        var $this = $(this);
        var $dropzone = $this.hasClass('gapmatch-dropzone') ? $this : $this.parent();

        if($draggingObject.parent()[0] !== $dropzone[0]){
          if((options.maxDropped && $dropzone.children().length >= options.maxDropped)
            || ($dropzone.find('[data-stringid="' + $draggingObject.data('stringid') + '"]').length > 0)){
            return;
          }

          if(options.infiniteTexts && !$draggingObject.parent().hasClass('gapmatch-dropzone')){
            $insert = $draggingObject.clone();
          } else {
            $draggingObject.remove();
          }
        }

        var $beforeElem = getDropSpot($dropzone, event);
        if($beforeElem) $beforeElem.before($insert);
        else $dropzone.append($insert);

        if(options.onChange){
          options.onChange(getResult());
        }

      });
    }
    this.getResult = getResult;

    function setState(state){

    }

    this.setState = setState;

    this.destroy = function(){
      $elem.off('mousedown mouseup tochend touchstart dblclick dragstart drop dragover');
      $backdrop.off('dragstart');
      $elem[0].removeEventListener('touchend', onTouchEnd);
      $elem.html('');
      alive = false;
    }


  };
}

if(typeof define == "function"){
  define(['IMSGlobal/jquery_2_1_1'], function($){
    return GapMatchFactory($);
  });
} else {
  window.GapMatch = GapMatchFactory($);
}

})();
