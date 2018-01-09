'use strict';
//const API_PREFIX = "/api";
const API_PREFIX = "";

function cleanForm(form){
    document.getElementById(form).reset();
}
function getFormData(dataform){
    var formData = {};
    var formElems = document.getElementById(dataform).elements;
    Array.prototype.forEach.call(formElems, (fe) => {
        if(fe.name) formData[fe.name] = encodeURIComponent(fe.value);
    });
    return formData;
}
function getFormQueryString(dataform){
    var formData = "";
    var formElems = document.getElementById(dataform).elements;
    Array.prototype.forEach.call(formElems, (fe) => {
        if(fe.name) {
            if (formData!=='') formData += '&';
            formData += encodeURIComponent(fe.name) + "=" + encodeURIComponent(fe.value.replace('\'', "\\'").replace('\"', '\\"') );
        }
    });
    return formData;
}
function prefixUriWith(uri, prefix) {
    var parser = document.createElement('a');
    parser.href = uri;
    
    parser.pathname = prefix + parser.pathname;
    //parser.hostname; // => "example.com"
    //parser.port;     // => "3000"
    //parser.pathname; // => "/pathname/"
    //parser.search;   // => "?search=test"
    //parser.hash;     // => "#hash"
    //parser.host;
    return parser.href;
}
function createBodyString(formData) {
    if (!formData) {
        return null;
    }
    let str = "";
    for (let k in formData) {
        str += k + "=" + formData[k] + "&";
    }
    return str.substring(0, str.length - 1);
}
function makeHttpRequest(method, uri, cb, formData) {
    uri = prefixUriWith(uri, API_PREFIX);

    let xhr = new XMLHttpRequest();

    method = method.toUpperCase();
    xhr.open(method, uri);

    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");

    var body = createBodyString(formData);
    xhr.send(body);

    xhr.onreadystatechange = function () {
        //console.log("onreadystatechange: " + xhr.readyState);
        //console.log("Server replied with :", xhr.status);
        if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
            cb(xhr.responseText);
        }
    }
}

//////////////////////////////////////////////////////
function processDelete(uri, cb) {
    makeHttpRequest("DELETE", uri, cb, {});
    return false;
}
function processGET(uri, cb) {
    makeHttpRequest("GET", uri, cb, {});
    return false;
}
function processPOST(uri, data, cb) {
    makeHttpRequest("POST", uri, cb, data);
    return false;
}
function processPUT(uri, data, cb) {
    makeHttpRequest("PUT", uri, cb, data);
    return false;
}
//////////////////////////////////////////////////////

function addNewMovieComment(formWithData){
    var formData = getFormData(formWithData);
    var tempURI = '/api/comments/' + formData['movieId'] + '/add';

    function addNewMovieCommentCB(rsp){
        document.getElementById('movieCommentsList').innerHTML += rsp;
        cleanForm(formWithData);
    }
    processPOST(tempURI, formData, addNewMovieCommentCB);
}

function addResponseMovieComment(formWithData){
    var formData = getFormData(formWithData);
    var tempURI = '/api/comments/' + formData['movieId'] + '/add';

    function  addResponseMovieCommentCB(rsp){
        document.getElementById('movieCommentsList').innerHTML += rsp;
        cleanForm(formWithData);
    }
    processPOST(tempURI, formData, addResponseMovieCommentCB);
}