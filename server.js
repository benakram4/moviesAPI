
var express = require('express');
var app = express();
app.use(express.json());

//require cors module
var cors = require('cors');
//use cors middleware
app.use(cors());

//require dotenv module
var dotenv = require('dotenv').config();
//use dotenv middleware
app.use(dotenv());


var HTTP_PORT = process.env.PORT || 8080;

onHttpStart = () => {
    console.log("Express http server listening on: " + HTTP_PORT);
}

//create a route for the app to get index.html
app.get('/', function(req, res) {
    //res.sendFile(__dirname + '/index.html');

    //return the following object (JSON): {message: "API Listening"}. 
    res.json({message: "API Listening"});
});

//start the server
app.listen(HTTP_PORT, onHttpStart);



