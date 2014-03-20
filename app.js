var sys     = require('util'),
    request = require('request');

var express = require('express'),
    app     = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.static(__dirname + '/public'));
});

app.get('/get-json', function(req, res){
  var url = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';
  request({url:url, json:true}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(body);
    }
  });
});

app.get('/', function(req, res){
  res.render('index', {});
});

app.listen(8080);
