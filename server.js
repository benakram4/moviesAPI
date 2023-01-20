
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

//start the server
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(HTTP_PORT, () => {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err) => {
    console.log(err);
});

//Home route
app.get('/', function (req, res) {
    res.json({ message: "API Listening" });
});

//POST - C - Add a new movie
app.post("/api/movies", (req, res) => {
    //get the movie object
    let movie = req.body;
    //call addMovie()
    db.addMovie(movie)
    .then((data) => {
        //return new movie object
        res.status(201).json(data);
    }).catch((err) => {
        //return the error message
        res.status(500).json({ message: `Error - 500: ${err} ` });
    });
});

//GET - R - Get all movies
app.get("/api/movies", (req, res) => {
    //get the page and perPage query parameters from the request
    let page = req.query.page ? req.query.page : 0;
    let perPage = req.query.perPage ? req.query.perPage : 0;
    let title = req.query.title; // optional parameter
    //call the getAllMovies()
    db.getAllMovies(page, perPage, title)
    .then((data) => {
        //return the array of movies
        data ? res.status(200).json(data) : res.status(404).json({ message: "Resource not found - 404" });
    }).catch((err) => {
        //return the error message
        res.status(500).json({ message: `No movies found - Error - 500: ${err} ` });
    });
});

//GET - R - Get one movie by id
app.get("/api/movies/:id", (req, res) => {
    //get the id parameter
    let id = req.params.id;
    //call getMovieById()
    db.getMovieById(id)
    .then((data) => {
        //return the movie object
        data ? res.status(200).json(data) : res.status(404).json({ message: "Resource not found - 404" });
    }).catch((err) => {
        //return the error message
        res.status(500).json({message: `Resource not found - Error - 500: ${err}`});
    });
});

//PUT - U - Update a movie by id
app.put("/api/movies/:id", (req, res) => {
    //get the id parameter
    let id = req.params.id;
    //get the movie object
    let movie = req.body;
    //call the updateMovieById() 
    db.updateMovieById(movie, id)
    .then((data) => {
        //return the updated movie object
        data ? res.status(200).json(data) : res.status(404).json({ message: "Resource not found - 404" });
    }).catch((err) => {
        //return the error message
        res.status(400).json({message: `No Match - Error - 400: ${err}`});
    });
});

//DELETE - D - Delete a movie by id
app.delete("/api/movies/:id", (req, res) => {
    //get the id parameter
    let id = req.params.id;
    //call deleteMovieById()
    db.deleteMovieById(id)
    .then((data) => {
        //return the deleted movie object
        data ? res.status(204).end() : res.status(404).json({ message: "Resource not found - 404" });
    }).catch((err) => {
        //return the error message
        res.status(500).json({ message: `Resource not found - Error - 500: ${err}`});
    });
});

app.use((req, res) => {
    res.status(404).send(`<h1>Page Not Found - 404</h1>`);
});





