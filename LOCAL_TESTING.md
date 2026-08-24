# Local testing

Use Netlify Dev rather than a basic static server. It runs the website and Netlify Functions together.

1. Copy `.env.local.example` to `.env`.
2. Leave Cloudflare's provided test secret in place. It pairs with the test site key automatically used by `js/site-config.js` on `localhost` and `127.0.0.1`.
3. From the repository root, run `npx netlify-cli dev`.
4. Open the local address it prints (normally `http://localhost:8888/contact.html`).

The Turnstile widget should pass locally with the test credentials. The production site still uses the live public key and the `TURNSTILE_SECRET_KEY` saved in Netlify.

To test a real email locally, add the Gmail app password to `.env`. Otherwise, the form validation and Turnstile test work, but the final mail send will fail because no mail credential is present.

To test `/admin` locally, run `node scripts/generate-admin-password.js` and use the generated values only in `.env`. Use a different password from production.

## Testing with the real Netlify credentials

Do not copy secrets to a local file. Instead, authenticate the Netlify CLI to the same account that owns this site, link the folder to the existing project, and run `npx netlify-cli dev --context production`. This loads the production function environment variables into the local process only.

To use the real Turnstile credentials locally, add `localhost` and `127.0.0.1` to the widget's authorised hostnames in Cloudflare, then open `/contact.html?turnstile=production`. Keep the default local URL for safe test-key behavior.
