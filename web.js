/* Explicitly copied or adopted from various sources:
   see README.md */

var express = require('express');

var app = module.exports = express.createServer(express.logger());

var ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;

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

var articleProvider= new ArticleProvider('localhost',27017);

app.get('/hello', function(request, response) {
    var text = 'Hello World!\n';
    text += 'I am running with\n';
    text += process.env.HOME;
    response.send(text);
});


app.get('/egg', function(request, response) {
    response.send('happy easter');
});

app.get('/', function(req, res){
    articleProvider.findAll(function(error, docs){
	res.render('index.jade', { locals: {
            title: 'Blog',
            articles:docs
	}
				 });
    })
});


app.get('/blog/new', function(req, res) {
    res.render('blog_new.jade',
	       { locals: {
		   title: 'New Post' }
	       });
});

app.post('/blog/new', function(request, response){
    console.log("request body is " + JSON.stringify(request.body));
    console.log("request param is " + JSON.stringify(request.param));
    articleProvider.save(
	[{
            title: request.param('title'),
            body:  request.param('body')
	}], 
	function(error, docs) {
	    response.redirect('/')
	});
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Listening on " + port);
});