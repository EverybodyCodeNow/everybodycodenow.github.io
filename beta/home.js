//Contact Form submission.
$('#contactus-btn').click(function() {
    var $name = $('#contactus-name');
    var $email = $('#contactus-email');
    var $comment = $('#contactus-comment');
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
        var fayabase = firebase.database().ref("contactus-messages/");
        var newPostRef = fayabase.push();
        newPostRef.set({
            uname: $name.val(),
            uemail: $email.val(),
            ucomment: $comment.val(),
            udate: getUnixTime
        });
        $('#contactus_message').show().html('<p style="color:green;">Thanks for your response! We\'ll try to get back to you within a day or two!</p>').fadeOut(5000);
        $('#contactus-name').val('');
        $('#contactus-email').val('');
        $('#contactus-comment').val('');
    } else {
        $('#contactus_message').show().html('<p style="color:red;">Please fill in the red boxes.</p>');
    }
});



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
    var $dobDay = $("#signup > div>  select[name = 'day']");
    var $dobMonth = $("#signup > div>  select[name = 'month']");
    var $dobYear = $("#signup > div>  select[name = 'year']");
    var $school = $("#signup > div>  input[name = 'school']");
    var $address = $("#signup > div>  input[name = 'address']");
    var $city = $("#signup > div>  input[name = 'city']");
    var $state = $("#signup > div>  select[name = 'state']");
    var $country = $("#signup > div>  select[name = 'country']");
    var $zipcode = $("#signup > div>  input[name = 'zipcode']");
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
    var studentData = {
        "uid": id,
        "email": $email.val(),
        "school": $school.val(),
        "dobDay": $dobDay.val(),
        "dobMonth": $dobMonth.val(),
        "dobYear": $dobYear.val(),
        "dob": $dobMonth.val() + "/" + $dobDay.val() + "/" + $dobYear.val(),
        "address": $address.val(),
        "city": $city.val(),
        "zipcode": $zipcode.val(),
        "state": $state.val(),
        "country": $country.val(),
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
                    "phone": $phone.val()
                };
                firebase.database().ref("students").push(studentData);
                programSignup($programName.val());
            }
        });
    }
});
