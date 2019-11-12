# Discussed Elsewhere
This Chrome extension checks if the current tab URL is referenced in Reddit or Hacker News.

Available in the Chrome web store: https://chrome.google.com/webstore/detail/discussed-elsewhere-reddi/ndooigbgchkjpgdbgajgpkconcoogoea

## Why?
Often I find that I am checking if a news, wikipedia, etc. article has been dicussed on Reddit or Hacker News. Discussions on those website provide a lot of insight and feedback so I wanted to make the checking process a little easier. Now with a simple click I can determine whether or not the current URL has been discussed on Reddit or Hacker News.

Note: There are some significant inconsistencies with the Reddit search results. I couldn't find anything in the documentation, but I found a few discussions were others encountered the same issues. The below search endpoints do not appear consistent from Reddit (example search term is `philosophy`).

* https://www.reddit.com/search/?q=philosophy
* https://gateway.reddit.com/desktopapi/v1/search?rtj=only&allow_over18=1&include=structuredStyles%2CprefsSubreddit&q=philosophy#event-onUpdated&sort=relevance&t=all&type=link%2Csr%2Cuser&b=true&search_correlation_id=d3747a68-4aae-4ea7-b159-c9887444fc3e
* https://www.reddit.com/search.json?q=philosophy

## To do
 * [ ] Get Bing search count [via API](https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/)
 * [ ] Add other sites of interest (recommendations welcomed)
 * [ ] Identify keywords / concepts on the site and link to Wikipedia
 
## Completed
 * [x] Integrate Google search count
 * [x] Checks Hacker News and Reddit for current tab URL
 * [x] Display search count find and hyperlink to search

## References / Sources
 * https://hn.algolia.com/api
 * https://www.reddit.com/dev/api/
 * https://simpleicons.org/
 * https://developers.google.com/custom-search/docs/overview
