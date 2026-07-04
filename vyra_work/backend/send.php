<?php
/**
 * ZEROX — Contact Form Mailer (PHPMailer)
 * ----------------------------------------------------------------
 * Sends email via SMTP and stores messages in MySQL database.
 * ----------------------------------------------------------------
 */

// ---- CORS: restrict to own domain ----
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = [
    // 🚀 Add your live domain here before deploying:
    // 'https://yourdomain.com',
    // 'https://www.yourdomain.com',
    'http://localhost',
    'http://localhost:3000',
    'http://localhost:5500',
    'http://127.0.0.1',
    'http://127.0.0.1:5500',
];
if (in_array($origin, $allowed)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

header('Content-Type: application/json');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---- Load PHPMailer ----
require __DIR__ . '/PHPMailer/src/Exception.php';
require __DIR__ . '/PHPMailer/src/PHPMailer.php';
require __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// ---- Collect + validate ----
$name    = trim($_POST['name']    ?? '');
$email   = trim($_POST['email']   ?? '');
$message = trim($_POST['message'] ?? '');

if ($name === '' || $email === '' || $message === '') {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'All fields are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Invalid email address.']);
    exit;
}

// Sanitize for output
$safe_name    = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safe_email   = htmlspecialchars($email, ENT_QUOTES, 'UTF-8');
$safe_message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// ---- Save to database ----
try {
    $dbConfig = __DIR__ . '/db-config.php';
    if (file_exists($dbConfig)) {
        $db = require $dbConfig;
        $pdo = new PDO(
            "mysql:host={$db['host']};dbname={$db['dbname']};charset=utf8mb4",
            $db['user'],
            $db['pass'],
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
        );
        $stmt = $pdo->prepare(
            "INSERT INTO messages (name, email, message, created_at) VALUES (:name, :email, :message, NOW())"
        );
        $stmt->execute([
            ':name'    => $name,
            ':email'   => $email,
            ':message' => $message,
        ]);
    }
} catch (PDOException $e) {
    // DB failure is non-fatal — email will still be sent
    error_log('DB insert failed: ' . $e->getMessage());
}

// ---- Load SMTP config ----
$cfg = require __DIR__ . '/mail-config.php';

// Skip email if no SMTP credentials configured
if (empty($cfg['smtp_user']) || empty($cfg['smtp_pass'])) {
    echo json_encode(['ok' => true, 'message' => 'Message received! I\'ll get back to you soon.']);
    exit;
}

// ---- Send email via PHPMailer ----
$mail = new PHPMailer(true);

try {
    $mail->isSMTP();
    $mail->Host       = $cfg['smtp_host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $cfg['smtp_user'];
    $mail->Password   = $cfg['smtp_pass'];
    $mail->SMTPSecure = $cfg['smtp_secure'];
    $mail->Port       = $cfg['smtp_port'];

    $mail->setFrom($cfg['from_email'], $cfg['from_name']);
    $mail->addReplyTo($email, $name);
    $mail->addAddress($cfg['to_email'], $cfg['to_name']);

    $mail->isHTML(true);
    $mail->Subject = 'New Contact — ZEROX Portfolio';

    $mail->Body = <<<HTML
<!DOCTYPE html>
<html>
<head><style>
  body{font-family:sans-serif;background:#0d0d0d;padding:2rem;color:#fff;}
  .wrap{max-width:560px;margin:0 auto;border:1px solid #202020;padding:2rem;}
  h2{color:#DC143C;font-size:1.2rem;margin:0 0 .5rem;text-transform:uppercase;}
  .field{color:#A1A1A1;font-size:.82rem;margin:0 0 .25rem;}
  .val{color:#fff;font-size:.95rem;margin:0 0 1.2rem;}
  hr{border:none;border-top:1px solid #202020;margin:1.2rem 0;}
  .footer{color:#6b6b6b;font-size:.72rem;margin-top:1.5rem;}
</style></head>
<body>
<div class="wrap">
  <h2>New Message from ZEROX</h2>
  <hr>
  <p class="field">Name</p>
  <p class="val">$safe_name</p>
  <p class="field">Email</p>
  <p class="val">$safe_email</p>
  <p class="field">Message</p>
  <p class="val">$safe_message</p>
  <hr>
  <p class="footer">Sent via the ZEROX contact form.</p>
</div>
</body>
</html>
HTML;

    $mail->AltBody = "New message from ZEROX\n\nName: $name\nEmail: $email\n\n$message";

    $mail->send();
    echo json_encode(['ok' => true, 'message' => 'Message sent! I\'ll get back to you soon.']);

} catch (Exception $e) {
    http_response_code(500);
    error_log('PHPMailer Error: ' . $mail->ErrorInfo);
    echo json_encode(['ok' => false, 'error' => 'Message could not be sent. Please try again later.']);
}
