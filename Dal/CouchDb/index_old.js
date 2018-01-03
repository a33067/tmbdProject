'use strict'

const { Key, User} = require('../../models/entities')

const DatabaseAccess = require('./couchdb')
const db = new DatabaseAccess()

module.exports = CouchDB

function CouchDB(){
     /**
     * Init Couch METHOD
     */
    this.init = function(callback){
        // check if database exists
        //log('Initializating database')
        db.getDB((error, data, httpResponse) => {
            if (httpResponse.statusCode !== 200) {
                // database doesn't exist. create it
                //log('Database doesn\'t exist - Creating it')
                db.createDB((err, data, httpResponse) => {
                    if (err) {
                        console.error(`Error creating database -> ${error}`);
                        callback(error);
                    }
                    
                    if (httpResponse.statusCode === 200 || httpResponse.statusCode === 201) {
                        //log('Created database')
                        initViews(callback);
                    } else {
                        let errormsg = 'Unable to create database';
                        console.error(errormsg);
                        console.error(JSON.stringify(data));
                        callback(new Error(errormsg));
                    }
                })
            } else {
                //log('Database already existed')
                initViews(callback);
            }
        })

        function initViews(callback) {
            //log('Initializating database views')
            db.getDocById('/_design/application/', (error, data, httpResponse) => {

                if (httpResponse.statusCode >= 400) {
                    data = null;
                }

                let viewsDesignDoc = data || { };
                
                /* global emit */ // --> suppress warning for 'emit' method (it exists in couchdb)
                const _views = {}
                _views[dbviews.COMMENTS] = {
                    'map': function(doc) {
                        if (doc.type === 'comment') {
                            emit(doc._id, { _id: doc._id })
                        }
                    }.toString()
                }
                viewsDesignDoc._id = viewsDesignDoc._id || '_design/application';
                viewsDesignDoc.language = 'javascript';
                viewsDesignDoc.views = _views;
                
                // create views inside a design document named 'application', with all views
                db.updateDoc('/_design/application/', viewsDesignDoc, (error) => {
                    if (error) {
                        console.error(`Error occurred on creating playlist views -> ${error}`);
                        callback(error);
                    } else {
                        //log('Created database views')
                        callback();
                    }
                });
            });
        }
    }

     /**
     * USER METHODS
     */
    this.getUser = function(key, callback) {
        _get(key, mapUser, callback);
    }

    this.createUser = function(user, callback) {
        _create(user, callback);
    }

    this.updateUser = function(user, callback){
        _update(user._id, user, callback);
    }

    /**
     * PRIVATE METHODS
     */ 

    function _get(key, mapper, cb){
        db.getDocById(key, (error, data, httpResponse) => {
            if (error) {
                return cb(error,undefined);
            }
            return cb(undefined, httpResponse)
        })
    }

    function _create(doc, cb) {
        // insert doc in couchdb
        db.insertDoc(doc, (error, data, httpResponse) => {
            // validate response from couchdb
            error = error || utils.checkError(httpResponse, data)
            if (error) {
                return callback(error);
            }
            // read data id and rev (update key)
            if (data.ok) {
                doc.key = doc.key || new Key();
                doc.key.id = data.id;
                doc.key.rev = data.rev;
            }

            // ok response
            return callback(undefined, doc);
        })
    }

    function _queryView(view, filter, pagination, mapfn, callback) {
        db.queryView(view, filter, pagination, !!mapfn, (error, data, httpResponse) => {
            if (error) {
                return callback(error);
            }

            // ok response
            let results = []
            if (mapfn) {
                // if map function defined, docs were retrieved
                data.rows.forEach((elem) => results.push( mapfn(elem.doc)) )
            } else {
                // if no map function, only keys were retrieved
                data.rows.foreach((elem) => elem && elem.value && results.push(new Key(elem.value._id)))
            }
            
            return callback(null, results)
        })
    }

    function _update(id, entity, callback){
        db.updateDoc(id, entity, callback)
    }

}

function mapUser(doc) {
    return doc && new User(doc._id, 
        doc._rev,
        doc.username,
        doc.password,
        doc.email,
        doc.favourites)
}


