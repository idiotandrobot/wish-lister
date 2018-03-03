"use strict";

// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var website = "https://www.amazon.co.uk";
const scrapeIt = require("scrape-it");

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/index.html');
});

function scrapethis(listid, callback)
{
  var scrapedData;
  scrapeIt(website + "/hz/wishlist/ls/" + listid + "?filter=unpurchased&sort=price-asc", {
    items: {
          listItem: "div.g-item-sortable"
        , name: "items"
        , data: {
              title: "h5 a"
            , price: { attr: "data-price" }
            , url: {
                  selector: "a"
                , attr: "href"
              }
            , author: ".a-size-base"
          }
      }
    ,title: "#profile-list-name"
  }, (err, page) => {
      console.log(err || page);
      scrapedData=err || page;
      callback(scrapedData.title, scrapedData.items);
  });  
}

app.get("/list", function (request, response) {
  var listid = request.query.listid;  
  scrapethis(listid, function (title, items) {
    response.send({ items, title});
  });
});

app.get("/lists", function (request, response) {
  var listids = request.query.ids.split(',');
  console.log(listids);
  var books = [];
  listids.forEach(function(listid, i) {
    scrapethis(listid, function (title, moreBooks) {    
          books = books.concat(moreBooks);
          if (i == listids.length - 1)
            response.send(books.sort(function(a, b){return a.price-b.price}).slice(0, 10));
        })
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});