// Public configuration only. Never put passwords, API keys, or the Turnstile secret key here.
// Cloudflare's official test site key is used only on local development addresses.
var localHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
var useProductionTurnstile = new URLSearchParams(window.location.search).get('turnstile') === 'production';
window.TURNSTILE_SITE_KEY = localHost && !useProductionTurnstile ? '1x00000000000000000000AA' : '0x4AAAAAAEaCzvwkfpvThNJh';
