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
    function setLastOnline(user) {
        if (user) {
            var lastOnlines = firebase.database().ref("users/" + user.uid).update({
                "lastOnline": getUnixTime()
            });
        }
    }
    var timer;
    if (user) {
        $('#home').show();
        $('#signinbox').hide();
        $('.authBtn>span#authBtn').html('Sign Out');
        $('.authBtn>span#authBtn').attr("onclick", "signout();");
        uid = user.uid;

        timer = setInterval(function() {
            setLastOnline(user);
        }, 60000);
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
        clearInterval(timer);
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
    var person = data.val().firstName + " " + data.val().lastName + ", " + data.val().email + ", " + data.val().phone;
    people.push({
        id: data.key,
        name: person
    });
    $('#people').append("<tr onClick=\"getPerson('" + data.key + "')\"><td>" + data.val().firstName + " " + data.val().lastName + "</td><td>" + data.val().email + "</td><td>" + data.val().phone + "</td></tr>");
});
var $input = $('.typeahead');
$input.typeahead({
    source: people,
    autoSelect: true,
    showHintOnFocus: true
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

function getPerson(id) {
    var $numProgramsAttended = $("#personModalForm > div> div>  #numProgramsAttended");
    var $email = $('#personModalForm > div> div> input[name="email"]');
    var $phone = $("#personModalForm > div> div>  input[name = 'phone']");
    var $firstName = $("#personModalForm > div> div>input[name = 'firstName']");
    var $lastName = $("#personModalForm > div> div>  input[name = 'lastName']");
    var $emergency_name = $("#personModalForm > div> div>input[name = 'emergency_name']");
    var $emergency_email = $("#personModalForm > div> div> input[name = 'emergency_email']");
    var $emergency_phone = $("#personModalForm > div> div>input[name = 'emergency_phone']");
    var $dobDay = $("#personModalForm > div> div> select[name = 'day']");
    var $dobMonth = $("#personModalForm > div> div>  select[name = 'month']");
    var $dobYear = $("#personModalForm > div> div>  select[name = 'year']");
    var $school = $("#personModalForm > div> div>  input[name = 'school']");
    var $address = $("#personModalForm > div> div> input[name = 'address']");
    var $city = $("#personModalForm > div> div>  input[name = 'city']");
    var $state = $("#personModalForm > div> div> select[name = 'state']");
    var $country = $("#personModalForm > div> div>  select[name = 'country']");
    var $zipcode = $("#personModalForm > div> div>  input[name = 'zipcode']");
    firebase.database().ref('/students/' + id).once('value').then(function(snapshot) {
        $numProgramsAttended.html((snapshot.child("programs").numChildren()));
        $('#programsInModal').html("");
        if (snapshot.child("programs").hasChildren()) {
            snapshot.child("programs").forEach(function(childSnapshot) {
                $('#programsInModal').append("<tr><td>"+(childSnapshot.val().date||"")+"</td><td>"+childSnapshot.val().name+"</td><td>"+childSnapshot.val().attended+"</td><td><textarea data-programid='"+childSnapshot.key+"'>"+(childSnapshot.val().comment||"")+"</textarea></td><td><textarea data-programid='"+childSnapshot.key+"'>"+(childSnapshot.val().feedback||"")+"</textarea></td></tr>");
            });

        } else {
            $('#programsInModal').append("<tr><td colspan='5'>You haven't attended any programs yet!</td></tr>");

        }
        $firstName.val(snapshot.val().firstName);
        $lastName.val(snapshot.val().lastName);
        $email.val(snapshot.val().email);
        $phone.val(snapshot.val().phone);
        $email.val(snapshot.val().email);
        $emergency_name.val(snapshot.val().emergency_name);
        $emergency_email.val(snapshot.val().emergency_email);
        $emergency_phone.val(snapshot.val().emergency_phone);
        $emergency_phone.val(snapshot.val().emergency_phone);
        $dobDay.val(snapshot.val().dobDay);
        $dobMonth.val(snapshot.val().dobMonth);
        $dobYear.val(snapshot.val().dobYear);
        $school.val(snapshot.val().school);
        $address.val(snapshot.val().address);
        $city.val(snapshot.val().city);
        $state.val(snapshot.val().state);
        $country.val(snapshot.val().country);
        $zipcode.val(snapshot.val().zipcode);

        // ...
    });
    $('#personModal').modal({
        show: true
    });
}

function getUnixTime() {
    return "" + Date.now();
}

function getUnixDate(timestamp) {
    var dt = eval(timestamp);
    var myDate = new Date(dt);
    return (myDate.toLocaleString());
}
