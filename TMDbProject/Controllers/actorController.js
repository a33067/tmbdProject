'use strict'

const debugmodule = "actor-controller";
let debug = undefined;
let actorBs = undefined;
let viewutils = undefined;

var obj = { };

obj.actorController = function (req,res){
    let actorId = req.params.actor_id;
    debug(debugmodule, 'Actor to get: ' + actorId);
    if(actorId != undefined){
        actorBs.getActorById(actorId, processSearch);
    }else{
        res.writeHead(401, { 'Content-Type': 'text/plain' });
        res.write('Bad Request');
        res.end();
    }
    
    function processSearch(err, data){
        if (err){
            debug(debugmodule, 'Error ' + err.number + ': ' + err.message);
            res.writeHead(501, { 'Content-Type': 'text/plain' });
            res.write('Internal server error');
            res.end();
        } else {
            res.render('actorsDetails', data);
        }
    }
}


module.exports = function (d, m) {
    // Validate model
    debug = d;
    actorBs = m;
    return obj;
}