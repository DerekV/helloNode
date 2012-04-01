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

var mongoUrl = (process.env.MONGOHQ_URL || 'localhost:27017/node-mongo-blog');

var articleProvider= new ArticleProvider( mongoUrl + '?auto_reconnect');

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
    console.log("Request received");
    articleProvider.findAll(function(error, docs){
	console.log("in findall callback");
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

app.get('/blog/:id', function(req, res) {
    articleProvider.findById(req.params.id, function(error, article) {
        res.render('blog_show.jade',
        { locals: {
            title: article.title,
            article:article
        }
        });
    });
});

app.post('/blog/addComment', function(req, res) {
    articleProvider.addCommentToArticle(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
       } , function( docs) {
           res.redirect('/blog/' + req.param('_id'))
       });
});


var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Listening on " + port);
});