define(['IMSGlobal/jquery_2_1_1'], function($){
  return function WordGame (options){
    if (!options.element) throw "No element!";
    if (!options.cells) throw "No Cells!";

    var elem = options.element;
    var currentDropId = null;

  // Creates the divs and HTML elements for the game.
    var table = document.createElement('div');
    table.className = 'wordgame-table';

  // Goes on to make rows and event listeners for drag and drop.
    var cellSpan = 0;
    options.cells.forEach(function(c){
      if(c > cellSpan) cellSpan = c;
    });
    var cellWidth = 100 / cellSpan;
    options.cells.forEach(function(cells, i){
      var rowTable = document.createElement('table');
      var row = document.createElement('tr');
      rowTable.appendChild(row);
      rowTable.style.width = cellWidth*cells + '%';

      row.className = 'wordgame-row';
      var cell;
      for(var i = 0; i<cells; i++){
        td = document.createElement('td');


        td.style.width = cellWidth + '%';

        cell = document.createElement('div');
        cell.className = 'wordgame-cell';

        cell.addEventListener('dragover', function(evt) {
          evt.preventDefault();
        });

        cell.addEventListener('drop', function(evt) {
          evt.preventDefault();
          if(this.childNodes.length > 0) return;
          var id = currentDropId;
          this.appendChild(document.getElementById(id));
        });
        td.appendChild(cell);
        row.appendChild(td);
      }

      table.appendChild(rowTable);
    });
    elem.appendChild(table);

	if(options.descriptions.length>0) {
		var cells=options.descriptions.length
		var descTable = document.createElement('table');
		var row = document.createElement('tr');
		descTable.style.width = cellWidth*cells + '%';
		row.className = 'wordgame-descr-row';
		var cell;
		for(var i = 0; i<cells; i++){
			td = document.createElement('td');
			td.style.width = cellWidth + '%';
			cell = document.createElement('div');
			cell.className = 'wordgame-descr-cell';
			cell.innerText=options.descriptions[i]
			td.appendChild(cell);
			row.appendChild(td);
		}
		descTable.appendChild(row);
		table.appendChild(descTable);
	}
	
    var words = document.createElement('div');
    words.className = 'wordgame-texts';
    words.addEventListener('drop', function(evt){
      var id = currentDropId;
      words.appendChild(document.getElementById(id));
    });
    words.addEventListener('dragover', function(evt){
      evt.preventDefault();
    });
    options.texts.forEach(function(str, i){
      var strings = str.split(':');
      var text = document.createElement('div');
      text.className = 'wordgame-text';
      text.innerText = strings[0];
      text.title = typeof(strings[1])!="undefined"?strings[1]:strings[0];
      text.draggable = true;
      text.id = (options.idPrefix||'') + 'wordrank' + i;
      text.addEventListener('dragstart', function(evt) {
        currentDropId =  text.id;
        evt.dataTransfer.setData('text', text.id);
        text.style.opacity = 0.25;
      });
      text.addEventListener('dragend', function(evt){
        text.style.opacity = 1;
      })
      words.appendChild(text);
    });

    elem.appendChild(words);
  // Destroys stuff.
    this.destroy = function(){
      elem.innerHTML = '';
    }

  // Use query select to set a result.
    this.setResult = function(result){
      var texts = {};
      elem.querySelectorAll('.wordgame-text').forEach(function(textDiv){
        texts[textDiv.innerText] = textDiv;
      });
      var rows = elem.querySelectorAll('.wordgame-row');
  // Checks the results.
      result.forEach(function(row, rowNum){
        row.forEach(function(cell, cellNum){
          var text = texts[cell];
          if(text){
            var cell = rows[rowNum].childNodes[cellNum];
            cell.appendChild(text);
          }
        });
      });
    }

  // Calls the result.
    this.getResult = function(){
      var result = [];
      var rows = elem.querySelectorAll('.wordgame-row');
      rows.forEach(function(row){
        var rowResult = [];
        var cells = row.querySelectorAll('.wordgame-cell');
        cells.forEach(function(cell){
          rowResult.push(cell.innerText);
        });
        result.push(rowResult);
      });
      return result;
    }
  }

});
