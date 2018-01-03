
function movie(movieId,movieName,overview,poster_path,actors,directors)
{
    this.movieId = movieId;
    this.movieName = movieName;
    this.overview = overview;
    this.poster_path = poster_path;
    this.actors = actors;
    this.directors = directors;
}

function movieActor(movieId, actorId, actorName, actorCharacter){
    this.movieId = movieId;
    this.actorId = actorId;
    this.actorName = actorName;
    this.actorCharacter = actorCharacter;
}

function movieDirector(movieId, directorId, directorName){
    this.movieId = movieId;
    this.directorId = directorId;
    this.directorName = directorName;
}

function actor( name,actorId,popularity,biography,poster_path){
    this.actorName = name;
    this.actorId = actorId;       
    this.characters = [];
    this.biography = biography;
    this.popularity = popularity;
    this.poster_path = poster_path;
}

function user(id, rev, username,password,email,favourites,comments){
    this._id = id;
    this._rev = rev;
    this.username = username;
    this.password = password;
    this.email = email;
    this.favourites = favourites;
    this.comments = comments;
}

function searchMovie(searchName, resultsNumber, results){
    this.searchName = searchName;
    this.resultsNumber = resultsNumber;
    this.results = results;
}

function searchMovieDetail(movieId, movieName, movieOverview, moviePosterPath){
    this.movieId = movieId;
    this.movieName = movieName;
    this.movieOverview = movieOverview;
    this.moviePosterPath = moviePosterPath;
}

function comment(commentId,rev, movieId, comment,userID,responseComments){
    this._id = commentId;
    this._rev = rev;
    this.movieId = movieId;
    this.comment = comment;
    this.userID = userID;
    this.responseComments = [];
}

module.exports = {
    movie:             movie,
    movieActor:        movieActor,
    movieDirector:     movieDirector,
    actor :            actor,
    searchMovieDetail: searchMovieDetail,
    searchMovie:       searchMovie,
    user:              user,
    comment:          comment
}