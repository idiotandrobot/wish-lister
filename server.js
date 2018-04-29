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

app.get("/lists.html", function (request, response) {
  response.sendFile(__dirname + '/lists.html');
});

async function scrapethis(listid)
{
  var result = await scrapeIt(website + "/hz/wishlist/ls/" + listid + "?filter=unpurchased&sort=price-asc", {
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
  });  
  return result.data;
}

async function getlist(listid)
{
  var result = await scrapethis(listid);
  return result.items;
}

app.get("/list", async function (request, response) {
  var listid = request.query.listid;  
  var list = await scrapethis(listid);
  response.send(list);
});

// via https://hackernoon.com/functional-javascript-resolving-promises-sequentially-7aac18c4431e
const promiseSerial = funcs =>
  funcs.reduce((promise, func) =>
    promise.then(result => func().then(Array.prototype.concat.bind(result))),
    Promise.resolve([]))

app.get("/lists", async function (request, response) {
  var listids = request.query.ids.split(',');
  
  var funcs = listids.map(listid => () => getlist(listid));
  var books = await promiseSerial(funcs);
  var top = books.sort(function(a, b){return a.price-b.price}).slice(0, 15);
  response.send(top);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});