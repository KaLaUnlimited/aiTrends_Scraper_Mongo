const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const path = require("path"); // built

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
const axios = require("axios");
const cheerio = require("cheerio");

// Require all models
const db = require("./models");

const PORT = 3000;

// Initialize Express
const app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// By default mongoose uses callbacks for async queries, we're setting it to use promises (.then syntax) instead
// Connect to the Mongo DB

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB

mongoose.connect(MONGODB_URI)

// Routes

app.get("/", function (req, res) {
  // Static Files
  // HTML
  // JavaScript
  // CSS
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/saved", function (req, res) {
  // Static Files
  // HTML
  // JavaScript
  // CSS
  res.sendFile(path.join(__dirname, "views/saved.html"));
});




// API
app.get("/articles", function (req, res) {


  db.Article.find({saved:false}) // promise
    .then(function (data) {
      // TODO
      res.json(data); // json

      // res.json();
    })
    .catch(function (err) {
      // TODO
      res.json(err);
    })
});






// get = url
  // send a static
  // build an api
  // process some information, and send the user somewhere else
// post





// A GET route for scraping the echojs website
app.get("/scrape", function (req, res) {
  // First, we grab the body of the html with request
  axios.get("https://aitrends.com/").then(function (response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    const $ = cheerio.load(response.data);

    var finalResults = []; // {}
    // Now, we grab every h2 within an article tag, and do the following:
    $("div.item-details").each(function (i, element) {
      // Save an empty result object
      const result = {};

      // Add the text and href of every link, and save them as properties of the result object

      if (result.summary !== "" || result.summary !== undefined) {
        result.title = $(this)
          .children("h3")
          .children("a")
          .text();
        result.link = $(this)
          .children("h3")
          .children("a")
          .attr("href")

        result.summary = $(this)
          .children("div.td-excerpt")
          .text();
      }

      finalResults.push(result)

    });



    // Create a new Article using the `result` object built from scraping
    db.Article.create(finalResults)
      .then(function (dbArticle) {
        // View the added result in the console
        // console.log(dbArticle);
        res.redirect("/");
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json("We not not able to save the articles");
      });

    // If we were able to successfully scrape and save an Article, send a message to the client
    // res.send(result);
  });
});

// // Route for getting all Articles from the db
app.put('/savedArticles', function (req, res) {
  // Grab every document in the Articles collection
  db.Article.update({"saved": false}, {$set: {"saved":true}})

    .then(function (dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

app.get("/savedArticles", function (req, res) {


  db.Article.find({saved:true}) // promise
    .then(function (data) {
      // TODO
      res.json(data); // json

      // res.json();
    })
    .catch(function (err) {
      // TODO
      res.json(err);
    })
});


// Route for grabbing a specific Article by id, populate it with it's note
app.delete("/api/headlines/:id", function(req, res) {

  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  console.log("reqbody: " + req.body.id)
  //const objID= "ObjectId(''"
  db.Article.remove(
    {
      _id: req.params.id
     
    }
    
  ).then(function(removed) {
      // If we were able to successfully find an Article with the given id, send it back to the client
      res.json(removed);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
});

// // Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
//   db.Note.create(req.body)
//     .then(function(dbNote) {
//       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function(dbArticle) {
//       // If we were able to successfully update an Article, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});




// Serve our App
// Microservices
  // Building API
  // Not serving a static
// Some Integrations