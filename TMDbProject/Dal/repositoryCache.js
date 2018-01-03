'use strict'
const debugmodule = 'repositoryCache';
let debug = undefined;
var obj = { };

obj.cacheMovies = [];
obj.cacheMoviesAndActor = [];
obj.cacheMoviesAndDirectors = [];
obj.cachePerson = [];
obj.cacheUser = [];
obj.cacheFavourites = [];
obj.cacheSearchMovie = [];




module.exports = function (d) {
    // Validate model
    debug = d;
    return obj;
}

