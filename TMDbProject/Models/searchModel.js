'use strict'

const debugmodule = "search-model";
let debug = undefined;
let search_dto = undefined;

var obj = { };

obj.getSearchByMovieName = function(movieName, cb){
    cb(undefined, undefined); // MOCK 
    /*
    searchDto.findByMovieName(movieName, processMovie);
    function processMovie(err, data){
        if (err){
            debug(debugmodule, 'Error ' + err.number + ': ' + err.message);
            cb(err, undefined);
        } else {
            debug(debugmodule, data);
            cb(undefined, data);
        }                
    }
    */
}

obj.addMovieDetail = function(movieId, movieName, movieOverview, moviePosterPath, cb){
    search_dto.addMovieDetail(movieId, movieName, movieOverview, moviePosterPath, (err,data)=>{
        cb(err, data);
    });
}

obj.addMovieSearch = function(searchName, resultsNumber, results, cb){
    search_dto.addMovieSearch(searchName, resultsNumber, results, (err,data)=>{
        cb(err, data);
    });
}

module.exports = function (d, dto) {
    // Validate model
    debug = d;
    search_dto = dto;
    return obj;
}