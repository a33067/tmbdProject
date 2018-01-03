'use strict'

const debugmodule = "actor-model";
let debug = undefined;
let actorsdto = undefined;

var obj = { };

obj.getActorById = function(id, cb){
    actorsdto.findActorById(id, processActors);
    function processActors(err, data){
        if (err){
            debug(debugmodule, 'Error ' + err.number + ': ' + err.message);
            cb(err, undefined);
        } else {
            debug(debugmodule, data);
            cb(undefined, data);
        }                
    }
}

obj.findActorsByMovie = function(movie, cb){
    actorsdto.findActorsByMovieId(movie.movieId, processActors);
    function processActors(err, data){
        if (err){
            debug(debugmodule, 'Error ' + err.number + ': ' + err.message);
            cb(err, undefined);
        } else {
            movie.actors=data
            debug(debugmodule, movie);
            cb(undefined, movie);
        }                
    }
}
obj.Addactor = function (id,name,popularity,biography,profile_path,cb){
    
    actorsdto.Addactor(id,name,popularity,biography,profile_path,(err,data)=>{
        cb(err,data)
    });
    
}



module.exports = function (d, dto) {
    // Validate model
    debug = d;
    actorsdto = dto;
    return obj;
}


