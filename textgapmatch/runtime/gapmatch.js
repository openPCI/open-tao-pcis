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

  $zones.append($backdrop);
  $elem.append($zones);

  if(options.editor){
    var dropzones = options.dropzones || [];
    var start;
    var indx = 0;

    $elem.on('mousedown', function(event){
      start = {x: event.offsetX, y: event.offsetY};
    });

    $elem.on('mouseup', function(event){
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

        dropzones.push([x,y,w,h, "dropzone_"+indx]);
        $zones.append($('<div>', {
          class: 'gapmatch-editor-dropzone',
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
  options.strings.forEach(function(string){
      $strings.push($('<div>', {
        class: 'gapmatch-string',
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
      $draggingObject.remove();
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
        $strings.append($draggingObject);
        $draggingObject = null;
      }
    });
  }
  this.getResult = getResult;

  this.destroy = function(){
    $elem.off('mousedown mouseup tochend touchstart');
    $elem[0].removeEventListener('touchend', onTouchEnd);
    $elem.html('');
  }
};
});
