//WORK ON THIS FILE
function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	
	//finding earliest and latest tweets
	var earliest = tweet_array[0].time;
	var latest = tweet_array[0].time;
	for(let i = 0; i < tweet_array.length; i++){
		var time = tweet_array[i].time;
		if(time < earliest){
			earliest = time;
		}
		else if (time > latest){
			latest = time;
		}
	}
	//instructions said to use .toLocaleDateString
	//Write out the Month, Day, and Year of the earliest and latest Tweet (e.g., Monday, January 18, 2021)
	var dates = {month: 'long', day: 'numeric', year: 'numeric'}
	document.getElementById('firstDate').innerText = earliest.toLocaleDateString('en-US', options);
	document.getElementById('lastDate').innerText = earliest.toLocaleDateString('en-US', options);
	//getting element id from index.html
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});