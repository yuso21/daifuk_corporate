const JSON_HEADERS = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store'
};

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS
  });
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function onRequestPost(context) {
  const contentType = context.request.headers.get('Content-Type') || '';

  if (!contentType.includes('application/json')) {
    return jsonResponse({ error: '不正なリクエスト形式です。' }, 415);
  }

  let input;
  try {
    input = await context.request.json();
  } catch {
    return jsonResponse({ error: '入力内容を読み取れませんでした。' }, 400);
  }

  const company = typeof input.company === 'string' ? input.company.trim() : '';
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const email = typeof input.email === 'string' ? input.email.trim() : '';
  const content = typeof input.content === 'string' ? input.content.trim() : '';

  if (!name || !email || !content) {
    return jsonResponse(
      { error: '必須項目（お名前、メールアドレス、お問い合わせ内容）が入力されていません。' },
      400
    );
  }

  if (!isValidEmail(email)) {
    return jsonResponse({ error: 'メールアドレスの形式が正しくありません。' }, 400);
  }

  const apiKey = context.env.RESEND_API_KEY;
  const from = context.env.RESEND_FROM_EMAIL;

  if (!apiKey || !from) {
    console.error('Resend environment variables are not configured.');
    return jsonResponse({ error: 'メール送信の設定が完了していません。' }, 500);
  }

  const text = [
    'DAIFUK ウェブサイトより、新しいお問い合わせがありました。',
    '',
    '--------------------------------------------------',
    '【会社名】',
    company,
    '',
    '【お名前】',
    name,
    '',
    '【メールアドレス】',
    email,
    '',
    '【お問い合わせ内容】',
    content,
    '--------------------------------------------------',
    '',
    '※このメールは DAIFUK ウェブサイトの送信フォームから自動送信されました。'
  ].join('\n');

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to: ['kobayashi@daifuk.jp'],
        reply_to: email,
        subject: '【DAIFUK】ウェブサイトからのお問い合わせ',
        text
      })
    });

    if (!resendResponse.ok) {
      const responseText = await resendResponse.text();
      console.error('Resend request failed.', resendResponse.status, responseText);
      return jsonResponse(
        { error: 'メールの送信に失敗しました。時間をおいて再度お試しいただくか、直接 kobayashi@daifuk.jp までご連絡ください。' },
        502
      );
    }
  } catch (error) {
    console.error('Resend request could not be completed.', error);
    return jsonResponse(
      { error: 'メールの送信に失敗しました。時間をおいて再度お試しいただくか、直接 kobayashi@daifuk.jp までご連絡ください。' },
      502
    );
  }

  return jsonResponse({ success: true });
}

export function onRequest() {
  return jsonResponse({ error: 'Method Not Allowed' }, 405);
}
