var express = require('express');
var app = express();
var url = require("url");
var https = require('https');

var DICE_REPLY_HOOK = process.env.DICE_REPLY_HOOK;

function reply_by_hook(hook_url, channel, username, message){

  var options = url.parse(hook_url);
  options.method = "POST";

  var req = https.request(options, null);
  req.write(JSON.stringify({text: message, channel: channel, username: username}));
  req.end();
}

function roll() {
  var num = Math.floor(Math.random() * 3 - 1);
  var die;

  if ( num === - 1 ){
    die = ":minus:";
  }else if ( num === 1 ){
    die = ":plus:";
  }else {
    die = ":blank:";
  }

  return {die: die, num: num};
}


app.get('/fudge_dice', function(req, res) {
  var dice = "", result, sum = 0;
  for ( var i = 0; i < 4; i++ ){
    result = roll();
    dice += result.die;
    sum += result.num;
  }

  dice += " (" + sum + ")";

  console.log(req.query);
    
  reply_by_hook(DICE_REPLY_HOOK, req.query.channel_id, req.query.user_name, dice);

  res.send("");
});

var port = process.env.PORT || 8080;
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Started on port " + port)
});
