define(['IMSGlobal/jquery_2_1_1'], function($){
  return function WordGame (options){
    if (!options.element) throw "No element!";
    if (!options.cells) throw "No Cells!";

    var elem = options.element;
	var outertable=document.createElement('table')
	outertable.style.width = "100%"
	var outertr=document.createElement('tr')
	var divtd=document.createElement('td');
	divtd.style.width = (100-5*Math.floor(options.descriptions.length/2))+'%';
	outertr.appendChild(divtd)
	outertable.appendChild(outertr)
    elem.appendChild(outertable);

    var currentDropId = null;

  // Creates the divs and HTML elements for the game.
    var div = document.createElement('div');
    div.className = 'wordgame-table';
	
  // Goes on to make rows and event listeners for drag and drop.
    var cellSpan = 0;
    options.cells.forEach(function(c){
      if(c > cellSpan) cellSpan = c;
    });
    var cellWidth = 100 / cellSpan;
	var descrSides=[]
	if(options.descriptions.length>0) {
		var sides=options.descriptions.length
		for(s=0;s<sides;s++) {
			var cells=options.descriptions[s].length
			if(cells) {
				var isVertical=(Math.floor(s/2)<s/2)
				var descTable = document.createElement('table');
				descTable.style.width = (isVertical?100:cellWidth*cells) + '%';
				if(!isVertical) {
					var row = document.createElement('tr');
					row.className = 'wordgame-descr-horizontal-row';
				}
				for(var i = 0; i<cells; i++){
					td = document.createElement('td');
					if(!isVertical)
						td.style.width = cellWidth + '%';
					if(isVertical) {
						var row = document.createElement('tr')
						row.className = 'wordgame-descr-vertical-row';
						row.appendChild(td);
					}
					var cell = document.createElement('div');
					cell.className = 'wordgame-descr-cell';
					cell.innerText=options.descriptions[s][i]
					td.appendChild(cell);
					if(isVertical) descTable.appendChild(row); else row.appendChild(td);
				}
				if(isVertical) {
					var verttd=document.createElement('td');
					verttd.appendChild(descTable)
					verttd.style.width = '5%';
					descrSides[s]=verttd
				} else {
					descTable.appendChild(row);
					descrSides[s]=descTable
				}
			}
		}
	}
// 	console.log(descrSides)
	divtd.appendChild(div)
	
	if(descrSides.length>1) //Descriptions at the left
		divtd.before(descrSides[1]);
	if(descrSides.length>3) //Descriptions at the right
		divtd.after(descrSides[3]);
	if(descrSides.length>2) //Descriptions at the top
		div.appendChild(descrSides[2]);

	options.cells.forEach(function(cells, i){
      var rowTable = document.createElement('table');
      var row = document.createElement('tr');
      rowTable.appendChild(row);
      rowTable.style.width = cellWidth*cells + '%';
	  rowTable.style.tableLayout="fixed";
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

      div.appendChild(rowTable);
    });

	if(descrSides.length>0) //Descriptions at the bottom
		div.appendChild(descrSides[0]);
	
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
		if(str!="") {
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
		}
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

// from: https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/before()/before().md
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('before')) {
      return;
    }
    Object.defineProperty(item, 'before', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function before() {
        var argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment();
        
        argArr.forEach(function (argItem) {
          var isNode = argItem instanceof Node;
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
        });
        
        this.parentNode.insertBefore(docFrag, this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
// from: https://github.com/jserz/js_piece/blob/master/DOM/ChildNode/after()/after().md
(function (arr) {
  arr.forEach(function (item) {
    if (item.hasOwnProperty('after')) {
      return;
    }
    Object.defineProperty(item, 'after', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function after() {
        var argArr = Array.prototype.slice.call(arguments),
          docFrag = document.createDocumentFragment();
        
        argArr.forEach(function (argItem) {
          var isNode = argItem instanceof Node;
          docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
        });
        
        this.parentNode.insertBefore(docFrag, this.nextSibling);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
