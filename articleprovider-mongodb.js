var Mongo = require('mongoskin');
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ArticleProvider = function(mongoUrl) {
    console.log(mongoUrl);

    console.log("Opening connection mongodb to " + mongoUrl);
    this.db = Mongo.db(mongoUrl);
    this.db.collection('articles').find().toArray(
	function(err, items) { 
	    console.dir(items); 
	});
};


ArticleProvider.prototype.getCollection= function(callback) {
    console.log("in getCollection");
//    this.db.collection('articles');//.find().toArray(
//	function(error, article_collection) {
//	    console.log("in getCollection callback");
//	    if( error ) callback(error);
//          else callback(null, article_collection);
//	});
    callback(null, this.db.collection('articles'));

};

ArticleProvider.prototype.findAll = function(callback) {
    console.log("in findall");
    this.getCollection(function(error, article_collection) {
	console.log("in getCollectionCallback");
	if( error ) callback(error)
	else {
            article_collection.find().toArray(function(error, results) {
		if( error ) callback(error)
		else callback(null, results)
            });
	}
    });
};


ArticleProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
        article_collection.findOne({_id: article_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

ArticleProvider.prototype.save = function(articles, callback) {
    this.getCollection(function(error, article_collection) {
      if( error ) callback(error)
      else {
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

        article_collection.insert(articles, function() {
          callback(null, articles);
        });
      }
    });
};

exports.ArticleProvider = ArticleProvider;