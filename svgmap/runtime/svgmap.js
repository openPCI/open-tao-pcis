(function(){
function SvgMapFactory($){
return function SvgMap(options){
  var $svg;
  var $el;
  var dotResolution = options.dotResolution || 5;

  var pathTo = null;
  var pathFrom = null;

  var dots = [];
  var result = [];

  var startDot;

  this.destroy = function(){
    $(options.element).html('');
    $(window).off('resize', onWindowResize);
  }

  function getResult(){
    return result;
  }

  this.getResult = getResult;

  function onWindowResize(){
    var viewBox = svg.viewBox.baseVal;
    var viewBoxWidth = viewBox.width;
    var viewBoxHeight = viewBox.height;
    var scale = $svg.width() / viewBoxWidth;
    $(svg).css('height', viewBoxHeight*scale + 'px');
    dots.forEach(function(dot){
      dot.dot.css({
        top: dot.point.y*scale,
        left: dot.point.x*scale
      });
    });
  }

  function findShortestPath(from, to, backtrack){
    var paths = findPaths(from, to, null, backtrack);
    paths.sort(function(a,b){
      return a.length-b.length;
    });

    return paths[0];
  }

  function findPaths(from, to, path, backtrack){
    path = path ? path.slice() : [];
    var paths = [];

    path.push(from);

    if(from == to){
      paths.push(path);
    } else {
      from.connected.forEach(function(node){
        if(!backtrack && (path.indexOf(node) > -1 || node.visited && from.visited)) return;
        if(backtrack && (path.indexOf(node) > -1 || !node.visited && !from.visited)) return;
        Array.prototype.push.apply(paths, findPaths(node, to, path, backtrack));
      });
    }

    return paths;
  }

  function findNearest(list, point, maxDist){
    var matches = [];
    list.forEach(function(dot){
      if(!dot.endpoint) return;
      var p = dot.point;
      var a = p.x - point.x;
      var b = p.y - point.y;
      var dist = Math.sqrt( a*a + b*b );
      if(p !== point && dist < maxDist){
        matches.push(dot);
      }
    });
    return matches;
  }

  function createDot(point,scale){
    var $dot = $('<div>', {class: 'dot'});
    $dot.css('top',point.y*scale + 'px');
    $dot.css('left',point.x*scale + 'px');
    return $dot;
  }

  function drawPathDots(svg, layerId, el){
    $el = $(el);
    $svg = $(svg);
    var viewBox = svg.viewBox.baseVal;
    var viewBoxWidth = viewBox.width;
    var viewBoxHeight = viewBox.height;
    var scale = $svg.width() / viewBoxWidth;
    var $dots = $('<div>', {class:'dots'});

    $(svg).css('height', viewBoxHeight*scale + 'px');

    $el.append($dots);
    var lastDot;
    var firstDot;

    $svg.find('#' + layerId).find('path').each(function(i, path){
      var i = 0;
      var l = path.getTotalLength();

      firstDot = null;
      lastDot = null;

      while(i <= l){
        var point = path.getPointAtLength( i );

        var $dot = createDot(point, scale);
        $dots.append($dot);

        var connected = [];

        var info = {
          point: point,
          dot: $dot,
          connected: connected,
          i: dots.length
        };

        if(options.poi && options.poi[dots.length]){
          info.poi = options.poi[dots.length];
          $dot.addClass('svgmap-poi');
        }

        $dot.data('dotinfo', info);

        $dot.on('click', function(){
          var data = $(this).data('dotinfo');

          if(options.editorCallback){
            options.editorCallback(data);
            return;
          }

          if(pathFrom !== null) pathTo = data.i;
          else pathFrom = data.i;

          if(pathTo == null || pathFrom == null) return;

          var path = findShortestPath(dots[pathFrom],dots[pathTo], data.visited);
          if(data.visited){
            for(var i = 0; i<path.length-1; i++) result.pop();
          } else if(path) {
            path.shift();
            Array.prototype.push.apply(result, path.map(function(o){ return o.i; }));
          }
          dots.forEach(function(dot,i){
            dot.visited = result.indexOf(dot.i) > -1;
            dot.dot[dot.visited ? 'addClass':'removeClass']('svgmap-visited', data.visited);
          });
          if(options.pathCallback) options.pathCallback(result);
          pathFrom = result[result.length-1];
          pathTo = null;

        });

        if(lastDot){
          connected.push(lastDot);
          lastDot.connected.push(info);
        }

        if(i == 0) firstDot = info;
        lastDot = info;

        dots.push(info);

        if(i == l) break;
        i += dotResolution;
        if(i > l) i = l;
      }

      firstDot.endpoint = true;
      lastDot.endpoint = true;
    });


    dots.forEach(function(dot){
      if(dot.endpoint){
        dot.junction = true;
        dot.dot.addClass('svgmap-junction');
        var matches = findNearest(dots, dot.point, dotResolution/2);
        if(matches.length){
          matches.forEach(function(match){
            match.connected.forEach(function(connected){
              if(dot.connected.indexOf(connected) == -1){
                connected.connected.push(dot);
                dot.connected.push(connected);
                if(match.junction) match.dot.hide();
              }
            });
            match.connected = [];
          });
        }
      }
    });

    return $dots;
  }

  if(options.svg){
    var parser = new DOMParser();
    var svg;

    var data = $.parseXML(options.svg);
    if(data.childNodes.length == 0) return;
    svg = data.childNodes[1];

    $(svg).css('width','100%');
    $(svg).attr('width',null);
    $(svg).attr('height',null);

    $('.svgmap').append(svg);
    var $dots = drawPathDots(svg, options.pathLayer || 'layer1', options.element);

    //Set start dot
    if(options.poi){
      if(options.poi.start){
        pathFrom = options.poi.start;
        result.push(pathFrom);
        startDot = pathFrom;
        dots[pathFrom].dot.addClass('svgmap-visited');
      }

      Object.keys(options.poi).forEach(function(k){
        if(k == 'start') return;
        var id = parseInt(options.poi[k]);
        dots[id].poi = k;
        dots[id].dot.addClass('svgmap-poi');
      });
      // Style POIs
    }
    $(window).on('resize', onWindowResize);
  }

}
}

if(typeof define == "function"){
  define(['IMSGlobal/jquery_2_1_1'], function($){
    return SvgMapFactory($);
  });
} else {
  window.SvgMap = SvgMapFactory($);
}
})()
