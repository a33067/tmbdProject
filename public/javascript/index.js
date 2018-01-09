function showResponseDiv() {
    var x = document.getElementById("formMovieComment");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

function ajaxRequest(ajaxObject) {
    try { 
        let xhr = new XMLHttpRequest();
        xhr.open(ajaxObject.type, ajaxObject.url, ajaxObject.sync ? false : true)
		//xhr.setRequestHeader('Content-Type', ajaxObject.contentType || 'application/json charset=UTF-8')
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        
		xhr.send(ajaxObject);
		xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 400) {
                ajaxObject.success && ajaxObject.success(xhr.responseText)
            } else {
                ajaxObject.error && ajaxObject.error(xhr.responseText)
            }
        };
    } catch(ex) {
        console.error('Error on ajax request --> ' + ex)
    }
    return false
}

function editFavourites(){
    let oldName = document.getElementById("oldName").value;
    let favouritesName = document.getElementById("favouritesName").value; 
	
	return ajaxRequest({
		type:'POST',
		url:`/favouritesDetails/edit/${oldName}/${favouritesName}`,
		sucess: (ajax) => {
			alert('Updated');
		}
	});
}

function deleteFavouritesMovies(){
    let favouritesName = document.getElementById("movie").value; 
	
	return ajaxRequest({
		type:'DELETE',
		url:`/favouritesDetails/edit/${favouritesName}`,
		sucess: (ajax) => {
			location.reload();
		}
	});
}

function deleteFavourites(){
    let favouritesName = document.getElementById("favouriteName").value; 
	
	return ajaxRequest({
		type:'DELETE',
		url:`/favourite/delete/${favouritesName}`,
		sucess: (ajax) => {
			location.reload();
		}
	});
}