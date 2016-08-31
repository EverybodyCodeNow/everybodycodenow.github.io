<?php
// Set email variables
if (empty($_POST)){
  die("Access Denied.");
}
$secret = $_POST['secret'];
$actual_secret = "ECN2016";
if ($secret != $actual_secret){
  die("Authentication Error");
}
$email_to = $_POST['email'];
$email_subject = $_POST['subject'];
$headers = "From: admin@everybodycodenow.com"; // added
$email_content = $_POST['message'];
mail($email_to, $email_subject, $email_content, $headers);
echo "Email sent.";
?>
