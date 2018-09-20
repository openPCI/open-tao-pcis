define(['IMSGlobal/jquery_2_1_1'], function($){
  function GanttJS(container, options){
    var $container = $(container);

    $container.addClass('ganttjs-container');

    var $table = $('<table>', {class:'ganttjs-table'});

    var months = ['Januar', 'Februar', 'Marts', 'April','Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];
    var weekDayShort = ['Sø','Ma','Ti','On','To','Fr','Lø'];

    function resultDate(i){
      if(!options.startDate) return i+1;

      var d = new Date(options.startDate);
      d.setDate(d.getDate() + i);


      return day(i-1) + '.' + months[d.getMonth()].substring(0,3);
    }

    function day(i){
      if(!options.startDate) return i+1;
      var d = new Date(options.startDate);
      d.setDate(d.getDate() + i);
      return d.getDate();
    }

    var gi = 1;
    function weekDay(i){
      if(!options.startDate){
        i++;
        while(i>6) i -= 7;
        return weekDayShort[i];
      }
      var d = new Date(options.startDate);
      d.setDate(d.getDate() + i);
      return weekDayShort[d.getDay()];
    }

    function tableHeader(){
      var $tr;
      var ret = [];
      if(options.months && options.startDate){
        var $tr = $('<tr>', {class:'ganttjs-th-month'});
        var month = options.startDate.getMonth();
        var $th = $('<th>', {text: months[month]});
        c = 0;
        for(var i=0; i < options.period; i++){
          c++;
          var d = new Date(options.startDate);
          d.setDate(d.getDate() + i);
          if(d.getMonth() != month){
            $th.attr('colspan', c);
            $tr.append($th);
            c=0;
            month = d.getMonth();
            $th = $('<th>', {text: months[month]});
          }
        }
        $th.attr('colspan', c+1);
        $tr.append($th);
        ret.push($tr);
      }

      $tr = $('<tr>', {class: 'ganttjs-th-day'});
      $tr.append($('<th>'));

      for(var i=0; i < options.period; i++){
        $tr.append($('<th>', {text: day(i)}));
      }

      ret.push($tr);

      if(options.weekDays){
        $tr = $('<tr>', {class:'ganttjs-th-weekday'});
        $tr.append($('<th>'));

        for(var i=0; i < options.period; i++){
          var $th;
          $tr.append($th = $('<th>', {text: weekDay(i)}));
          if(options.disableWeekends && ['Lø','Sø'].indexOf(weekDay(i)) > -1){
            $th.addClass('disabled');
          }
        }
        ret.push($tr);
      }


      return ret;
    }

    $table.append(tableHeader());

    function appendTimeSlots($row){
      for(var i=0; i<options.period;i++){
        var cls = ['timeslot'];
        if(options.disableWeekends && ['Lø','Sø'].indexOf(weekDay(i)) > -1){
          cls.push('disabled')
        }
        $row.append($('<td>', {class: cls.join(' ')}));
      }
    }

    function addTask(t){
      var $row = $('<tr>', {class:'ganttjs-task'});
      var $task = $('<td>', {text: t[0], class: 'ganttjs-tasklbl'});
      $row.prop('active-color', t[1]);
      $row.append($task);
      appendTimeSlots($row);
      $table.append($row);
    }

    options.tasks.forEach(function(task){
      addTask(task);
    });


    $container.append($table);

    var paintMode = false;
    var $paintRow = null;
    var paintStart = 0;
    var paintActive = true;

    $table.on('click', '.timeslot', function(e){
      if($(this).is('.disabled')) return;
      $(this).toggleClass('selected');
      $(this).css('background-color', $(this).is('.selected') ? $(this.parentNode).prop('active-color') : '');
    });

    $table.on('mousedown', '.timeslot', function(e){
      var $this = $(this);
      paintMode = true;
      $paintRow = $(this.parentNode);
      paintActive = !$this.hasClass('selected');
      paintStart = $this.index();
      e.preventDefault();
      return false;
    });

    $table.on('mouseup', function(e){
      e.preventDefault();
      if(paintMode){
        $paintRow.find('.paint-selected').removeClass('paint-selected').addClass('selected');
        $paintRow.find('.paint-deselected').removeClass('paint-deselected').removeClass('selected');
        $paintRow.find('.selected').css('background-color', $paintRow.prop('active-color'));
        paintMode = false;
        $paintRow = null;
      }
      return false;
    });

    $table.on('mouseover', '.timeslot', function(e){
      if(!paintMode) return;
      var paintTo = $(this).index();
      $container.find('td').removeClass('paint-selected');
      $container.find('td').removeClass('paint-deselected');
      var from = Math.min(paintStart, paintTo);
      var to = Math.max(paintStart, paintTo);
      for(var i=from; i<=to; i++){
        if(!$($paintRow.children().get(i)).hasClass('disabled'))
        $($paintRow.children().get(i)).addClass(paintActive ? 'paint-selected' : 'paint-deselected');
      }

      $paintRow.find('td').css('background-color', '');
      $paintRow.find('.paint-selected, .selected').not('.paint-deselected').css('background-color', $paintRow.prop('active-color'));

      e.preventDefault();
      return false;
    });

    var mx, w;
    $table.on('mousemove', function(e){
      if(paintMode){
       w = $container.width()-5;
       mx = e.pageX - $container.offset().left;
      }
    });

    var dragScrollInterval = setInterval(function(){
      if(paintMode && mx > w || mx < 5){
        $container.scrollLeft($container.scrollLeft()+((mx>w?1:-1)*5));
      }
    }, 100);

    this.destroy = function(){
      $container.children().remove();
      $container.removeClass('ganttjs-container');
      clearInterval(dragScrollInterval);
    };

    this.getData = function(){
      var res = [];
      options.tasks.forEach(function(t, ti){
        var taskData = [];

        $($container.find('.ganttjs-task').get(ti)).children().each(function(i, item){
          if($(this).is('.selected')) taskData.push(i);
        });
        res.push(taskData);
      });
      return res;
    }


    this.getResult = function(){
      var res = [];
      options.tasks.forEach(function(t, ti){
        var taskData = [];

        var selStart = 0;
        var input = '';
        var last = 0;
        $($container.find('.ganttjs-task').get(ti)).children().each(function(i, item){
          if(selStart){
            if(!$(this).is('.selected')){
              taskData.push(''+(selStart+1 == i ? resultDate(selStart) : resultDate(selStart) + '-' + resultDate(i-1)));
              selStart = 0;
            }
          } else {
            if($(this).is('.selected')){
              selStart = i;
            }
          }
          last = i;
        });

        if(selStart==last) taskData.push(resultDate(selStart));
        else if(selStart) taskData.push(resultDate(selStart) + '-' + resultDate(last));

        res.push(taskData);
      });
      return res;
    };

  }
  return GanttJS;
});
