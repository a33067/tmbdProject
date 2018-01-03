'use strict'

const fs = require('fs')

module.exports = FileRequest

function FileRequest() {

    this.counter = 0

    this.getFile = function(uri, cb){
        const parts = uri.split('/')
        const endpoint = 
            parts[parts.length - 2].replace('[,=?&]', '-')
            + '-' 
            + parts[parts.length - 1].replace('[,=?&]', '-')
        const path = __dirname + '/' + endpoint + '.json'
        fs.readFile(path, (err, data) => {
            if(err) return cb(err)
            this.counter++
            cb(null, null,data.toString())
        })
    }

}
