'use strict'

const debugmodule = "movie-model";
let debug = undefined;
let movieDto = undefined;

var obj = { };

obj.getMovieByName = function(name, cb){
    movieDto.findMovieByName(name, processMovie);
    function processMovie(err, data){
        if (err){
            debug(debugmodule, 'Error ' + err.number + ': ' + err.message);
            cb(err, undefined);
        } else {
            debug(debugmodule, data);
            cb(undefined, data);
        }                
    }
}

obj.getMovieById = function(movieID, cb){
    movieDto.findMovieById(movieID, processMovie);
    function processMovie(err, data){
        if (err) {
            debug(debugmodule, 'Error ' + err.number + ': ' + err.message);
            cb(err, undefined);
        } else {
            debug(debugmodule, data);
            cb(undefined, data);
        }                
    }
}

obj.Add = function (id,original_title,overview,poster_path,cb){
    movieDto.Add(id,original_title,overview,poster_path,(err,data)=>{
        cb(err,data)
    });
    
}

module.exports = function (d, dto) {
    // Validate model
    debug = d;
    movieDto = dto;
    return obj;
}