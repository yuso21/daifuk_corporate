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

## Deploy

- Push to `main`
- Cloudflare Pages automatically deploys from GitHub
- No GitHub Actions required
- GitHub Pages disabled
