'use strict'


/* External Dependencies */
const http = require('http');
const url = require('url');
const fs = require('fs');
const express = require('express');
const hbs = require('hbs');
const path = require('path');
const bodyParser = require('body-parser')
const passport = require('passport')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require('express-flash')


//const debug = require('debug')('xpto');
const debug = function(debugmodulename, debugmessage){ 
    var debugtime = (new Date()).toISOString().replace('T',' ').replace('Z','') ;
    console.log('[' + debugtime + '] Debug: ' + debugmodulename + ' -> ' + debugmessage);
};

const PORT = process && process.env && process.env.PORT || 8080

let app = express();
let router = express.Router();
/* Locals */
const debugmodule ='server';

app.use(express.static(path.join(__dirname, 'public')));
app.engine('hbs', hbs.__express)
app.set('views', [__dirname + '/views/partials'])
app.set('view engine', 'hbs')
hbs.registerPartials(__dirname + '/views/templates')
hbs.registerPartials(__dirname + '/views/partials')


app.use(bodyParser.urlencoded({ extended: false }))
app.use('public', express.static('public', { maxAge: '1d' }))
app.use(cookieParser())
app.use(session({secret: 'keyboard cat', resave: false, saveUninitialized: true }))
app.use(passport.initialize())
app.use(passport.session()) // Obtem da sessão user id -> deserialize(id) -> user -> req.user
app.use(flash())



const urlsUtils = require('./utils/constants');

const repositoryCache = require('./Dal/repositoryCache')(debug); 
/* Service */ 
const ApiServices = require('./Services/ApiServices')(debug);

/* Dto */
const entities = require('./Models/entities');
const actorDto = require('./Dal/actorDto.js')(debug, entities, repositoryCache);
const movieDto = require('./Dal/movieDto')(debug,entities, repositoryCache);
const userDto = require('./Dal/userDto')(debug,entities, repositoryCache);
const searchDto = require('./Dal/searchDto')(debug, entities, repositoryCache);
const couchdb = require('./Dal/CouchDb/couchdb')
/* Models */
const actorModel = require('./Models/actorModel')(debug, actorDto);
const movieModel = require('./Models/movieModel')(debug, movieDto);
const userModel = require('./Models/userModel')(debug, userDto);
const searchModel = require('./Models/searchModel')(debug, searchDto);

/* Business Services */
const actorBs = require('./businessServices/actorBs')(debug, actorModel, ApiServices, urlsUtils);
const movieBs = require('./businessServices/moviesBs')(debug, entities, actorBs, movieModel, ApiServices, urlsUtils);
const searchBs = require('./businessServices/searchBs')(debug, searchModel, ApiServices, urlsUtils);
const userBs = require('./businessServices/userBs')(debug, userModel, ApiServices, urlsUtils, couchdb);
/* Controllers */
//const actorController = require('./Controllers/actorController')(debug, actorModel);
const movieController = require('./Controllers/movieController')(debug, movieBs);
const actorController = require('./Controllers/actorController')(debug, actorBs);
const searchController = require('./Controllers/searchController')(debug, searchBs);
const userController = require('./Controllers/userController')(debug,entities,userBs);
/* APP server */

let routes = require('./router/router')(debug,router, url, movieController, searchController , actorController,userController,passport);
app.use(routes);
//const server = http.createServer((req,res)=> router.route(req,res) );
app.use((req, res, next) => { 
    if(req.user !== undefined){
        res.locals.user = req.user._id
    }
    next() 
})

//server.listen(8080);
app.listen(PORT,()=>{debug(debugmodule, 'Listening on port '+PORT)});
