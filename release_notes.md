# Release Notes

## 1.4.1
* Search without quotes for better Reddit results
* Remove everything after a `?` in the URL

## 1.4.0
* New icon and screenshots

## 1.3.0
* Badge now updates on page reloads

## 1.2.0
* Uses Google Custom search to obtain Google search result count
* Badge updated with Reddit and Hacker News counts using a background script
* [Google CSE JSON is limited to 10,000 queries per day](https://developers.google.com/custom-search/docs/overview#summary_of_custom_search_offerings)

## 1.1.0
* Added Google and Bing search link since Reddit search alone seems limited.
* Strips `https:\\` or `http:\\` from the tab URL for better results.
* Added icons for each source
* Minor refactoring

## 1.0.0
* Leveraged the Reddit API and Hacker News API to determine if the current tab's URL was submitted or present at those discussion sites.
* Initial idea implementation.