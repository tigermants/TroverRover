var apiKey = "rlthcid1aooa2e8s";
var loadedImages = [];
var urlPatterns = ["flickr.com", "nla.gov.au", "artsearch.nga.gov.au", "recordsearch.naa.gov.au", "images.slsa.sa.gov.au"];
var found = 0;

function getImages(search) {
	loadedImages = [];
	found = 0;
	var searchTerm = search;
	searchTerm = searchTerm.replace(/ /g, "%20");
	var url = "http://api.trove.nla.gov.au/result?key=" + apiKey + "&l-availability=y%2Ff&encoding=json&zone=picture&sortby=relevance&n=100&q=" + searchTerm + "&l-format=Photograph&callback=?";

	$.getJSON(url, function(data) {
		console.log(data);
		$.each(data.response.zone[0].records.work, processImages);
	});
	return loadedImages;
}

// From: http://deco1800.uqcloud.net/examples/troveImage.php
function addFlickrItem(imgUrl, troveItem) {
	var flickr_key = "a4d0bf2f4bde0595521b7bd8317ec428";
	var flickr_secret = "efc7221b694ff55e";
	var flickr_url = "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key=" + flickr_key + "&photo_id=";
	var url_comps = imgUrl.split("/");
	var photo_id = url_comps[url_comps.length - 1];

	$.getJSON(flickr_url + photo_id + "&format=json&nojsoncallback=1", function(data) {
		if (data.stat == "ok") {
			var flickr_image_url = data.sizes.size[data.sizes.size.length - 1].source;
			loadedImages.push(flickr_image_url);
		};
	});
}

// From: http://deco1800.uqcloud.net/examples/troveImage.php
function processImages(index, troveItem) {
	var imgUrl = troveItem.identifier[0].value;
	if (imgUrl.indexOf(urlPatterns[0]) >= 0) {
		found++;
		addFlickrItem(imgUrl, troveItem);
	}
	else if (imgUrl.indexOf(urlPatterns[1]) >= 0) {
		found++;
		loadedImages.push(imgUrl + "/representativeImage?wid=900");
	}
	else if (imgUrl.indexOf(urlPatterns[2]) >= 0) {
		found++;
		loadedImages.push("http://artsearch.nga.gov.au/IMAGES/LRG/" + getQueryVariable("IRN", imgUrl) + ".jpg");
	}
	else if (imgUrl.indexOf(urlPatterns[3]) >= 0) {
		found++;
		loadedImages.push("http://recordsearch.naa.gov.au/NAAMedia/ShowImage.asp?T=P&S=1&B=" + getQueryVariable("Number", imgUrl));
	}
	else if (imgUrl.indexOf(urlPatterns[4]) >= 0) {
		found++;
		loadedImages.push(imgUrl.slice(0, imgUrl.length - 3) + "jpg");
	}
	else {
	}
}

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
