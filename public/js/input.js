
function clearForm() {
	document.getElementById('wish-input').value=''
}

function startSending() {
	showProgress()
	var userWish = document.getElementById("wish-input").value
	saveWish(userWish, function(error){
		if (error) {
			console.log(error)
			showError()
		} else {
			hideProgress()
			clearForm()	
		}
	})
}

function showError() {
	document.getElementById('progress-bar').hidden = true
	document.getElementById('progress-complete').hidden = false
	document.getElementById('progress-complete').innerHTML = "Błąd!"
}

function showProgress() {
	document.getElementById('progress-bar').hidden = false
	document.getElementById('progress-complete').hidden = true
}

function hideProgress() {
	document.getElementById('progress-bar').hidden = true
	document.getElementById('progress-complete').hidden = false
	document.getElementById('progress-complete').innerHTML = "Wysłano!"
}

function saveWish(userWish, callback) {
	var database = firebase.database()
	var key = database.ref().child("user-wishes").push().key
	console.log("Key is " + key)
	var wishData = {
			wish : userWish,
			shown : false
		}
	console.log(wishData)
	var updates = {}
	updates["user-wishes/" + key ] = wishData
	database.ref().update(updates, callback)
}

document.querySelector('meta[name="viewport"]').setAttribute('content', 'width='+siteWidth+', initial-scale='+scale+'');