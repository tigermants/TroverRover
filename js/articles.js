var apiKey = "rlthcid1aooa2e8s";

// There is an issue with TROVE applications where the first search will result in nothing being returned
// To get around this, we perform a dummy form submit.
$("form#articles-btn").submit();

// action that occurs when the form is submitted - either through hitting the enter key or by clicking on Search
$("form#articles-btn").submit(function() {

		// Get the values from our search form
    // HW - Hardcoded as a test
    var searchTerm = "Koala Food"
    // Set the search zone - alternatively you can set this using a form input
    // HW - We only want articles that are relevant to the search string.
    var searchZone = "newspaper";
    var sortBy = "relevance"

    /*
    *	Construct the URL for the Trove Search API
    * 	http://api.trove.nla.gov.au/result? is the base URL required for accessing the TROVE API
    * 	Additional arguments are sent as key/value pairs separated by the & sign
    * 	key is the API key needed to access the API
    * 	encoding tells the API how to return the results - json or xml (default)
    * 	zone tells the API where to perform the search - book, picture, article, music, map, collection, newspaper, list or all can be used
    * 	sortby tells the API how to sort the results - datedesc, dateasc, relevance
    * 	q is the set of keywords to search on, alternatively you can use Indexes to refine the search terms (see the API documentation for how to use indexes & which zones support each one
    *	callback allows you to specify a function to process the response - even if you choose not to set one, you need to include the callback parameter
    * 	See the API documentation for other parameters you can use in the search string
    */
    var url = "http://api.trove.nla.gov.au/result?key=" + apiKey + "&encoding=json&zone=" + searchZone +
    "&sortby=" + sortBy + "&q=" + searchTerm + "&s=0&n=5&include=articletext,pdf&encoding=json&callback=?";

    /*
    * 	Perform the search using jQuery's getJSON method
    *	Requires the search URL
    */
    console.log(url);

    $.getJSON(url, function(data) {
    	// clear the HTML div that will display the rsesults
        article_out = [];
        $('#article-test').empty();

        $.each(data.response.zone[0].records.article, function(index, value) {
          	//$("#article-out").append("<h3>" + index + " " + value.heading + "</h3>" + "<p>" + value.articleText +"</p>" +
            //"<p>" + "<a href=" + value.troveUrl + ">Click for more!</a>" + "</p><hr/>");
            article_out.push({heading: value.heading, url: value.troveUrl})
        });
        console.log(article_out);

        for (var i = 0; i < article_out.length; i++) {
          $("#article-test").append("<h3>" + article_out[i].heading + "</h3>" + "<p>"
            + "<a href=" + article_out[i].url + ">Find out more!</a></p>")
        };

	});
});
