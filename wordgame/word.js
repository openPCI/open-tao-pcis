function WordGame (options){
  if (!options.element) throw "No element!";
  if (!options.cells) throw "No Cells!";

  var elem = options.element;

  var table = document.createElement('div');
  table.className = 'wordgame-table';

  options.cells.forEach(function(cells, i){
    var row = document.createElement('div');
    row.className = 'wordgame-row';
    var cell;
    for(var i = 0; i<cells; i++){
      cell = document.createElement('div');
      cell.className = 'wordgame-cell';
      cell.style.width = 100 / cells + '%';
      cell.addEventListener('dragover', function(evt) {
        evt.preventDefault();
      });
      cell.addEventListener('drop', function(evt) {
        evt.preventDefault();
        if(this.childNodes.length > 0) return;
        var id = evt.dataTransfer.getData("text/wordrank");
        this.appendChild(document.getElementById(id));
        console.log(evt, this);
      });
      row.appendChild(cell);
    }

    table.appendChild(row);
  });

  elem.appendChild(table);

  var words = document.createElement('div');
  words.className = 'wordgame-texts';
  words.addEventListener('drop', function(evt){
    var id = evt.dataTransfer.getData("text/wordrank");
    words.appendChild(document.getElementById(id));
  });
  words.addEventListener('dragover', function(evt){
    evt.preventDefault();
  });
  options.texts.forEach(function(str, i){
    var text = document.createElement('div');
    text.className = 'wordgame-text';
    text.innerText = str;
    text.draggable = true;
    text.id = (options.idPrefix||'') + 'wordrank' + i;
    text.addEventListener('dragstart', function(evt) {
      evt.dataTransfer.setData('text/wordrank', text.id);
      text.style.opacity = 0.25;
    });
    text.addEventListener('dragend', function(evt){
      text.style.opacity = 1;
    })
    words.appendChild(text);
  });

  elem.appendChild(words);
}
function destroyWidget(WordGame){
  var elem = document.getElementById("playarea");
  elem.remove();
}
