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
const dbComments =  process.env.dbComments || 'tmdbprojectcomments';
const userDb = process.env.userDb || 'jcnasc.90';
const pass = process.env.dbPass || 'KqxxFWVxv4';

const userDb2 = process.env.userDb2 || 'fcoracaonas';
const pass2 = process.env.dbPass2 || 'aWLf9qnYji';

const request = require('request')
var CouchDB = {}


CouchDB.find = function (username, cb) {
    const path = dbHost+ dbUsers + '/' + username
    const auth="Basic " + new Buffer(userDb + ":" + pass).toString("base64");
    console.log('couchDb find: '+path);
    
    const options = {
        headers : {
            "Authorization" : auth
        }
    }
    request(path,options, (err, res, body) => {
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
    console.log('couchDb authenticate: '+path);
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
    
    request(path, options,(err, res, body) => {
       
        if(err) return cb(err)
        if(res.statusCode != 200) return cb(null, null, `User ${username} does not exists`)
        console.log(err + 'user: '+body);
        const user = JSON.parse(body)
        if(passwd != user.password) return cb(null, null, 'Invalid password')
        cb(null, user)
    })
}

CouchDB.save = function(user, cb) {
    const path =dbHost+ dbUsers + '/' +  user.username;  
    console.log('couchDb save: '+path);
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
    const auth="Basic " + new Buffer(userDb + ":" + pass).toString("base64");
    console.log('couchDb updateUserComments: '+path);
    
    const options = {
        method: "PUT",
        'Content-Type': 'application/json',
        body:JSON.stringify(user),
        headers : {
            "Authorization" : auth
        }
    }
    request(path,options, (err, res, body) => {
        if(err) return cb(err)
        cb()
    })
}

CouchDB.updateFavourites = function(user, params, cb){
    let query = params ? '?' + params : '';
    const path = dbHost+ dbUsers + '/' +  user.username + '/' + query;  
    const auth="Basic " + new Buffer(userDb + ":" + pass).toString("base64");
    console.log('couchDb updateFavourites: '+path);
    
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


CouchDB.addComments = function (comment,cb){
    const path = dbHost+ dbComments + '/' +  comment._id;  
    const auth="Basic " + new Buffer(userDb2 + ":" + pass2).toString("base64");
    console.log('couchDb addComments: '+path);
    
    const options = {
        method: "PUT",
        'Content-Type': 'application/json',
        body:JSON.stringify(comment),
        headers : {
            "Authorization" : auth
        }
    }
    _request(path,options,cb);
}

CouchDB.updateComments = function(comment,cb){
    const path = dbHost+ dbComments + '/' +  comment._id;  
    const auth="Basic " + new Buffer(userDb2 + ":" + pass2).toString("base64");
    console.log('couchDb updateComments: '+path);
    
    const options = {
        method: "PUT",
        'Content-Type': 'application/json',
        body:JSON.stringify(comment),
        headers : {
            "Authorization" : auth
        }
    }
    _request(path,options,cb);
}

CouchDB.getCommentsById = function(comment,cb){
    const path = dbHost+dbComments + '/' +  comment;  
    const auth="Basic " + new Buffer(userDb2 + ":" + pass2).toString("base64");
    console.log('couchDb getCommentsById: '+path);
    
    const options = {
        method: "GET",
        'Content-Type': 'application/json',
        headers : {
            "Authorization" : auth
        }
      //  body:JSON.stringify(comment)
    }
    request(path, (err, res, body) => {
        if(err) return cb(err)
        cb(null, JSON.parse(body))
    })
}
CouchDB.getComments = function(movieId,cb){
    const path = dbHost+dbComments + '/_all_docs';
    const auth="Basic " + new Buffer(userDb2 + ":" + pass2).toString("base64");
    console.log('couchDb getComments: '+path);
    
    const options = {
        headers : {
            "Authorization" : auth
       }
      //  body:JSON.stringify(comment)
    }
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
