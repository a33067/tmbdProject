'use strict'

const debugmodule = "search-dto";
let debug = undefined;
let entities = undefined;
let cacheSearchMovie = undefined;

var obj = { };

obj.addMovieDetail = function (id, name, overview, poster_path, cb){
    let movie = new entities.searchMovieDetail(id, name, overview, poster_path);
    cb(undefined, movie);
}

obj.addMovieSearch = function(searchName, resultsNumber, results, cb){
    //searchMovie(searchName, resultsNumber, results)
    let movieSearch = new entities.searchMovie(searchName, resultsNumber, results);
    cacheSearchMovie.push(movieSearch);
    cb(undefined, movieSearch);
}

module.exports = function (d, e, repo) {
    // Validate model
    debug = d;
    entities = e;
    cacheSearchMovie = repo.cacheSearchMovie;
    return obj;
}
