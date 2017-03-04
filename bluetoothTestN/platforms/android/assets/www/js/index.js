/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// SHORTCUT to DOM Elements
var signUpForm = document.getElementById("f-signup");
var loginForm = document.getElementById("f-login");
var splash = document.getElementById("app-splash");
var appPage = document.getElementById("app-main");

var profilePage = document.getElementById("p-profile");
var profileContent = document.getElementById("prof-content");

var DeviceFactory = {
  devices : [],

  addDevice: function(device){
    this.devices.push(device);
  },

  getDevices: function(){
    return this.devices;
  },

  getDevice: function(id){
    var device_found = this.devices.filter(function(device){
      return device.id == id;
    });
    return device_found[0];
  },

  reset: function(){
    devices = [];
  }

}

function handleError(error) {
    alert("ERROR: " + error);
}

function enableSuccess(result) {
    alert("enable success");
    bluetoothSerial.setDiscoverable(0);
    // Listen to State Changes
            firebase.auth().onAuthStateChanged(onAuthStateChanged);
}

function discoverSuccess(result) {
    alert("scan end");
}

function update_list(updated_users) {

  // clear the existing list
  $('#users .list li').remove();

  $.each(updated_users, function(index,device) {

   firebase.database().ref('/users/' + device.id).once('value').then(function(snapshot) {
            if(snapshot && snapshot.val() !== null){
              var username = snapshot.val().firstName + ' ' + snapshot.val().lastName;
              $('#users .list').append('<li><h3 class="name">' + username + '</h3></li>');
            }
        });

  });

};

function discover() {
    alert("start discovering");
    //document.getElementById("page1").setAttribute("style", "display: none");
    //document.getElementById("users").setAttribute("style", "display: block");
    bluetoothSerial.setDeviceDiscoveredListener(function(device) {
        alert("Found " + device.name + " id: " + device.id);
        DeviceFactory.addDevice(device);
        update_list(DeviceFactory.getDevices());
        //要先按subscribe
        firebase.database().ref('/users/' + device.id).once('value').then(function(snapshot) {
          if(snapshot && snapshot.val() !== null){
              var username = snapshot.val().firstName + ' ' + snapshot.val().lastName;
              alert("he's our user " + username);
            }
        });
    });
    bluetoothSerial.discoverUnpaired(discoverSuccess, handleError);
}

function startBluetooth (result) {
    alert("firebase initialized");
    return new Promise (function (resolve, reject) {
        bluetoothSerial.isEnabled(
            function() {
                alert("Bluetooth is enabled");
                resolve(0);
            },
            function() {
                bluetoothSerial.enable(resolve, reject);
            }
        );
    });
}

function hideUI(){
    this.setAttribute("style", "display:none");
}

function showUI(){
    this.setAttribute("style", "display:block");
}

function cleanForm(){
    var nodeList = this.getElementsByTagName('input');
    var i;
    for(i=0; i<nodeList.length;i++){
        nodeList[i].value = "";
    }
    return this;
}

function openSignUp() {
    // change form to user sign up form
    hideUI.call(cleanForm.call(loginForm));
    showUI.call(signUpForm);
}

function openLogin(){
    showUI.call(loginForm);
    hideUI.call(cleanForm.call(signUpForm));
}

var currentUID;
var macAddr = 0;

function showProfile(macAddr){
    console.log("showProfile activated");
    firebase.database().ref('/users/' + macAddr).once('value').then(function(snapshot){
      if(snapshot && snapshot.val() !== null){
          var user = snapshot.val();
          console.log(user.firstName);
          // Show Data
          profileContent.innerHTML = '';

          if(user.profile_picture){
            profileContent.innerHTML = '<img id="prof-pic" src=' + user.profile_picture + 'alt="Profile Picture"><br>';
          }
          else{
            showUI.call(document.getElementById('dp-upload'));
          }
          profileContent.innerHTML += '<h2 class="textcenter">'+user.firstName+' '+user.lastName+'</h2><br>';
      }
      else{
        console.log('showProfile: no data');
        return;
      }
    });
}

function openPage(target){
    // hide all pages
    document.getElementById('p-profile').style.display = 'none';
    document.getElementById('p-discovery').style.display = 'none';
    // display desired
    document.getElementById(target).style.display = 'block';
}

function onAuthStateChanged(user) {
    // ignore refresh tokens
    if(user && currentUID === user.id){
        // return;
    }

    if (user) {
        // User is signed in.
        currentUID = user.uid;
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        // Initialize Data + Clean Form
        initUserData(macAddr, function(){
            cleanForm.call(splash);
        });
        // [START UI]
            hideUI.call(splash);
            showUI.call(appPage);
        // [END UI]

    }
    else{
        // User signed out
        currentUID = null;
        // [START UI]
            // cleaup UI
            showUI.call(splash);
            hideUI.call(appPage);
        // [END UI]
    }
}

var app = {

    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },

    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        window.addEventListener('load', this.onLoad, false);
    },

    // device ready Event Handler
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    // load Event Handler
    onLoad: function() {
        app.receivedEvent('load');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        if(id === 'deviceready'){
            // document.getElementById("users").setAttribute("style", "display: none");
            // Initialize Firebase and Enable Bluetooth
            /*
            new Promise (function (resolve, reject) {
                var config = {
                apiKey: "AIzaSyDgzJxMjYmVi80mXOLMWPwGao5ohCnaFXo",
                authDomain: "fir-test-ff157.firebaseapp.com",
                databaseURL: "https://fir-test-ff157.firebaseio.com",
                storageBucket: "fir-test-ff157.appspot.com",
                messagingSenderId: "272158210105"
                };
                firebase.initializeApp(config);
                resolve(0);
            }).then(startBluetooth, handleError
            ).then(enableSuccess, handleError);
            */

            // Initialize Firebase

            new Promise (function (resolve, reject) {
                var config = {
                apiKey: "AIzaSyD8uRsr0Cwen-k-JwOx5Am0ARu7jDH9AV0",
                authDomain: "myapp-dc1cb.firebaseapp.com",
                databaseURL: "https://myapp-dc1cb.firebaseio.com",
                storageBucket: "myapp-dc1cb.appspot.com",
                messagingSenderId: "635172411383"
              };
              firebase.initializeApp(config);
                resolve(0);
            }).then(startBluetooth, handleError
            ).then(enableSuccess, handleError);
              
            //startBluetooth().then(enableSuccess, handleError);
            
            window.MacAddress.getBluetoothMacAddress(
                function(macAddress) {
                    alert(macAddress);
                    macAddr = macAddress;
                    
                },
                function(fail) {
                    alert(fail);
                }
            );
            
        }
        else if(id === 'load'){
            
            // Login form
            document.getElementById("b-login").addEventListener('click', userSignIn, false);
            document.getElementById("b-createAcc").addEventListener('click', openSignUp, false);
            // Signup form
            document.getElementById("b-signup").addEventListener('click', userSignUp, false);
            document.getElementById("b-openLogin").addEventListener('click', openLogin, false);
            // Hidden
            hideUI.call(signUpForm);

            // Hide App Page
            hideUI.call(appPage);
            // App page
            document.getElementById("b-profile").addEventListener("click", function(){
                showProfile(macAddr);
                openPage('p-profile');
            }, false);
            document.getElementById("b-discover").addEventListener("click", function(){
                discover();
                openPage('p-discovery');
            }, false);
            document.getElementById("b-signout").addEventListener("click", userSignOut, false);
            document.getElementById("b-dp-upload").addEventListener('click', function(){
                updateUserData(macAddr, document.getElementById('dp-url').value);
            }, false);
            // Hidden
            hideUI.call(document.getElementById('dp-upload'));
        }

        console.log('Received Event: ' + id);
    }
};

app.initialize();