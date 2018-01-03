'use strict'

const debugmodule = 'search-Bs';
let debug = undefined;

let searchModel = undefined;
let service = undefined;
let urls = undefined;
var obj = { };

obj.findMovieByName = function (name, cb){
    let moviesArray = [],
        pagesGetted = 0,
        pagesToGet  = 0,
        urlSearch   = '',
        chunkMovieDetail = 0;
    searchModel.getSearchByMovieName(name, verifyMovieExist);

    function verifyMovieExist(err, existInCache){
        debug(debugmodule, existInCache);
        if (!existInCache) {
            urlSearch = urls.SEARCH_MOVIES_BY_NAME(name);
            service.requestGetApi(urls.SEARCH_MOVIES_BY_NAME(urlSearch, 1), requestSearchChunks);
        } else {
            cb(undefined, { "results": existInCache } );
        }
    }
    
    function requestSearchChunks(err, data){
        if (err) {
            verifyMovieExist(err, undefined);
        } else {
            if (data) {
                pagesToGet = data.total_pages;
                proccessSearchChunk(undefined, data);
                for(let i=2; i<=pagesToGet; i++){
                    urlSearch = urls.SEARCH_MOVIES_BY_NAME(name);
                    service.requestGetApi(urls.SEARCH_MOVIES_BY_NAME(urlSearch, i), proccessSearchChunk);
                }
            } else {
                verifySearchResults(new Error("invalid data from API"), undefined);
            }
        }
    }

    function proccessSearchChunk(err, data){
        pagesGetted++;
        if (err) {
            verifySearchResults(err, undefined);
        } else {
            if (data) {
                moviesArray = moviesArray.concat(data.results);
                data.results = [];
                console.log(data);

                if (pagesGetted===pagesToGet) {
                    verifySearchResults(undefined, moviesArray);
                }
            } else {
                verifySearchResults(new Error("empty data from API"), undefined);
            }
        }
    }

    function verifySearchResults(err, data) {
        if (err) {
            cb(err, undefined);
        } else {
            let res_movies = [];
            
            data.forEach(function(element) {
                searchModel.addMovieDetail(element.id, element.title, element.overview, element.poster_path, checkMovieDetail);
            });
            function checkMovieDetail(err, dataCheck){
                if (!err) {
                    res_movies.push(dataCheck);
                }
                chunkMovieDetail++;
                if (chunkMovieDetail == data.length) {
                    verifySearchProcessed(undefined, res_movies);
                }
            }
        }
    }

    function verifySearchProcessed(err, dataMovies){
        dataMovies.sort();
        searchModel.addMovieSearch(name, dataMovies.length, dataMovies, (err, data)=>{
            if (err) {
                cb(err, undefined);
            } else {
                cb(undefined, data);
            }
        });
    }

    function getServiceMovieToApi(err, json){
        let convertJSon =undefined
        if (json!=null) {
            let newList = []
            let sizeResult =json.results.length
            let countResults = 0
            json.results.forEach(function(item){
                movieModel.Add(item.id,item.original_title,item.overview,item.poster_path,(err,dataMovieModel)=>{
                    if (dataMovieModel == undefined) {
                        cb(new Error('Error creating data'), undefined);
                    } else {
                        newList.push(dataMovieModel)
                        countResults++;
                        if (countResults==json.results.length)
                            cb(undefined, { "results":newList})
                    }
                })
            })
        }          
    }
}

module.exports = function (d, m, s , u) {
    debug = d;
    searchModel = m;
    service = s;
    urls = u
    return obj;
}
