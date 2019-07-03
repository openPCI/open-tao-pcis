var messageListeners = {};
var data;
var currentRow = 0;
var currentRowData = null;
var file;
var scoreTable = document.getElementById('scoreTable');
var rowInput = document.getElementById('csvRowNum');
var scoreLabelColumns = {};
window.addEventListener('message', function(event){
  var type = event.data.type;
  if(messageListeners[type])
  while(messageListeners[type].length > 0){
    var handler = messageListeners[type][messageListeners[type].length-1];
    handler(event);
    messageListeners[type].pop();
  }
});


document.getElementById('fileUpload').addEventListener('change', function(e){
  file = this.files[0];

  var papa = Papa.parse(file, {
    complete: function(results) {
      scoreLabelColumns = {};
      data = results.data;
      buildDataTable(data);
    }
  });

});

function showTaskOptions(){
  var task = document.getElementById('task').value;
  document.querySelectorAll('.taskoptions').forEach(function(e){
    e.style.display='none';
  });
  document.getElementById(task).style.display = 'block';
  runBtn.innerText = (task.indexOf('Recalc') > -1) ? 'Run rescore' : 'Do Review';
}

document.getElementById('task').addEventListener('change', showTaskOptions);

function rebuildDataTableRow(rowNum){
  var row = document.querySelectorAll('#columns table tr')[rowNum+1];

  if(!row) return;

  var tr = document.createElement('tr');
  for(var i=0; i<data[0].length;i++){
    s = data[rowNum][i] || '';
    var td = document.createElement('td');
    td.innerText = s;
    tr.appendChild(td);
  }
  row.replaceWith(tr);
}

function buildDataTable(){
  var rows = data;
  var table = document.createElement('table');
  var tr = document.createElement('tr');

  for(var i=0; i<rows[0].length;i++){
    var td = document.createElement('td');
    td.innerText = i;
    tr.appendChild(td);
  }

  table.appendChild(tr);
  rows.forEach(function(row){
    var tr2 = document.createElement('tr');

    table.appendChild(tr2);
    var s = '';
    for(var i=0; i<rows[0].length;i++){
      s = row[i] || '';
      var td2 = document.createElement('td');
      td2.innerText = s;
      tr2.appendChild(td2);
    }
  });
  var container = document.getElementById('columns');
  container.innerHTML = '';
  container.appendChild(table);
}

function sendMessage(type, value){
  if(window.parent)
    var iframe = document.querySelector('#playarea iframe');
    iframe.contentWindow.postMessage({
      type: type,
      value: value
    },'*');
}

function onceMessage(type, cb){
  if(!messageListeners[type]) messageListeners[type] = [];
  messageListeners[type].push(cb);
}

function recalculateRoomExercise(row, column, callback){
  onceMessage('rescore', function(event){
    console.log('rescore');
    row[column] = event.data.value;
    setTimeout(callback, 10);
  });
  try {
    sendMessage('rescore', JSON.parse(row[column]));
  } catch(e){
    console.log('JSON PARSE ERROR', e);
    callback();
  }
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function runTask(){
  var task = document.getElementById('task').value;
  var column = document.getElementById('column').value;
  var playarea = document.getElementById('playarea');

  function done(){
    console.log('done', data);
    buildDataTable(data);
  }
  if(task.indexOf('Recalc') > -1){
    window[task](data, column, playarea, done);
  } else {
    rowInput.value = currentRow = 1;
    loadCurrentRow();
  }
}


function taskRecalculateCustomFunction(data, column, playarea, done){
  playarea.innerHTML = '';
  try {
    var scoreFunction = eval('(' + document.getElementById('mapScoringFunc').value + ')');
    data.forEach(function(row){
      try {
        var d = JSON.parse(row[column]);
        row[column] = JSON.stringify({data: d, score:scoreFunction(d)});
      } catch(e) { console.error(e); }
    });
  } catch (e){ console.error(e); }
  done();
}

function taskRecalculateRoomExercise(data, column, playarea, done){
  var exercise = document.getElementById('exerciseFix').value;
  playarea.innerHTML = '<iframe width="800" height="600" src="../theroom/runtime/theroom.html"></iframe>';
  var i = -1;
  onceMessage('ready', function(){
    function next(){
      i++;
      if(i >= data.length) return done();
      if(exercise){
        try {
          var d = JSON.parse(data[i][column]);
          d.exercise = exercise;
          data[i][column] = JSON.stringify(d);
        } catch(e){
          console.log(e, data[i][column]);
          next();
          return;
        }
      }
      recalculateRoomExercise(data[i], column, next);
    }
    next();
  });
}

function taskGenericBrainstorm(data, column, canvas, done){
  var testTaker = document.getElementById('brainstormNickname').value;
  canvas.innerHTML = '';
  data[0][column].split(/[|\n]/g).forEach(function(str){
    var row = str.split(';');
    if(row.length !== 3) return;
    var div = document.createElement('div');
    if(row[1] != testTaker) div.style.opacity = 0.5;
    var name = document.createElement('strong');
    name.className = 'brainstorm-name';
    name.innerText = row[1];
    var msg = document.createElement('span');
    msg.innerText = row[2];
    div.appendChild(name);
    div.appendChild(msg);
    canvas.appendChild(div);
  })
  done();
}

function taskGenericText(data, column, canvas, done){
  canvas.innerHTML = data[0][column];
  done();
}

function taskRecalculateVoxelcraft(data, column, playarea, done){
  var scoringFunction = document.getElementById('voxelScoringFunc').value;
  playarea.innerHTML = '<iframe width="800" height="600" src="../voxelcraft/game/index.html"></iframe>';
  var i = -1;
  onceMessage('ready', function(){
    sendMessage('setScoringFunction',scoringFunction);
    console.log('ready');
    function next(){
      i++;
      if(i >= data.length) return done();
      recalculateVoxelcraft(data[i], column, next);
    }
    next();
  });
}

function recalculateVoxelcraft(row, column, callback){
  try {
    var data = JSON.parse(row[column]);
    onceMessage('rescore', function(event){
      console.log('rescore', event.data.value);
      row[column] = JSON.stringify(event.data.value);
      setTimeout(callback, 10);
    });
    sendMessage('rescore', data);
  } catch(e){
    console.log('JSON PARSE ERROR', e);
    callback();
  }
}


function scoringTable(column){
  var scoreLabels = document.getElementById('scoreLabels').value.split(',').map(function(l){
    return l.trim();
  });

  var table = document.createElement('table');

  var th = document.createElement('tr');
  var td = document.createElement('th');
  td.colSpan = 2;
  td.innerText = "Scoring";
  th.appendChild(td);
  table.appendChild(th);

  var newColumns = false;

  scoreLabels.forEach(function(label, i){
    var columnName = data[0][column] + '-' + label;
    if(!scoreLabelColumns[columnName]){
      var columnIndex = data[0].indexOf(columnName);
      if(columnIndex > -1){
        scoreLabelColumns[columnName] = columnIndex;
      } else {
        scoreLabelColumns[columnName] = data[0].length;
        data[0].push(columnName);
        newColumns = true;
      }
    }
    var insertColumn = scoreLabelColumns[columnName];
    var tr = document.createElement('tr');
    var tdLabel = document.createElement('td');
    tdLabel.innerText = label;
    tr.appendChild(tdLabel);

    var tdInput = document.createElement('td');
    var input = document.createElement('input');
    input.value = currentRowData[insertColumn];
    input.addEventListener('change', function(evt){
      currentRowData[insertColumn] = this.value;
      rebuildDataTableRow(currentRow);
    });
    input.addEventListener('focus', function(){
      this.select();
    });
    input.addEventListener("keyup", function(evt) {
      currentRowData[insertColumn] = this.value;
      rebuildDataTableRow(currentRow);
      if(evt.keyCode != 13) return;
      if(i+1<scoreLabels.length) table.querySelectorAll('input')[i+1].focus();
      else nextInReview(function(){
        scoreTable.querySelectorAll('input')[0].focus();
      });

    });
    input.type = "number";
    tdInput.appendChild(input);
    tr.appendChild(tdInput);

    table.appendChild(tr);
  });

  if(newColumns) buildDataTable();
  return table;
}

function objectToTable(obj, title){
  var table = document.createElement('table');
  if(title){
    var th = document.createElement('tr');
    var td = document.createElement('th');
    td.colSpan = 2;
    td.innerText = title;
    th.appendChild(td);
    table.appendChild(th);
  }
  for(var k in obj){
    var tr = document.createElement('tr');

    var td = document.createElement('td');
    td.innerText = k;

    var valTd = document.createElement('td');
    valTd.innerText = obj[k];

    tr.appendChild(td);
    tr.appendChild(valTd);

    table.appendChild(tr);
  }
  return table;
}

function loadCurrentRow(cb){
  if (typeof cb != "function") cb = function(){scoreTable.querySelectorAll('input')[0].focus();};

  var task = document.getElementById('task').value;
  var column = document.getElementById('column').value;
  var playarea = document.getElementById('playarea');
  currentRowData = data[currentRow];
  window[task]([currentRowData], column, playarea, function(){
    scoreTable.innerHTML = '';
    if(task.indexOf('Recalc') > -1){
      try {
        var dat = JSON.parse(data[currentRow][column]);
        scoreTable.appendChild(objectToTable(dat['score'] ? dat['score'] : dat, 'Score'));
      } catch(e){
        scoreTable.innerText = e.toString();
      }
    } else {
      scoreTable.appendChild(scoringTable(column));

      //Prevent UI from jumping around too much.
      if(parseInt("0"+playarea.style.minHeight,10) < playarea.clientHeight){
        playarea.style.minHeight = playarea.clientHeight + 'px';
      }
    }
    if(cb) cb();
  });

}

function nextInReview(cb){
  currentRow++;
  if(currentRow == data.length){
    currentRow--;
  }
  rowInput.value = currentRow;
  loadCurrentRow(cb);
}

function prevRow(){
  currentRow--;
  if(currentRow == 0) currentRow++;
  rowInput.value = currentRow;
  loadCurrentRow();
}

document.getElementById('nextBtn').addEventListener('click', nextInReview);
document.getElementById('prevBtn').addEventListener('click', prevRow);

document.addEventListener('keydown', function(evt){
  switch(evt.which){
    case 37: prevRow();
    break;
    case 39: nextInReview();
    break;
  }
});

rowInput.addEventListener('keydown', function(e){
   if(e.keyCode == 13) {
     currentRow = rowInput.value;
     loadCurrentRow();
     e.preventDefault();
   }
});

var runBtn = document.getElementById('runBtn');
runBtn.addEventListener('click',runTask);

window.onunload = function(){
  var inputs = document.querySelectorAll('.optform input, .optform select');
  var settings = {};
  inputs.forEach(function(input){
    settings[input.id] = input instanceof HTMLSelectElement ? input.selectedIndex : input.value;
  });
  localStorage.setItem("settings", JSON.stringify(settings));
  localStorage.setItem("rescoreSnapshot", JSON.stringify(data));
  localStorage.setItem("rescoreSnapshotFile", file.name);
  localStorage.setItem("rescoreInReview", currentRow);
};

window.onload = function(){
  var settings = JSON.parse(localStorage.getItem('settings'));
  for(var k in settings){
    var val = settings[k];
    try {
      var input = document.getElementById(k);
      if(input.type == "text") input.value = val;
      if(input instanceof HTMLSelectElement){
        input.selectedIndex = val;
      }
    } catch (e){}
  }
  var snapshot = localStorage.getItem('rescoreSnapshot');
  var snapshotFile = localStorage.getItem("rescoreSnapshotFile");
  var inReview = localStorage.getItem("rescoreInReview");
  if(snapshot && snapshotFile){
    data = JSON.parse(snapshot);
    file = { name : snapshotFile };
    buildDataTable(data);
    if(inReview){
      rowInput.value = currentRow = parseInt(inReview,10);
      loadCurrentRow();
    }
  }

  showTaskOptions();
}

document.getElementById('saveBtn').addEventListener('click', function(){
  var fn  = file.name.replace(/(-rescored)?.csv/,'-rescored.csv')
  download(fn, Papa.unparse(data, {
    quotes: true, //or array of booleans
    quoteChar: '"',
    escapeChar: '"',
    delimiter: ";",
    header: true,
    newline: "\r\n",
    skipEmptyLines: false, //or 'greedy',
  }));
});
