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

        var x = tmpStart.x / $zones.width() * 100;
        var y = tmpStart.y / $zones.height() * 100;
        var w = (end.x - tmpStart.x) / $zones.width() * 100;
        var h = (end.y - tmpStart.y) / $zones.height() * 100;
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
      $zones[0].addEventListener('mousemove', function(event){
        updateDragHelper(event);
      }, true);

      // Show rectangle helper
      $zones[0].addEventListener('mousedown', function(event){
        var offset = $zones.offset();

        start = {x: event.offsetX, y: event.offsetY};
        createDragHelper();
      }, true);

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
      $zones[0].addEventListener('mouseup', function(event){
        var offset = $zones.offset();

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
          var x = start.x / $zones.width() * 100;
          var y = start.y / $zones.height() * 100;
          var w = (end.x - start.x) / $zones.width() * 100;
          var h = (end.y - start.y) / $zones.height() * 100;
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
      }, true);
    }

    var $strings = [];
    options.strings.forEach(function(string,i){
      var $text = $('<div>', {
        class: 'gapmatch-string',
        attr: { 'data-stringid': i, draggable: "true" },
      });
      if(options.numbering) $text.append($('<span>', {class: 'gapmatch-number'}));
      $text.append(string);
      $strings.push($text);
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
      function redoNumbering(){
        console.log('numbering')
        $elem.find('.gapmatch-dropzone').each(function(){
          $(this).find('.gapmatch-number').each(function(i){
            $(this).text(i+1 + '.');
          });
        });
      }

      $elem.on('dragstart', '.gapmatch-string', function(event){
        $draggingObject = $(this);
        $draggingObject.addClass('gapmatch-dragging');
      });

      $elem.on('dragend', '.gapmatch-string', function(event){
        $draggingObject = null;
        $(this).removeClass('gapmatch-dragging');
        if(options.numbering) redoNumbering();
      });

      $elem.on('dragover', function(event){
        event.preventDefault();
      });
      $elem.on('drop', function(event){
        $draggingObject.attr('style', '');
        if(options.infiniteTexts && $draggingObject.parent().hasClass('gapmatch-dropzone')) $draggingObject.remove();
        else if(!options.infiniteTexts) $strings.append($draggingObject);
      });

      function swapNodes(a, b) {
          var aparent = a.parentNode;
          var asibling = a.nextSibling === b ? a : a.nextSibling;
          b.parentNode.insertBefore(a, b);
          aparent.insertBefore(b, asibling);
      }

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
        console.log(event);
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

          if($draggingObject.parent().hasClass('gapmatch-dropzone') && $this[0] !== $dropzone[0]){
            swapNodes($this[0],$draggingObject[0]);
            return;
          }

          if(options.infiniteTexts && !$draggingObject.parent().hasClass('gapmatch-dropzone')){
            $insert = $draggingObject.clone();
          } else {
            $draggingObject.remove();
          }
        }

        $insert.attr('style', options.droppedStyle || '');

        var $beforeElem = getDropSpot($dropzone, event.originalEvent);
        if($beforeElem) $beforeElem.before($insert);
        else $dropzone.append($insert);

        if(options.onChange){
          options.onChange(getResult());
        }
      });
    }
    this.getResult = getResult;

    function setResult(state){
      var result = {};
      $zones = $elem.find('.gapmatch-dropzone');
      $zones.each(function(i){
        var $zone = $(this);
        var strings = state[$zone.data('dropzone')];
        strings.forEach(function(str){
          $zone.append($('<div>', {class: 'gapmatch-string', text: str}));
        });
      });
    }

    this.setResult = setResult;

    this.destroy = function(){
      $elem.off('mousedown mouseup tochend touchstart dblclick dragstart drop dragover');
      $backdrop.off('dragstart');
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
