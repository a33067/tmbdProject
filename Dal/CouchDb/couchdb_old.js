const http = require('http')
const https = require('https')
const querystring = require('querystring')

let defaults = {
    hostname: process.env.DBHOST || 'localhost',
    port:     process.env.DBPORT || 5984,
    dbName:   process.env.DBNAME || 'tmdbproject',
    protocol: process.env.DBPROTOCOL || 'http',
    user:     process.env.DBUSER || 'tmbdProject',
    pass:     process.env.DBPASS || 'tmbdProject'
}

/**
 * Aceder ao couchDB utils
 * http://127.0.0.1:5984/_utils/
 */
module.exports = DatabaseAccess

function DatabaseAccess(options){

    let option = options || defaults

    this.getDB = function(cb){
        request( { method: 'GET' }, cb)
    }

    this.createDB = function(cb){
        request( { method: 'PUT' }, cb)
    }

    this.getAllDocs = function(limit, offset, cb){
        request( { path: '/_all_docs/' }, cb)
    }

    this.getDocById = function(id, cb){
        request( { path: `/${id}/` }, cb)
    }

    this.queryView = function(viewId, filter, pagination, getDocs, cb) {
        let params
        if (pagination) {
            params = params || {}
            params.limit = pagination.limit || 0
            params.skip = pagination.offset || 0
        }
        if (filter) {
            if(filter.startKey && filter.endKey) {
                params = params || {}
                params.startKey = JSON.stringify(filter.startKey)
                params.endKey = JSON.stringify(filter.endKey)
            } else {
                params = params || {}
                params.key = JSON.stringify(filter)
            }
        }
        if (getDocs === true) {
            params = params || {}
            params.include_docs = getDocs
        }

        request( {
            path: `/_design/application/_view/${viewId}`,
            params: params
        }, cb)
    }

    this.insertDoc = function(document, cb){
        request( { method: 'POST', headers: { 'Content-Type': 'application/json' }, doc: document }, cb)
    }

    this.updateDoc = function(id, document, cb){
        request( { path: `/${id}/`, method: 'PUT', headers: { 'Content-Type': 'application/json'}, doc: document }, cb)
    }

    this.removeDoc = function(id, rev, cb) {
        request({ path: `/${id}/`, params: { rev: rev }, method: 'DELETE', headers: { 'Content-Type': 'application/json'} }, cb)
    }

    this.postBulkDocs = function(docs, cb) {
        this._request( { path: `/_bulk_docs/`, 
            method: 'POST', headers: { 'Content-Type': 'application/json'},
            doc: {
                docs: docs
            }
        },
            cb)
    }

    function request(options, cb){
        let {path, params, method, headers, doc} = options

        let query = params ? '?' + querystring.stringify(params) : ''
        path = path || ''

        let opt = {
            hostname: option.hostname,
            port: option.port,
            path: '/' + encodeURI(option.dbName + path) + query,
            method: method || 'GET',
            headers: headers || ''
        }
        // authentication
        if (option.user && option.pass) {
            opt.auth = option.user + ':' + option.pass
        } else if (option.user) {
            opt.auth = option.user
        }

        let _http = option.protocol === 'https' ? https : http
        const req = _http.request(opt, (httpResponse) => {
            let jsonString = ''
            httpResponse.on('data', (chunk) => jsonString += chunk)
            httpResponse.on('end', () => {
                if (httpResponse.statusCode !== 200) {
                    cb(`Error: ${httpResponse.statusCode} - ${httpResponse.statusMessage}`, httpResponse)
                    return
                }
                let json = JSON.parse(jsonString)
                cb(undefined, json)
            })
            httpResponse.on('error', (error) => {
                cb(error, null)
            })
        })
        if(doc) req.write(JSON.stringify(doc))
        req.end()
    }
}