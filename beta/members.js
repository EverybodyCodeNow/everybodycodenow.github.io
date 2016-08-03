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
    if (user) {
        $('#home').show();
        $('#signinbox').hide();
        $('.authBtn>span#authBtn').html('Sign Out');
        $('.authBtn>span#authBtn').attr("onclick", "signout();");
        uid = user.uid;
        // firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
        //     var isAdmin = snapshot.val().isAdmin;
        //     if (isAdmin == true) {
        //         if ($('#adminBtn').length == 0) {
        //             $('.authBtn').append('<span class="btn btn-primary" id="adminBtn"><a href="members.html" target="_blank" style="color:#FFF">Members Page</a></span>')
        //         } else {
        //             $('#adminBtn').show();
        //         }
        //     }
        // });


    } else {
        $('#home').hide();
        $('#signinbox').show();

        $('.authBtn>span#authBtn').html('Please Sign In.');
    }
});


//Sign In Form submit event
$("#signin").submit(function(event) {
    event.preventDefault();
    var $email = $('#signin > div> input[name = "email"]');
    var $password = $('#signin > div>input[name = "password"]');
    var passVali = true;
    //validation check
    if ($email.val() == "") {
        passVali = false;
        $email.css("border", "solid 2px red");
    }
    if (!passVali) {
        $("#signinMessage").html("Please fill in the red boxes.");
    } else {
        var passErrors = true;
        firebase.auth().signInWithEmailAndPassword($email.val(), $password.val()).catch(function(error) {
            var errorCode = error.code;
            if (errorCode == "auth/invalid-email") {
                $email.css("border", "solid 2px red");
                $("#signinMessage").html("Please double check that you typed in your email correctly. Example: 'everybodycodenow@gmail.com'");
                passErrors = false;
            } else if (errorCode == "auth/user-not-found") {
                $("#signinMessage").html("Your email was not found in our database, please <a style='cursor:pointer;' onClick='showSignup();'>sign up</a> first!");
                passErrors = false;
            } else if (errorCode == "auth/wrong-password") {
                $password.css("border", "solid 2px red");
                $("#signinMessage").html("Your email is correct but you've typed in the wrong password! :(");
                passErrors = false;
            } else {
                $("#signinMessage").html("Ooops, we've encountered a problem. Please refresh the page and try again!");
                passErrors = false;
            }
        });
    }
});
//Sign out function
function signout() {
    firebase.auth().signOut();
}
people = [];
var peopleRef = firebase.database().ref("students");
peopleRef.on('child_added', function(data) {
  var person = data.val().firstName+ " "+ data.val().lastName+", "+data.val().email+", "+data.val().phone;
  people.push({id:data.key, name: person});
  $('#people').append("<tr onClick=\"getPerson('"+data.key+"')\"><td>"+data.val().firstName+" "+data.val().lastName+"</td><td>"+data.val().email+"</td><td>"+data.val().phone+"</td></tr>");
});
var $input = $('.typeahead');
$input.typeahead({
    source: people,
    autoSelect: true, showHintOnFocus: true
});
$input.change(function() {
    var current = $input.typeahead("getActive");
    if (current) {
        // Some item from your model is active!
        if (current.name == $input.val()) {
            getPerson(current.id);
        }
    } else {
        // Nothing is active so it is a new value (or maybe empty value)
    }
});

function getPerson(id){
  firebase.database().ref('/users/' + id.once('value').then(function(snapshot) {
  var username = snapshot.val().username;
  // ...
});

    $('#personModal').modal({
        show: true
    });
}
