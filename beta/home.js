


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
