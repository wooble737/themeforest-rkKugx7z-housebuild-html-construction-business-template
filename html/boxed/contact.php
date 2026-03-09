<?php
header('Content-Type: application/json; charset=utf-8');

define('__TO__', 'besimdauti24@gmail.com');
define('__SUBJECT__', 'examples.com = From:');
define('__SUCCESS_MESSAGE__', 'Your message has been sent. Thank you!');
define('__ERROR_MESSAGE__', "Error, your message hasn't been sent");
define('__MESSAGE_EMPTY_FILDS__', 'Please fill out all fields');

$phpMailerPath = __DIR__ . '/phpmailer/src';
if (
    file_exists($phpMailerPath . '/PHPMailer.php') &&
    file_exists($phpMailerPath . '/SMTP.php') &&
    file_exists($phpMailerPath . '/Exception.php')
) {
    require_once $phpMailerPath . '/PHPMailer.php';
    require_once $phpMailerPath . '/SMTP.php';
    require_once $phpMailerPath . '/Exception.php';
}

function json_response($info, $msg)
{
    echo json_encode(array('info' => $info, 'msg' => $msg));
    exit();
}

function check_email($email)
{
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function sanitize_header_value($value)
{
    return trim(str_replace(array("\r", "\n"), '', (string)$value));
}

function get_smtp_config()
{
    $encryption = strtolower((string)(getenv('SMTP_ENCRYPTION') ?: 'tls'));
    if ($encryption !== 'ssl' && $encryption !== 'tls') {
        $encryption = 'tls';
    }

    return array(
        'host' => getenv('SMTP_HOST') ?: '',
        'port' => (int)(getenv('SMTP_PORT') ?: 587),
        'username' => getenv('SMTP_USERNAME') ?: '',
        'password' => getenv('SMTP_PASSWORD') ?: '',
        'encryption' => $encryption,
        'from_email' => getenv('SMTP_FROM_EMAIL') ?: (getenv('SMTP_USERNAME') ?: __TO__),
        'from_name' => getenv('SMTP_FROM_NAME') ?: 'Website Contact Form'
    );
}

function send_mail($to, $subject, $message, $replyEmail, $replyName)
{
    $safeReplyName = sanitize_header_value($replyName);
    $safeReplyEmail = sanitize_header_value($replyEmail);

    $smtp = get_smtp_config();
    $usePhpMailer = class_exists('PHPMailer\\PHPMailer\\PHPMailer') && $smtp['host'] !== '';
    $fromEmail = check_email($smtp['from_email']) ? sanitize_header_value($smtp['from_email']) : __TO__;
    $fromName = sanitize_header_value($smtp['from_name']);

    if ($usePhpMailer) {
        try {
            $mail = new PHPMailer\PHPMailer\PHPMailer(true);
            $mail->isSMTP();
            $mail->Host = $smtp['host'];
            $mail->Port = $smtp['port'];
            $mail->SMTPAuth = $smtp['username'] !== '';
            $mail->Username = $smtp['username'];
            $mail->Password = $smtp['password'];

            if ($smtp['encryption'] === 'ssl') {
                $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
            } else {
                $mail->SMTPSecure = PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
            }

            $mail->CharSet = 'UTF-8';
            $mail->setFrom($fromEmail, $fromName);
            $mail->addAddress($to);
            $mail->addReplyTo($safeReplyEmail, $safeReplyName);
            $mail->isHTML(true);
            $mail->Subject = $subject;
            $mail->Body = $message;

            $mail->send();
            return true;
        } catch (\Throwable $e) {
            return false;
        }
    }

    $headers = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";
    $headers .= 'From: ' . $fromEmail . "\r\n";
    $headers .= 'Reply-To: ' . $safeReplyEmail . "\r\n";

    return @mail($to, $subject, $message, $headers);
}

if (!isset($_POST['name']) || !isset($_POST['mail']) || !isset($_POST['comment'])) {
    json_response('error', __MESSAGE_EMPTY_FILDS__);
}

$name = trim((string)$_POST['name']);
$mail = trim((string)$_POST['mail']);
$website = isset($_POST['website']) ? trim((string)$_POST['website']) : '';
$comment = trim((string)$_POST['comment']);

if ($name === '') {
    json_response('error', 'Please enter your name.');
}

if ($mail === '' || !check_email($mail)) {
    json_response('error', 'Please enter valid e-mail.');
}

if ($comment === '') {
    json_response('error', 'Please enter your message.');
}

$to = getenv('CONTACT_TO_EMAIL') ?: __TO__;
$safeName = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$safeMail = htmlspecialchars($mail, ENT_QUOTES, 'UTF-8');
$safeWebsite = htmlspecialchars($website, ENT_QUOTES, 'UTF-8');
$safeComment = nl2br(htmlspecialchars($comment, ENT_QUOTES, 'UTF-8'));

$subject = __SUBJECT__ . ' ' . str_replace(array("\r", "\n"), '', $name);
$message = '
<html>
<head>
  <meta charset="utf-8">
  <title>Mail from ' . $safeName . '</title>
</head>
<body>
  <table style="width: 500px; font-family: arial; font-size: 14px;" border="1">
    <tr style="height: 32px;">
      <th align="right" style="width:150px; padding-right:5px;">Name:</th>
      <td align="left" style="padding-left:5px; line-height: 20px;">' . $safeName . '</td>
    </tr>
    <tr style="height: 32px;">
      <th align="right" style="width:150px; padding-right:5px;">E-mail:</th>
      <td align="left" style="padding-left:5px; line-height: 20px;">' . $safeMail . '</td>
    </tr>
    <tr style="height: 32px;">
      <th align="right" style="width:150px; padding-right:5px;">Website:</th>
      <td align="left" style="padding-left:5px; line-height: 20px;">' . $safeWebsite . '</td>
    </tr>
    <tr style="height: 32px;">
      <th align="right" style="width:150px; padding-right:5px;">Comment:</th>
      <td align="left" style="padding-left:5px; line-height: 20px;">' . $safeComment . '</td>
    </tr>
  </table>
</body>
</html>
';

if (send_mail($to, $subject, $message, $mail, $name)) {
    json_response('success', __SUCCESS_MESSAGE__);
}

json_response('error', __ERROR_MESSAGE__);
?>