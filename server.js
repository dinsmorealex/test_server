var SerialPort  = require("serialport").SerialPort;
var portName = "/dev/cu.usbmodem809851";
var fs = require("fs");
var url = require("url");
var words = require("an-array-of-english-words")
var request =require('request');
var http = require('http');
var requestify = require('requestify');
var sentiment = require('sentiment');
var colors = require('colors');

	var info= 0;
 var positive =[];
  	 var negative =[];
  	 var neutral =[];


// static file http server
// serve files for application directory

var root = "web";
var http = require("http").createServer(handle);

function handle (req, res) {
	var request = url.parse(req.url, false);
	console.log("Serving request: " + request.pathname);

	var filename = request.pathname;
	
	if(filename == "/") { filename = "/index.html"; }
	
	filename = root + filename;

	try {
		fs.realpathSync(filename);
	} catch (e) {
		res.writeHead(404);
		res.end();
	}

	var contentType = "text/plain";

	if (filename.match(".js$")) {
		contentType = "text/javascript";
	} else if (filename.match(".html$")) {
		contentType = "text/html";
	}

	fs.readFile(filename, function(err, data) {
		if (err) {
			res.writeHead(500);
			res.end();
			return;
		}

		res.writeHead(200, {"Content-Type": contentType});
		res.write(data);
		res.end();
	});	
}

http.listen(9090);

console.log("server started on localhost:9090");

var io = require("socket.io").listen(http); // server listens for socket.io communication at port 8000
io.set("log level", 1); // disables debugging. this is optional. you may remove it if desired.

var sp = new SerialPort(portName, {
	baudrate: 9600
}); // instantiate the serial port.

sp.on("close", function (err) {
	console.log("port closed");
});

sp.on("error", function (err) {
	console.error("error", err);
});

sp.on("open", function () {
	console.log("port opened... Press reset on the Arduino.");
});

io.sockets.on("connection", function (socket) {
    // If socket.io receives message from the client browser then 
    // this call back will be executed.    
    socket.on("message", function (msg) {
    	console.log(msg);
    });
    	   socket.on("button", function (msg) {
    	console.log(msg);
    });
       socket.on("results", function (pos,neg,neu) {
    	console.log(msg);
    });
    // If a web browser disconnects from Socket.IO then this callback is called.
    socket.on("disconnect", function () {
    	console.log("disconnected");
    });

    
});

var cleanData = ""; // this stores the clean data
var readData = "";  // this stores the buffer
sp.on("data", function (data) { // call back when data is received


	var chicken = data.toString();
	var wordChoice
  	var trigger=0;
	if (chicken.indexOf("A") >=0){
		var turkey = chicken.split("A")[1];
		

		var cow = turkey.split("B")[0];

		 wordChoice = words[cow]

		console.log(wordChoice);
		

		io.sockets.emit("message",wordChoice);

		searchAndDestroy(wordChoice);


	}

	if(chicken.indexOf("Y")>=0){
		var goose = chicken.split("Y")[1];

		var decide = goose.split("Z")[0];

		console.log(decide);
		
		io.sockets.emit("button", decide);

		
	}

	

	

});

function searchAndDestroy(searchTerm){
	console.log(colors.red("search term: "+searchTerm));

requestify.get("http://www.reddit.com/search.json?q="+searchTerm)
  .then(function(response) {

	
      // Get the response body (JSON parsed or jQuery object for XMLs)
      var hits = response.getBody().data.children;
  	
    console.log ("total results: "+hits.length)

      for(i=0;i<=hits.length;i++){
      	var results = hits[i].data.selftext;
      	var title = hits[i].data.title;
      	console.log(title);

      	var feelings =sentiment(results);
      	console.log("positive words: "+feelings.positive);

      	console.log("negative words: "+feelings.negative);

  		var pos =feelings.positive.length;
  		var neg = feelings.negative.length;
  		console.log("number of positive words: "+pos);
  		console.log("number of negative words: "+neg);

  		if (pos >neg){
  			positive.push(title);
  			console.log("new entry added to positive results");
  		}

  		else if(pos < neg){
  			negative.push(title);
  			console.log("new entry added to negative results");
  		}
  		else{
  			neutral.push(title)
  			console.log('new entry add to neutral list');
  		}
      }
 
  });
  		    console.log(colors.red("positive: "+positive.length)+colors.blue(" negative: "+negative.length)+colors.yellow(" neutral: "+neutral.length));
  		  	io.sockets.emit("results",positive, negative, neutral);
  		  	positive = [];
			negative =[];
			neutral=[];


}

