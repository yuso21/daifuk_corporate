# daifuk.jp

## Architecture

```text
VS Code
    │
git push
    │
    ▼
GitHub Repository
    │
    ▼
Cloudflare Pages
(Web Hosting)
    │
    ▼
Cloudflare DNS
(DNS / SSL / CDN / WAF)
    │
    ▼
daifuk.jp
www.daifuk.jp

ConoHa
└── Mail
    ├── MX
    ├── SPF
    └── DKIM
```

## Hosting

- Web Hosting: Cloudflare Pages
- DNS: Cloudflare
- SSL/CDN: Cloudflare
- Mail: ConoHa

## Contact form

The contact form is handled by the Cloudflare Pages Function at `POST /api/contact`.
The Function sends mail through Resend and always returns JSON:

- Success: `{ "success": true }`
- Failure: `{ "error": "..." }`

`send_mail.php` is intentionally not deployed. Cloudflare Pages is static hosting and does not execute PHP.

### One-time Resend and Cloudflare setup

1. Create or sign in to a Resend account and use its Free plan.
2. Add a sending domain in Resend. To avoid changing the existing ConoHa mailbox records, use a dedicated sending subdomain such as `send.daifuk.jp`.
3. Add the DNS records Resend displays in the Cloudflare DNS dashboard and wait until the domain is verified. Do not replace the existing ConoHa MX records for `daifuk.jp`.
4. In **Cloudflare Dashboard → Workers & Pages → daifuk_corporate → Settings → Variables and Secrets**, add the following Production variables:
   - `RESEND_API_KEY`: add this as a secret.
   - `RESEND_FROM_EMAIL`: add this as a text variable, for example `DAIFUK <no-reply@send.daifuk.jp>`.
5. Redeploy the production branch after the variables are saved, then submit a real test inquiry and confirm delivery to `kobayashi@daifuk.jp` and the Reply-To address.

Never commit either value to this repository. `RESEND_API_KEY` must remain a Cloudflare secret.

## Deploy

- Push to `main`
- Cloudflare Pages automatically deploys from GitHub
- No GitHub Actions required
- GitHub Pages disabled
