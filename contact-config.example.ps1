# Example SMTP environment setup for contact.php
# Copy this file, fill in real values, then run it in PowerShell:
#   . .\contact-config.ps1
#
# It sets variables only for the current terminal session.
# Do NOT commit files with real credentials.

$env:SMTP_HOST = 'smtp.example.com'
$env:SMTP_PORT = '587'
$env:SMTP_USERNAME = 'your-smtp-username'
$env:SMTP_PASSWORD = 'your-smtp-password'
$env:SMTP_ENCRYPTION = 'tls'   # allowed: tls or ssl
$env:SMTP_FROM_EMAIL = 'no-reply@example.com'
$env:SMTP_FROM_NAME = 'Website Contact Form'
$env:CONTACT_TO_EMAIL = 'recipient@example.com'

Write-Host 'SMTP environment variables set for this session.' -ForegroundColor Green
Write-Host 'Now start PHP server and test the form.' -ForegroundColor Yellow
