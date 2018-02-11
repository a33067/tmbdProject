'use strict'

const debugmodule = "user-controller";
let debug = undefined;
let viewutils = undefined;
let userBs = undefined;
let entities = undefined;
var obj = { };

obj.getHomePage = function(req,res){
    res.render ('home');
}

obj.getSignIn = function(req,res,next){
    let userId = req.body.username
    let password = req.body.password
    userBs.getUser(userId,password, (err, data)=>{
        if(err) next(err)
        next(null,data)
    })
    
}
obj.find = function(username,next){
    userBs.findUser(username, (err, data)=>{
        if(err) next(err)
        next(null,data)
    })
    
}
obj.getUserHomepage = function(req,res){
    console.log('getUSerHomePage: ' + req.user);
    res.render('userHomePage',req);
}

obj.getSignUp = function(req,res,next){
    let user = new entities.user(req.body.username,
        undefined,
        req.body.username,
        req.body.password,
        req.body.email,
        [],[])
        userBs.createUser(user, (err,body)=>{
            if(err) next(err)
            console.log(err + ' bod: ' + body)
            res.redirect(303, '/signIn')
        })
}
obj.getFavourites = function (req,res,next){
    if(req.user === undefined){
        userBs.findAllFavourites( (err,body)=>{
            if(err) next(err)
            res.render('favouritesDetails',body)
        })
    }else{
        res.render('favourites', req);
    }
}
obj.getFavouritesDetails = function(req,res,next){
    let id = req.params.id;
    userBs.getFavouritesDetails(req.user,id, (err,body)=>{
        if(err) next(err)
        res.locals.favourites = body;
        res.render('favouritesDetails',body)
    })
}
obj.addFavourites = function(req,res,next){
    let user = req.user;
    let favourites = req.body;
    userBs.addFavourites(user,favourites, (err,body)=>{
        if (err) { 
            next(err); 
        }
        res.redirect(303, '/favourites')
    })
}
obj.editFavourite = function (req,res,next){
    let user = req.user;
    let id = req.params.id;
    userBs.editFavourites(user,id, (err,body)=>{
        if (err) { 
            next(err); 
        }
        res.redirect(303, '/favourites')
    })
}
obj.editFavouriteName = function (req,res,next){
    let user = req.user;
    let id = req.params.id;
    let name = req.params.newName;
    userBs.editFavouritesNames(user,id,name, (err,body)=>{
        if (err) { 
            next(err); 
        }
        res.redirect(303, '/favourites')
    })
}
obj.deleteFavourite = function (req,res,next){
    let user = req.user;
    let id = req.params.id;
    userBs.deleteFavourites(user,id, (err,body)=>{
        if (err) { 
            next(err); 
        }
        res.redirect(303, '/favourites')
    })
}

obj.addComments = function(req, res){
    let commentBody = req.body;
    let commentId = commentBody.commentId || 0;
    let comment = new entities.comment( 
        commentBody.movieId + "_" + Math.floor(Math.random() * 1000),
        undefined,
        commentBody.movieId,
        commentBody.comment,
        req.user._id,
        []);
    if (commentId == 0) {
        userBs.addComments(commentId, comment,req, (err)=>{
            if (err) { 
                next(err); 
            } else {
                res.render('movieComment', {layout: false, title: "Comentário", commentId:comment._id, comment:comment.comment, user: req.user, movieId:comment.movieId});
            }
        });
    } else {
        userBs.addComments(commentId,comment,req,(err)=>{
            if (err) { 
                next(err); 
            } else {
                res.render('movieCommentReply', {layout: false,commentId:comment.commentId, comment:comment.comment, user: req.user});
            }
        });
    }
}

obj.getComments = function(req,res){
    let movieId=req.params.movieId;
    userBs.getComments(movieId,(err,body)=>{
        if (err) { 
            next(err); 
        }
        res.redirect(303,'/moviesDetails/'+movieId,body)
    });
}

module.exports = function (d,e, m) {
    // Validate model
    debug = d;
    entities = e;
    userBs = m;
    return obj;
}
