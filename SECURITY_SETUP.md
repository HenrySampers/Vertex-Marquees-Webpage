# Production security setup

Before publishing this version, configure the following values in Netlify's environment-variable settings:

- `GMAIL_APP_PASSWORD`: the Gmail app password used only by the quote function.
- `TURNSTILE_SECRET_KEY`: the private Cloudflare Turnstile secret key.
- `ALLOWED_ORIGINS`: `https://vertexmarquees.ie,https://www.vertexmarquees.ie` (add any authorised preview domain only when needed).
- `ADMIN_PASSWORD_HASH`: a password hash for the private `/admin` media manager.
- `ADMIN_SESSION_SECRET`: a unique random secret used to sign admin login sessions.

Create a Cloudflare Turnstile widget for `vertexmarquees.ie`, place its **public site key** in `js/site-config.js`, and place its **secret key** in Netlify as `TURNSTILE_SECRET_KEY`. The public key is safe to publish; the secret key must never appear in the repository or browser code.

The function includes a best-effort, per-instance rate limit. For durable protection across all serverless instances, enable Netlify edge/WAF rate limiting or place the domain behind Cloudflare with a rate-limit rule for `/.netlify/functions/send-quote`.

Before accepting bookings, replace the business identity and booking-policy wording in `privacy.html` and `terms.html` with the owner's confirmed legal name, full trading/registered address, retention policy, deposit amount, cancellation/refund policy, and insurance/booking terms. Have those final documents checked by an Irish solicitor or qualified adviser.

## Admin media manager

The `/admin` page does not store a password in the browser or repository. To configure it, run `node scripts/generate-admin-password.js` locally, choose a password of at least 16 characters, then add the two values it prints as **secret** environment variables in Netlify. Do not add those values to `.env.example`, source code, or Git.

The manager stores uploaded JPG, PNG and WebP images (maximum 4 MB each) in Netlify Blobs. Use a unique password, enable two-factor authentication on the Netlify owner account, and do not share the password through email or chat. The manager's image session expires after four hours.
