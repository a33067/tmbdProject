'use strict'

const debugmodule = 'ActorBs';
let debug       = undefined,
    actorModel  = undefined,
    service     = undefined,
    urls        = undefined;
var obj = { };

obj.getActorById = function (id, cb){

    actorModel.getActorById(id, verifyActorExist);
    
    let actorSync   = 0,
        actorFile   = undefined,
        actorMovies = undefined;

    function verifyActorExist(err, existInCache){
        if(existInCache==undefined){
            //get API
            service.requestGetApi(urls.GET_PERSON_DETAILS(id), processActor);
            service.requestGetApi(urls.GET_PERSON_MOVIE_CREDITS(id), processActorMovies);
        }else{
            cb(undefined, existInCache);
        }
    }

    function processActor(err, data){
        actorSync++;
        if (err) {
            cb (new Error ('cant get data from API'), undefined);
        } else {
            actorModel.Addactor(data.id,data.name,data.popularity,data.biography,data.profile_path, (err, item)=>{
                if(err){
                    cb(err, undefined);
                } else {
                    actorFile = item;
                    finishWork();
                }
            });
        }
    }
    function processActorMovies(err, data){
        actorSync++;
        if (err) {
            cb (new Error ('cant get data from API'), undefined);
        } else {
            actorMovies = data.cast;
            finishWork();
        }
    }    

    function finishWork(){
        //if(actorSync==2 && actorFile && actorMovies){
        if (actorSync==2) {
            if (actorFile) {
                actorFile.characters = actorMovies;
                cb(undefined, actorFile);
            } else {
                cb (new Error ('cant get data'), undefined);
            }
        }
    }
}

module.exports = function (d, aM , s , u) {
    debug = d;
    actorModel = aM;
    service = s;
    urls = u
    return obj;
}
