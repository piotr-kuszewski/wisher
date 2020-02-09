class FirebaseQueue {
	constructor() {
		this.queue = [] //contains the db keys
		
	}

	init() {
		var self = this
		var ref = firebase.database().ref("user-wishes")
		// ref.once("value", function(snapshot) {
		// 	snapshot.forEach(function(childSnapshot) {
		// 		console.log(childSnapshot.val().wish)
		// 		if (childSnapshot.val().shown == false) {
		// 			self.queue.push(childSnapshot)	
		// 		}
		// 	})
		// })
		ref.on("child_added", function(data) {
			console.log(data.val().wish)
			if (data.val().shown == false) {
				self.queue.push(data)	
			}
		})
	}

	getEntry() {
		if (this.queue.length == 0) {
			return "Brak wiadomości! Zachęcamy do wysyłania życzeń :)"
		}
		var entry = this.queue.shift()
		var database = firebase.database()
		var userWish = entry.val().wish
		var wishData = {
				wish : userWish,
				shown : true
			}
		var updates = {}
		updates["user-wishes/" + entry.key ] = wishData
		database.ref().update(updates)
		return userWish
	}

	restoreEntries(callback) {
		var ref = firebase.database().ref("user-wishes")
		ref.once("value", function(snapshot) {
			var updates = {}
			snapshot.forEach(function(childSnapshot) {
				var value = childSnapshot.val()
				value.shown = false
				updates["user-wishes/" + childSnapshot.key] = value
			})
			firebase.database().ref().update(updates, callback)
		})
	}
}



function init() {
	var firebaseQueue = new FirebaseQueue()
	firebaseQueue.restoreEntries(function() {
		firebaseQueue.init()
		window.setInterval(
			function() {
				var nextWish = firebaseQueue.getEntry()
				if (nextWish !== $("#wish-holder").text()) {
					$("#wish-holder").fadeOut(function() {
	  					$(this).text(nextWish).fadeIn();	
	  				});
				}
			}, 5000)
	})
	
}

init()