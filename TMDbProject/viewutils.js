'use strict';
let utilfs = undefined;
let handlebars = undefined;

var obj = { };

obj.getHtmlFromTemplate = function(templateFile, data, cb){
    utilfs.readFile(templateFile, 'utf-8', function(err, source){
        if(err){
            cb(err, undefined);
        }
        else{
            var template = handlebars.compile(source);
            var html = template(data);
            cb(null, html);
        }
    });
}

module.exports = function (ifs,  ihandlebars){
    utilfs = ifs;
    handlebars = ihandlebars;
    return obj;
}