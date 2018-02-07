'use strict'

/**
 * Array of User objects
 */
/*
const dbHost ='http://127.0.0.1:5984/';
const dbUsers = dbHost+'tmdbproject_users';
const dbComments = dbHost+'tmdbproject_comments';*/
const dbHost = process.env.dbHost || 'http://127.0.0.1:5984/';
const dbUsers = process.env.dbUsers || 'tmdbprojectusers';
const dbComments =  process.env.dbComments || 'tmdbproject_comments';
const userDb = process.env.users || 'jcnasc.90';
const pass = process.env.dbPass || 'KqxxFWVxv4';
const request = require('request')
var CouchDB = {}


CouchDB.find = function (username, cb) {
    const path = dbHost+ dbUsers + '/' + username
    request(path, (err, res, body) => {
        if(err) return cb(err)
        cb(null, JSON.parse(body))
    })
}


/**
 * @param String username 
 * @param String passwd 
 * @param Function cb callback (err, user, info) => void. If user exists
 * but credentials fail then calls cb with undefined user and an info message.
 */
CouchDB.authenticate =function (username, passwd, cb) {
    const path = dbHost+ dbUsers + '/' + username;
    console.log('couchDb: '+path);
    const auth="Basic " + new Buffer(userDb + ":" + pass).toString("base64");

    const options = {
        headers : {
            "Authorization" : auth
        }
    }
   // authentication
   /* if (user && pass) {
        options.auth = user + ':' + pass
    } else if (user) {
        options.auth = user
    }*/
    console.log('user: '+user+' pass: '+pass);
    request(path, options,(err, res, body) => {
        console.log(err + 'user: '+body);
        if(err) return cb(err)
        if(res.statusCode != 200) return cb(null, null, `User ${username} does not exists`)
        console.log(err + 'user: '+user);
        const user = JSON.parse(body)
        if(passwd != user.password) return cb(null, null, 'Invalid password')
        cb(null, user)
    })
}

CouchDB.save = function(user, cb) {
    const path =dbHost+ dbUsers + '/' +  user.username;  
    console.log('couchDb: '+path);
    const auth="Basic " + new Buffer(userDb + ":" + pass).toString("base64");

    const options = {
        method: "PUT",
        'Content-Type': 'application/json',
        body:JSON.stringify(user),
        headers : {
            "Authorization" : auth
        }
    }
    _request(path,options,cb);
}

CouchDB.updateUserComments = function(user,params,cb){
    let query = params ? '?' + params : '';
    const path = dbHost+ dbUsers + '/' +  user.username + '/' + query;  
    const options = {
        method: "PUT",
        'Content-Type': 'application/json',
        body:JSON.stringify(user)
    }
    request(path,options, (err, res, body) => {
        if(err) return cb(err)
        cb()
    })
}

CouchDB.updateFavourites = function(user, params, cb){
    let query = params ? '?' + params : '';
    const path = dbHost+ dbUsers + '/' +  user.username + '/' + query;  
    const options = {
        method: "PUT",
        'Content-Type': 'application/json',
        body:JSON.stringify(user)
    }
    _request(path,options,cb);
}


CouchDB.addComments = function (comment,cb){
    const path = dbHost+ dbComments + '/' +  comment._id;  
    const options = {
        method: "PUT",
        'Content-Type': 'application/json',
        body:JSON.stringify(comment)
    }
    _request(path,options,cb);
}

CouchDB.updateComments = function(comment,cb){
    const path = dbHost+ dbComments + '/' +  comment._id;  
    const options = {
        method: "PUT",
        'Content-Type': 'application/json',
        body:JSON.stringify(comment)
    }
    _request(path,options,cb);
}

CouchDB.getCommentsById = function(comment,cb){
    const path = dbHost+dbComments + '/' +  comment;  
    const options = {
        method: "GET",
        'Content-Type': 'application/json',
      //  body:JSON.stringify(comment)
    }
    request(path, (err, res, body) => {
        if(err) return cb(err)
        cb(null, JSON.parse(body))
    })
}
CouchDB.getComments = function(movieId,cb){
    const path = dbHost+dbComments + '/_all_docs';
    request(path, (err, res, body) => {
        if(err) return cb(err)
        let bodyAux=JSON.parse(body);
        let allComments = bodyAux.rows;
        let commentsArr =[];
        /*allComments.foreach((elem)=>{
            let movieName = elem.id.split('_');
            if(movieName[0] === movieId){
                commentsArr.push(movieName);
            }
        })*/
        for(let i=0; i< allComments.length;i++){
            let movieName = allComments[i].id.split('_');
            if(movieName[0] === movieId){
                commentsArr.push(allComments[i].id);
                
            }
        }
        cb(null, commentsArr)
    })
}
function _request(path,options,cb){
    request(path,options, (err, res, body) => {
        if(err) return cb(err)
        console.log(err + ' bod: ' + body)
        cb()
    })
}
module.exports = CouchDB
