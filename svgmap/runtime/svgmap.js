define(['IMSGlobal/jquery_2_1_1'], function($){
  return function SvgMap(options){
    var $svg;
    var $el;
    var dotResolution = options.dotResolution || 5;

    var pathTo = null;
    var pathFrom = null;

    var dots = [];
    var result = [];

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

    function findShortestPath(from, to){
      var paths = findPaths(from, to);
      paths.sort(function(a,b){
        return a.length-b.length;
      });

      return paths[0];
    }

    function findPaths(from, to, path){
      path = path ? path.slice() : [];
      var paths = [];

      path.push(from);

      if(from == to){
        paths.push(path);
      } else {
        from.connected.forEach(function(node){
          if(path.indexOf(node) > -1 || node.visited && from.visited) return;
          Array.prototype.push.apply(paths, findPaths(node, to, path));
        });
      }

      return paths;
    }

    function findNearest(list, point, maxDist){
      var distance = 99999;
      var match = null;
      list.forEach(function(dot){
        if(!dot.endpoint) return;
        var p = dot.point;
        var a = p.x - point.x;
        var b = p.y - point.y;
        var dist = Math.sqrt( a*a + b*b );
        if(dist < distance && p !== point && dist < maxDist){
          match = dot;
          distance = dist;
        }
      });
      return match;
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

      $svg.find('#' + layerId).children().each(function(i, path){
        var i = 0;
        var l = path.getTotalLength();

        firstDot = null;
        lastDot = null;

        while(i < l){
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

            var path = findShortestPath(dots[pathFrom],dots[pathTo]);
            path.forEach(function(dot){
              dot.dot.addClass('svgmap-visited');
              dot.visited = true;
              result.push(dot.i);
            });
            if(options.pathCallback) options.pathCallback(result);
            pathFrom = pathTo;
            pathTo = null;

          });

          if(lastDot){
            connected.push(lastDot);
            lastDot.connected.push(info);
          }

          if(i == 0) firstDot = info;
          lastDot = info;

          dots.push(info);

          i += dotResolution;
        }

        firstDot.endpoint = true;
        lastDot.endpoint = true;

        if(firstDot && lastDot){
          [firstDot, lastDot].forEach(function(dot){
            var match = findNearest(dots, dot.point, dotResolution*scale);
            if(match && dot.connected.indexOf(match) == -1){
              match.connected.push(dot);
              dot.connected.push(match);
            }
          });
        }

      });

      // All paths should be connected now, clean up merging points...
      dots.forEach(function(info){
        if(info.merged) return;
        if(!info.endpoint) return;

        var endpoints = [info];
        var connections = [];
        var nx = info.point.x;
        var ny = info.point.y;

        info.connected.forEach(function(connection){
          if(connection.endpoint){
            endpoints.push(connection);
            nx += connection.point.x;
            ny += connection.point.y;
          }
        });

        endpoints.forEach(function(endpoint,i){
          endpoint.connected.forEach(function(connection){
            if(!connection.endpoint) connections.push(connection);
          });
          if(i>0)endpoint.dot.remove();
          endpoint.merged = true;
        });

        info.connected = connections;

        nx = nx / endpoints.length;
        ny = ny / endpoints.length;

        var $dot = info.dot;
        $dot.css('top', ny*scale+ 'px');
        $dot.css('left', nx*scale + 'px');
        $dot.addClass('svgmap-junction');
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
      console.log(svg);
      $('.svgmap').append(svg);
      var $dots = drawPathDots(svg, options.pathLayer || 'layer1', options.element);

      //Set start dot
      console.log(options.poi);
      if(options.poi && options.poi.start){
        pathFrom = options.poi.start;
        dots[pathFrom].dot.addClass('svgmap-visited');
      }


      $(window).on('resize', onWindowResize);
    }


  }
});
