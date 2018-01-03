"use strict"

const req = require("./fileRequest")
const movies = require('./../server')(req)



module.exports.testGetMovies = function(test) {
    movies.findMovieById(36326,(err, data) => {
        if(err) return failure(err, test);
        test.equal(data.movieName, 'O Ninja das Caldas');
        test.equal(data.overview, 'He just wanted to be happy but they don\'t let him go in peace...')
        test.done()
    })
}

module.exports.testGetActor = function(test) {
    football.getActorsById(115286, (err, data) => {
        if(err) return failure(err, test)
        test.equal(data.actorName, 'Ricardo Guerreiro')
        test.done()
    })
}

module.exports.testSearchMovies = function(test) {
    football.getSearchMovieByName('Ninja', (err, data) => {
        if(err) return failure(err, test);
        test.equal(data[0].movieId, '25602');
        test.equal(data[0].movieName, 'Ninja')
        test.done()
    })
}


function failure(err, test) {
    console.log(err.message)
    test.ok(false)
    test.done()
}