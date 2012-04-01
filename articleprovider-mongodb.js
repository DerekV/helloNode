var Mongo = require('mongoskin');
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ArticleProvider = function(mongoUrl) {
    console.log(mongoUrl);

    console.log("Opening connection mongodb to " + mongoUrl);
    this.db = Mongo.db(mongoUrl);
    this.article_collection = 
	this.db.collection('articles');
};


ArticleProvider.prototype.findAll = function(callback) {
    this.article_collection.find().toArray(function(error, results) {
	if( error ) callback(error)
	else callback(null, results)
    });
};


ArticleProvider.prototype.findById = function(id, callback) {
    this.article_collection.findById(
	id
	  ,
	  function(error, result) {
	      if( error ) callback(error)
	      else callback(null, result)
	  }
	);
};
    

ArticleProvider.prototype.save = function(articles, callback) {
    if( typeof(articles.length)=="undefined")
        articles = [articles];
    
    for( var i =0;i< articles.length;i++ ) {
        article = articles[i];
        article.created_at = new Date();
        if( article.comments === undefined ) article.comments = [];
        for(var j =0;j< article.comments.length; j++) {
            article.comments[j].created_at = new Date();
        }
    }
    
    this.article_collection.insert(articles, function() {
        callback(null, articles);
    });
};

exports.ArticleProvider = ArticleProvider;