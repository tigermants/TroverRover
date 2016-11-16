var apiKey = "rlthcid1aooa2e8s";

function apiArticles(searchTerm, searchZone) {
  var result = [];
  var searchTerm = searchTerm
  searchTerm = searchTerm.replace(/ /g, "%20");
  var url = "http://api.trove.nla.gov.au/result?key=" + apiKey + "&encoding=json&zone=" + searchZone +
            "&sortby=relevance" + "&q=" + searchTerm + "&s=0&n=5&include=articletext,pdf&encoding=json&callback=?";
  console.log(url);
  $.getJSON(url, function(data) {
    if (searchZone == "article") {
      $.each(data.response.zone[0].records.work, function(index, value) {
        result.push({title: value.title, url: value.troveUrl});
      });
    }
    else if (searchZone == "newspaper") {
      $.each(data.response.zone[0].records.article, function(index, value) {
        result.push({title: value.heading, url: value.troveUrl, snippet: value.snippet});
      });
    }
    else if (searchZone == "book") {
      $.each(data.response.zone[0].records.work, function(index, value) {
        result.push({title: value.title, url: value.troveUrl, snippet: value.snippet});
      })
    }
  });
  return result;
}

var paper = apiArticles("Koala Facts", "newspaper");
var articles = apiArticles("Koala", "article");
var books = apiArticles("Koala", "book");

function randomIndex(data) {
  if (data == "text") {
    return Math.floor(Math.random() * 5);
  }
  else {
    return Math.floor(Math.random() * 10);
  }
}
