'use strict'

const debugmodule = 'movieBs';
let debug       = undefined,
    entities    = undefined,
    actorBs     = undefined,
    movieModel  = undefined,
    service     = undefined,
    urls        = undefined;
var obj = { };

obj.findMovieById = function (id, cb){

    movieModel.getMovieById(id, verifyMovieExist);

    function verifyMovieExist(err, existInCache){
        if(existInCache==undefined){
            service.requestGetApi(urls.SEARCH_DETAILS_MOVIES(id), getServiceMovieToApi);
        }else{
            cb(undefined, existInCache);
        }
    }
    
    function getServiceMovieToApi(err, json){
        let movieObj        = undefined,
            movieActors     = false,
            movieDirectors  = false;
        if (!json) {
            cb(new Error('Can´t get data on ' + debugmodule), undefined);
            return ;
        }
        movieModel.Add(json.id,json.title,json.overview,json.poster_path, (err, dataMovieModel)=>{
            if (!dataMovieModel) {
                cb(new Error('Error creating data'), undefined);
                return;
            }
            movieObj = dataMovieModel;
            getMoviePersons();
        });
        
        function getMoviePersons() {
            let castCount = 0,
                castTotal = 0,
                crewCount = 0,
                crewTotal = 0;
            service.requestGetApi(urls.SEARCH_DETAILS_MOVIES_CREDITS(movieObj.movieId), (err, movieData)=>{
                if (err) { // can't get API Data
                    movieActors = true;
                    movieDirectors = true;
                    syncAndReturn();
                } else {
                    castTotal = movieData.cast.length;
                    movieData.cast.forEach(function(item){
                        dispatchMovieActors(undefined, new entities.movieActor(movieObj.movieId, item.id, item.name, item.character));
                    });

                    if (!movieData.crew) {
                        movieDirectors = true;
                        syncAndReturn();
                    } else {
                        let directorsFind =  movieData.crew.filter((element) => element.job === 'Director');
                        crewTotal = directorsFind.length;
                        directorsFind.forEach(function(item){
                            dispatchMovieDirectors(undefined, new entities.movieDirector(movieObj.movieId, item.id, item.name));
                        });
                    }
                }
            });

            function dispatchMovieActors(err, movieActor){
                castCount++;
                if (!err) {
                    movieObj.actors.push(movieActor);
                }
                if (castCount == castTotal){
                    movieActors = true;
                    syncAndReturn();
                }
            }

            function dispatchMovieDirectors(err, movieDirector){
                crewCount++;
                if (!err) {
                    movieObj.directors.push(movieDirector);
                }
                if (crewCount == crewTotal){
                    movieDirectors = true;
                    syncAndReturn();
                }
            }
        }

        function syncAndReturn() {
            if (movieActors && movieDirectors) {
                cb(undefined, movieObj);
            }
        }
    }
}

module.exports = function (d, e, aBS, mM, s , u) {
    debug = d;
    entities = e;
    actorBs = aBS;
    movieModel = mM;
    service = s;
    urls = u
    return obj;
}
