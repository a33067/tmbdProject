'use strict'

const debugmodule = "search-controller";
let debug = undefined;
let SearchBs = undefined;
let viewutils = undefined;

var obj = { };

obj.searchController = function (req,res){
    debug(debugmodule, 'Movie to get: ' + req.query.name);
    if(req.query.name != undefined){
        SearchBs.findMovieByName(req.query.name, processSearch);
    }else{
        processSearch(true,undefined)
    }
    
    function processSearch(err, data){
        if (err){
            debug(debugmodule, 'Error ' + err.number + ': ' + err.message);
            res.writeHead(501, { 'Content-Type': 'text/plain' });
            res.write('Internal server error');
            res.end();
        } else {
            //console.log(JSON.stringify(data));
            res.render('searchMovies', data);
        }                
    }
}


module.exports = function (d, m) {
    // Validate model
    debug = d;
    SearchBs = m;
    return obj;
}