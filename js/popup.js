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

const sourceTypes = {
	REDDIT: "Reddit",
	HACKERNEWS: "Hacker News",
	CSE_REDDIT: "Reddit via Google Custom Search",
	CSE_HACKERNEWS: "Hacker News via Google Custom Search",
}

function setPopupElementsWithSearchCounts(url, source) {
	console.log("Source:", source, "URL: ", url);

	aClient = new HttpClient();
	aClient.get(url, function (response) {
		var count = 0;
		try {
			switch (source) {
				case sourceTypes.REDDIT:
					if (response.length > 1) {
						count = response[0].data.children.length;
					} else {
						count = response.data.children.length;
					}
					break;

				case sourceTypes.HACKERNEWS:
					count = response.nbHits;
					break;

				case sourceTypes.CSE_REDDIT:
					count = response.searchInformation.totalResults;
					break;

				case sourceTypes.CSE_HACKERNEWS:
					count = response.searchInformation.totalResults;
					break;

				default:
					console.error("Invalid SourceType")
			}
		} catch (e) {
			/* No matches (most likely) */
			console.log("Failed to results:", e);
		}

		if (isBlank(count)) {
			count = 0;
		}

		switch (source) {
			case sourceTypes.REDDIT:
				document.getElementById("redditCount").innerHTML = count;
				break;

			case sourceTypes.HACKERNEWS:
				document.getElementById("hackerNewsCount").innerHTML = count;
				break;

			case sourceTypes.CSE_REDDIT:
				document.getElementById("googleRedditCount").innerHTML = count;
				break;

			case sourceTypes.CSE_HACKERNEWS:
				document.getElementById("googleHackerNewsCount").innerHTML = count;
				break;

			default:
				console.error("Invalid SourceType")
		}

	});
}

document.addEventListener('DOMContentLoaded', function () {
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
		var currentUrl = tabs[0].url
		// Remove https:// or http://
		currentUrl = currentUrl.replace(/^(https?:|)\/\//, '')
		// Remove everything after a ?
		// splitCurrentUrl = currentUrl.split('?')
		// currentUrl = splitCurrentUrl[0]

		// Reddit search
		var url = 'https://www.reddit.com/search.json?q=' + encodeURIComponent(currentUrl);
		document.getElementById("redditLink").href = "https://www.reddit.com/search?q=" + encodeURIComponent(currentUrl);
		document.getElementById("bingRedditLink").href = "https://www.bing.com/search?q=\"" + encodeURIComponent(currentUrl) + "\"+site%3Areddit.com";
		setPopupElementsWithSearchCounts(url, sourceTypes.REDDIT);

		// Custom Google search for Reddit
		// Surround with quotes
		// var encodedUrl = '%22' + encodeURIComponent(currentUrl) + '%22';
		// No quotes
		var encodedUrl = encodeURIComponent(currentUrl);
		url = 'https://www.googleapis.com/customsearch/v1?q=' + encodedUrl + '%20site:reddit.com&cx=011989466420602001809:1srqdechne1&key=GOOGLE_CSE_API';
		document.getElementById("googleRedditLink").href = "https://cse.google.com/cse?cx=011989466420602001809:1srqdechne1&q=" + encodedUrl + "+site%3Areddit.com";
		setPopupElementsWithSearchCounts(url, sourceTypes.CSE_REDDIT);

		// Hacker News search
		url = "https://hn.algolia.com/api/v1/search?query=" + encodeURIComponent(currentUrl) + "&restrictSearchableAttributes=url";
		document.getElementById("hackerNewsLink").href = "https://hn.algolia.com/?query=" + encodeURIComponent(currentUrl);
		document.getElementById("googleHackerNewsLink").href = "https://www.google.com/search?q=\"" + encodeURIComponent(currentUrl) + "\"+site%3Anews.ycombinator.com";
		document.getElementById("bingHackerNewsLink").href = "https://www.bing.com/search?q=\"" + encodeURIComponent(currentUrl) + "\"+site%3Anews.ycombinator.com";
		setPopupElementsWithSearchCounts(url, sourceTypes.HACKERNEWS);

		// Custom Google search for Hacker News
		// Surround with quotes
		encodedUrl = '%22' + encodeURIComponent(currentUrl) + '%22';
		// No quotes
		// encodedUrl = encodeURIComponent(currentUrl);
		url = 'https://www.googleapis.com/customsearch/v1?q=' + encodedUrl + '%20site:news.ycombinator.com&cx=011989466420602001809:1srqdechne1&key=GOOGLE_CSE_API';
		document.getElementById("googleHackerNewsLink").href = "https://cse.google.com/cse?cx=011989466420602001809:1srqdechne1&q=" + encodedUrl + "+site%3Anews.ycombinator.com";
		setPopupElementsWithSearchCounts(url, sourceTypes.CSE_HACKERNEWS);

	});
}, false);