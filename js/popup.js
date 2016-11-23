var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(JSON.parse(anHttpRequest.responseText));
        }

        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}

document.addEventListener('DOMContentLoaded', function() {
	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
		var currentUrl = tabs[0].url
		var count = 0;

	  	aClient = new HttpClient();
	  	var url = 'https://www.reddit.com/submit.json?url=' + encodeURIComponent(currentUrl)
		aClient.get(url, function(response) {
			try {
				// filtering by type doesn't apper to work
				if (response.length > 1) { 
					count = response[0].data.children.length;
				} else {
					count = response.data.children.length;
				}
			} catch(e) { /* No matches (most likely)*/ }
			console.log(count);
			
			document.getElementById("rCount").innerHTML = count;
			document.getElementById("rLink").href = "https://www.reddit.com/search?q=" + encodeURIComponent(currentUrl);
		});

	  	url = "https://hn.algolia.com/api/v1/search?query=" +encodeURIComponent(currentUrl)+ "&restrictSearchableAttributes=url";
		aClient.get(url, function(response) {
			count =  response.nbHits;
			console.log(count);
			
			document.getElementById("hnCount").innerHTML = count;
			document.getElementById("hnLink").href = "https://hn.algolia.com/?query=" + encodeURIComponent(currentUrl);
		});
	});
}, false);