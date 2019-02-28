function Scoring(){
  this.find = function(type){
    var result = [];
    var regex = new RegExp(type, "i");
    moveables.forEach(function(obj){
      if(regex.test(obj.userData.modelPath)) result.push(obj);
    });
    return result;
  };
}
