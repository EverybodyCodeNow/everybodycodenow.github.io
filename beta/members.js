//Authentication Listener
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        $('#home').show();
        $('#signinbox').hide();
        getPerson(user.uid, true);
    } else {
        $('#home').hide();
        $('#signinbox').show();
    }
});


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

function getPerson(id, self) {
    var fieldsSelector, programsAttended,numprograms;
    if (self) {
        fieldsSelector = "#user_profile>div>";
        programsAttended = "#user_programs";
        numprograms = "#user_numProgramsAttended";
    } else {
        fieldsSelector = "#personModalForm > div> div>";
        programsAttended = "#programsInModal";
        numprograms ="#numProgramsAttended";
    }
    var $numProgramsAttended = $(numprograms );
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

        $(programsAttended).html("");
        if (snapshot.child("programs").hasChildren()) {
            snapshot.child("programs").forEach(function(childSnapshot) {
                $(programsAttended).append("<tr><td>" + (childSnapshot.val().date || "") + "</td><td>" + childSnapshot.val().name + "</td><td>" + childSnapshot.val().attended + "</td><td><textarea data-programid='" + childSnapshot.key + "'>" + (childSnapshot.val().comment || "") + "</textarea></td><td><textarea data-programid='" + childSnapshot.key + "'>" + (childSnapshot.val().feedback || "") + "</textarea></td></tr>");
            });

        } else {
            $(programsAttended).append("<tr><td colspan='5'>You haven't attended any programs yet!</td></tr>");

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
