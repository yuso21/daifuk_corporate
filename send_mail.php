<?php
header('Content-Type: application/json; charset=utf-8');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    $input = $_POST;
}

$company = isset($input['company']) ? trim($input['company']) : '';
$name = isset($input['name']) ? trim($input['name']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$content = isset($input['content']) ? trim($input['content']) : '';

// Validation
if (empty($name) || empty($email) || empty($content)) {
    http_response_code(400);
    echo json_encode(['error' => '必須項目（お名前、メールアドレス、お問い合わせ内容）が入力されていません。']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'メールアドレスの形式が正しくありません。']);
    exit;
}

// Mail settings
$to = 'kobayashi@daifuk.jp';
$subject = '【DAIFUK】ウェブサイトからのお問い合わせ';

// Mail body (UTF-8)
$body = "DAIFUK ウェブサイトより、新しいお問い合わせがありました。\n\n";
$body .= "--------------------------------------------------\n";
$body .= "【会社名】\n" . $company . "\n\n";
$body .= "【お名前】\n" . $name . "\n\n";
$body .= "【メールアドレス】\n" . $email . "\n\n";
$body .= "【お問い合わせ内容】\n" . $content . "\n";
$body .= "--------------------------------------------------\n\n";
$body .= "※このメールは DAIFUK ウェブサイトの送信フォームから自動送信されました。\n";

// Display Name and Sender Email
$from_name = 'HPから問い合わせ';
$from_email = 'no-reply@daifuk.jp';

// RFC 2047 Base64 encode for headers to prevent character garbling
$encoded_subject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$encoded_from = '=?UTF-8?B?' . base64_encode($from_name) . '?= <' . $from_email . '>';

// Mail headers
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'Content-Transfer-Encoding: 8bit';
$headers[] = 'From: ' . $encoded_from;
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'X-Mailer: PHP/' . phpversion();

$headerString = implode("\r\n", $headers);

// Send mail using standard PHP mail() with raw UTF-8 body bytes and envelope sender
if (mail($to, $encoded_subject, $body, $headerString, '-f' . $from_email)) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'メールの送信に失敗しました。お手数ですが、時間をおいて再度お試しいただくか、直接 kobayashi@daifuk.jp までご連絡ください。']);
}
?>
