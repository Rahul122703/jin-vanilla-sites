<?php
// Contact form to fill in google sheet
header('Content-Type: application/json');

function sendResponse($statusCode, $message)
{
    http_response_code($statusCode);
    echo json_encode(['status' => $statusCode === 200 ? 'Success' : 'Error', 'message' => $message]);
    exit;
}

function logError($error)
{
    $logFile = __DIR__ . '/error.log';
    $timestamp = date('Y-m-d H:i:s');
    file_put_contents($logFile, "[$timestamp] $error\n", FILE_APPEND);
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(405, 'Method not allowed.');
}

// Ensure Composer autoload exists so we fail gracefully if not uploaded
$autoloadPath = __DIR__ . '/vendor/autoload.php';
if (!file_exists($autoloadPath)) {
    logError("Composer autoload file not found at: {$autoloadPath}");
    sendResponse(500, 'Server configuration error. Please try again later.');
}

require $autoloadPath;

use Google\Client;
use Google\Service\Sheets;
use Google\Service\Sheets\ValueRange;

// Set timezone to Eastern Time
date_default_timezone_set('America/New_York');

// Columns: Timestamp | Name | Email | Phone Number | Subject Chosen | Message
// Google Sheets spreadsheet ID for storing contact form submissions.
// To update, replace with your own Google Sheets ID from the sheet URL.
$spreadsheetId = '1igcUmmuxElYpUqT4kgzN0cvnRbtLCcsHN4R5gNLvajE';
$sheetName = 'Butter&Scoop - Contact';

// Sanitize Function
function clean_input($value)
{
    if ($value === null)
        return '';
    $value = strip_tags($value);
    $value = htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
    $value = preg_replace('/[\x00-\x1F\x7F]/u', '', $value);
    return trim($value);
}

// Sanitize Input Data
$data = [
    'name' => clean_input($_POST['name'] ?? ''),
    'phone' => clean_input($_POST['phone'] ?? ''),
    'email' => clean_input($_POST['email'] ?? ''),
    'subject' => clean_input($_POST['subject'] ?? ''),
    'message' => clean_input($_POST['message'] ?? ''),
];

// Basic validation
$errors = [];
if (empty($data['name'])) {
    $errors[] = 'Name is required.';
}
if (strlen($data['name']) > 100) {
    $errors[] = 'Name must be less than 100 characters.';
}
if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Invalid email address. Please enter a valid email address.';
}
if (strlen($data['email']) > 150) {
    $errors[] = 'Email must be less than 150 characters.';
}
if (!empty($data['phone'])) {
    // Basic phone validation (digits, spaces, dashes, parentheses, periods, and optional extensions like x1234 or ext.1234)
    if (!preg_match('/^[0-9\s\-\+\(\)\.]+(\s?(x|ext\.?)\s?\d+)?$/i', $data['phone'])) {
        $errors[] = 'Phone number contains invalid characters.';
    }
}
if (empty($data['subject'])) {
    $errors[] = 'Subject is required.';
}
if (!empty($data['message']) && strlen($data['message']) > 1000) {
    $errors[] = 'Message must be less than 1000 characters.';
}

if (!empty($errors)) {
    sendResponse(400, implode(' ', $errors));
}

// Path to your Google service-account JSON key.
// Best practice: store this OUTSIDE public_html so it can never be downloaded
// directly via a browser. See setup notes for the Hostinger folder layout.
$credentialsPath = getenv('GOOGLE_SHEETS_CREDENTIALS') ?: (__DIR__ . '/etc/secrets/service-account.json');

if (!file_exists($credentialsPath)) {
    logError("Google Sheets credentials file not found at: {$credentialsPath}");
    sendResponse(500, 'Server configuration error. Please try again later.');
}

try {
    $client = new Client();
    $client->setApplicationName('Restaurant Contact Form');
    $client->setScopes([Sheets::SPREADSHEETS]);
    $client->setAuthConfig($credentialsPath);
    $client->setAccessType('offline');

    $sheetService = new Sheets($client);

    // Write to Sheet (row layout matches the header row)
    // Timestamp | Name | Email | Phone Number | Subject Chosen | Message
    $sheetRange = $sheetName;

    if (empty($data['phone'])) {
        $data['phone'] = 'N/A';
    }
    if (empty($data['message'])) {
        $data['message'] = 'N/A';
    }

    $row = [
        date('Y-m-d H:i:s'),
        $data['name'],
        $data['email'],
        $data['phone'],
        $data['subject'],
        $data['message'],
    ];

    $sheetService->spreadsheets_values->append(
        $spreadsheetId,
        $sheetRange,
        new ValueRange(['values' => [$row]]),
        ['valueInputOption' => 'RAW']
    );

    sendResponse(200, 'Thank you for contacting us! We will get back to you shortly.');

} catch (Google\Service\Exception $e) {
    logError($e->getMessage());
    sendResponse(500, 'A Google API error occurred while processing your request. Please try again later.');
} catch (Exception $e) {
    logError($e->getMessage());
    sendResponse(500, 'An error occurred while processing your request. Please try again later.');
}
