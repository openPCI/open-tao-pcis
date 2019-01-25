define(['IMSGlobal/jquery_2_1_1'], function($){
return function GapMatch(elem, options){
  var $draggingObject;
  var $elem = $(elem);
  var mousePos = {x:0,y:0};
  var clientPos = {x:0,y:0};

  $elem.addClass('gapmatch-wrapper');
  var offset = $elem.offset();
  var dragInterval;

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
        attr: { 'data-stringid': i },
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

  function onDrag(){
    if($draggingObject){
      $draggingObject.css({
        top: mousePos.y+10 + 'px',
        left: mousePos.x+10 + 'px',
        position: 'absolute'
      });
      if(clientPos.y < window.innerHeight * 0.20 && $('body,html').scrollTop() > 10){
        $('body,html').scrollTop($('body,html').scrollTop() - 10);
        mousePos.y -= 10;
      }
      if(clientPos.y > window.innerHeight * 0.80 && mousePos.y < $(document).height() - $(window).height()){
        $('body,html').scrollTop($('body,html').scrollTop() + 10);
        mousePos.y += 10;
      }
    }
  }


  if(!options.editor){
    $elem.on('mousedown touchstart', '.gapmatch-string', function(event){
      $draggingObject = $(this);
      console.log($draggingObject.parent().hasClass('gapmatch-dropzone'));
      if(options.infiniteTexts && !$draggingObject.parent().hasClass('gapmatch-dropzone')){
        $draggingObject = $draggingObject.clone();
      } else {
        $draggingObject.remove();
      }
      $elem.append($draggingObject);
      var ev = event.originalEvent.touches ? event.originalEvent.touches[0] : event;
      mousePos.x = ev.pageX - offset.left;
      mousePos.y = ev.pageY - offset.top;

      clientPos.x = ev.clientX;
      clientPos.y = ev.clientY;

      dragInterval = setInterval(onDrag, 1000/30);

    });

    $elem.on('mousemove touchmove', function(event){
      var ev = event.originalEvent.touches ? event.originalEvent.touches[0] : event;

      mousePos.x = ev.pageX - offset.left;
      mousePos.y = ev.pageY - offset.top;
      clientPos.x = ev.clientX;
      clientPos.y = ev.clientY;
      if($draggingObject){
        event.preventDefault();
      }
    });

    function onTouchEnd(e){
      var t = e.changedTouches[0];
      var elems = document.elementsFromPoint(t.clientX, t.clientY);
      var triggered = false;
      elems.forEach(function(elem){
          if($(elem).hasClass('gapmatch-dropzone')){
            $(elem).trigger('touchend');
            triggered = true;
          }
      });
      if(!triggered) $elem.trigger('mouseup');
    }

    $elem[0].addEventListener('touchend', onTouchEnd);

    $elem.on('mouseup touchend', '.gapmatch-dropzone', function(event){
      if(!$draggingObject) return;
      clearInterval(dragInterval);
      $draggingObject.remove();
      $draggingObject.css({
        position:'relative',
        top: '0px',
        left: '0px'
      });

      if(options.maxDropped && $(this).children().length >= options.maxDropped){
        $draggingObject = null;
        return;
      }
      if($(this).find('[data-stringid="' + $draggingObject.data('stringid') + '"]').length > 0){
        $draggingObject = null;
        return;
      }

      $(this).append($draggingObject);
      $draggingObject = null;

      if(options.onChange){
        options.onChange(getResult());
      }
    });

    $elem.on('mouseup', function(){
      if($draggingObject){
        $draggingObject.remove();
        $draggingObject.css({
          position:'relative',
          top: '0px',
          left: '0px'
        });
        if(!options.infiniteTexts){
          $strings.append($draggingObject);
        }
        $draggingObject = null;
      }
    });
  }
  this.getResult = getResult;

  this.destroy = function(){
    $elem.off('mousedown mouseup tochend touchstart dblclick');
    $backdrop.off('dragstart');
    $elem[0].removeEventListener('touchend', onTouchEnd);
    $elem.html('');
  }
};
});
