//main.js

// VARIABLES



//SHARED REF
var storageRef = firebase.storage().ref();
var database = firebase.database();

var songsRef = firebase.database().ref('songs');
var coverStorageRef = firebase.storage().ref('covers');
var songStorageRef = firebase.storage().ref('songs');


var vibesRef =  firebase.database().ref('Vibes/Verified');
var newVibesRef =  firebase.database().ref('Vibes/Unverified');




// SHARED VARIABLES

var songArray = [""];
var newNamesArray = [""];
var newArtistsArray = [""];
var newSongURLArray = [""];
var userPostsArray = [""];
// DEFAULTS

var defaultCover = "https://firebasestorage.googleapis.com/v0/b/disco-6a3bf.appspot.com/o/covers%2FcoverArt.png?alt=media&token=ac5f78d7-580b-4f61-9d1d-f86aa4e64fee";

var newCoverURLArray = [defaultCover,defaultCover,defaultCover,defaultCover,defaultCover,defaultCover];



function tryLogin(){

	var inputEmail = navLogin.navEmail.value;
	var inputPassword = navLogin.navPassword.value;

	firebase.auth().signInWithEmailAndPassword(inputEmail, inputPassword).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// ...
	});

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			window.open("myProfile.html", "_self");  
			// User is signed in.

		} else {
			// No user is signed in.
		}
	});
}


function makeSongList(songId){

	songArray.push(songId);
	loadTimelineData(songId, songArray.length -1 );
}

function loadTimelineData(songId, position){

	var songIdRef = songsRef.child(songId);

	// song name
	songIdRef.once('value').then(function(snapshot) {
		var name = snapshot.val().name;
		console.log("NEW SONG NAME: " + name);
		newNames(name, position);
		// ...
	});

	// artist name
	songIdRef.child("creator").once('value').then(function(snapshot) {
		var publicName = snapshot.val().publicName;
		newArtists(publicName, position);

		// ...
	});

	//cover File
	coverStorageRef.child(songId).getDownloadURL().then(function(coverURL) {
		// image url
		newCovers(coverURL, position);
	}).catch(function(error) {
		// No Image
		newCovers(defaultCover, position);

	});

	//song File
	songStorageRef.child(songId).getDownloadURL().then(function(songURL) {
		// song url
		console.log("SONG URL is: " + songURL);
		newSongs(songURL, position);

	}).catch(function(error) {

	});

}


function newNames(name, position){

	newNamesArray[position] = name;
	updateTimeline();

}

function newArtists(artist, position){

	newArtistsArray[position] = artist;
	updateTimeline();

}

function newCovers(coverURL, position){

	newCoverURLArray[position] = coverURL;
	updateTimeline();

}

function newSongs(songURL, position){

	newSongURLArray[position] = songURL;

}

function playSong1(){
	updatePlayer(1);
}

function playSong2(){
	updatePlayer(2);

}

function playSong3(){
	updatePlayer(3);

}

function playSong4(){         
	updatePlayer(4);

}

function playSong5(){
	updatePlayer(5);

}


function updatePlayer(position){
	footerPlayer.style.display = 'block';
	player.src = newSongURLArray[position];
	playerSong.innerHTML = newNamesArray[position];
	playerArtist.innerHTML = newArtistsArray[position];
	footerCover.src = newCoverURLArray[position];
	player.play();

}

function toggleMusic(){ 

	console.log("clicked");
	if (player.paused == true){
		player.play();  
		playButton.src = "Icons/Pause-100.png";
	}
	else if (player.paused == false){
		player.pause();
		playButton.src = "Icons/Play-100.png";

	}
}


function updateTimeline(){

	console.log(newNamesArray);
	console.log(newArtistsArray);

	name1.innerHTML=  newNamesArray[1];
	name2.innerHTML =  newNamesArray[2];
	name3.innerHTML =  newNamesArray[3];
	name4.innerHTML =  newNamesArray[4];
	name5.innerHTML =  newNamesArray[5];

	artist1.innerHTML =  newArtistsArray[1];
	artist2.innerHTML =  newArtistsArray[2];
	artist3.innerHTML =  newArtistsArray[3];
	artist4.innerHTML =  newArtistsArray[4];
	artist5.innerHTML =  newArtistsArray[5];

	coverArt1.src = newCoverURLArray[1];
	coverArt2.src = newCoverURLArray[2];
	coverArt3.src = newCoverURLArray[3];
	coverArt4.src = newCoverURLArray[4];
	coverArt5.src = newCoverURLArray[5];

}


function checkUsername(){

	var inputPublicName = loginForm.inputPublicName.value;
	var inputUsername = loginForm.inputUsername.value;
	var inputEmail = loginForm.inputEmail.value;
	var inputPassword = loginForm.inputPassword.value;
	var inputConfirmPassword = loginForm.inputConfirmPassword.value;


	// check username availibility 

	if (inputUsername.length > 0){

		// username typed 
		var usernameRef = firebase.database().ref("users/");
		usernameRef.once("value")
			.then(function(snapshot) {
			if (snapshot.child(inputUsername).exists()){
				alert("Username is taken");
			}
			else {
				console.log("username NOT is taken");
				if (inputPassword.length > 5 && inputPassword == inputConfirmPassword){
					// password is longer than 5 and matches confirm

					createAccount(inputEmail, inputPassword, inputUsername, inputPublicName);
				}
				else {
					alert("Passwords DO NOT match");
				}
			}
		});
	} // end username typed  



} // end checkCreate()

function createAccount(goodEmail, goodPassword, goodUsername, goodPublicName){
	console.log("about to create");
	firebase.auth().createUserWithEmailAndPassword(goodEmail, goodPassword).catch(function(error) {
		// Handle Errors here.
		var errorCode = error.code;
		var errorMessage = error.message;
		// [START_EXCLUDE]
		if (errorCode == 'auth/weak-password') {
			alert('The password is too weak.');
		} else {
			alert(errorMessage);
		}
		console.log(error);
		// [END_EXCLUDE]
	});

	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			// User is signed in.
			console.log("user was created");
			console.log(user.uid);
			writeUserData(goodUsername,goodEmail,user.uid, goodPublicName);

			var user = firebase.auth().currentUser;

			user.updateProfile({
				displayName: goodUsername
			}).then(function() {
				window.open("myProfile.html", "_self");  
				// Update successful.
			}, function(error) {
				// An error happened.
			});
			// user now created and logged in:


		} else {
			// No user is signed in.
			console.log("user was NOT created");
		}
	});


} // end good Create Account


function writeUserData(username, email, uid, name) {
	firebase.database().ref('users/' + username + '/details').set({
		username: username,
		email: email,
		userID: uid,
		publicName: name
	})
	firebase.database().ref('users/' + username + '/details/following/disco').set("disco");
}


// SHARED FUNCTIONS 
function handleCoverSelect(input) {
	console.log("file chosen");

	if (input.files && input.files[0]) {
		console.log("file exists");


		coverFile = input.files[0];
		coverSelected = true;

		var reader = new FileReader();

		reader.onload = function (e) {
			$('#coverArt')
				.attr('src', e.target.result);
		};

		reader.readAsDataURL(input.files[0]);
	}

} // END FILE SELECT

function startCoverUpload(){
	document.getElementById('coverFile').click();
}

function createSong(songFile){

	console.log("creating song @: " + position);

	// capture Song Data 
	var readySongName = inputSongName.value;
	var readyFeatures = inputFeatures.value; 
	var readyCapion = inputCaption.value;

	//vibes 
	if (myVibesArray){
		var readyVibes = myVibesArray;
	}
	else if(typeof myVibesArray == "undefined") {
		var readyVibes = false;
	}


	// explicit

	var readyExplicit = false;
	if (inputExplicit.checked == true){
		readyExplicit = true;
	}



	// create Song Object 
	var songObject = {
		name: readySongName ,
		caption: readyCapion,
		vibes: readyVibes ,
		creator: savedCreator,
		features: readyFeatures,
		dateAdded: Date(),
		timeline: timestamp.getTime(),
		plays: 1,
		likes: 1,
		shares: 0,
		explicit: readyExplicit
	};

	console.log(songObject);

	if (position != 0){
		songDataArray.push(songObject);
		songFileArray.push(songFile);
	}

	if (position == 0){
		songDataArray = [songObject];
		songFileArray = [songFile];    
	}
	position = position +1;


	console.log("DataArray of size: " + songDataArray.length);
	console.log(songDataArray);

	console.log("FileArray of size: " + songFileArray.length);
	console.log(songFileArray);


}

function saveCreator(incomingCreator){
	savedCreator = incomingCreator;
	console.log(savedCreator);

}

function creator() {

	var user = firebase.auth().currentUser;

	if (user) {
		// User is signed in.

		if (user != null) {
			userUsername = user.displayName;
			userUid = user.uid;

			firebase.database().ref('/users/' + userUsername + "/details/publicName").once('value').then(function(snapshot) {
				userPublicName = snapshot.val();

				creator = {
					username: userUsername,
					uid: userUid,
					publicName: userPublicName
				}

				saveCreator(creator)

			});


		}
	} else {
		// No user is signed in.
		console.log("creator is NOT here")

	}


}

function handleSongSelect(input) {
	console.log("file selected for: " + position);
	if (input.files && input.files[0]) {
		console.log("file exists");
		songFile = input.files[0];

		if (songFile){
			// controller.style.display = 'block';
			publishBlock.style.display = 'block'; 
		}
		createSong(songFile);


	}



} // END SONG SELECT

function startSongUpload(){
	document.getElementById('songFile').click();
}

function publish(){

	console.log(songDataArray.length + " song data ready");
	console.log(songDataArray);

	console.log(songFileArray.length + " song files ready");
	console.log(songFileArray);



	// SINGLE UPLOAD
	if (songDataArray.length == 1 ){


		var readyData = songDataArray[0];
		var readyFile = songFileArray[0];  

		var newSongRef = songsRef.push();
		var songKey = newSongRef.key; 
		var userSongsRef = firebase.database().ref('users/' + userUsername + '/posts/singles/' + songKey);



		console.log("posting: ");
		console.log(readyData);


		// upload Song File
		var songStorageRef = storageRef.child('songs/' + songKey);

		var uploadTask =  songStorageRef.put(readyFile);

		// UPLOADING TASK
		uploadTask.on('state_changed', function(snapshot){
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

			progressDiv.style.display = 'block'
			uploadProgress.style.width = progress+ "%";
			uploadProgress.innerHTML = (progress.toFixed(0) + "%");

			console.log( progress + "% DONE");

		}, function(error) {
			// Handle unsuccessful uploads
		}, function() {
			// Handle successful uploads on complete

			if (coverSelected == true) {

				// write cover location
				var coverLocation = songsRef.child(songKey + "/cover");
				coverLocation.set(songKey);

				// store image
				var coverStorageRef = storageRef.child('covers/' + songKey);
				coverStorageRef.put(coverFile).then(function(snapshot) {
					console.log('Uploaded a Single cover file!');
					// upload Song Data
					newSongRef.set(readyData);
					userSongsRef.set(songKey);

					window.open("index.html", "_self"); 

				});

			}
			else {
				// upload Song Data
				newSongRef.set(readyData);
				userSongsRef.set(songKey);

				window.open("index.html", "_self"); 

			}







		}); // DONE with all Uploads



	}

	//
	//                // ALBUM UPLOAD
	//                if (songDataArray.length > 1){
	//
	//                    for ( postPosition;(postPosition + 1) < songDataArray.length; postPosition++) {
	//                        var readyData = songDataArray[postPosition];
	//                        var readyFile = songFileArray[postPosition];  
	//
	//                        var newSongRef = songsRef.push();
	//                        var songKey = newSongRef.key; 
	//                        createAlbumKeysArray(songKey);
	//
	//                        console.log("posting: ");
	//                        console.log(readyData);
	//
	//                        // upload Song Data
	//                        newSongRef.set(readyData);
	//
	//                        // upload Song File
	//                        var songStorageRef = storageRef.child('songs/' + songKey);
	//
	//                        var uploadTask =  songStorageRef.put(readyFile);
	//
	//
	//                        uploadTask.on('state_changed', function(snapshot){
	//                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
	//                            console.log('Upload is ' + progress + '% done');
	//                            switch (snapshot.state) {
	//                                case firebase.storage.TaskState.PAUSED: // or 'paused'
	//                                    console.log('Upload is paused');
	//                                    break;
	//                                case firebase.storage.TaskState.RUNNING: // or 'running'
	//                                    console.log('Upload is running');
	//                                    break;
	//                                                  }
	//                        }, function(error) {
	//                            // Handle unsuccessful uploads
	//                        }, function() {
	//                            // Handle successful uploads on complete
	//
	//                        }); // END OF UPLOAD TASK 
	//
	//
	//                        // Done uploading redirect 
	//                        if ((postPosition + 1) == songDataArray.length){
	//                            window.open("createAccount.html", "_self");  
	//
	//
	//                        } 

	//
	//                    } // end of FOR loop
	//

	//                }

} 

function createAlbumKeysArray(songKey){

	if (postPosition == 0) {
		albumKeys = [songKey];  
	}

	if (postPosition > 0 ){
		albumKeys.push(songKey);
	}

}

function addTrack(){

	console.log("post postition is : ");
	console.log(postPosition);

	var trackName =  inputSongName.value;



	trackList.style.display = 'block';
	console.log("song is: " + trackName);
	track1.innerHTML = trackName;
	inputFields.reset();



}

function nameExists(event){

	songName = event.target.value;


	if (songName.length > 0){
		uploadButton.style.display = 'block';
	}
	if (songName.length == 0){
		uploadButton.style.display = 'none';
	}

}

function vibesList(vibes){

	if(typeof vibesArray == "undefined") {
		vibesArray = [vibes];
	}
	else if (vibesArray){
		vibesArray.push(vibes);
	}

}

function unverifiedVibesList(vibes){

	console.log("starting unverified list:");



	if(typeof unverifiedVibesArray == "undefined") {
		unverifiedVibesArray = [vibes];
	}
	else if (unverifiedVibesArray){
		unverifiedVibesArray.push(vibes);
	}

}


function loadFill(){
	var availableTags = vibesArray;

	$( "#inputVibes" ).autocomplete({
		source: availableTags
	});
}


function saveVibes(e){


	console.log(e.keyCode);


	if (e.keyCode === 0 || e.keyCode === 32 || e.keyCode === 13) {

		newVibe(inputVibes.value);

		e.preventDefault();
		console.log('Space  or Enter pressed');

		if(typeof myVibesArray == "undefined") {
			myVibesArray = [inputVibes.value];
			console.log("my vibes: " + myVibesArray);
			vibeButtons();
			inputVibes.value = "";

		}

		else if (myVibesArray){
			var isRepeat = myVibesArray.indexOf(inputVibes.value);
			if (isRepeat < 0){
				// not typed
				if (myVibesArray.length == 1){
					myVibesArray.push(inputVibes.value);
					console.log("my vibes: " + myVibesArray);
					vibeButtons();
					inputVibes.value = "";

				}
				else if (myVibesArray.length == 2){
					myVibesArray.push(inputVibes.value);
					console.log("my vibes: " + myVibesArray);
					vibeButtons();
					inputVibes.value = "";


				}
				else if (myVibesArray.length == 3){
					myVibesArray.push(inputVibes.value);
					console.log("my vibes: " + myVibesArray);
					vibeButtons();
					inputVibes.value = "";


				}
				else if (myVibesArray.length == 4){
					myVibesArray.push(inputVibes.value);
					console.log("my vibes: " + myVibesArray);
					vibeButtons();
					inputVibes.value = "";


				}
				else if (myVibesArray.length == 5){
					alert("Out of spots :/``");
				}

			}
			else if (isRepeat > -1){
				// already typed 
				return false

			}


		}


	}

}


function vibeButtons(){

	console.log("Reset buttons to:");
	console.log(myVibesArray);


	if(typeof myVibesArray == "undefined" || myVibesArray.length == 0) {
		$("#vibe1").html("");
		$("#vibe2").html("");
		$("#vibe3").html("");
		$("#vibe4").html("");
		$("#vibe5").html("");
	}

	else if (myVibesArray.length == 1){
		$("#vibe1").html(myVibesArray[0]);
		$("#vibe2").html("");
		$("#vibe3").html("");
		$("#vibe4").html("");
		$("#vibe5").html("");

	}
	else if (myVibesArray.length == 2){
		$("#vibe1").html(myVibesArray[0]);
		$("#vibe2").html(myVibesArray[1]);
		$("#vibe3").html("");
		$("#vibe4").html("");
		$("#vibe5").html("");

	}
	else if (myVibesArray.length == 3){
		$("#vibe1").html(myVibesArray[0]);
		$("#vibe2").html(myVibesArray[1]);
		$("#vibe3").html(myVibesArray[2]);
		$("#vibe4").html("");
		$("#vibe5").html("");
	}
	else if (myVibesArray.length == 4){
		$("#vibe1").html(myVibesArray[0]);
		$("#vibe2").html(myVibesArray[1]);
		$("#vibe3").html(myVibesArray[2]);
		$("#vibe4").html(myVibesArray[3]);
		$("#vibe5").html("");         
	}
	else if (myVibesArray.length == 5){
		$("#vibe1").html(myVibesArray[0]);
		$("#vibe2").html(myVibesArray[1]);
		$("#vibe3").html(myVibesArray[2]);
		$("#vibe4").html(myVibesArray[3]);
		$("#vibe5").html(myVibesArray[4]);         
	}


}


function click1(){
	myVibesArray.splice(0, 1);
	vibeButtons();
}
function click2(){
	myVibesArray.splice(1, 1);       
	vibeButtons();
}
function click3(){
	myVibesArray.splice(2, 1);
	vibeButtons();

}
function click4(){
	myVibesArray.splice(3,1);
	vibeButtons();

}
function click5(){
	myVibesArray.splice(4,1);
	vibeButtons();

}

function newVibe(input){

	// check if input is a new or old vibe

	var isUnverified = vibesArray.indexOf(input);
	var isNew = unverifiedVibesArray.indexOf(input);





	console.log("isNew: " + isNew);

	console.log("isUnverified: " + isUnverified);




	if (isUnverified >= 0){
		// if already verified 
		console.log("already verified");

	}


	else if (isUnverified < 0 && isNew >= 0){
		console.log("not verified but old");

		// if unverified not new
		var unverifiedRef = newVibesRef.child(input);
		console.log("check 1");


		unverifiedRef.once('value').then(function(snapshot) {
			console.log("check 2");

			var count = snapshot.val();
			console.log("check 3");


			// add one 
			count++;

			unverifiedRef.set(count);

			console.log("tag count is: " + count);



		});


	}



	else if (isUnverified < 0 && isNew < 0){

		console.log("not verified and new");
		// if unverified and new 
		var unverifiedRef = newVibesRef.child(input);
		unverifiedRef.set(1);
		console.log("added vibe! Thanks :)");



	}


}

function handleFileSelect(evt) {


	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {
			userId = user.uid;
			console.log("user: " + userId);
			evt.stopPropagation();
			evt.preventDefault();
			var file = evt.target.files[0];
			var metadata = {
				'contentType': file.type
			};
			// Push to child path.
			// [START oncomplete]
			storageRef.child('profileImages/'+ userId +'/profileImage.jpg').put(file, metadata).then(function(snapshot) {
				console.log('Uploaded', snapshot.totalBytes, 'bytes.');
				console.log(snapshot.metadata);
				var url = snapshot.downloadURL;
				console.log('File available at', url);
				user.updateProfile({
					photoURL: url
				}).then(function() {
					// Update successful.
				}, function(error) {
					// An error happened.
				});

				selectImage(url);

				// [START_EXCLUDE]

				// [END_EXCLUDE]
			}).catch(function(error) {
				// [START onfailure]
				console.error('Upload failed:', error);
				// [END onfailure]
			});
			// [END oncomplete]

		}    // User is signed in.

		else {
			// no one logged in 
			window.open("createAccount.html", "_self");  

		}
	});

} // END FILE SELECT

function selectImage(fileName) {
	document.getElementById("profileImage").src = fileName;
}

function makeUserPostsList(songId){
	userPostsArray.push(songId);
	console.log("user posts: " + userPostsArray);
	loadUserTimelineData(songId, (userPostsArray.length -1));
}

function songObject(songId){
	var songIdRef = songsRef.child(songId);

	var songObject = {
		songId: songId,
		name: "Song Name",
		creator: "Creator",
		caption: "Caption",
		dateAdded: "Date",
		features: "Featuring",
		likes: 1,
		plays: 1,
		shares: 0,
		timeline: "Timeline",
		vibes: false,
		explicit: false
	}



	// artist name
	songIdRef.child("creator").once('value').then(function(snapshot) {
		var creator = snapshot.val();
		songObject.creator = creator;
	});

	// song name
	songIdRef.once('value').then(function(snapshot) {
		var caption = snapshot.val().caption;
		var dateAdded = snapshot.val().dateAdded;
		var features = snapshot.val().features;
		var likes = snapshot.val().likes;
		var name = snapshot.val().name;
		var plays = snapshot.val().plays;
		var shares = snapshot.val().shares;
		var timeline = snapshot.val().timeline;
		var vibes = snapshot.val().vibes;
		

		
		songObject.name = name;
	});

	//cover File
	coverStorageRef.child(songId).getDownloadURL().then(function(coverURL) {
		// image url
		//newCovers(coverURL, position);
	}).catch(function(error) {
		// No Image
		//newCovers(defaultCover, position);

	});

	//song File
	songStorageRef.child(songId).getDownloadURL().then(function(songURL) {
		// song url
		console.log("SONG URL is: " + songURL);
		//	newSongs(songURL, position);

	}).catch(function(error) {

	});




}

function loadUserTimelineData(songId, position){

	var songIdRef = songsRef.child(songId);

	// song name
	songIdRef.once('value').then(function(snapshot) {
		var name = snapshot.val().name;
		console.log("NEW SONG NAME: " + name);
		//newNames(name, position);
		// ...
	});

	// artist name
	songIdRef.child("creator").once('value').then(function(snapshot) {
		var publicName = snapshot.val().publicName;
		console.log("CREATOR: ");
		console.log(snapshot.val())

		//newArtists(publicName, position);

		// ...
	});

	//cover File
	coverStorageRef.child(songId).getDownloadURL().then(function(coverURL) {
		// image url
		//newCovers(coverURL, position);
	}).catch(function(error) {
		// No Image
		//newCovers(defaultCover, position);

	});

	//song File
	songStorageRef.child(songId).getDownloadURL().then(function(songURL) {
		// song url
		console.log("SONG URL is: " + songURL);
		//	newSongs(songURL, position);

	}).catch(function(error) {

	});
	
	
}



