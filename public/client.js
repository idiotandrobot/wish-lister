// client-side js
// run by the browser each time your view template is loaded

$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
                      .exec(window.location.search);

    return results[1] || 0;
}

function loadlist(listid) {
  var parameters = {
    listid: listid
  }
  //
  $.get('/list'+'?'+$.param(parameters), function(data) {
      var list = data

      $('div#title').empty().append("<a href='https://www.amazon.co.uk/hz/wishlist/ls/" + listid + "?filter=unpurchased&sort=price-asc'>" + list.title + "</a>");
      $('ol#items').empty();
      var books = list.items;
      books.sort(function(a, b){return a.price-b.price})
        .forEach(function(book) {
      //$('<li></li>').text().appendTo('ul#items');
      
        $('ol#items').append("<li><a href='https://www.amazon.co.uk" + book.url + "'>" + book.title + "</a> <div>" + book.author + (isFinite(book.price) ? (" - £" + book.price) : "") + "</div></li>");
      });
    }); 
}

$(function() {
  document.getElementById('listid').value = $.urlParam('listid');
  loadlist(document.getElementById('listid').value);
});