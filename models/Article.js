// Require mongoose
var mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator');

// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is a required string and should be unique to ensure no duplicates
  title: {
    type: String,
    required: true,
    unique: true
  },
  //summary, may not exist
  summary: {
    type: String
  },
  //dateline of article
  dateline: {
    type: String,
  },
  //author's name may not be provided
  author: {
    type:String
  },
  // link is a required string
  link: {
    type: String,
    required: true
  },
  //image link
  image: {
    type: String
  },
  //boolean whether to show or not
  read: {
    type: Boolean,
    default: false
  },
  // Which news site this article came from
  source: {
    type: String,
    required: true
  },
  // This only saves one comment's ObjectId, ref refers to the Comment model
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

// add unique-validator plugin
ArticleSchema.plugin(uniqueValidator);

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;