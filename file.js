var fs = require('fs');
var fileName = 'chat.txt';
function rdFile(){
  fs.readFile(fileName, 'utf8', function(err, data){
  if(err){
    return console.log(err);
  }
  var str = data;
  var arr = [];
  for(var i=0;i<returnDate(data).length; i++){
    arr.push(split(returnDate(data)[i]));
  }
  console.log(arr);
  //return arr;
  })
}
function returnDate (str){
  var res = str.match(/\d{2}\/\d{2}\/\d{4}[/,]\s\d{2}[/:]\d{2}\s[/-]\s[^:]*[/:]\s[^\n]*/gi);
  return res;
}
function split(str){
  var date = str.slice(0,10);
  var time = str.slice(12, 17);
  var rest = str.slice(20);
  var sender = String(rest).match(/[^:]*/);
  var msg = String(rest).slice(sender[0].length+2);
  var doc = {
    'date': date,
    'time': time,
    'sender': sender[0],
    'message': msg
  };
  return doc;
}
rdFile();
