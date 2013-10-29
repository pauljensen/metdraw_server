
/**
 * Module dependencies.
 */

var express = require('express')
  , upload = require('./routes/fileupload')
  , metdraw = require('./routes/metdraw')
  , upload_json = require('./routes/upload_json')
  , render = require('./routes/render')
  , clone = require('./routes/clone')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use(express.bodyParser());

app.get('/', function(req, res) {
    res.render('index', { title: 'Metdraw' });
});

app.post('/upload', upload.fileupload);
app.get('/metdraw/:sessionid', metdraw.metdraw);
app.post('/upload_json/:sessionid/:filename', upload_json.upload_json);
app.post('/render/:sessionid', render.render);
app.get('/clone/:sessionid', clone.clone);
app.get('/start', function(req, res) {
    res.render('start');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
