'use strict';


let URL_HOST ='https://api.themoviedb.org/3/';
let KEY_THE_MOVIE = '63455146500b40d414bbca3a3f91c910'

let API_KEY = 'api_key='+KEY_THE_MOVIE;

if (!KEY_THE_MOVIE) {
	throw new Error('Missing api_key.')
}

function SEARCH_MOVIES_BY_NAME (name, page){
    return  URL_HOST + "search/movie?" + API_KEY + 
            "&query=" + name + 
            "&page=" + page;
} 

function SEARCH_DETAILS_MOVIES (id){
    return URL_HOST+"movie/"+id+"?"+API_KEY;
} 

function SEARCH_DETAILS_MOVIES_CREDITS (id){
    return URL_HOST+"movie/"+id+"/credits?"+API_KEY;
} 

function GET_PERSON_MOVIE_CREDITS(id){
    return URL_HOST+"person/"+id+"/movie_credits?"+API_KEY;
}

function GET_PERSON_DETAILS (id){
    return URL_HOST+ "person/"+id+"?"+API_KEY;

}

module.exports = {
    SEARCH_MOVIES_BY_NAME : SEARCH_MOVIES_BY_NAME,
    SEARCH_DETAILS_MOVIES : SEARCH_DETAILS_MOVIES,
    SEARCH_DETAILS_MOVIES_CREDITS : SEARCH_DETAILS_MOVIES_CREDITS,
    GET_PERSON_DETAILS : GET_PERSON_DETAILS,
    GET_PERSON_MOVIE_CREDITS : GET_PERSON_MOVIE_CREDITS
}