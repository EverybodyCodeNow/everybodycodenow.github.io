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
        $('.authBtn>a#authBtn').html('<i class="material-icons">power_settings_new</i><br>Sign Out'); //Change login button to signout button.
        $('.authBtn>a#authBtn').attr("onclick", "signout();"); //When it's clicked call signout()

        timer = setInterval(function() { //Timer to record last online time.
            setLastOnline(user);
        }, 60000);

    } else {
        clearInterval(timer); //Clear the set last online time Interval.
        showSignup(); //Show the sign in/up button
        $('#membersPageBtn').hide(); //Hide the members page button
        $('.authBtn>a#authBtn').html('<i class="material-icons">face</i><br>Sign In/Register'); //Change login button to signout button.
    }
});
//Sign out function
function signout() {
    firebase.auth().signOut();
}


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
                $("#signinMessage").html("<p style='color:red;'>Please double check that you typed in your email correctly. Example: 'everybodycodenow@gmail.com'</p>");
                passErrors = false;
            } else if (errorCode == "auth/user-not-found") {
                $("#signinMessage").html("<p style='color:red;'>Your email was not found in our database, please <a style='cursor:pointer;' href='#signup'>sign up</a> first!</p>");
                passErrors = false;
            } else if (errorCode == "auth/wrong-password") {
                $password.css("border", "solid 2px red");
                $("#signinMessage").html("<p style='color:red;'>Your email is correct but you've typed in the wrong password!</p>");
                passErrors = false;
            } else {
                $("#signinMessage").html("<p style='color:red;'>Ooops, we've encountered a problem. Please refresh the page and try again!</p>");
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
        $("#signupMessage").html("<p style='color:red;'>Please fill in the red boxes.</p>");
    } else {
        var passErrors = true;
        firebase.auth().createUserWithEmailAndPassword($email.val(), $password.val()).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            firebase.database().ref("errors").push({
                time: getUnixTime(),
                errorm: errorMessage,
                errorc: errorCode
            });
            if (errorCode == "auth/invalid-email") {
                $email.css("border", "solid 2px red");
                $("#signupMessage").html("<p style='color:red;'>Please double check your email</p>");
                passErrors = false;
            } else if (errorCode == "auth/email-already-in-use") {
                $("#signupMessage").html("<p style='color:red;'>This email is already in use. Please sign in, or use another email.</p>");
                passErrors = false;
            } else if (errorCode == "auth/weak-password") {
                $password.css("border", "solid 2px red");
                $("#signupMessage").html("<p style='color:red;'>Please use a stronger password. Try using using at least 6 characters, numbers and letters.</p>");
                passErrors = false;
            } else {
                $("#signupMessage").html("<p style='color:red;'>Sorry we can't sign you up at this time. Try again later!</p>");
                passErrors = false;
            }
        }).then(function() {
            if (passErrors) {
                var user = firebase.auth().currentUser;
                var id = user.uid;
                var studentData = {
                    "email": $email.val(),
                    "uid": id,
                    "firstName": $firstName.val(),
                    "lastName": $lastName.val(),
                    "phone": $phone.val()
                };
                firebase.database().ref("users/" + id).update(studentData);
            }
        });
    }
});

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
            udate: getUnixTime()
        });
        $('#contactus_message').show().html('<p style="color:green;">Thanks for your response! We\'ll try to get back to you within a day or two!</p>').fadeOut(5000);
        $('#contactus-name').val('');
        $('#contactus-email').val('');
        $('#contactus-comment').val('');
    } else {
        $('#contactus_message').show().html('<p style="color:red;">Please fill in the red boxes.</p>');
    }
});


//Gets current time in UNIX format
function getUnixTime() {
    return "" + Date.now();
}

//Converts UNIX time to actual date.
function getUnixDate(timestamp) {
    var dt = eval(timestamp);
    var myDate = new Date(dt);
    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return (myDate.toLocaleString('en-US', options));
}

//Makes the html files a lot shorter :P Idk how this affects performance though <_<
$('select[name="month"]').html('<option value="">Month</option> <option value="01">January</option> <option value="02">February</option> <option value="03">March</option> <option value="04">April</option> <option value="05">May</option> <option value="06">June</option> <option value="07">July</option> <option value="08">August</option> <option value="09">September</option> <option value="10">October</option> <option value="11">November</option> <option value="12">December</option>');
$('select[name="country"]').html('<option value="US">United States of America</option> <option value="AF">Afghanistan</option> <option value="AX">Åland Islands</option> <option value="AL">Albania</option> <option value="DZ">Algeria</option> <option value="AS">American Samoa</option> <option value="AD">Andorra</option> <option value="AO">Angola</option> <option value="AI">Anguilla</option> <option value="AQ">Antarctica</option> <option value="AG">Antigua and Barbuda</option> <option value="AR">Argentina</option> <option value="AM">Armenia</option> <option value="AW">Aruba</option> <option value="AU">Australia</option> <option value="AT">Austria</option> <option value="AZ">Azerbaijan</option> <option value="BS">Bahamas</option> <option value="BH">Bahrain</option> <option value="BD">Bangladesh</option> <option value="BB">Barbados</option> <option value="BY">Belarus</option> <option value="BE">Belgium</option> <option value="BZ">Belize</option> <option value="BJ">Benin</option> <option value="BM">Bermuda</option> <option value="BT">Bhutan</option> <option value="BO">Bolivia, Plurinational State of</option> <option value="BQ">Bonaire, Sint Eustatius and Saba</option> <option value="BA">Bosnia and Herzegovina</option> <option value="BW">Botswana</option> <option value="BV">Bouvet Island</option> <option value="BR">Brazil</option> <option value="IO">British Indian Ocean Territory</option> <option value="BN">Brunei Darussalam</option> <option value="BG">Bulgaria</option> <option value="BF">Burkina Faso</option> <option value="BI">Burundi</option> <option value="KH">Cambodia</option> <option value="CM">Cameroon</option> <option value="CA">Canada</option> <option value="CV">Cape Verde</option> <option value="KY">Cayman Islands</option> <option value="CF">Central African Republic</option> <option value="TD">Chad</option> <option value="CL">Chile</option> <option value="CN">China</option> <option value="CX">Christmas Island</option> <option value="CC">Cocos (Keeling) Islands</option> <option value="CO">Colombia</option> <option value="KM">Comoros</option> <option value="CG">Congo</option> <option value="CD">Congo, the Democratic Republic of the</option> <option value="CK">Cook Islands</option> <option value="CR">Costa Rica</option> <option value="CI">Côte d\'Ivoire</option> <option value="HR">Croatia</option> <option value="CU">Cuba</option> <option value="CW">Curaçao</option> <option value="CY">Cyprus</option> <option value="CZ">Czech Republic</option> <option value="DK">Denmark</option> <option value="DJ">Djibouti</option> <option value="DM">Dominica</option> <option value="DO">Dominican Republic</option> <option value="EC">Ecuador</option> <option value="EG">Egypt</option> <option value="SV">El Salvador</option> <option value="GQ">Equatorial Guinea</option> <option value="ER">Eritrea</option> <option value="EE">Estonia</option> <option value="ET">Ethiopia</option> <option value="FK">Falkland Islands (Malvinas)</option> <option value="FO">Faroe Islands</option> <option value="FJ">Fiji</option> <option value="FI">Finland</option> <option value="FR">France</option> <option value="GF">French Guiana</option> <option value="PF">French Polynesia</option> <option value="TF">French Southern Territories</option> <option value="GA">Gabon</option> <option value="GM">Gambia</option> <option value="GE">Georgia</option> <option value="DE">Germany</option> <option value="GH">Ghana</option> <option value="GI">Gibraltar</option> <option value="GR">Greece</option> <option value="GL">Greenland</option> <option value="GD">Grenada</option> <option value="GP">Guadeloupe</option> <option value="GU">Guam</option> <option value="GT">Guatemala</option> <option value="GG">Guernsey</option> <option value="GN">Guinea</option> <option value="GW">Guinea-Bissau</option> <option value="GY">Guyana</option> <option value="HT">Haiti</option> <option value="HM">Heard Island and McDonald Islands</option> <option value="VA">Holy See (Vatican City State)</option> <option value="HN">Honduras</option> <option value="HK">Hong Kong</option> <option value="HU">Hungary</option> <option value="IS">Iceland</option> <option value="IN">India</option> <option value="ID">Indonesia</option> <option value="IR">Iran, Islamic Republic of</option> <option value="IQ">Iraq</option> <option value="IE">Ireland</option> <option value="IM">Isle of Man</option> <option value="IL">Israel</option> <option value="IT">Italy</option> <option value="JM">Jamaica</option> <option value="JP">Japan</option> <option value="JE">Jersey</option> <option value="JO">Jordan</option> <option value="KZ">Kazakhstan</option> <option value="KE">Kenya</option> <option value="KI">Kiribati</option> <option value="KP">Korea, Democratic People\'s Republic of</option> <option value="KR">Korea, Republic of</option> <option value="KW">Kuwait</option> <option value="KG">Kyrgyzstan</option> <option value="LA">Lao People\'s Democratic Republic</option> <option value="LV">Latvia</option> <option value="LB">Lebanon</option> <option value="LS">Lesotho</option> <option value="LR">Liberia</option> <option value="LY">Libya</option> <option value="LI">Liechtenstein</option> <option value="LT">Lithuania</option> <option value="LU">Luxembourg</option> <option value="MO">Macao</option> <option value="MK">Macedonia, the former Yugoslav Republic of</option> <option value="MG">Madagascar</option> <option value="MW">Malawi</option> <option value="MY">Malaysia</option> <option value="MV">Maldives</option> <option value="ML">Mali</option> <option value="MT">Malta</option> <option value="MH">Marshall Islands</option> <option value="MQ">Martinique</option> <option value="MR">Mauritania</option> <option value="MU">Mauritius</option> <option value="YT">Mayotte</option> <option value="MX">Mexico</option> <option value="FM">Micronesia, Federated States of</option> <option value="MD">Moldova, Republic of</option> <option value="MC">Monaco</option> <option value="MN">Mongolia</option> <option value="ME">Montenegro</option> <option value="MS">Montserrat</option> <option value="MA">Morocco</option> <option value="MZ">Mozambique</option> <option value="MM">Myanmar</option> <option value="NA">Namibia</option> <option value="NR">Nauru</option> <option value="NP">Nepal</option> <option value="NL">Netherlands</option> <option value="NC">New Caledonia</option> <option value="NZ">New Zealand</option> <option value="NI">Nicaragua</option> <option value="NE">Niger</option> <option value="NG">Nigeria</option> <option value="NU">Niue</option> <option value="NF">Norfolk Island</option> <option value="MP">Northern Mariana Islands</option> <option value="NO">Norway</option> <option value="OM">Oman</option> <option value="PK">Pakistan</option> <option value="PW">Palau</option> <option value="PS">Palestinian Territory, Occupied</option> <option value="PA">Panama</option> <option value="PG">Papua New Guinea</option> <option value="PY">Paraguay</option> <option value="PE">Peru</option> <option value="PH">Philippines</option> <option value="PN">Pitcairn</option> <option value="PL">Poland</option> <option value="PT">Portugal</option> <option value="PR">Puerto Rico</option> <option value="QA">Qatar</option> <option value="RE">Réunion</option> <option value="RO">Romania</option> <option value="RU">Russian Federation</option> <option value="RW">Rwanda</option> <option value="BL">Saint Barthélemy</option> <option value="SH">Saint Helena, Ascension and Tristan da Cunha</option> <option value="KN">Saint Kitts and Nevis</option> <option value="LC">Saint Lucia</option> <option value="MF">Saint Martin (French part)</option> <option value="PM">Saint Pierre and Miquelon</option> <option value="VC">Saint Vincent and the Grenadines</option> <option value="WS">Samoa</option> <option value="SM">San Marino</option> <option value="ST">Sao Tome and Principe</option> <option value="SA">Saudi Arabia</option> <option value="SN">Senegal</option> <option value="RS">Serbia</option> <option value="SC">Seychelles</option> <option value="SL">Sierra Leone</option> <option value="SG">Singapore</option> <option value="SX">Sint Maarten (Dutch part)</option> <option value="SK">Slovakia</option> <option value="SI">Slovenia</option> <option value="SB">Solomon Islands</option> <option value="SO">Somalia</option> <option value="ZA">South Africa</option> <option value="GS">South Georgia and the South Sandwich Islands</option> <option value="SS">South Sudan</option> <option value="ES">Spain</option> <option value="LK">Sri Lanka</option> <option value="SD">Sudan</option> <option value="SR">Suriname</option> <option value="SJ">Svalbard and Jan Mayen</option> <option value="SZ">Swaziland</option> <option value="SE">Sweden</option> <option value="CH">Switzerland</option> <option value="SY">Syrian Arab Republic</option> <option value="TW">Taiwan, Province of China</option> <option value="TJ">Tajikistan</option> <option value="TZ">Tanzania, United Republic of</option> <option value="TH">Thailand</option> <option value="TL">Timor-Leste</option> <option value="TG">Togo</option> <option value="TK">Tokelau</option> <option value="TO">Tonga</option> <option value="TT">Trinidad and Tobago</option> <option value="TN">Tunisia</option> <option value="TR">Turkey</option> <option value="TM">Turkmenistan</option> <option value="TC">Turks and Caicos Islands</option> <option value="TV">Tuvalu</option> <option value="UG">Uganda</option> <option value="UA">Ukraine</option> <option value="AE">United Arab Emirates</option> <option value="GB">United Kingdom</option> <option value="US">United States</option> <option value="UM">United States Minor Outlying Islands</option> <option value="UY">Uruguay</option> <option value="UZ">Uzbekistan</option> <option value="VU">Vanuatu</option> <option value="VE">Venezuela, Bolivarian Republic of</option> <option value="VN">Viet Nam</option> <option value="VG">Virgin Islands, British</option> <option value="VI">Virgin Islands, U.S.</option> <option value="WF">Wallis and Futuna</option> <option value="EH">Western Sahara</option> <option value="YE">Yemen</option> <option value="ZM">Zambia</option> <option value="ZW">Zimbabwe</option>');
$('select[name="state"]').html('<option value="">State</option> <option value="AL">Alabama</option> <option value="AK">Alaska</option> <option value="AZ">Arizona</option> <option value="AR">Arkansas</option> <option value="CA">California</option> <option value="CO">Colorado</option> <option value="CT">Connecticut</option> <option value="DE">Delaware</option> <option value="DC">District Of Columbia</option> <option value="FL">Florida</option> <option value="GA">Georgia</option> <option value="HI">Hawaii</option> <option value="ID">Idaho</option> <option value="IL">Illinois</option> <option value="IN">Indiana</option> <option value="IA">Iowa</option> <option value="KS">Kansas</option> <option value="KY">Kentucky</option> <option value="LA">Louisiana</option> <option value="ME">Maine</option> <option value="MD">Maryland</option> <option value="MA">Massachusetts</option> <option value="MI">Michigan</option> <option value="MN">Minnesota</option> <option value="MS">Mississippi</option> <option value="MO">Missouri</option> <option value="MT">Montana</option> <option value="NE">Nebraska</option> <option value="NV">Nevada</option> <option value="NH">New Hampshire</option> <option value="NJ">New Jersey</option> <option value="NM">New Mexico</option> <option value="NY">New York</option> <option value="NC">North Carolina</option> <option value="ND">North Dakota</option> <option value="OH">Ohio</option> <option value="OK">Oklahoma</option> <option value="OR">Oregon</option> <option value="PA">Pennsylvania</option> <option value="RI">Rhode Island</option> <option value="SC">South Carolina</option> <option value="SD">South Dakota</option> <option value="TN">Tennessee</option> <option value="TX">Texas</option> <option value="UT">Utah</option> <option value="VT">Vermont</option> <option value="VA">Virginia</option> <option value="WA">Washington</option> <option value="WV">West Virginia</option> <option value="WI">Wisconsin</option> <option value="WY">Wyoming</option>');
$('select[name="year"]').html('<option value="">Year</option> <option value="2013">2013</option> <option value="2012">2012</option> <option value="2011">2011</option> <option value="2010">2010</option> <option value="2009">2009</option> <option value="2008">2008</option> <option value="2007">2007</option> <option value="2006">2006</option> <option value="2005">2005</option> <option value="2004">2004</option> <option value="2003">2003</option> <option value="2002">2002</option> <option value="2001">2001</option> <option value="2000">2000</option> <option value="1999">1999</option> <option value="1998">1998</option> <option value="1997">1997</option> <option value="1996">1996</option> <option value="1995">1995</option> <option value="1994">1994</option> <option value="1993">1993</option> <option value="1992">1992</option> <option value="1991">1991</option> <option value="1990">1990</option> <option value="1989">1989</option> <option value="1988">1988</option> <option value="1987">1987</option> <option value="1986">1986</option> <option value="1985">1985</option> <option value="1984">1984</option> <option value="1983">1983</option> <option value="1982">1982</option> <option value="1981">1981</option> <option value="1980">1980</option> <option value="1979">1979</option> <option value="1978">1978</option> <option value="1977">1977</option> <option value="1976">1976</option> <option value="1975">1975</option> <option value="1974">1974</option> <option value="1973">1973</option> <option value="1972">1972</option> <option value="1971">1971</option> <option value="1970">1970</option> <option value="1969">1969</option> <option value="1968">1968</option> <option value="1967">1967</option> <option value="1966">1966</option> <option value="1965">1965</option> <option value="1964">1964</option> <option value="1963">1963</option> <option value="1962">1962</option> <option value="1961">1961</option> <option value="1960">1960</option> <option value="1959">1959</option> <option value="1958">1958</option> <option value="1957">1957</option> <option value="1956">1956</option> <option value="1955">1955</option> <option value="1954">1954</option> <option value="1953">1953</option> <option value="1952">1952</option> <option value="1951">1951</option> <option value="1950">1950</option> <option value="1949">1949</option> <option value="1948">1948</option> <option value="1947">1947</option> <option value="1946">1946</option> <option value="1945">1945</option> <option value="1944">1944</option> <option value="1943">1943</option> <option value="1942">1942</option> <option value="1941">1941</option> <option value="1940">1940</option> <option value="1939">1939</option> <option value="1938">1938</option> <option value="1937">1937</option> <option value="1936">1936</option> <option value="1935">1935</option> <option value="1934">1934</option> <option value="1933">1933</option> <option value="1932">1932</option> <option value="1931">1931</option> <option value="1930">1930</option> <option value="1929">1929</option> <option value="1928">1928</option> <option value="1927">1927</option> <option value="1926">1926</option> <option value="1925">1925</option> <option value="1924">1924</option> <option value="1923">1923</option> <option value="1922">1922</option> <option value="1921">1921</option> <option value="1920">1920</option> <option value="1919">1919</option> <option value="1918">1918</option> <option value="1917">1917</option> <option value="1916">1916</option> <option value="1915">1915</option> <option value="1914">1914</option> <option value="1913">1913</option> <option value="1912">1912</option> <option value="1911">1911</option> <option value="1910">1910</option> <option value="1909">1909</option> <option value="1908">1908</option> <option value="1907">1907</option> <option value="1906">1906</option> <option value="1905">1905</option>');
$('select[name="day"]').html('<option value="">Day</option> <option value="01">01</option> <option value="02">02</option> <option value="03">03</option> <option value="04">04</option> <option value="05">05</option> <option value="06">06</option> <option value="07">07</option> <option value="08">08</option> <option value="09">09</option> <option value="10">10</option> <option value="11">11</option> <option value="12">12</option> <option value="13">13</option> <option value="14">14</option> <option value="15">15</option> <option value="16">16</option> <option value="17">17</option> <option value="18">18</option> <option value="19">19</option> <option value="20">20</option> <option value="21">21</option> <option value="22">22</option> <option value="23">23</option> <option value="24">24</option> <option value="25">25</option> <option value="26">26</option> <option value="27">27</option> <option value="28">28</option> <option value="29">29</option> <option value="30">30</option> <option value="31">31</option>');
