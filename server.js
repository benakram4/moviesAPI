
var express = require('express');
var app = express();
app.use(express.json());

//require cors module
var cors = require('cors');
//use cors middleware
app.use(cors());

//require dotenv module
require('dotenv').config();

//require the moviesDB module
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();

var HTTP_PORT = process.env.PORT || 8080;

onHttpStart = () => {
    console.log("Express http server listening on: " + HTTP_PORT);
}

//create a route for the app to get index.html
app.get('/', function (req, res) {
    //res.sendFile(__dirname + '/index.html');

    //return the following object (JSON): {message: "API Listening"}. 
    res.json({ message: "API Listening" });
});

//POST /api/movies
app.post("/api/movies", (req, res) => {
    //get the movie object
    let movie = req.body;
    //call addMovie()
    db.addMovie(movie)
    .then((data) => {
        //return the newly created movie object
        res.json(data);
    }).catch((err) => {
        //return the error message
        res.status(201).json({ message: "Movie already exists - 201" });
    });
});

//GET /api/movies - get all movies
app.get("/api/movies", (req, res) => {
    //get the page and perPage query parameters from the request
    let page = req.query.page ? req.query.page : 0;
    let perPage = req.query.perPage ? req.query.perPage : 0;
    let title = req.query.title; // optional parameter
    //call the getAllMovies()
    db.getAllMovies(page, perPage, title)
    .then((data) => {
        //return the array of movies
        data ? res.json(data) : res.status(404).json({ message: "Resource not found - 404" });
    }).catch((err) => {
        //return the error message
        res.status(200).json({ message: `No movies found - error: ${err} - 200` });
    });
});

//GET /api/movies/:id - get a movie by id
app.get("/api/movies/:id", (req, res) => {
    //get the id parameter
    let id = req.params.id;
    //call the getMovieById()
    db.getMovieById(id)
    .then((data) => {
        //return the movie object
        data ? res.json(data) : res.status(404).json({ message: "Resource not found - 404" });
    }).catch((err) => {
        //return the error message
        res.status(500).json({message: "Server internal error - 500"});
    });
});

//PUT /api/movies/:id
app.put("/api/movies/:id", (req, res) => {
    //get the id parameter
    let id = req.params.id;
    //get the movie object
    let movie = req.body;
    //call the updateMovieById() 
    db.updateMovieById(movie, id)
    .then((data) => {
        //return the updated movie object
        data ? res.json(data) : res.status(404).json({ message: "Resource not found - 404" });
    }).catch((err) => {
        //return the error message
        res.status(400).json({message: "No Match - 400"});
    });
});

//DELETE /api/movies/:id
app.delete("/api/movies/:id", (req, res) => {
    //get the id parameter
    let id = req.params.id;
    //call the deleteMovieById()
    db.deleteMovieById(id)
    .then((data) => {
        //return the deleted movie object
        data ? res.json(data) : res.status(404).json({ message: "Resource not found - 404" });
    }).catch((err) => {
        //return the error message
        res.status(204).json({ message: "no content to delete - 204"});
    });
});

app.use((req, res) => {
    res.status(404).send("<h1>Page Not Found - 404</h1>");
});

//start the server
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});



