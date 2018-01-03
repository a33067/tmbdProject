'use strict'
let http = require("https");
const request = require('request');

const debugmodule = 'ApiServies';
let debug = undefined;

var obj = { };

obj.requestGetApi = function (url , callBack){
    request( 
        url,
        {json: true },
        (err, res, body) => {
            if (err) {
                callBack(err, undefined)
            } else {
                if(res.statusCode != 200){
                    callBack(new Error('API invalid response'), undefined);
                } else {
                    callBack(undefined, body);
                }
            }
        }
    );
}


// requestGet(
//   "http://api.themoviedb.org/3/movie/36326?language=pt-pt&api_key=63455146500b40d414bbca3a3f91c910",
//   getMovie);





module.exports = function (d) {
  // Validate model
  debug = d;
  return obj;
}


function errMM()
{
   this.existError ;
   this.statusCode ;
   this.statusMessage ;
   this.erroRequest ;
}