'use strict'

const debugmodule = "user-model";
let debug = undefined;
let userdto = undefined;

var obj = { };
/*
obj.getUser = function(id,cb){
    userdto.getUser(id,processUsers);
    function processUsers(err,data){
        if(err){
            debug(debugmodule, 'Error ' + err.number + ': ' + err.message);
            cb(err, undefined);
        }else{
            cb(undefined,data);
        }
    }
}
obj.createUser = function(user,cb){
    userdto.
}*/
module.exports = function (d, dto) {
    // Validate model
    debug = d;
    userdto = dto;
    return obj;
}

