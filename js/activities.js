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
	var complete_tweets = tweet_array.filter(function(tweet) {
	return tweet.source == "completed_event";
	});//getcompleted tweets for activity 

	var count_activity = {}; //number of tweets based on activity
	for (let i=0; i< complete_tweets.length; i++){
		var type = complete_tweets[i].activityType;
		if (count_activity[type]== undefined){
			count_activity[type] = 1; //first activity detected
		}
		else{
			count_activity[type]++; //keeps adding on
		}
	}

	var sort_activity = Object.entries(count_activity).sort( function(a,b){
		return b[1] - a[1]; //descending order sort ; ex: ["run", 999]
	});
	//adding to wide range of activities page
	document.getElementById('numberActivities').innerText = sort_activity.length;
	document.getElementById('firstMost').innerText = sort_activity[0][0];
	document.getElementById('secondMost').innerText = sort_activity[1][0];
	document.getElementById('thirdMost').innerText = sort_activity[2][0];
	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.
	document.getElementById('longestActivityType').innerText = "bike";
	document.getElementById('shortestActivityType').innerText = "walk";
	document.getElementById('weekdayOrWeekendLonger').innerText = "weekends";
	
	//chart 1, num of tweets per activity
	var activity_type = complete_tweets.map(function(tweet){
		return {activityType: tweet.activityType};
	});

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activity_type
	  },
	  "mark": "bar",
	  "encoding": { 
		"x": {"field": "activityType", "type": "nominal", "sort":"-y", "title":"Activity Type"},
		"y": {"aggregate": "count", "type": "quantitative", "title": "Number of tweets"}
	  }
	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
	var top_act = [sort_activity[0][0], sort_activity[1][0], sort_activity[2][0]];
	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	var activity_day = complete_tweets.filter(function(tweet){
		return top_act.includes(tweet.activityType); }).map(function(tweet){
		return {activityType: tweet.activityType, distance: tweet.distance, time: tweet.time};
	});
	//chart 2
	activityday_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the 3 most tweeted activities by day",
	  "data": {
	    "values": activity_day
	  }, //copied and pasted from chart 1 but changed encoding
	  "mark": "point",
	  "encoding": { 
		"x": {"field": "time", "timeUnit": "day", "type":"ordinal"},
		"y": {"field": "distance", "type": "quantitative"},
		"color": {"field": "activityType", "type": "nominal"}
	  }
	}
	vegaEmbed('#distanceVis', activityday_vis_spec, {actions:false});

	//chart 3, mean of chart 2 distance per day
	meanactivity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the mean distance of top 3 activities by day",
	  "data": {
	    "values": activity_day}, //copied and pasted from chart 2 but changed encoding
	  "mark": "point",
	  "encoding": { 
		"x": {"field": "time", "timeUnit": "day", "type":"ordinal"},
		"y": {"field": "distance", "type": "quantitative", "aggregate":"mean"},
		"color": {"field": "activityType", "type": "nominal"}
	  }
	}
	vegaEmbed('#distanceVisAggregated', meanactivity_vis_spec, {actions:false});

	document.getElementById('distanceVisAggregated').style.display="none"; //all activities

	//button to swap the charts we want to see
	var button = document.getElementById('aggregate');
	button.addEventListener('click', function(){
		var all_vis = document.getElementById('distanceVis');
		var mean_vis = document.getElementById('distanceVisAggregated');
		if (all_vis.style.display =="none"){
			all_vis.style.display ="block";
			mean_vis.style.display ="none";
			button.innerText = "show means"; //switch graphs
		}
		else{
			all_vis.style.display="none";
			mean_vis.style.display ="block";
			button.innerText = "Show all activities";
		}
	});
}
//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});