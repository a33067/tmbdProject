
const constants = require('constants');

module.exports = function(debug,router,url,movieController,searchController,actorController,userController,passport){
    router.use((req, res, next) => { 
        if(req.user !== undefined){
            res.locals.user = req.user;
        }
        next();
    })
    /**
     * Setup passport
     */
    passport.use('basic', {
        authenticate: function(req,res) {
            console.log('Authenticating...')
            const errorMsg = 'User or password incorrect!';
            if(req.body.password == '' ) return this.fail({message: errorMsg})
            userController.getSignIn(req, res, (err, data, info) => {
                if(err) return this.fail({message: err})
                if(!data) return this.fail({message: errorMsg})
                console.log('login: '+data.username);
                if(data.password !== req.body.password)return this.fail({message: errorMsg})
                this.success(data)
            })
        }
    })
    passport.serializeUser(function(user, cb) {
        cb(null, user.username)
    })

    passport.deserializeUser(function(username, cb) {
        userController.find(username, cb)
    })
    
    
    router.get('/',userController.getHomePage);
    router.get('/signIn',(req,res)=>res.render ('signIn',res.locals.user));
    router.post('/signIn',passport.authenticate('basic', {
        successRedirect: '/',
        failureRedirect: '/signIn',
        failureFlash: true 
    }));
    router.get('/logout', function(req, res){
        req.logout()
        res.redirect('/')
    })
    router.get('/userHomePage',userController.getUserHomepage)
    router.get('/register',(req,res)=>res.render ('register'));
    router.post('/register',userController.getSignUp);
    router.get('/movies/:movie_id', movieController.movieController);
    router.get('/search', searchController.searchController);
    router.get('/actors/:actor_id', actorController.actorController);
    
    router.post('/users/favourites/add', userController.addFavourites);
    router.get('/favourites',userController.getFavourites);
    router.get('/favouritesDetails/:id',userController.getFavouritesDetails);
    router.get('/favouritesDetails/edit/:id',userController.editFavourite);
    
    /* AJAX REQUESTS */
    router.delete('/favouritesDetails/edit/:id',userController.editFavourite);
    router.post('/favouritesDetails/edit/:id/:newName',userController.editFavouriteName);
    router.get('/favourite/delete/:id',userController.deleteFavourite);
    router.delete('/favourite/delete/:id',userController.deleteFavourite);

    router.post('/api/comments/:movieId/add', userController.addComments);
    //router.get('/comments/:movieId/add/:comment/:commentId/:newCommentId',(req,res)=>res.render ('moviesDetails'));
    //router.get('/api/comments/:movieId/add/:comment/:commentId/:newCommentId',userController.getComments);


    // catch 404 and forward to error handler
    router.use(function(req, res, next) {
        const err = new Error('Not Found')
        err.status = 404
        next(err)
    })
    
    // error handler
    router.use(function(err, req, res, next) {
        // set locals, only providing error in development
        res.locals.message = err.message
        res.locals.error = req.app.get('env') === 'development' ? err : {}
        
        // render the error page
        res.status(err.status || 500)
        res.render('error')
    })


    return router;
}
