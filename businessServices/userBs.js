'use strict'

const debugmodule = 'userBs';
let debug = undefined;

let userModel = undefined;
let couchDB = undefined;
let service = undefined;
let urls = undefined;
var obj = { };

obj.getUser = function (id,password,cb){
    couchDB.authenticate(id,password,cb);  
    
}
obj.findUser = function (id,cb){
    couchDB.find(id,cb);  
    
}

obj.createUser = function(user,cb){
    couchDB.save(user,cb);
}

obj.addFavourites = function(user,favourites,cb){
    let favouritesName = favourites.favouritListName;
    let exists = false;
    user.favourites.forEach((element) => {
        if(element.name === favouritesName){
            exists = true;
            element.movies.push(JSON.parse(favourites.favourites));
            couchDB.updateFavourites(user,user._rev,cb);  
        }
    });
    if(!exists){
        let json = '{"name":"'+ favouritesName +'", "movies":[' + favourites.favourites +']}';
        user.favourites.push(JSON.parse(json))
        couchDB.updateFavourites(user,user._rev,cb);
    }
}
obj.deleteFavourites =function(user,id,cb){
    let index = undefined;
    user.favourites.forEach((element) => {
        if(element.name === id){
            index = user.favourites.indexOf(element);  
        }
    });
    if(index == undefined){
        cb(new Error('Element Does not exist'),undefined);
    }else{
        user.favourites.splice(index, 1);
        couchDB.updateFavourites(user,user._rev,cb);
    }
}
obj.getFavouritesDetails = function(user,id,cb){
    let data =undefined;
    user.favourites.forEach((element) => {
        if(element.name === id){
            data = element;  
        }
    });
    cb(undefined,data);
}
obj.editFavourites = function(user,id,cb){
    let index = undefined;
    let notExists=true;
    user.favourites.forEach((element) => {
        element.movies.forEach((ele)=>{
            if(ele.id === id){
                index = element.movies.indexOf(ele);  
            }
            if(index !== undefined){
                element.movies.splice(index, 1);
                notExists=false;
                index=undefined;
            }
        });
    });
    if(notExists){
        cb(new Error('Element Does not exist'),undefined);
    }else{
        couchDB.updateFavourites(user,user._rev,cb);
    }
}

obj.editFavouritesNames = function(user,id,newId,cb){
    let index = undefined;
    user.favourites.forEach((element) => {
        if(element.name==id){
            element.name=newId;
        }
    });
    couchDB.updateFavourites(user,user._rev,cb);
    
}
obj.addComments = function(commentId,comment,req,cb){
    if(commentId ==0){
        couchDB.addComments(comment,(err)=>{
            if(err) return cb(err);
            let json = '{"commentId":"'+ comment._id +'","commentText":"'+comment.comment+'","movieId":"'+comment.movieId+'"}';
            let user = req.user;
            user.comments.push(JSON.parse(json));
            couchDB.updateUserComments(user,user._rev,cb);
        });
    }else{
        let json = '{"commentId":"'+ comment._id +'", "comment":"' + comment.comment +'","user":"'+ comment.userID+'"}';
        couchDB.getCommentsById(commentId,(err,comment)=>{
            if(err) return cb(err);
            comment.responseComments.push(JSON.parse(json))
            couchDB.updateComments(comment,(err)=>{
                if(err) return cb(err);
                let json = '{"commentId":"'+ comment._id +'","commentText":"'+comment.comment+'","movieId":"'+comment.movieId+'"}';
                let user = req.user;
                user.comments.push(JSON.parse(json));
                couchDB.updateUserComments(user,user._rev,cb);
            });
        })   
    }
}
obj.getComments = function(movieId,cb){
    couchDB.getComments(movieId,(err,body)=>{
        if(err) return cb(err)
        let arr = body;
        let comments=[];
        arr.forEach(ele=> {
            couchDB.getCommentsById(ele,(err,body2)=>{
                if(err) return cb(err)
                comments.push([body2._id,body2._rev,body2.comment,body2.movieId,body2.userID,body2.responseComments]);
            });
            cb(null,comments);
        });
    });
}

module.exports = function (d, uM , s , u,cb) {
    debug = d;
    userModel = uM;
    service = s;
    urls = u;
    couchDB = cb
    return obj;
}
