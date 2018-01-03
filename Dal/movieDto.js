'use strict'

const debugmodule = 'movie-dto';
let debug = undefined;
let cacheMovies = undefined;
let entities = undefined;

var obj = { };

obj.findMovieByName = function (name, cb){
    let existInCache =  cacheMovies.find((element) => element.movieName == name)
    debug(debugmodule, existInCache);
    if(existInCache==undefined){
        cb(undefined, undefined);
    }else{
        cb(undefined, existInCache);
    }
}

obj.findMovieById = function (id, cb){
    let existInCache =  cacheMovies.find((element) => element.movieId == id)
    debug(debugmodule, existInCache);
    if(existInCache==undefined){
        cb(undefined, undefined);
    }else{
        cb(undefined, existInCache);
    }
}

obj.Add = function (id,original_title,overview,poster_path,cb){
    let movie = new entities.movie(id,original_title,overview,poster_path, [], []);
    cacheMovies.push(movie);
    cb(undefined, movie);
}

module.exports = function (d,e ,repo) {
    // Validate model
    debug = d;
    entities = e 
    cacheMovies = repo.cacheMovies
    return obj;
}
