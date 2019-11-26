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

var globalCount = 0;

function updateBadgeWithCounts(url, sourceType) {
    console.log("Source:", sourceType, "URL: ", url)

    aClient = new HttpClient();
    aClient.get(url, function (response) {
        var count = 0;
        try {
            switch (sourceType) {
                case sourceTypes.REDDIT:
                    // filtering by type doesn't apper to work
                    if (response.length > 1) {
                        count = response[0].data.children.length;
                    } else {
                        count = response.data.children.length;
                    }
                    break;
                case sourceTypes.HACKERNEWS:
                    count = response.nbHits;
                    break;
                default:
                    console.error("Invalid SourceType")
            }
        } catch (e) {
            /* No matches (most likely)*/
            console.log("Failed to results:", e)
        }

        if (isBlank(count)) {
            count = 0;
        }

        console.log(sourceType, "count: ", count);
        globalCount += count;

        console.log("New global count: ", globalCount.toString())
        if (globalCount > 0) {
            chrome.browserAction.setBadgeText({ text: globalCount.toString() });
        }
    });
}

function callback(tab) {
    // console.log(tab);
    globalCount = 0;
    chrome.browserAction.setBadgeText({ text: globalCount.toString() });

    try {
        // Remove https:// or http://
        var currentUrl = tab.url
        console.log("Current URL: ", currentUrl)
        console.log(window.location.toString())
        currentUrl = currentUrl.replace(/^(https?:|)\/\//, '')
        // Remove everything after a ?
		// splitCurrentUrl = currentUrl.split('?')
		// currentUrl = splitCurrentUrl[0]
    }
    catch (error) {
        console.log(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
        return;
    }

    var url = 'https://www.reddit.com/search.json?q=' + encodeURIComponent(currentUrl)
    updateBadgeWithCounts(url, sourceTypes.REDDIT);

    url = "https://hn.algolia.com/api/v1/search?query=" + encodeURIComponent(currentUrl) + "&restrictSearchableAttributes=url";
    updateBadgeWithCounts(url, sourceTypes.HACKERNEWS);
}

var activeTabId;

chrome.tabs.onActivated.addListener(function (activeInfo) {
    getActiveTab(callback);
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (changeInfo.status == 'complete' && tab.status == 'complete' && tab.url != undefined) {
        getActiveTab(callback);
    }
});

function getActiveTab(callback) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var tab = tabs[0];
        if (tab) {
            callback(tab);
        } else {
            chrome.tabs.get(activeTabId, function (tab) {
                if (tab) {
                    callback(tab);
                } else {
                    console.log('No active tab identified.');
                }
            });

        }
    });
}