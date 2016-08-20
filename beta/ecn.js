// Initialize Firebase
var config = {
    apiKey: "AIzaSyCZbco1VR3tONggfZmmVc9O8cyswZL1T_U",
    authDomain: "everybodycodenow-d4f23.firebaseapp.com",
    databaseURL: "https://everybodycodenow-d4f23.firebaseio.com",
    storageBucket: "",
};
firebase.initializeApp(config);

//Authentication Listener
firebase.auth().onAuthStateChanged(function(user) {
    //setLastOnline() writes the last time the user was logged on to db.
    function setLastOnline(user) {
        if (user) {
            var lastOnlines = firebase.database().ref("users/" + user.uid).update({
                "lastOnline": getUnixTime()
            });
        }
    }
    var timer; //Interval to call setLastOnline(), Initialized later
    if (user) { //If logged in:
        var uid = user.uid;
        if ($('#membersPageBtn').length == 0) { //If members page button !exists create it:
            $('.authBtn').append('<span class="btn" id="membersPageBtn"><a href="members.html" target="_blank" style="color:#FFF"><i class="material-icons">face</i><br>Members Page</a></span>')
        } else { //Else just show it:
            $('#membersPageBtn').show();
        }
        $('.authBtn>span#authBtn').html('<i class="material-icons">power_settings_new</i><br>Sign Out'); //Change login button to signout button.
        $('.authBtn>span#authBtn').attr("onclick", "signout();"); //When it's clicked call signout()

        timer = setInterval(function() { //Timer to record last online time.
            setLastOnline(user);
        }, 60000);

    } else {
        clearInterval(timer); //Clear the set last online time Interval.
        showSignup(); //Show the sign in/up button
        $('#membersPageBtn').hide(); //Hide the members page button
    }
});
//Sign out function
function signout() {
    firebase.auth().signOut();
}

//Bottom Navigation Controllers:
$('.action[href="#home"]').addClass('action_active');
$('.action').click(function() {
    $('.action').removeClass('action_active');
    $(this).addClass('action_active');
});


//Gets current time in UNIX format
function getUnixTime() {
    return "" + Date.now();
}

//Converts UNIX time to actual date.
function getUnixDate(timestamp) {
    var dt = eval(timestamp);
    var myDate = new Date(dt);
    return (myDate.toLocaleString());
}
