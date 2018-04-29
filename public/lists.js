// client-side js
// run by the browser each time your view template is loaded

$.urlParam = function (name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)')
                      .exec(window.location.search);

    return results[1] || 0;
}

function loadlist1() {
  loadlist2(document.getElementById('listids').value, document.getElementById('topn').value);
}

function loadlist2(listids, topn) {
  var parameters = {
    ids: listids,
    topn: topn
  }
  //
  $('div#title').empty().append("Top ").append(document.getElementById('topn').value);
  $('ol#items').empty();
  $.get('/lists'+'?'+$.param(parameters), function(data) {
      var books = data     
      books//.sort(function(a, b){return a.price-b.price})
        .forEach(function(book) {
      //$('<li></li>').text().appendTo('ul#items');
      
        $('ol#items').append("<li><a href='https://www.amazon.co.uk" + book.url + "'>" + book.title + "</a> <div>" + book.author + (isFinite(book.price) ? (" - £" + book.price) : "") + "</div></li>");
      });
    }); 
}

$(function() {
  document.getElementById('listids').value = $.urlParam('ids');
  loadlist1();
});