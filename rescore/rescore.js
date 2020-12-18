var acceptVals=[0,1,9]
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
	  localStorage.clear();
	  rowInput.value = currentRow = 0;
	  loadCurrentRow();
	  
    }
  });

});

function showTaskOptions(){
		var task = document.getElementById('task').value;
		document.querySelectorAll('.taskoptions').forEach(function(e){
			e.style.display='none';
		});
	if(document.getElementById(task)) {
		document.getElementById(task).style.display = 'block';
	}
	runBtn.innerText = (task.indexOf('Recalc') > -1) ? 'Run rescore' : 'Do Review';
	document.getElementById("rescoreThis").style.display = (task.indexOf('Recalc') > -1 ? 'block':'none');
}

document.getElementById('task').addEventListener('change', showTaskOptions);
document.getElementById("rescoreThis").addEventListener('click', rescorethis);

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
	// Remove the listener created in onceMessage
	messageListeners['rescore'].pop()

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
    rowInput.value = currentRow = 0;
    loadCurrentRow();
  }
}

function rescorethis(){
  var task = document.getElementById('task').value;
  var column = document.getElementById('column').value;
	function updateRow() {
		var rowNum = Number(document.getElementById('csvRowNum').value);
		rebuildDataTableRow(rowNum)
		loadCurrentRow()
	}

  var fct=task.replace(/^task/,"")
  fct=fct.charAt(0).toLowerCase() + fct.slice(1);
  var rowInput = Number(document.getElementById('csvRowNum').value);
  
  switch(fct) {
	  case "recalculateVoxelcraft":
		var scoringFunction = document.getElementById('voxelScoringFunc').value;
		sendMessage('setScoringFunction',scoringFunction);
		break;
  }
  
	window[fct](data[rowInput], column, updateRow)
}

function taskRecalculateCustomFunction(thisdata, column, playarea, done){
  playarea.innerHTML = '';
  try {
    var scoreFunction = eval('(' + document.getElementById('mapScoringFunc').value + ')');
    thisdata.forEach(function(row){
      try {
        var d = JSON.parse(row[column]);
        row[column] = JSON.stringify({data: d, score:scoreFunction(d)});
      } catch(e) { console.error(e); }
    });
  } catch (e){ console.error(e); }
  done();
}

function taskReviewRoomExercise(thisdata, column, playarea, done){
  var exercise = document.getElementById('exerciseFix').value;
  playarea.innerHTML = '<iframe width="800" height="600" src="../theroom/runtime/theroom.html"></iframe>';
  onceMessage('ready', function(){
	  try {
		var d=JSON.parse( thisdata[0][column])
		if(typeof (d.exercise)=="undefined")
			d.exercise = exercise;
		sendMessage('loadExercise',d);
	  } catch(e){
          console.log(e, thisdata[0][column]);
          return;
	  }
  });	
	done();
}
function taskRecalcReviewRoomExercise(thisdata, column, playarea, done){taskReviewRoomExercise(thisdata, column, playarea, done)}


function taskRecalculateRoomExercise(thisdata, column, playarea, done){
  var exercise = document.getElementById('exerciseFix').value;
  playarea.innerHTML = '<iframe width="800" height="600" src="../theroom/runtime/theroom.html"></iframe>';
  var i = -1;
  onceMessage('ready', function(){
    function next(){
		i++;
		if(i >= thisdata.length) {
			if(i>0) { //return
				rowInput.value = currentRow = 0;
				loadCurrentRow();
			}
			return done();
		}
		try {
			var d = JSON.parse(thisdata[i][column]);
			if(typeof (d.exercise)=="undefined") {
				d.exercise = exercise;
				thisdata[i][column] = JSON.stringify(d);
			}
		} catch(e){
			console.log(e, thisdata[i][column]);
			next();
			return;
		}
		recalculateRoomExercise(thisdata[i], column, next);
    }
    next();
  });
}

function taskGenericBrainstorm(thisdata, column, canvas, done){
  var testTaker = document.getElementById('brainstormNickname').value;
  canvas.innerHTML = '';
  thisdata[0][column].split(/[|\n]/g).forEach(function(str){
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

function taskGenericText(thisdata, column, canvas, done){
  canvas.innerHTML = thisdata[0][column];
  done();
}
function taskReviewVoxelcraft(thisdata, column, playarea, done){
	playarea.innerHTML = '<iframe width="800" height="600" src="../voxelcraft/game/index.html"></iframe>';
  onceMessage('ready', function(){
	  var scene=JSON.parse( thisdata[0][column]).data
	  sendMessage('setScene',scene);
  });
	
	done();
}
function taskRecalcReviewVoxelcraft(thisdata, column, playarea, done){taskReviewVoxelcraft(thisdata, column, playarea, done)}
function taskRecalculateVoxelcraft(thisdata, column, playarea, done){
  var scoringFunction = document.getElementById('voxelScoringFunc').value;
  playarea.innerHTML = '<iframe width="800" height="600" src="../voxelcraft/game/index.html"></iframe>';
  var rowno = -1;
  onceMessage('ready', function(){
    sendMessage('setScoringFunction',scoringFunction);
    console.log('ready');
    function next(){
      rowno++;
// 	  console.log("rowno "+rowno)
      if(rowno >= thisdata.length) {
		if(rowno>0) {
			rowInput.value = currentRow = 0;
			loadCurrentRow();
		}
		return done();
	  }
      recalculateVoxelcraft(thisdata[rowno], column, next);
    }
    next();
  });
}

function recalculateVoxelcraft(row, column, callback){
// 	
	if(row[column] && row[column].length>0) {
		onceMessage('rescore', function(event){
			console.log('rescore', event.data.value);
 			row[column] = JSON.stringify(event.data.value);
			setTimeout(callback, 10);
		});
		try {
			var thisdata = JSON.parse(row[column]);
			sendMessage('rescore', thisdata);
		} catch(e){
			console.log('JSON PARSE ERROR', e);
			// Remove the listener created in onceMessage
			messageListeners['rescore'].pop()
			callback();
		}
	} else callback();
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
	if(currentRowData[insertColumn]) 
		console.log(currentRowData[insertColumn])
    input.value = (typeof(currentRowData[insertColumn])!="undefined"?currentRowData[insertColumn]:-1);
    input.addEventListener('change', function(evt){
		if(!checkinsert(insertColumn,this)) this.value="-1"
    });
    input.addEventListener('focus', function(){
      this.select();
    });
    input.addEventListener("keyup", function(evt) {
		if(!checkinsert(insertColumn,this)) this.value="-1"
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
  var tr = document.createElement('tr');
  var tdall0 = document.createElement('td');
  var td1 = document.createElement('td');
  var all0 = document.createElement('input');
  all0.type = "button";
  all0.value= "Code all 0";
  tdall0.appendChild(all0);
  tr.appendChild(td1);
  tr.appendChild(tdall0);
  table.appendChild(tr)
  all0.addEventListener('click', codeAll0);

  return table;
}
function checkinsert(insertColumn,elem) {
	val=elem.value
	isNum= /^[0-9]$/.test(val);
	if(isNum && acceptVals.indexOf(Number(val))>-1) {
		currentRowData[insertColumn] = val;
		rebuildDataTableRow(currentRow);
		return true;
	} else return false; // give warning...?
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
	var notFunction=typeof cb != "function"
  if (notFunction && scoreTable.querySelectorAll('input').length>0) cb = function(){scoreTable.querySelectorAll('input')[0].focus();};

  var task = document.getElementById('task').value;
  var column = document.getElementById('column').value;
  var extracolumns = document.getElementById('extracolumns').value;
  var playarea = document.getElementById('playarea');
  var extrainfoarea = document.getElementById('extrainfo');
  //If you want info from other columns, show it now...
  currentRowData = data[currentRow];
  extrainfoarea.innerHTML=''
  if(extracolumns.length>0) {
	 extracolumns=extracolumns.split(",")
	 var extradata=[]
	 for(var i in extracolumns) {
		var extracolumn=Number(extracolumns[i])
	 	 extradata[extradata.length]=currentRowData[extracolumn]
	 }
	 extrainfoarea.innerHTML=extradata.join("<br>")
  }
  if(notFunction) {
	switch(task) {
		case "taskRecalculateVoxelcraft":
			task="taskRecalcReviewVoxelcraft"
			break
		case "taskRecalculateRoomExercise":
			task="taskRecalcReviewRoomExercise"
			break
	}
  }
  window[task]([currentRowData], column, playarea, function(){
    scoreTable.innerHTML = '';
    if(task.indexOf('Recalc') > -1){
      try {
		if(data[currentRow][column].length>0) {
			var dat = JSON.parse(data[currentRow][column]);
			scoreTable.appendChild(objectToTable(dat['score'] ? dat['score'] : '', 'Score'));
		} else scoreTable.innerHTML = "<h3>Empty response</h3>"
      } catch(e){
        scoreTable.innerText = "No score: "+e.toString();
      }
    } else {
      scoreTable.appendChild(scoringTable(column));

      //Prevent UI from jumping around too much.
      if(parseInt("0"+playarea.style.minHeight,10) < playarea.clientHeight){
        playarea.style.minHeight = playarea.clientHeight + 'px';
      }
    }
    if(typeof cb == "function") cb();
  });

}

function nextInReview(cb){
	var okay=true
	var input=document.getElementById("scoreTable").getElementsByTagName('input')
	for(var i=0;i<input.length;i++) {
		if(input[i].type=="number" && (input[i].value=="" || acceptVals.indexOf(Number(input[i].value))==-1)) okay=false
	}
	if(okay) {
		currentRow++;
		if(currentRow == data.length){
			currentRow--;
		}
		rowInput.value = currentRow;
		loadCurrentRow(cb);
	} else alert("Please code all items");
}

function prevRow(){
  currentRow--;
  if(currentRow == 0) currentRow++;
  rowInput.value = currentRow;
  loadCurrentRow();
}
function codeAll0() {
	var input=document.getElementById("scoreTable").getElementsByTagName('input')
	var insertColumn=Number(document.getElementById('column').value)+1;
	console.log(insertColumn)
	for(var i=0;i<input.length;i++) {
		if(input[i].type=="number") {
			input[i].value="0"
			currentRowData[insertColumn] = "0";
			insertColumn++
		}
	}
	rebuildDataTableRow(currentRow);
}

document.getElementById('nextBtn').addEventListener('click', nextInReview);
document.getElementById('prevBtn').addEventListener('click', prevRow);

document.addEventListener('keydown', function(evt){
	if(["INPUT","SELECT","TEXTAREA"].indexOf(evt.target.tagName)==-1)
	{
		switch(evt.which){
			case 37: prevRow();
			break;
			case 39: nextInReview();
			break;
		}
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
  
  var coll = document.getElementsByClassName("collapsible");
	var i;
	for (i = 0; i < coll.length; i++) {
	coll[i].children[0].addEventListener("click", function() {
		this.classList.toggle("active");
		var content = this.nextElementSibling;
		if (content.style.display != "none") {
		content.style.display = "none";
		} else {
		content.style.display = "block";
		}
	});
	} 
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
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
