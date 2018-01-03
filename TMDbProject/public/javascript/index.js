function ajaxRequest(ajaxObject) {
    try { 
        let xhr = new XMLHttpRequest()
        xhr.open(ajaxObject.type, ajaxObject.url, ajaxObject.sync ? false : true)
        xhr.setRequestHeader('Content-Type', ajaxObject.contentType || 'application/json charset=UTF-8')
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                ajaxObject.success && ajaxObject.success(this)
            } else {
                ajaxObject.error && ajaxObject.error(this)
            }
        }
        xhr.send(ajaxObject.data)
    } catch(ex) {
        console.error('Error on ajax request --> ' + ex)
    }
    return false
}
function addComments(){
    let commmentText = document.getElementById("comment").value; 
    let movieId = document.getElementById("movieId").value;
	let commentId = document.getElementById("commentId").value ==""?0:document.getElementById("commentId").value;
	let commentIdNewComment = movieId + "_" + Math.floor(Math.random() * 100);
    return ajaxRequest({
        type:'POST',
        url: `/comments/${movieId}/add/${commmentText}/${commentId}/${commentIdNewComment}`,
        sucess: (ajax) => {
			console.log(commentId);
			if(commentId == 0){
				let newPara = document.createElement('P');
				let t = document.createTextNode(commentText);
				newPara.appendChild(t);
				document.getElementById('commentList').appendChild(newPara);
			}else{
				let newLi = document.createElement('LI');
				let newPara = document.createElement('P');
				let t = document.createTextNode(commentText)
				newPara.appendChild(t);
				newLi.appendChild(newPara);
				document.getElementById('comments').appendChild(newLi);
			}
        }
    })

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