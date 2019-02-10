try {
var wordWidget = new Widget({
  element: document.querySelector(".playarea"),
  cells: [3, 5, 7, 5, 3],
  texts: ["test1", "test2", "test3"]
}
);

} catch(ex){
  console.log('Der skete en fejl: ', ex);
}

wordWidget.destroy();

wordWidget.getResult();

wordWidget.setResult(result);
var gameWidget = new Widget({
element: document.querySelector(".wordgame-content"),
cells: [3, 5, 7, 5, 3],
texts: ["Test1", "Test2", "Test3", "Test4", "Test5"]
});
