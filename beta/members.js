//Authentication Listener
userId = null;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        $('#home').show();
        $('#signinbox').hide();
        $("#user_programs").html("");
        userId = user.uid;
        getPersonInfo(userId, true);
        getUser();
    } else {
        $('#home').hide();
        $('#signinbox').show();
    }
});
eventsAttendedRef = null;

function getUser() {
    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        var username = snapshot.val().username;
        if (snapshot.child("isAdmin").exists() && snapshot.val().isAdmin) {

        }
        eventsAttendedRef = firebase.database().ref("users/" + userId + "/programs");
        eventsAttendedRef.on('child_added', function(data) {
            var programID = data.key;
            $("#event_" + programID + ">.subscribeEventBtn").html("Canel Joining");
            $("#event_" + programID + ">.subscribeEventBtn").removeClass("btn-primary");
            $("#event_" + programID + ">.subscribeEventBtn").addClass("btn-danger");
            $("#event_" + programID + ">.subscribeEventBtn").attr("onClick", "unjoinEvent(\"" + programID + "\")");

            $("#user_programs").append("<tr id='programsAttended_" + programID + "'><td>" + (getUnixDate(data.val().time) || "") + "</td><td>" + data.val().programName + "</td><td>" + data.val().attended + "</td><td><textarea data-programid='" + data.key + "'>" + (data.val().comment || "") + "</textarea></td><td>" + (data.val().feedback || "") + "</td></tr>");


            // if (snapshot.child("programs").hasChildren()) {
            //     snapshot.child("programs").forEach(function(childSnapshot) {
            //           });
            //
            // } else {
            //     $(programsAttended).append("<tr><td colspan='5'>You haven't attended any programs yet!</td></tr>");
            //
            // }
        });
        eventsAttendedRef.on('child_removed', function(data) {
            var programID = data.key;
            $("#event_" + programID + ">.subscribeEventBtn").html("Join Event");
            $("#event_" + programID + ">.subscribeEventBtn").addClass("btn-primary");
            $("#event_" + programID + ">.subscribeEventBtn").removeClass("btn-danger");
            $("#event_" + programID + ">.subscribeEventBtn").attr("onClick", "joinEvent(\"" + programID + "\")");
            $("#programsAttended_" + programID).remove();
        });


        // ...
    });

}

function joinEvent(programID) {
    firebase.database().ref("users/" + userId + "/programs/" + programID).set({
        programName: $("#event_" + programID).data("programname"),
        time: $("#event_" + programID).data("time"),
        attended: "no"
    });
    firebase.database().ref("programs/" + programID + "/students/" + userId).set({
        attended: "no",
        time: getUnixTime()
    });
}

function unjoinEvent(programID) {
    firebase.database().ref("users/" + userId + "/programs/" + programID).remove();
    firebase.database().ref("programs/" + programID + "/students/" + userId).remove();
}


//Events tab
var eventsRef = firebase.database().ref("programs");
eventsRef.on('child_added', function(data) {
    var programname = data.val().programname;
    var address = data.val().address + " " + data.val().city + " " + data.val().country + " " + data.val().zipcode;
    var time = data.val().time;
    var description = data.val().description;
    var id = data.key;
    $('#events').append("<div class='event_card' id='event_" + id + "' data-programName='" + programname + "' data-time='" + time + "'> <h1>" + programname + "</h1> <p> " + description.substring(0, 50) + "... </p> <div class='btn btn-primary btn-lg subscribeEventBtn' onClick='joinEvent(\"" + id + "\")'>Join Event</div> <div class='btn btn-info btn-lg' onClick='programInfo(\"" + id + "\")'>More Information</div> </div>");
});


// //Events tab:



//Students Tab:
people = [];
var peopleRef = firebase.database().ref("users");
peopleRef.on('child_added', function(data) {
    var person = data.val().firstName + " " + data.val().lastName + ", " + data.val().email + ", " + data.val().phone;
    people.push({
        id: data.key,
        name: person
    });
    $('#people').append("<tr onClick=\"getPerson('" + data.key + "')\"><td>" + data.val().firstName + " " + data.val().lastName + "</td><td>" + data.val().email + "</td><td>" + data.val().phone + "</td></tr>");
});
var $student = $('.typeahead');
$student.typeahead({
    source: people,
    autoSelect: true,
    showHintOnFocus: true
});
$student.change(function() {
    var current = $student.typeahead("getActive");
    if (current) {
        // Some item from your model is active!
        if (current.name == $student.val()) {
            getPerson(current.id);
        }
    } else {
        // Nothing is active so it is a new value (or maybe empty value)
    }
});

function getPersonInfo(id, self) {
    var fieldsSelector, programsAttended, numprograms;
    if (self) {
        fieldsSelector = "#user_profile>div>";
        programsAttended = "#user_programs";
        numprograms = "#user_numProgramsAttended";
    } else {
        fieldsSelector = "#personModalForm > div> div>";
        programsAttended = "#programsInModal";
        numprograms = "#numProgramsAttended";
    }
    var $numProgramsAttended = $(numprograms);
    var $email = $(fieldsSelector + " input[name='email']");
    var $phone = $(fieldsSelector + "  input[name = 'phone']");
    var $firstName = $(fieldsSelector + "input[name = 'firstName']");
    var $lastName = $(fieldsSelector + "  input[name = 'lastName']");
    var $emergency_name = $(fieldsSelector + "input[name = 'emergency_name']");
    var $emergency_email = $(fieldsSelector + " input[name = 'emergency_email']");
    var $emergency_phone = $(fieldsSelector + "input[name = 'emergency_phone']");
    var $dobDay = $(fieldsSelector + " select[name = 'day']");
    var $dobMonth = $(fieldsSelector + "  select[name = 'month']");
    var $dobYear = $(fieldsSelector + "  select[name = 'year']");
    var $school = $(fieldsSelector + "  input[name = 'school']");
    var $address = $(fieldsSelector + " input[name = 'address']");
    var $city = $(fieldsSelector + "  input[name = 'city']");
    var $state = $(fieldsSelector + " select[name = 'state']");
    var $country = $(fieldsSelector + "  select[name = 'country']");
    var $zipcode = $(fieldsSelector + "  input[name = 'zipcode']");
    firebase.database().ref('/users/' + id).once('value').then(function(snapshot) {
        $numProgramsAttended.html((snapshot.child("programs").numChildren()));
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
    if (!self) {
        $('#personModal').modal({
            show: true
        });
    }
}
