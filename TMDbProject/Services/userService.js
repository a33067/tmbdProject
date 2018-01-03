
'use strict'

//const fs = require('fs')
const httpReq = require('request')
/**
 * Array of User objects
 */

const FILM_DB = 'http://127.0.0.1:5984/tmdbproject/'
module.exports = {
    'find': find,
    'authenticate': authenticate,
    'save': save
}

function find(username, cb) {
    const path = FILM_DB + username
    httpReq(path, (err, resp, body) => {
        if(err) return cb(err)
        if(resp.statusCode != 200) return cb(err, null)
        cb(null, JSON.parse(body))
    })
}

function authenticate(username, passwd, cb) {
    find(username,(err, user) => {
        if(err) cb(err)
        if(!user) return cb(null, null, 'User does not exists')
        if(passwd != user.password) return cb(null, null, 'Invalid password')
        cb(null, user)
    })
}

function save(username,fullname,password, cb) {
    httpReq(
        { method: 'PUT'
        , uri: FILM_DB + username
        , multipart:
        [ { 
            'content-type': 'application/json'
            ,  body: JSON.stringify({username: username,name:fullname,password:password })
        }]
        } , function (error, response, body) {
        if(response.statusCode == 201){
            return cb(null,'SignUp OK')
        } else {
            return cb(null,null,'error: '+ response.statusCode + body)
        }
    })
}