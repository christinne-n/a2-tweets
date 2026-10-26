//WORK ON THIS FILE
var user_tweets = []; //parsetweets will add to this when searching

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	//TODO: Filter to just the written tweets
	user_tweets = runkeeper_tweets.map(function(tweet){
		return new Tweet(tweet.text, tweet.created_at);
	}).filter(function(tweet) {
		return tweet.written;
	});
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	document.getElementById('searchCount').innerText =0;
	document.getElementById('searchText').innerText = "";

	var searchbox = document.getElementById('textFilter');
	searchbox.addEventListener('input', function(){ 
		var text = searchbox.value;
		var table = document.getElementById('tweetTable');
		table.innerHTML = ""; //empty results
		document.getElementById('searchText').innerText = text;

		//empty = no results
		if(text ==""){
			document.getElementById('searchCount').innerText = 0;
			return;
		}
		//not empty == show results
		var matches = user_tweets.filter(function(tweet){
			return tweet.writtenText.includes(text);
		});
		document.getElementById('searchCount').innerText=matches.length;

		//new rows for each match ; 20 matches show 20 rows
		var rows="";
		for(let i=0; i<matches.length;i++){
			rows += matches[i].getHTMLTableRow(i +1);
		}
		table.innerHTML = rows;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});