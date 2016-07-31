// Initialize Firebase
var config = {
    apiKey: "AIzaSyCZbco1VR3tONggfZmmVc9O8cyswZL1T_U",
    authDomain: "everybodycodenow-d4f23.firebaseapp.com",
    databaseURL: "https://everybodycodenow-d4f23.firebaseio.com",
    storageBucket: "",
};
firebase.initializeApp(config);

//Contact Form submission.
$('#contactus-btn').click(function() {
    var $name = $('#contactus-name');
    var $email = $('#contactus-email');
    var $comment = $('#contactus-comment');
    var date = Date();
    var passVali = true;
    if ($name.val() == "") {
        $name.css("border", "solid red 2px");
        var passVali = false;
    }
    if ($email.val() == "") {
        $email.css("border", "solid red 2px");
        var passVali = false;
    }
    if ($comment.val() == "") {
        $comment.css("border", "solid red 2px");
        var passVali = false;
    }
    if (passVali) {
        $name.css("border", "none");
        $email.css("border", "none");
        $comment.css("border", "none");
        var fayabase = new Firebase("https://everybodycodenow-d4f23.firebaseio.com/contactus-messages/");
        var newPostRef = fayabase.push();
        newPostRef.set({
            uname: $name.val(),
            uemail: $email.val(),
            ucomment: $comment.val(),
            udate: date
        });
        $('#contactus_message').show().html('<p style="color:green;">Thanks for your response! We\'ll try to get back to you within a day or two!</p>').fadeOut(5000);
        $('#contactus-name').val('');
        $('#contactus-email').val('');
        $('#contactus-comment').val('');
    } else {
        $('#contactus_message').show().html('<p style="color:red;">Please fill in the red boxes.</p>');
    }
});

//Authentication Listener
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        programSignup();
        var uid = user.uid;
        firebase.database().ref('/users/' + uid).once('value').then(function(snapshot) {
            var isAdmin = snapshot.val().isAdmin;
            if (isAdmin == true) {
                if ($('#adminBtn').length == 0) {
                    $('.authBtn').append('<span class="btn btn-primary" id="adminBtn"><a href="admin.html" target="_blank" style="color:#FFF">Members Only</a></span>')
                } else {
                    $('#adminBtn').show();
                }
            }
        });

        $('#programs_authMessage').html('You\'re not signed up for any programs. <a href="#home">Sign up now!</a>');

    } else {
        showSignup();
        $('#adminBtn').hide();
        $('#programs_authMessage').html('You\'re not signed in. <a href="#home">Sign in or sign up</a> to see the programs you\'re registered for or have already attended!');
    }
});
//Shows Signup Form
function showSignup() {
    $("#signin").parent().hide();
    $("#programSignup").parent().hide();
    $('.authBtn>span#authBtn').html('Sign In');
    $('.authBtn>span#authBtn').attr("onclick", "showSignin();");
    $("#signup").parent().show();
}
//Shows Sign in Form
function showSignin() {
    $("#signup").parent().hide();
    $("#programSignup").parent().hide();
    $("#signin").parent().show();
    $('.authBtn>span#authBtn').html('Sign Up');
    $('.authBtn>span#authBtn').attr("onclick", "showSignup();")
}
//Shows Program Sign Up form
function programSignup(progId) {
    $("#signin").parent().hide();
    $("#signup").parent().hide();
    $("#programSignup").hide();
    $("#programSignup").parent().show();
    $('.authBtn>span#authBtn').html('Sign Out');
    $('.authBtn>span#authBtn').attr("onclick", "signout();")
    firebase.database().ref('/programs/').once('value').then(function(snapshot) {
        if (snapshot.numChildren() > 0) {
            $("#programSignup").show();
                $("#noProgramMsg").hide();
            firebase.database().ref('/programs/').on('child_added', function(data) {
                data.val().text;
            });
        } else {
            $("#programSignup").hide();
            if ($("#noProgramMsg").length == 0) {
                $("#programSignup").parent().append("<h3 id='noProgramMsg' style='color:#23527c; background-color:#BBDEFB; padding:10px;'>Unfortunately, there are no events scheduled in your area right now. Check back later or send us a <a href='#help'>message</a>!</h3>");
            } else {
                $("#noProgramMsg").show();
            }
        }
    });
}
//Handles if someone is trying to sign up with the same address as one registered before.
function returningStudent() {
    showSignin();
    $("#signinMessage").html("It looks like you already have an email registered with that email address!");
}
//Sign out function
function signout() {
    firebase.auth().signOut();
}

//Program Signup Form submit event
$("#programSignup").submit(function(event) {
    event.preventDefault();
    var $programName = $("#programSignup > div> select[name = 'programName']");
    var $attendingStudents = $("#programSignup >div> #attendingStudents input[name = 'studentId']");
    var $email = $("#programSignup >div> input[name = 'email']");
    var $specialNotes = $("#programSignup > div>textarea[name = 'specialNotes']");
    var $emergency_name = $("#programSignup > div>input[name = 'emergency_name']");
    var $emergency_email = $("#programSignup >div> input[name = 'emergency_email']");
    var $emergency_phone = $("#programSignup > div>input[name = 'emergency_phone']");
    var studentData = {
        "uid": id,
        "email": $email.val(),
        "specialNotes": $specialNotes.val(),
        "programName": $programName.key(),
        "programId": $programName.val(),
        "emergencyName": $emergency_name.val(),
        "emergencyEmail": $emergency_email.val(),
        "emergencyPhone": $emergency_phone.val()
    };
    firebase.database().ref("programs/" + $programName.val() + "/attendies").push(studentData);
    firebase.database().ref("students/" + studentId + "/programs").push(studentData);
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


//Sign Up Form submit event
$("#signup").submit(function(event) {
    var $email = $('#signup > div> input[name="email"]');
    var $password = $('#signup > div>  input[name = "password"]');
    var $phone = $("#signup > div>  input[name = 'phone']");
    var $firstName = $("#signup > div>  input[name = 'firstName']");
    var $lastName = $("#signup > div>  input[name = 'lastName']");
    var $dobDay = $("#signup > div>  select[name = 'day']");
    var $dobMonth = $("#signup > div>  select[name = 'month']");
    var $dobYear = $("#signup > div>  select[name = 'year']");
    var $school = $("#signup > div>  input[name = 'school']");
    var $address = $("#signup > div>  input[name = 'address']");
    var $city = $("#signup > div>  input[name = 'city']");
    var $state = $("#signup > div>  select[name = 'state']");
    var $country = $("#signup > div>  select[name = 'country']");
    var $zipcode = $("#signup > div>  input[name = 'zipcode']");
    var $programName = $("#signup > div>  select[name = 'programName']");

    event.preventDefault();
    var passVali = true;
    //validation check
    if ($email.val() == "") {
        passVali = false;
        $email.css("border", "solid 2px red");
    }
    if ($password.val() == "") {
        passVali = false;
        $password.css("border", "solid 2px red");
    }
    if ($firstName.val() == "") {
        passVali = false;
        $firstName.css("border", "solid 2px red");
    }
    if ($lastName.val() == "") {
        passVali = false;
        $lastName.css("border", "solid 2px red");
    }
    if ($dobDay.val() == "") {
        passVali = false;
        $dobDay.css("border", "solid 2px red");
    }
    if ($dobMonth.val() == "") {
        passVali = false;
        $dobMonth.css("border", "solid 2px red");
    }
    if ($dobYear.val() == "") {
        passVali = false;
        $dobYear.css("border", "solid 2px red");
    }
    if ($school.val() == "") {
        passVali = false;
        $school.css("border", "solid 2px red");
    }
    if ($address.val() == "") {
        passVali = false;
        $address.css("border", "solid 2px red");
    }
    if ($city.val() == "") {
        passVali = false;
        $city.css("border", "solid 2px red");
    }
    if ($state.val() == "") {
        passVali = false;
        $state.css("border", "solid 2px red");
    }
    if ($zipcode.val() == "") {
        passVali = false;
        $zipcode.css("border", "solid 2px red");
    }
    if (!passVali) {
        $("#signupMessage").html("Please fill in the red boxes.");
        alert("Please fill in the red boxes.");
    } else {
        var passErrors = true;
        firebase.auth().createUserWithEmailAndPassword($email.val(), $password.val()).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode == "auth/invalid-email") {
                $email.css("border", "solid 2px red");
                $("#signupMessage").html("Please double check your email");
                passErrors = false;
            } else if (errorCode == "auth/email-already-in-use") {
                returningStudent();
                passErrors = false;
            } else if (errorCode == "auth/weak-password") {
                $password.css("border", "solid 2px red");
                $("#signupMessage").html("Please use a stronger password. Try using using at least 6 characters, numbers and letters.");
                passErrors = false;
            } else {
                $("#signupMessage").html("Sorry we can't sign you up at this time. Try again later!");
                passErrors = false;
            }
        }).then(function() {
            if (passErrors) {
                var user = firebase.auth().currentUser;
                var id = user.uid;
                var dbRef = firebase.database().ref('users/' + id);
                dbRef.update({
                    "email": $email.val()
                });
                var studentData = {
                    "email": $email.val(),
                    "uid": id,
                    "firstName": $firstName.val(),
                    "lastName": $lastName.val(),
                    "school": $school.val(),
                    "dob": $dobMonth.val() + "/" + $dobDay.val() + "/" + $dobYear.val(),
                    "address": $address.val(),
                    "city": $city.val(),
                    "zipcode": $zipcode.val(),
                    "state": $state.val(),
                    "country": $country.val(),
                    "phone": $phone.val()
                };
                firebase.database().ref("students").push(studentData);
                programSignup($programName.val());
            }
        });
    }
});

//Bottom Navigation Controllers:
$('.action[href="#home"]').addClass('action_active');
$('body>header>span').html("Home");
$('.action').click(function() {
    $('.action').removeClass('action_active');
    $(this).addClass('action_active');
});
$(document).bind('scroll', function(e) {
    $('.box').each(function() {
        if (
            $(this).offset().top < window.pageYOffset + 10
            //begins before top
            &&
            $(this).offset().top + $(this).height() > window.pageYOffset + 10
            //but ends in visible area
            //+ 10 allows you to change hash before it hits the top border
        ) {
            var hash = $(this).attr('id');
            window.location.hash = hash;
            $('.action').removeClass('action_active');
            $('.action[href="#' + hash + '"]').addClass('action_active');
            $('body>header>span').html(hash);
        }
    });
});
