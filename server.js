// Parses our HTML and helps us find elements
var cheerio = require("cheerio");
// Makes HTTP request for HTML page
var request = require("request");

// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
            "Grabbing every high profile headline and link\n" +
            "from Dan Abrahm's LawNewz:" +
            "\n***********************************\n");

// Making a request for reddit's "webdev" board. The page's HTML is passed as the callback's third argument
request("https://lawnewz.com/category/high-profile/", function(error, response, html) {

  // Load the HTML into cheerio and save it to a variable
  // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
  var $ = cheerio.load(html);

  // An empty array to save the data that we'll scrape
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

    // Save these results in an object that we'll push into the results array we defined earlier
    results.push({
      title: title,
      summary: summary,
      dateline: dateline,
      author: author,
      link: link,
      image: img
    });
  });

  // Log the results once you've looped through each of the elements found with cheerio
  console.log(results);
});
