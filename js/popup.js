var HttpClient = function () {
	this.get = function (aUrl, aCallback) {
		var anHttpRequest = new XMLHttpRequest();
		anHttpRequest.onreadystatechange = function () {
			if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
				aCallback(JSON.parse(anHttpRequest.responseText));
		}

		anHttpRequest.open("GET", aUrl, true);
		anHttpRequest.send(null);
	}
}

function isBlank(str) {
	return (!str || /^\s*$/.test(str));
}

document.addEventListener('DOMContentLoaded', function () {
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
		var currentUrl = tabs[0].url
		// Remove https:// or http://
		currentUrl = currentUrl.replace(/^(https?:|)\/\//, '')
		var redditCount = 0, hackerNewsCount = 0;

		aClient = new HttpClient();
		var url = 'https://www.reddit.com/submit.json?url=' + encodeURIComponent(currentUrl)
		aClient.get(url, function (response) {
			try {
				// filtering by type doesn't apper to work
				if (response.length > 1) {
					redditCount = response[0].data.children.length;
				} else {
					redditCount = response.data.children.length;
				}
			} catch (e) {
				/* No matches (most likely)*/
				console.log("Failed to results from Reddit: ", e)
			}

			if (isBlank(redditCount)) {
				redditCount = 0;
			}

			document.getElementById("redditCount").innerHTML = redditCount;
			document.getElementById("redditLink").href = "https://www.reddit.com/search?q=" + encodeURIComponent(currentUrl);
			document.getElementById("googleRedditLink").href = "https://www.google.com/search?q=\"" + encodeURIComponent(currentUrl) + "\"+site%3Areddit.com";
			document.getElementById("bingRedditLink").href = "https://www.bing.com/search?q=\"" + encodeURIComponent(currentUrl) + "\"+site%3Areddit.com";
		});

		url = "https://hn.algolia.com/api/v1/search?query=" + encodeURIComponent(currentUrl) + "&restrictSearchableAttributes=url";
		aClient.get(url, function (response) {
			hackerNewsCount = response.nbHits;
			if (isBlank(hackerNewsCount)) {
				hackerNewsCount = 0;
			}

			document.getElementById("hackerNewsCount").innerHTML = hackerNewsCount;
			document.getElementById("hackerNewsLink").href = "https://hn.algolia.com/?query=" + encodeURIComponent(currentUrl);
			document.getElementById("googleHackerNewsLink").href = "https://www.google.com/search?q=\"" + encodeURIComponent(currentUrl) + "\"+site%3Anews.ycombinator.com";
			document.getElementById("bingHackerNewsLink").href = "https://www.bing.com/search?q=\"" + encodeURIComponent(currentUrl) + "\"+site%3Anews.ycombinator.com";
		});
	});
}, false);