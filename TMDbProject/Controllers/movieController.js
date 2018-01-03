'use strict'

const debugmodule = "movie-controller";
let debug = undefined;
let movieBs = undefined;
let actorModel = undefined;
let viewutils = undefined;

var obj = { };

obj.movieController = function (req,res){
    let movieId = req.params.movie_id;
    debug(debugmodule, 'Movie to get: ' + movieId);
    movieBs.findMovieById(movieId, processMovie);
    
    function processMovie(err, data){
        if (err){
            debug(debugmodule, 'Error ' + err.number + ': ' + err.message);
            res.writeHead(500, {"Content-type": "text/html; charset=utf-8"});
            res.write('Internal server error');
            res.end();
        } else {
            res.render('moviesDetails', data);
        }                
    }
}

module.exports = function (d, m) {
    // Validate model
    debug = d;
    movieBs = m;
    return obj;
}