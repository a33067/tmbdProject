'use strict'
const debugmodule = 'user-dto';
let debug = undefined;
let cacheUser = undefined;
let cacheFavourites = undefined;
let entities = undefined;

var obj = { };


obj.getUser = function(id,cb){
    let existInCache =  cacheUser.find((element) => element.userId == id)   
    if(existInCache==undefined){
        cb(undefined, undefined);
    }else{
        cb(undefined, existInCache);
    }
}
/*obj.getFavourites = function(id,cb){
    let existInCache =  cacheFavourites.find((element) => element.id == id)   
    if(existInCache==undefined){
        cb(undefined, undefined);
    }else{
        cb(undefined, existInCache);
    }
}*/
module.exports = function (d,e ,repo) {
    // Validate model
    debug = d;
    entities = e;
    cacheUser = repo.cacheUser;
    cacheFavourites = repo.cacheFavourites;
    return obj;
}


