//Authentication Listener
$('.datetimepicker').datetimepicker({
    format: 'd/M/Y H:i:00',
    inline: true,
    defaultDate: new Date()
});
userId = null; //Current logged-in user id.
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
        userId = null;
    }
});
eventsAttendedRef = null; //Database reference.
numOfProgramsSubscribed = 0; //Keeps track of programs in Progress tab

function getUser() {
    firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        if (!snapshot.child("programs").hasChildren()) {
            $("#user_programs").append("<tr id='programsAttended_non'><td colspan='5'>You haven't attended any programs yet!</td></tr>");
            $("#user_numProgramsAttended").html(numOfProgramsSubscribed);
        } else {
            numOfProgramsSubscribed = snapshot.child("programs").numChildren();
        }
        var username = snapshot.val().username;
        if (snapshot.child("isAdmin").exists() && snapshot.val().isAdmin) {

        }
        eventsAttendedRef = firebase.database().ref("users/" + userId + "/programs");
        eventsAttendedRef.on('child_added', function(data) {
            var programID = data.key;
            //Change color and text of Join button
            $("#event_" + programID + ">.subscribeEventBtn").html("Canel Joining");
            $("#event_" + programID + ">.subscribeEventBtn").removeClass("btn-primary");
            $("#event_" + programID + ">.subscribeEventBtn").addClass("btn-danger");
            $("#event_" + programID + ">.subscribeEventBtn").attr("onClick", "unjoinEvent(\"" + programID + "\")");

            $("#programInfo_" + programID + ">.subscribeEventBtn").html("Canel Joining");
            $("#programInfo_" + programID + ">.subscribeEventBtn").removeClass("btn-primary");
            $("#programInfo_" + programID + ">.subscribeEventBtn").addClass("btn-danger");
            $("#programInfo_" + programID + ">.subscribeEventBtn").attr("onClick", "unjoinEvent(\"" + programID + "\")");
            //Add it to the your progress tab
            $("#user_programs").append("<tr class='programsAttended' id='programsAttended_" + programID + "'><td>" + (getUnixDate(data.val().time) || "") + "</td><td style='cursor:pointer;' onClick='programInfo(\"" + programID + "\")'>" + data.val().programName + "</td><td>" + data.val().attended + "</td><td>" + (data.val().comment || "") + "</td><td><textarea data-programid='" + data.key + "'>" + (data.val().feedback || "") + "</textarea></td></tr>");
        });
        eventsAttendedRef.on('child_removed', function(data) {
            var programID = data.key;
            //Change color and text of unJoin button
            $("#event_" + programID + ">.subscribeEventBtn").html("Join Event");
            $("#event_" + programID + ">.subscribeEventBtn").addClass("btn-primary");
            $("#event_" + programID + ">.subscribeEventBtn").removeClass("btn-danger");
            $("#event_" + programID + ">.subscribeEventBtn").attr("onClick", "joinEvent(\"" + programID + "\")");


            $("#programInfo_" + programID + ">.subscribeEventBtn").html("Join Event");
            $("#programInfo_" + programID + ">.subscribeEventBtn").addClass("btn-primary");
            $("#programInfo_" + programID + ">.subscribeEventBtn").removeClass("btn-danger");
            $("#programInfo_" + programID + ">.subscribeEventBtn").attr("onClick", "joinEvent(\"" + programID + "\")");
            //Remove it from the your progress tab
            $("#programsAttended_" + programID).remove();
        });
    });

}

function joinEvent(programID) {
    //Remove the Not sign up for any programs text
    $('#programsAttended_non').remove();
    //Increment number of programs in Progress tab
    numOfProgramsSubscribed = numOfProgramsSubscribed + 1;
    $("#user_numProgramsAttended").html(numOfProgramsSubscribed);
    //Add program to user node.
    firebase.database().ref("users/" + userId + "/programs/" + programID).set({
        programName: $("#event_" + programID).data("programname"),
        time: $("#event_" + programID).data("time"),
        attended: "no"
    });
    //Add user to program node.
    firebase.database().ref("programs/" + programID + "/students/" + userId).set({
        attended: "no",
        time: getUnixTime()
    });
}

function unjoinEvent(programID) {
    //Reduce the numer of programs in Progress tab
    numOfProgramsSubscribed = numOfProgramsSubscribed - 1;
    $('#user_numProgramsAttended').html(numOfProgramsSubscribed);
    //If number of programs == 0, show the you haven't attended programs text.
    if (numOfProgramsSubscribed == 0) {
        $("#user_programs").append("<tr id='programsAttended_non'><td colspan='5'>You haven't attended any programs yet!</td></tr>");
    }
    //Remove program from user node.
    firebase.database().ref("users/" + userId + "/programs/" + programID).remove();
    //Remove user from program node.
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
    $('#events').append("<div class='event_card' id='event_" + id + "' data-programName='" + programname + "' data-time='" + time + "'> <h1>" + programname + "</h1> <p> " + description.substring(0, 50) + "... </p> <p>" + getUnixDate(time) + "</p><div class='btn btn-primary btn-lg subscribeEventBtn' onClick='joinEvent(\"" + id + "\")'>Join Event</div> <div class='btn btn-info btn-lg' onClick='programInfo(\"" + id + "\")'>More Information</div> </div>");
});


function programInfo(programID) {
    $('#eventInfoBody').html("");
    $('#eventInfo').modal({
        show: true
    });
    firebase.database().ref('/programs/' + programID).once('value').then(function(snapshot) {
        var programname = snapshot.val().programname;
        var address = snapshot.val().address + ", " + snapshot.val().city + ", " + snapshot.val().country + ", " + snapshot.val().zipcode;
        var time = snapshot.val().time;
        var description = snapshot.val().description;
        $('#eventInfoBody').html("<div class='' id='programInfo_" + programID + "' data-programName='" + programname + "' data-time='" + time + "'> <h1>" + programname + "</h1> <p> " + description + " </p> <p>Time: " + getUnixDate(time) + "</p><p>Location: " + address + "</p><div class='btn btn-primary btn-lg subscribeEventBtn' onClick='joinEvent(\"" + programID + "\")'>Join Event</div></div>");
        if (snapshot.child("students/" + userId).exists() || snapshot.child("instructors/" + userId).exists()) {
            $("#programInfo_" + programID + ">.subscribeEventBtn").html("Canel Joining");
            $("#programInfo_" + programID + ">.subscribeEventBtn").removeClass("btn-primary");
            $("#programInfo_" + programID + ">.subscribeEventBtn").addClass("btn-danger");
            $("#programInfo_" + programID + ">.subscribeEventBtn").attr("onClick", "unjoinEvent(\"" + programID + "\")");
        } else {
            //Change color and text of unJoin button
            $("#programInfo_" + programID + ">.subscribeEventBtn").html("Join Event");
            $("#programInfo_" + programID + ">.subscribeEventBtn").addClass("btn-primary");
            $("#programInfo_" + programID + ">.subscribeEventBtn").removeClass("btn-danger");
            $("#programInfo_" + programID + ">.subscribeEventBtn").attr("onClick", "joinEvent(\"" + programID + "\")");
        }
    });
}

//Contact Form submission.
$("#addEventForm").submit(function(event) {
    event.preventDefault();
    var $name = $('#addEventForm > div> div> input[name="name"]');
    var $description = $('#addEventForm > div> div>  textarea[name = "description"]');
    var $time = $("#addEventForm > div>  div> input[name = 'time']");
    var $address = $("#addEventForm > div>div>  input[name = 'address']");
    var $city = $("#addEventForm > div>div>  input[name = 'city']");
    var $state = $("#addEventForm > div>div>  select[name = 'state']");
    var $country = $("#addEventForm > div>div>  select[name = 'country']");
    var $zipcode = $("#addEventForm > div>div>  input[name = 'zipcode']");
    var passVali = true;
    if ($name.val() == "") {
        $name.css("border", "solid red 2px");
        var passVali = false;
    }
    if ($description.val() == "") {
        $description.css("border", "solid red 2px");
        var passVali = false;
    }
    if ($time.val() == "") {
        $time.css("border", "solid red 2px");
        var passVali = false;
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
    if ($country.val() == "") {
        passVali = false;
        $country.css("border", "solid 2px red");
    }
    if (passVali) {
        $name.css("border", "none");
        $description.css("border", "none");
        $time.css("border", "none");
        $address.css("border", "none");
        $city.css("border", "none");
        $state.css("border", "none");
        $country.css("border", "none");
        $zipcode.css("border", "none");
        var fayabase = firebase.database().ref("programs/");
        var newPostRef = fayabase.push();
        var data = {
            programname: $name.val(),
            description: $description.val(),
            time: Date.parse($time.val()),
            address: $address.val(),
            city: $city.val(),
            state: $state.val(),
            country: $country.val(),
            zipcode: $zipcode.val()
        }
        newPostRef.set(data);
        $('#addEventMessage').show().html('<p style="color:green;">Event has been added successfully</p>').fadeOut(5000);

        $name.val("");
        $description.val("");
        $time.val("");
        $address.val("");
        $city.val("");
        $state.val("");
        $country.val("");
        $zipcode.val("");
    } else {
        $('#addEventMessage').show().html('<p style="color:red;">Please fill in the red boxes.</p>');
    }
});

//Contact Us Messages tab:

var contactMessagesRef = firebase.database().ref("contactus-messages");
contactMessagesRef.on('child_added', function(data) {

    var name = data.val().uname;
    var email = data.val().uemail;
    var comment = getUnixDate(data.val().udate) + "<br/>" + data.val().ucomment;
    var read = (data.val().read || "no");
    var replied = (data.val().replied || "no");

    $('#contactus_messages').append("<tr onClick=\"viewMessage('" + data.key + "')\" class='contactmessages'><td>" + name + "</td><td>" + email + "</td><td>" + comment + "</td><td>" + read + "</td><td>" + replied + "</td></tr>");
});
//Contact Form submission.
$("#replyMessage").submit(function(event) {
    event.preventDefault();
    var messageId = $('#replyMessage').data("messageid");
    var $subject = $('#replyMessage > div> div>   input[name="subject"]');
    var $message = $('#replyMessage > textarea[name = "message"]');
    var $email = $("#replyMessage > div>  div>  input[name = 'email']");
    var $secret = $("#replyMessage > div>   input[name = 'secret']");
    var time = getUnixTime();
    var passVali = true;
    if ($subject.val() == "") {
        $name.css("border", "solid red 2px");
        var passVali = false;
    }
    if ($message.val() == "") {
        $message.css("border", "solid red 2px");
        var passVali = false;
    }
    if ($email.val() == "") {
        $email.css("border", "solid red 2px");
        var passVali = false;
    }
    if ($secret.val() == "") {
        $secret.css("border", "solid red 2px");
        var passVali = false;
    }
    if (passVali) {
        $secret.css("border", "none");
        $subject.css("border", "none");
        $message.css("border", "none");
        $email.css("border", "none");
        $.post("http://everybodycodenow.com/mail.php", {
                secret: $secret.val(),
                email: $email.val(),
                subject: $subject.val(),
                message: $message.val()
            }).fail(function() {
                $('#replyMessage_message').show().html('<p style="color:red;">Couldn\'nt send message. Make sure the secret is correct.</p>');
            })
            .done(function(data) {
                if (data != "Email sent.") {
                    $('#replyMessage_message').show().html('<p style="color:red;">Couldn\'nt send message. Make sure the secret is correct.</p>');
                } else {
                    var fayabase = firebase.database().ref("contactus-messages/" + messageId);
                    var data = {
                        replied: true,
                        reply: $message.val(),
                        replytime: time
                    }
                    fayabase.update(data);
                    $('#replyMessage_message').show().html('<p style="color:green;">Message sent successfully.</p>').fadeOut(5000);

                    $subject.val("");
                    $message.val("");
                    $('#replyMessage').hide();
                    $('#messageReply').show();
                    $('#messageReply').html("Replied on: " + snapshot.val().replytime + "<br>" + snapshot.val().reply);
                }
            });
    } else {
        $('#replyMessage_message').show().html('<p style="color:red;">Please fill in the red boxes.</p>');
    }
});

function viewMessage(id) {
    var $subject = $('#replyMessage > div> div>   input[name="subject"]');
    var $message = $('#replyMessage >  textarea[name = "message"]');
    var $email = $("#replyMessage > div> div>  input[name = 'email']");
    $('#replyMessage').data("messageid", id);
    firebase.database().ref('/contactus-messages/' + id).once('value').then(function(snapshot) {
        $('#replyMessage').show();
        $('#messageReply').hide();
        $('#messageReply').html("");
        $subject.val("");
        $message.val("");
        var name = snapshot.val().uname + ", " + snapshot.val().uemail;
        var time = getUnixDate(snapshot.val().udate);
        var comment = snapshot.val().ucomment;
        $email.val(snapshot.val().uemail);
        firebase.database().ref('/contactus-messages/' + id + '/read').set("yes");
        $('#viewMessageContent').html('<div class=""> Sender: ' + name + '</div> <div class=""> Time: ' + time + '</div> <div class=""> ' + comment + ' </div>');

        var replied = snapshot.val().replied;
        if (replied == true) {
            $('#replyMessage').hide();
            $('#messageReply').show();
            $('#messageReply').html("Replied on: " + snapshot.val().replytime + "<br>" + snapshot.val().reply);
        }

    });

    $('#viewMessage').modal({
        show: true
    });

}

//Students Tab:
people = [];
var peopleRef = firebase.database().ref("users");
peopleRef.on('child_added', function(data) {
    var person = data.val().firstName + " " + data.val().lastName + ", " + data.val().email + ", " + (data.val().phone||"");
    people.push({
        id: data.key,
        name: person
    });
    $('#people').append("<tr onClick=\"getPersonInfo('" + data.key + "')\"><td>" + data.val().firstName + " " + data.val().lastName + "</td><td>" + data.val().email + "</td><td>" + (data.val().phone||"") + "</td></tr>");
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
            getPersonInfo(current.id);
        }
    } else {
        // Nothing is active so it is a new value (or maybe empty value)
    }
});

function getPersonInfo(id, self) {
    var fieldsSelector, programsAttended, numprograms;
    if (self) {
        fieldsSelector = "#user_profile>div>";
    } else {
        fieldsSelector = "#personModalForm > div> div>";
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
        $('#numProgramsAttended').html((snapshot.child("programs").numChildren()));
        $('#programsInModal').html("");
        if (snapshot.child("programs").hasChildren()) {
            snapshot.child("programs").forEach(function(childSnapshot) {
                $('#programsInModal').append("<tr><td>" + (getUnixDate(childSnapshot.val().time) || "") + "</td><td>" + childSnapshot.val().programName + "</td><td>" + childSnapshot.val().attended + "</td><td><textarea data-programid='" + childSnapshot.key + "'>" + (childSnapshot.val().comment || "") + "</textarea></td><td><textarea data-programid='" + childSnapshot.key + "'>" + (childSnapshot.val().feedback || "") + "</textarea></td></tr>");
            });

        } else {
            $('#programsInModal').append("<tr><td colspan='5'>This student hasn't attended any programs yet!</td></tr>");

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
    if (!self) {
        $('#personModal').modal({
            show: true
        });
    }
}
