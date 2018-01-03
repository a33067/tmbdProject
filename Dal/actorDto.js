'use strict'
const debugmodule = 'actor-dto';
let debug = undefined;
let cacheMoviesAndActor = undefined;
let cacheMoviesAndDirectors = undefined;

let cachePerson = undefined;
let entities = undefined;

var obj = { };




obj.findActorsByMovieId = function (id, cb){
    let listNew =[]
    let listCacheMovies =  cacheMoviesAndActor.filter((element) => element.FkmovieId === id) 


    if(listCacheMovies==undefined){
        cb(undefined, undefined);
    }else{
        listCacheMovies.forEach(function(item){
            let ppl =  cachePerson.find((element) => element.actorId == item.FkactorId);
            if(listCacheMovies==undefined)
                cb(undefined, undefined);
            let newPll =  new entities.actor(ppl.actorName,ppl.actorId,ppl.popularity,ppl.biography)
            newPll.characters= item.characters
            listNew.push(newPll);
        })
        cb(undefined, listNew);
    }
}



obj.findActorById = function (id, cb){
    let existInCache =  cachePerson.find((element) => element.actorId == id)   
    if(existInCache==undefined){
        cb(undefined, undefined);
    }else{
        cb(undefined, existInCache);
    }
}

obj.Addactor = function (id,name,popularity,biography,profile_path,cb){
    let actor = new entities.actor(name,id,popularity,biography,profile_path);
    cachePerson.push(actor);
    cb(undefined, actor);
}


module.exports = function (d,e ,repo) {
    // Validate model
    debug = d;
    entities = e 
    cacheMoviesAndActor = repo.cacheMoviesAndActor
    cachePerson = repo.cachePerson
    cacheMoviesAndDirectors = repo.cacheMoviesAndDirectors
    return obj;
}


