// Require mongoose
var mongoose = require("mongoose");
// Create Schema class
var Schema = mongoose.Schema;

// Create article schema
var ArticleSchema = new Schema({
  // title is a required string
  title: {
    type: String,
    required: true
  },
  //summary, may not exist
  summary: {
    type: String
  },
  //dateline of article
  dateline: {
    type: String,
    required: true
  },
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
  // This only saves one comment's ObjectId, ref refers to the Comment model
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

// Create the Article model with the ArticleSchema
var Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Article;