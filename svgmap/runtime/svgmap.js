define(['IMSGlobal/jquery_2_1_1'], function($){
  return function SvgMap(options){
    var dotResolution = options.dotResolution || 5;

    var pathTo = null;
    var pathFrom = null;

    var dots = [];

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

    function createDot(point){
      var $dot = $('<div>', {class: 'dot'});
      $dot.css('top',point.y + 'px');
      $dot.css('left',point.x + 'px');
      return $dot;
    }

    function drawPathDots(svg, layerId, el){
      var $el = $(el);
      var $svg = $(svg);
      var viewBox = $svg.attr('viewBox').split(' ').map(function(e){return parseInt(e);});
      var viewBoxWidth = viewBox[2];
      var viewBoxHeight = viewBox[3];
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
          point.x *= scale;
          //point.y -= viewBoxHeight / 2;
          point.y *= scale;
          point.y -= 7;

          var $dot = createDot(point);
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
              dot.dot.css('background', 'green');
              dot.visited = true;
            });
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
        $dot.css('top', ny+ 'px');
        $dot.css('left', nx + 'px');
        $dot.addClass('svgmap-junction');
      });

      return $dots;
    }

    if(options.svg){
      var parser = new DOMParser();
      var svg;
      try {
        svg = parser.parseFromString(options.svg, "image/svg+xml");
        if(svg.childNodes.length == 0) return;
        svg = data.childNodes[1];
      } catch(e){
        return;
      }

      $(svg).css('width','100%');
      $(svg).attr('width',null);
      $(svg).attr('height',null);
      $('.svgmap').append(svg);
      var $dots = drawPathDots(svg, options.pathLayer || 'layer1', options.element);
    }

    this.destroy = function(){
      $(options.element).html('');
    }
  });
});
