if(typeof define === "undefined"){
  window.define = function(n,f){ window.GanttJS = f($); }
}
define(['IMSGlobal/jquery_2_1_1'], function($){

  // https://github.com/uxitten/polyfill/blob/master/string.polyfill.js
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart
  if (!String.prototype.padStart) {
      String.prototype.padStart = function padStart(targetLength, padString) {
          targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
          padString = String(typeof padString !== 'undefined' ? padString : ' ');
          if (this.length >= targetLength) {
              return String(this);
          } else {
              targetLength = targetLength - this.length;
              if (targetLength > padString.length) {
                  padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
              }
              return padString.slice(0, targetLength) + String(this);
          }
      };
  }


  function GanttJS(container, options){
    var $container = $(container);

    $container.addClass('ganttjs-container');

    var $table = $('<table>', {class:'ganttjs-table'});

    var months = ['Januar', 'Februar', 'Marts', 'April','Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];
    var weekDayShort = ['Sø','Ma','Ti','On','To','Fr','Lø'];
    var optStartDate = options.startDate || new Date('09/01/2018');


    var hourIncrement = 24;
    var dayLength = 24;

    if(!options.dayStart) options.dayStart = 0;
    if(!options.dayEnd) options.dayEnd = 23;

    if(options.useHours || options.useHalfHours){
      hourIncrement = options.useHalfHours ? 0.5 : 1;
      options.useHours = true;
      if(options.dayStart && options.dayEnd){
        dayLength = options.dayEnd - options.dayStart;
      }
      if(options.hourIncrement){
        hourIncrement = options.hourIncrement;
      }
    }

    var dateIncrement = hourIncrement * 3600000;

    function resultDate(d){
      return d.getDate() + '/' + d.getMonth() + (options.useHours ? ' ' + time(d) : '');
    }

    function day(d){
      return d.getDate();
    }

    function weekDay(d){
      return weekDayShort[d.getDay()];
    }

    function time(d){
      return (d.getHours()+'').padStart(2,'0') + ':' + (d.getMinutes()+'').padStart(2,'0')
    }
    function appendTimeSlots($tr){
      var ret = [];

      var mc = 0;
      var dc = 0;
      var tdc = 0;
      var c = -1;

      var dateStart = new Date(optStartDate);
      dateStart.setHours(options.dayStart);
      dateStart.setMinutes(0);

      var ld = new Date(dateStart);
      var d = new Date(dateStart);
      var i = 0;

      while(tdc < options.period){

        if(d.getHours() > options.dayEnd){
          d.setHours(options.dayStart);
          d.setDate(d.getDate()+1);
        }

        $td = $('<td>', {class:'timeslot'});
        $td.prop('gantt-date', d);
        $tr.append($td);

        if(options.disableWeekends && [6,0].indexOf(d.getDay()) > -1){
          $td.addClass('disabled');
        }

        c++; dc++;

        if(d.getDate() != ld.getDate()){
          c = 0;
          tdc++;
        }

        if(d.getMonth() != ld.getMonth()){
          dc=0;
        }

        if(options.useHours && options.disableWeekends && [6,0].indexOf(d.getDay()) > -1){
          ld = new Date(d);
          d.setHours(options.dayEnd+1);
        }

        ld = d;
        d = new Date(ld.getTime() + dateIncrement);
        i++;
      }

      $tr.children().last().remove();

    }

    function tableHeader(){
      var $tr;
      var ret = [];

      var $monthTr = $('<tr>', {class:'ganttjs-th-month'});
      var $dateTr =  $('<tr>', {class: 'ganttjs-th-day'});
      $dateTr.append($('<th>'));
      var $weekdayTr = $('<tr>', {class:'ganttjs-th-weekday'});
      $weekdayTr.append($('<th>'));
      var $timeTr  = $('<tr>', {class:'ganttjs-th-time'});
      $timeTr.append($('<th>'));

      var $th;
      var mc = 0;
      var dc = 0;
      var tdc = 0;
      var c = -1;
      var first = true;

      var dateStart = new Date(optStartDate);
      dateStart.setHours(options.dayStart);
      dateStart.setMinutes(0);

      var ld = new Date(dateStart);
      var d = new Date(dateStart);
      var i = 0;

      while(tdc < options.period){

        if(d.getHours() > options.dayEnd){
          d.setHours(options.dayStart);
          d.setDate(d.getDate()+1);
        }

        if(options.useHours){
          console.log(tdc, options.period)
          $th = $('<th>', {text: time(d)});
          $timeTr.append($th);
          if(options.disableWeekends && [6,0].indexOf(d.getDay()) > -1){
            $th.text('-');
          }
        }

        c++; dc++;

        if(d.getDate() != ld.getDate()){
          $th = $('<th>', {text: (options.weekNumHack ? 'Uge ' : '') + ld.getDate()});
          $th.attr('colspan', c);
          $dateTr.append($th);

          $th = $('<th>', {text: weekDay(ld)});

          if(options.disableWeekends && [6,0].indexOf(ld.getDay()) > -1){
            $th.addClass('disabled');
          }

          $th.attr('colspan', c);
          $weekdayTr.append($th);
          c = 0;
          tdc++;
        }

        if(d.getMonth() != ld.getMonth()){
          $th = $('<th>', {text: months[ld.getMonth()]});
          $th.attr('colspan', dc);
          $monthTr.append($th);
          dc=0;
        }

        if(options.useHours && options.disableWeekends && [6,0].indexOf(d.getDay()) > -1){
          ld = new Date(d);
          d.setHours(options.dayEnd+1);
        }

        ld = d;
        d = new Date(ld.getTime() + dateIncrement);
        i++;
      }

      if(dc > 0){
        $th = $('<th>', {text: months[ld.getMonth()]});
        $th.attr('colspan', dc);
        $monthTr.append($th);
      }
      $timeTr.children().last().remove();

      var ret = [];

      if(options.months) ret.push($monthTr);
      ret.push($dateTr);
      if(options.weekDays) ret.push($weekdayTr);
      if(options.useHours) ret.push($timeTr);

      return ret;
    }

    $table.append(tableHeader());


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
        var last = 0;
        var lastDate;
        var selStartDate;
        $($container.find('.ganttjs-task').get(ti)).children().each(function(i, item){
          if(selStart){
            if(!$(this).is('.selected')){
              taskData.push(''+(selStart+1 == i ? resultDate(selStartDate) : resultDate(selStartDate) + ' - ' + resultDate(lastDate)));
              selStart = false;
              selStartDate = false;
            }
          } else {
            if($(this).is('.selected')){
              selStart = i;
              selStartDate = $(this).prop('gantt-date');
            }
          }
          lastDate = $(this).prop('gantt-date')
          last = i;
        });

        if(selStart==last) taskData.push(resultDate(selStartDate));
        else if(selStart) taskData.push(resultDate(selStartDate) + ' - ' + resultDate(lastDate));

        res.push(taskData);
      });
      return res;
    };

  }
  return GanttJS;
});
