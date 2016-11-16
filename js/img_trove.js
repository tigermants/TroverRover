var loadedImages = [];
var urlPatterns = ["flickr.com", "nla.gov.au", "artsearch.nga.gov.au", "recordsearch.naa.gov.au", "images.slsa.sa.gov.au"];
var found = 0;


function waitForFlickr() {
    if(found == loadedImages.length) {
	    printImages();
    } else {
	    setTimeout(waitForFlickr, 250);
    }

};

// This function has been changed to allow the demo button to generate the images.
// The demo button represents encountering an animal.
$("#search-koala").click(function() {
		//event.preventDefault();

		loadedImages = [];
		found = 0;
		//get input values
		//var searchTerm = $("#searchTerm").val().trim();
		// We test pulling photos of koalas here
		var searchTerm = "Koala Photos";
		searchTerm = searchTerm.replace(/ /g, "%20");
		//var sortBy = $("#sortBy").val();
		// Currently hard coding for relevance
		var sortBy = "relevance";
		var apiKey = "rlthcid1aooa2e8s";

		//create searh query
		var url = "http://api.trove.nla.gov.au/result?key=" + apiKey + "&l-availability=y%2Ff&encoding=json&zone=picture" + "&sortby=relevance&n=100&q=" + searchTerm + "&l-format=Photograph&callback=?";

		//get the JSON information we need to display the images
		$.getJSON(url, function(data) {
				$('#output').empty();
				console.log(data);
				$.each(data.response.zone[0].records.work, processImages);
				//printImages();

 waitForFlickr(); // Waits for the flickr images to load
		});
});


/*
 *   Depending where the image comes from, there is a special way to get that image from the website.
 *   This function works out where the image is from, and gets the image URL
 */
function processImages(index, troveItem) {
		var imgUrl = troveItem.identifier[0].value;
		if (imgUrl.indexOf(urlPatterns[0]) >= 0) { // flickr
found++;
				addFlickrItem(imgUrl, troveItem);

		} else if (imgUrl.indexOf(urlPatterns[1]) >= 0) { // nla.gov
found++;
				loadedImages.push(
						imgUrl + "/representativeImage?wid=900" // change ?wid=900 to scale the image
				);

		} else if (imgUrl.indexOf(urlPatterns[2]) >= 0) { //artsearch
found++;
				loadedImages.push(
						"http://artsearch.nga.gov.au/IMAGES/LRG/" + getQueryVariable("IRN", imgUrl) + ".jpg"
				);

		} else if (imgUrl.indexOf(urlPatterns[3]) >= 0) { //recordsearch
found++;
				loadedImages.push(
						"http://recordsearch.naa.gov.au/NAAMedia/ShowImage.asp?T=P&S=1&B=" + getQueryVariable("Number", imgUrl)
				);

		} else if (imgUrl.indexOf(urlPatterns[4]) >= 0) { //slsa
				found++;
				loadedImages.push(
						imgUrl.slice(0, imgUrl.length - 3) + "jpg"
);

		} else { // Could not reliably load image for item
				// UNCOMMENT FOR DEBUG:
	// console.log("Not available: " + imgUrl);
		}
}

function addFlickrItem(imgUrl, troveItem) {
		var flickr_key = "a4d0bf2f4bde0595521b7bd8317ec428";
		var flickr_secret = "efc7221b694ff55e";
		var flickr_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + flickr_key + "&photo_id=";
		var url_comps = imgUrl.split("/");
		var photo_id = url_comps[url_comps.length - 1];

		$.getJSON(flickr_url + photo_id + "&format=json&nojsoncallback=1", function(data) {
				if (data.stat == "ok") {
						var flickr_image_url = data.sizes.size[data.sizes.size.length - 1].source;
						loadedImages.push(
								flickr_image_url
						);
				};
		});

};

function printImages() {

// Print single random image
		var randomindex = Math.floor(Math.random() * 20)
		console.log(randomindex);
		var image = new Image();
		image.src = loadedImages[randomindex];

		// When image loaded, display in game area. Image will replace old images.
		image.onload = function() {
			context.context.drawImage(image, 250, 25, 300, 300);
		};
};

// from http://css-tricks.com/snippets/javascript/get-url-variables/
function getQueryVariable(variable, url) {
		var query = url.split("?");
		var vars = query[1].split("&");
		for (var i = 0; i < vars.length; i++) {
				var pair = vars[i].split("=");
				if (pair[0] == variable) {
						return pair[1];
				}
		}
		return (false);
}
