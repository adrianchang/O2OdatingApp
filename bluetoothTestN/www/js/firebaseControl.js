
function handleError(error) {
    alert("ERROR: " + error);
}

function firebaseSetUser(macID) {
	//alert(document.getElementById("thename").value);
	//var name = document.getElementById("thename").value;
	firebase.database().ref('users/' + macID).set({
        username: document.getElementById("thename").value
        //email: email,
        //profile_picture : imageUrl
    });
}

function subscribe () {
	alert("subscribe pressed");
	//var myFirebaseRef = new Firebase("https://fireBaseTest.firebaseio.com/");
	var database = firebase.database();
	new Promise (function (resolve, reject) {
		window.MacAddress.getBluetoothMacAddress(
	        function(macAddress) {
	            alert(macAddress);
	            resolve(macAddress);
	        },
	        function(fail) {
	            alert(fail);
	        }
	    );
	}).then(firebaseSetUser, handleError);
}

/**
* Handles the sign in button press.
* Input: email, password
*/
function userSignIn() {
    if (!firebase.auth().currentUser) {
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START authwithemail]
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
        return;
        // [END_EXCLUDE]
      });
      // [END authwithemail]
    }
    else {
        alert('Already logged in. Please log out first.');
        return;
    }
}

/**
* Handles the sign out button press.
* Input: N/A
*/
function userSignOut(){
    if (firebase.auth().currentUser) {
      // [START signout]
      firebase.auth().signOut();
      // [END signout]
    }
}

/**
* Handles the sign up button press.
* Input: email, password
*/
function userSignUp() {
    var email = document.getElementById('signup-email').value;
    var password = document.getElementById('signup-password').value;
    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
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

      return;
      // [END_EXCLUDE]
    });
    // [END createwithemail]
}
  
/**
* Sends an email verification to the user.
* Input: N/A
*/
function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
      // Email Verification sent!
      // [START_EXCLUDE]
      alert('Email Verification Sent!');
      // [END_EXCLUDE]
    });
    // [END sendemailverification]
}
/**
* Sends a password reset email to the user.
* Input: email
*/
function sendPasswordReset() {
    var email = document.getElementById('email').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function() {
      // Password Reset Email Sent!
      // [START_EXCLUDE]
      alert('Password Reset Email Sent!');
      // [END_EXCLUDE]
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/invalid-email') {
        alert(errorMessage);
      } else if (errorCode == 'auth/user-not-found') {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
}

/**
 * Writes the user's data to the database.
 * Used right after user creation.
 * Input: macAddr, userId, name, email, imageUrl
 */
// [START basic_write]
function initUserData(macAddr, callback) {
  firebase.database().ref('/users/' + macAddr).once('value').then(function(snapshot){
      // only write data to database if the account is new
      var user = firebase.auth().currentUser;

      if(snapshot && snapshot.val() !== null){
          console.log('UserData already exists!');
      }
      else{
        firebase.database().ref('users/' + macAddr).set({
          uid: user.uid,
          firstName: document.getElementById("signup-firstname").value,
          lastName: document.getElementById("signup-lastname").value,
          // email: document.getElementById("signup-email").value,
          email: user.email,
          profile_picture: null
        });
        console.log('User '+user.uid+' data submitted to database.');
      }
      callback();
  });
}
// [END basic_write]

/**
 * Update the user's data on the database.
 * Input: macAddr, userId, name, email, imageUrl
 */
// [START basic_write]
function updateUserData(macAddr, imageUrl) {
  firebase.database().ref('/users/' + macAddr).once('value').then(function(snapshot){
      // only write data to database if the account is new
      if(snapshot === null){
          alert('User does not exist!');
          return;
      }
      else{
          firebase.database().ref('/users/' + macAddr).update({
              // displayName: name,
              profile_picture : imageUrl
          });
          // console.log('User '+uid+' data updated on the database.');
      }
  });
}
// [END basic_write]
