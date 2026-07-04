<?php
/**
 * ZEROX — Mail Configuration
 * 
 * IMPORTANT: Do NOT store real credentials here.
 * Create a copy as mail-config.local.php with your real SMTP credentials.
 * That file is excluded from version control via .gitignore.
 * 
 * Uses Gmail App Passwords: https://myaccount.google.com/apppasswords
 */

// Load local overrides if they exist
$localConfig = __DIR__ . '/mail-config.local.php';
if (file_exists($localConfig)) {
    return require $localConfig;
}

// Fallback defaults (replace these or use mail-config.local.php)
return [
    'smtp_host'    => getenv('SMTP_HOST') ?: 'smtp.gmail.com',
    'smtp_port'    => (int)(getenv('SMTP_PORT') ?: 587),
    'smtp_secure'  => getenv('SMTP_SECURE') ?: 'tls',
    'smtp_user'    => getenv('SMTP_USER') ?: '',
    'smtp_pass'    => getenv('SMTP_PASS') ?: '',
    'from_email'   => getenv('SMTP_FROM_EMAIL') ?: '',
    'from_name'    => getenv('SMTP_FROM_NAME') ?: 'ZEROX Portfolio',
    'to_email'     => getenv('SMTP_TO_EMAIL') ?: '',
    'to_name'      => getenv('SMTP_TO_NAME') ?: 'Muhammad Umer Farooq',
];
