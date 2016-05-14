function createDbUser(emailid, passwrd, role, myname) {
  var ref = new Firebase("https://ecn.firebaseio.com/users/");
  ref.createUser({
    email: emailid,
    password: passwrd
  }, function(error, userData) {
    if (error) {
      console.log ("Error creating user:" + error);
    } else {
      console.log ("Successfully created user account with uid:" + userData.uid);
      newRef = ref.push();
      newRef.set({
        uid: userData.uid,
        urole: role,
        uname: myname
      });
    }
  });
}
