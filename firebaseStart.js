// Startup Script 

var inUsername = "Username"


// Initialize Firebase
var config = {
	apiKey: "AIzaSyDquIdmKQfr-QGF3kyEb28FzAboOPBE36g",
	authDomain: "disco-6a3bf.firebaseapp.com",
	databaseURL: "https://disco-6a3bf.firebaseio.com",
	storageBucket: "disco-6a3bf.appspot.com",
	messagingSenderId: "71660981931"
};
firebase.initializeApp(config);
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		console.log("Welcome " + user.displayName);
		creator();
		// User is signed in.
	} else {
		// No user is signed in.
		window.open("createAccount.html", "_self");  

	}
});


function navbarName(){

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			console.log("Welcome " + user.displayName);
			document.getElementById("navUsername").innerHTML = user.displayName;
			document.getElementById("newUserDiv").remove();


		} else {
			// No user is signed in.
			window.open("createAccount.html", "_self");  

		}
	});

}

// post HTML script
//
//		<script>
//
//
//
//			window.onload = 
//
//				function() {    
//				// NAV BAR CHOICE 
//				navbarName();
//			}
//
//
//		</script>