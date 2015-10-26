

var goodNews = 0;
var badNews = 0;
var mehNews =0;

var socket = io.connect("/", {
	"reconnect" : true,
	"reconnection delay" : 500,
	"max reconnection attempts" : 10
});

socket.on("welcome", function(msg) {
	console.log(msg);
});

socket.on("connect", function(data) {
	socket.emit("message", "Connected - " + data)

});

socket.on("message", function (data) {

	$('#search-box').text(data);
	
});

socket.on("button", function (data) {

	
	getInput();
	
});

socket.on("results",function(pos,neg,neu){


	goodNews = pos;
	badNews =neg;
	mehNews = neu;

	console.log("positive: "+goodNews);
	console.log("negative: "+badNews);
	console.log("neutral: "+mehNews);
	console.log('Appending data.');

});


function getInput(){
// var crisisKey ='562a2f7d008ff7336b330cbb';

console.log("button detected");
var searchTerm = $('#search-box').text();

console.log ("search term is "+ searchTerm);
var searchUrl = 'http://api.giphy.com/v1/gifs/search?api_key=dc6zaTOxFJmzC&q=' + searchTerm;
$.getJSON(searchUrl, function(json){
	console.log('Data received');
	console.log(json);
	var results = json.data;
	console.log('Found '+results.length+' results.');
	appendData(results);
});


		// var searchUrl= 'https://gateway-a.watsonplatform.net/calls/data/GetNews?outputMode=json&start=now-1d&end=now&count=5&q.enriched.url.enrichedTitle.taxonomy.taxonomy_.label=movies&return=enriched.url.url,enriched.url.title&apikey=8c29cb6f986b93e57dba36cdeb85908957977aec';
		// var searchUrl = 'http://api.crisis.net/item?apiKey=562a2f7d008ff7336b330cbbtags='+searchTerm;
		// var searchUrl = "http://www.reddit.com/search.json?q="+searchTerm;
		// $.getJSON(searchUrl, function(json) { 
  //   $.each(json.data.children, function(i,item){
  //   	var results = item.data.selftext;
  //   	console.log(results);

        // $("<img/>").attr("src", item.data.url).appendTo("#display");
    // });








}


// var appendDataNews = function(data){
// 		console.log('Appending data.');


// 	for(var i = 0; i < data.length; i++){

// 			var newElement = document.createElement('div');
// 			newElement.id = data[i]; newElement.className = "head-line";
// 			newElement.innerHTML = data[i].webTitle;
// 			document.body.appendChild(newElement);


// 		}

// 	}

var appendData = function(data){
	$('#good').empty();
	$('#bad').empty();
	$('#meh').empty();
	for(i=0; i<=goodNews.length; i++){

		var newElement = document.createElement('div');
		newElement.id = goodNews[i]; newElement.className = "head-line";
		newElement.innerHTML = goodNews[i];
		$("#good").append("<div>"+goodNews[i]+"/div>")
	}

	for(i=0; i<=badNews.length; i++){
		$("bad").append("<div>"+badNews[i]+"/div>")

	}

	for(i=0; i<=mehNews.length; i++){
		$("#meh").append("<div>"+mehNews[i]+"/div>")

	}

	$('#good').text(goodNews);
	$('#bad').text(badNews);
	$('#meh').text(mehNews);
	

	

	

	$('#display').empty(); // Jquery function!
	for(var i = 0; i < data.length; i++){
		
		$('#display').html
		('<img src="' + data[i].images.fixed_height.url + '" />');
		
	}
	

};


				
		