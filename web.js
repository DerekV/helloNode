/* Explicitly copied or adopted from various sources:
   see README.md */

var express = require('express');

var app = module.exports = express.createServer(express.logger());

var ArticleProvider = require('./articleprovider-memory').ArticleProvider;

app.get('/hello', function(request, response) {
    var text = 'Hello World!\n';
    text += 'I am running with\n';
    text += process.env.HOME;
    response.send(text);
});


app.get('/egg', function(request, response) {
    response.send('happy easter');
});

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var articleProvider= new ArticleProvider();

app.get('/', function(req, res){
    articleProvider.findAll(function(error, docs){
	res.render('index.jade', { locals: {
            title: 'Blog',
            articles:docs
	}
				 });
    })
});

app.listen(3000);

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});