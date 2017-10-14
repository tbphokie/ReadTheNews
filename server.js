/* Showing Mongoose's "Populated" Method
 * =============================================== */

 // mongo uri mongodb://heroku_p6wfczfl:ses5q25qoeal8tatoft9nlao1j@ds127260.mlab.com:27260/heroku_p6wfczfl
 var port = "mongodb://heroku_p6wfczfl:ses5q25qoeal8tatoft9nlao1j@ds127260.mlab.com:27260/heroku_p6wfczfl";// || 3001;

// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Requiring our Note and Article models
var Comment = require("./models/Comment.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Database configuration with mongoose
//mongoose.connect("mongodb://localhost/newsScraper");
mongoose.connect("mongodb://heroku_p6wfczfl:ses5q25qoeal8tatoft9nlao1j@ds127260.mlab.com:27260/heroku_p6wfczfl");
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});

// Routes
// ======
//default page
app.get("/", function(req, res){
   // Grab every doc in the Articles array
   Article.find({})
   .populate("comment")
   .exec( function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      //console.log("getting doc: ", doc);
      var hbsobj = {
        articles: doc
      }    
      res.render("index", hbsobj);
      }
  });
});

// A GET request to scrape the LawNewz website
app.get("/scrapeLN", function(req, res) {
  // First, tell the console what server.js is doing
  /*console.log("\n***********************************\n" +
              "Grabbing every high profile headline and link\n" +
              "from Dan Abrahm's LawNewz:" +
              "\n***********************************\n");
  */
  // Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
  request("https://lawnewz.com/category/high-profile/", function(error, response, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);
    var results = [];

    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    $("div.post.post-chron").each(function(i, element) {

      // Save the text of the element in a "title" variable
      var title = $(element).children("h3").children().attr("title");
      var summary = $(element).children("h3").children().text();

      // In the currently selected element, look at its child elements (i.e., its a-tags),
      // then save the values for any "href" attributes that the child elements may have
      var link = $(element).children("h3").children().attr("href");

      var regExp = /\(([^)]+)\)/;
      var fullImg = $(element).children("a.featured-img").attr("style");
      var matches = regExp.exec(fullImg);
      var img = matches[1];

      var dateline = $(element).children("div.dateline").text();
      dateline = dateline.replace(" by ", "");

      var author = $(element).children("div.dateline").children().text();
      dateline = dateline.replace(author, "");
      dateline = dateline.trim();
      // Save an empty result object
      var result = {};
      
      // Save these results in an object that we'll push into the results array we defined earlier
      result.title =  title;
      result.summary = "";  //lawnewz doesn't provide summaries
      result.dateline = dateline;
      result.author = author;
      result.link = link;
      result.image = img;
      result.source = "LN";
      result.read = false;

      results.push(result);
      
      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);
      
      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
    res.json(results);
    //console.log("RESULTS----",results);
  });

  });

// show all the articles in the database
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      var hbsobj = {
        articles: doc
      }    
      res.render("index", hbsobj);
    }
  });
});

// A GET request to scrape the LawNewz website
app.get("/scrapeWSJ", function(req, res) {
  // First, tell the console what server.js is doing
  /*console.log("\n***********************************\n" +
              "Grabbing every high profile headline and link\n" +
              "from Dan Abrahm's LawNewz:" +
              "\n***********************************\n");
  */
  // Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
  request("https://www.wsj.com/", function(error, response, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);
    var results = [];

    // With cheerio, find each p-tag with the "title" class
    // (i: iterator. element: the current element)
    console.log('WSJ');
    $("div.wsj-card").each(function(i, element) {
      // Save the text of the element in a "title" variable
      var title = $(element).children('h3.wsj-headline').text();
      var summary = $(element).children('div.wsj-card-body').children('p.wsj-summary').children('span').text();

      // In the currently selected element, look at its child elements (i.e., its a-tags),
      // then save the values for any "href" attributes that the child elements may have
      var link = $(element).children().children("a.wsj-headline-link").attr("href");
      var img = $(element).children().children().find('img.wsj-img-content').attr('src');
      console.log("WSJ img= ", img);

     var dateline = "";  //dateline and author not provided on front page 
     var author = "";

     
      // Save an empty result object
      var result = {};
      
      // Save these results in an object that we'll push into the results array we defined earlier
      result.title =  title;
      result.summary = summary;  
      result.dateline = dateline;
      result.author = author;
      result.link = link;
      result.image = img;
      result.source = "WSJ";
      result.read = false;

      results.push(result);
      
      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);
      
      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          //console.log(err);
        }
        // Or log the doc
        else {
          //console.log(doc);
        }
      });

    });
    res.json(results);
    //console.log("RESULTS----",results);
  });

  });

//mark article as read
app.post("/articleRead/:id", function(req, res){
  Article.findOneAndUpdate({ "_id": req.params.id }, { "read": true })
  .exec(function(err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    else {
      // Or send the document to the browser
      res.send(doc);
      //console.log(doc);
    }
  });
});

// add/update comment to this article
app.post("/articles/:id", function(req, res) {
    // Create a new comment and pass the req.body to the entry
    //console.log('POSTING');
    //console.log(req.body);
    var newComment = new Comment(req.body);
    
      // And save the new note the db
      newComment.save(function(error, doc) {
        // Log any errors
        if (error) {
          console.log(error);
        }
        // Otherwise
        else {
          //console.log("req.id= ", req.params.id);
          //console.log("doc.id= ", doc._id);
          // Use the article id to find and update it's note
          Article.findOneAndUpdate({ "_id": req.params.id }, { "comment": doc._id })
          // Execute the above query
          .exec(function(err, doc) {
            // Log any errors
            if (err) {
              console.log(err);
            }
            else {
              // Or send the document to the browser
              res.send(doc);
              //console.log(doc);
            }
          });
        }
      });
});

//route to delete note
app.post("/deleteComment/:id", function(req, res){
  Comment.findByIdAndRemove(req.params.id, function(err, note) {
      if (err) {
          console.log(err);
          res.status(500);
      } else {
          res.redirect('/');
      }
  });
});

//route to get note by id
app.get("/getComment/:id", function(req, res){
  console.log("Get Comment ID=", req.params.id);
  Article.findOne({"_id" : req.params.id}, function(err, commentId){

  }).exec(function(err, result){
    console.log("Comment id: ", result);
    Comment.findById(result.comment, function(err, comment){
      if(err){
        console.log(err);
      } else {
        console.log("Found note: ", comment);
        res.send(comment);
      }
    });
  });

});

// Listen on port 3000
app.listen(port, function() {
  console.log("App running on port 3000!");
});
