<?php
session_start();
require_once __DIR__ . '/../includes/config.php';

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: ../contact.php');
    exit;
}

// Collect and sanitize form data
$name       = isset($_POST['name']) ? trim(htmlspecialchars($_POST['name'])) : '';
$email      = isset($_POST['email']) ? trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL)) : '';
$phone      = isset($_POST['phone']) ? trim(htmlspecialchars($_POST['phone'])) : '';
$county     = isset($_POST['county']) ? trim(htmlspecialchars($_POST['county'])) : '';
$event_type = isset($_POST['event_type']) ? trim(htmlspecialchars($_POST['event_type'])) : 'Not specified';
$details    = isset($_POST['details']) ? trim(htmlspecialchars($_POST['details'])) : '';
$consent    = isset($_POST['gdpr_consent']) ? true : false;

// Store form data in session for re-populating the form on error
$_SESSION['form_data'] = [
    'name'       => $name,
    'email'      => $email,
    'phone'      => $phone,
    'county'     => $county,
    'event_type' => $event_type,
    'details'    => $details,
];

// Validation
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Please enter your full name.';
}

if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
}

if (empty($phone)) {
    $errors[] = 'Please enter your phone number.';
}

if (empty($county)) {
    $errors[] = 'Please select your county.';
}

if (empty($details) || strlen($details) < 10) {
    $errors[] = 'Please provide some details about your event (at least 10 characters).';
}

if (!$consent) {
    $errors[] = 'You must consent to data collection to submit this form.';
}

// If validation fails, redirect back with errors
if (!empty($errors)) {
    $_SESSION['form_error'] = implode(' ', $errors);
    header('Location: ../contact.php#quote-form');
    exit;
}

// Build email
$to = $business_email;
$subject = "New Quote Request from " . $name . " - " . $business_name . " Website";

$message = "
==============================================
NEW QUOTE REQUEST - {$business_name} Website
==============================================

Name:       {$name}
Email:      {$email}
Phone:      {$phone}
County:     {$county}
Event Type: {$event_type}

----------------------------------------------
EVENT DETAILS:
----------------------------------------------
{$details}

----------------------------------------------
Submitted on: " . date('d/m/Y \a\t H:i') . "
GDPR Consent: Yes
==============================================
";

$headers = "From: {$business_email}\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send email
$mail_sent = mail($to, $subject, $message, $headers);

if ($mail_sent) {
    // Clear form data on success
    unset($_SESSION['form_data']);
    $_SESSION['form_success'] = 'Thank you! Your quote request has been sent successfully. We will be in touch within 24 hours.';
    header('Location: ../thank-you.php');
    exit;
} else {
    $_SESSION['form_error'] = 'Sorry, there was a problem sending your request. Please try calling us directly at ' . $business_phone . ' or emailing ' . $business_email . '.';
    header('Location: ../contact.php#quote-form');
    exit;
}
