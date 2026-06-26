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
    // Fallback to URL-encoded form data
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

// Mail body
$body = "DAIFUK ウェブサイトより、新しいお問い合わせがありました。\n\n";
$body .= "--------------------------------------------------\n";
$body .= "【会社名】\n" . $company . "\n\n";
$body .= "【お名前】\n" . $name . "\n\n";
$body .= "【メールアドレス】\n" . $email . "\n\n";
$body .= "【お問い合わせ内容】\n" . $content . "\n";
$body .= "--------------------------------------------------\n\n";
$body .= "※このメールは DAIFUK ウェブサイトの送信フォームから自動送信されました。\n";

// Mail headers
// To prevent SPF/DMARC failures, From must be a domain email (e.g. no-reply@daifuk.jp)
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'From: no-reply@daifuk.jp';
$headers[] = 'Reply-To: ' . $email;
$headers[] = 'X-Mailer: PHP/' . phpversion();

// Send mail using UTF-8
mb_language('Japanese');
mb_internal_encoding('UTF-8');

$headerString = implode("\r\n", $headers);

if (mb_send_mail($to, $subject, $body, $headerString)) {
    echo json_encode(['success' => true]);
} else {
    // Fallback to standard mail function if mb_send_mail is not configured
    if (mail($to, $subject, $body, $headerString)) {
        echo json_encode(['success' => true]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'メールの送信に失敗しました。お手数ですが、時間をおいて再度お試しいただくか、直接 kobayashi@daifuk.jp までご連絡ください。']);
    }
}
?>
