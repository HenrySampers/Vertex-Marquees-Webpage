const nodemailer = require('nodemailer');

const MAX_BODY_BYTES = 12 * 1024;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const requestLog = new Map();
const ALLOWED_COUNTIES = new Set(['Carlow','Cavan','Clare','Cork','Donegal','Dublin','Galway','Kerry','Kildare','Kilkenny','Laois','Leitrim','Limerick','Longford','Louth','Mayo','Meath','Monaghan','Offaly','Roscommon','Sligo','Tipperary','Waterford','Westmeath','Wexford','Wicklow']);
const ALLOWED_EVENT_TYPES = new Set(['', 'Party', 'Wedding', 'Corporate Event', 'Festival', 'Communion/Confirmation', 'Other']);
const ALLOWED_GROUND_TYPES = new Set(['', 'Grass / Lawn', 'Concrete / Paving', 'Gravel', 'Decking / Wood', 'Not Sure', 'Other']);

function escapeHtml(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}

function clean(value, maxLength) {
    return String(value || '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, maxLength);
}

function getClientIp(event) {
    return (event.headers && (event.headers['x-nf-client-connection-ip'] || event.headers['X-Nf-Client-Connection-Ip'] || event.headers['x-forwarded-for']))?.split(',')[0].trim() || 'unknown';
}

function isRateLimited(ip) {
    const now = Date.now();
    const recent = (requestLog.get(ip) || []).filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS);
    recent.push(now);
    requestLog.set(ip, recent);
    for (const [key, timestamps] of requestLog) {
        if (!timestamps.some((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)) requestLog.delete(key);
    }
    return recent.length > RATE_LIMIT_MAX;
}

function allowedOrigin(origin) {
    const configured = (process.env.ALLOWED_ORIGINS || 'https://vertex-marquees.ie,https://www.vertex-marquees.ie').split(',').map((value) => value.trim()).filter(Boolean);
    return Boolean(origin && configured.includes(origin));
}

async function verifyTurnstile(token, ip) {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) return true;
    if (!token) return false;
    const localRequest = process.env.NETLIFY_LOCAL === 'true' || ['127.0.0.1', '::1', 'localhost', 'unknown'].includes(ip);
    const verificationData = { secret, response: token };
    // Cloudflare sees the browser's real network address, while Netlify Dev sees
    // only the loopback address. Do not send that mismatched local address.
    if (!localRequest) verificationData.remoteip = ip;
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(verificationData).toString(),
    });
    const result = await response.json();
    return response.ok && result.success === true;
}

// Package slug → display label
const PACKAGE_LABELS = {
    'single-party': 'Single Party Package',
    'double-party': 'Double Party Package',
    'single-event': 'Single Event Package',
    'double-event': 'Double Event Package',
    'not-sure':     'Not sure yet',
};

function field(label, value) {
    if (!value) return '';
    return `
        <tr>
            <td style="padding: 10px 16px; color: #C9A96E; font-size: 13px; font-weight: bold;
                        text-transform: uppercase; letter-spacing: 1px; width: 140px;
                        vertical-align: top; white-space: nowrap;">
                ${escapeHtml(label)}
            </td>
            <td style="padding: 10px 16px; color: #1A1A1A; font-size: 14px; vertical-align: top;">
                ${value}
            </td>
        </tr>
        <tr>
            <td colspan="2" style="padding: 0 16px;">
                <div style="height: 1px; background-color: #EEEEEE;"></div>
            </td>
        </tr>`;
}

function buildEmail(data) {
    const { name, email, phone, county, eventType, packageLabel, groundType, details } = data;
    const date = new Date().toLocaleDateString('en-IE', { day: '2-digit', month: 'long', year: 'numeric' });
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeCounty = escapeHtml(county);
    const safeDetails = escapeHtml(details);

    return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background-color:#F2F2F2; font-family: Arial, Helvetica, sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#F2F2F2; padding: 40px 20px;">
<tr><td align="center">

    <table width="600" cellpadding="0" cellspacing="0"
           style="max-width:600px; width:100%; background-color:#FFFFFF;
                  border-radius: 4px; overflow: hidden;
                  box-shadow: 0 2px 12px rgba(0,0,0,0.10);">

        <!-- Gold top bar -->
        <tr>
            <td style="background-color:#C9A96E; height: 5px; font-size: 0;">&nbsp;</td>
        </tr>

        <!-- Header -->
        <tr>
            <td style="background-color:#0A0A0A; padding: 32px 32px 28px; text-align: center;">
                <p style="margin: 0 0 6px; color: #C9A96E; font-size: 22px;
                           font-weight: bold; letter-spacing: 4px; text-transform: uppercase;">
                    VERTEX MARQUEES
                </p>
                <p style="margin: 0; color: #B0B0B0; font-size: 11px;
                           letter-spacing: 3px; text-transform: uppercase;">
                    New Quote Request
                </p>
            </td>
        </tr>

        <!-- Intro bar -->
        <tr>
            <td style="background-color:#1A1A1A; padding: 14px 32px;">
                <p style="margin: 0; color: #FFFFFF; font-size: 13px;">
                    A new quote request has been submitted on
                    <strong style="color:#C9A96E;">vertex-marquees.ie</strong>
                </p>
            </td>
        </tr>

        <!-- Contact details -->
        <tr>
            <td style="padding: 8px 16px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    ${field('Name',       safeName)}
                    ${field('Phone',      `<a href="tel:${safePhone.replace(/\s/g,'')}" style="color:#C9A96E;">${safePhone}</a>`)}
                    ${field('Email',      `<a href="mailto:${safeEmail}" style="color:#C9A96E;">${safeEmail}</a>`)}
                    ${field('County',     safeCounty)}
                    ${field('Event Type', eventType !== 'Not specified' ? escapeHtml(eventType) : '')}
                    ${field('Package',    packageLabel !== 'Not specified' ? escapeHtml(packageLabel) : '')}
                    ${field('Ground',     groundType !== 'Not specified' ? escapeHtml(groundType) : '')}
                </table>
            </td>
        </tr>

        <!-- Event details -->
        <tr>
            <td style="padding: 16px 32px 24px;">
                <p style="margin: 0 0 10px; color: #C9A96E; font-size: 12px;
                           font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">
                    Event Details
                </p>
                <div style="background-color:#F8F8F8; border-left: 3px solid #C9A96E;
                             padding: 14px 16px; border-radius: 2px;">
                    <p style="margin: 0; color: #1A1A1A; font-size: 14px; line-height: 1.7;
                               white-space: pre-wrap;">${safeDetails}</p>
                </div>
            </td>
        </tr>

        <!-- Reply prompt -->
        <tr>
            <td style="background-color:#F8F8F8; padding: 16px 32px; text-align: center;
                        border-top: 1px solid #EEEEEE;">
                <p style="margin: 0; color: #555555; font-size: 13px;">
                    Hit <strong>Reply</strong> to respond directly to
                    <strong>${safeName}</strong> at <strong>${safeEmail}</strong>
                </p>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="background-color:#0A0A0A; padding: 16px 32px; text-align: center;">
                <p style="margin: 0; color: #4A4A4A; font-size: 11px; letter-spacing: 1px;">
                    Submitted on ${date} &nbsp;|&nbsp; vertex-marquees.ie
                </p>
            </td>
        </tr>

        <!-- Gold bottom bar -->
        <tr>
            <td style="background-color:#C9A96E; height: 4px; font-size: 0;">&nbsp;</td>
        </tr>

    </table>

</td></tr>
</table>

</body>
</html>`;
}

exports.handler = async function(event) {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const body = event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : (event.body || '');
    if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) {
        return { statusCode: 413, body: JSON.stringify({ error: 'Request is too large.' }) };
    }
    const contentType = event.headers?.['content-type'] || event.headers?.['Content-Type'] || '';
    if (!contentType.toLowerCase().startsWith('application/x-www-form-urlencoded')) {
        return { statusCode: 415, body: JSON.stringify({ error: 'Unsupported request format.' }) };
    }
    const origin = event.headers?.origin || event.headers?.Origin;
    if (!allowedOrigin(origin)) {
        return { statusCode: 403, body: JSON.stringify({ error: 'Request origin is not allowed.' }) };
    }
    const clientIp = getClientIp(event);
    if (isRateLimited(clientIp)) {
        return { statusCode: 429, headers: { 'Retry-After': '900' }, body: JSON.stringify({ error: 'Too many requests. Please try again later.' }) };
    }

    // Parse form-encoded body
    const params   = new URLSearchParams(body);
    const name       = clean(params.get('name'), 100);
    const email      = clean(params.get('email'), 254).toLowerCase();
    const phone      = clean(params.get('phone'), 30);
    const county     = clean(params.get('county'), 40);
    const eventType  = clean(params.get('event_type'), 40) || 'Not specified';
    const pkgKey     = clean(params.get('package'), 30);
    const groundType = clean(params.get('ground_type'), 40) || 'Not specified';
    const details    = clean(params.get('details'), 3000);
    const consent    = params.get('gdpr_consent');
    const honeypot   = params.get('website');
    const formLoadedAt = Number(params.get('form_loaded_at'));
    const turnstileToken = params.get('cf-turnstile-response');

    // Validation
    const validEmail = /^[a-z0-9][a-z0-9._%+-]{0,63}@[a-z0-9.-]+\.[a-z]{2,63}$/i.test(email);
    const validPhone = /^[+\d\s().-]{7,30}$/.test(phone);
    const validTiming = Number.isFinite(formLoadedAt) && Date.now() - formLoadedAt >= 2500 && Date.now() - formLoadedAt <= 2 * 60 * 60 * 1000;
    const validPackage = pkgKey === '' || Object.prototype.hasOwnProperty.call(PACKAGE_LABELS, pkgKey);
    const validEvent = ALLOWED_EVENT_TYPES.has(eventType === 'Not specified' ? '' : eventType);
    const validGround = ALLOWED_GROUND_TYPES.has(groundType === 'Not specified' ? '' : groundType);
    if (honeypot || !validTiming) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Please wait a few seconds, then complete the form and try again.' })
        };
    }
    if (!name || !validEmail || !validPhone || !ALLOWED_COUNTIES.has(county) || !details || details.length < 10 || consent !== 'on' || !validEvent || !validGround || !validPackage) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Please complete all required fields with valid details and try again.' })
        };
    }

    try {
        if (!(await verifyTurnstile(turnstileToken, clientIp))) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Bot verification failed. Please try again.' }) };
        }
    } catch (error) {
        console.error('Turnstile verification error:', error.message);
        return { statusCode: 503, body: JSON.stringify({ error: 'Bot verification is temporarily unavailable.' }) };
    }

    const packageLabel = PACKAGE_LABELS[pkgKey] || 'Not specified';

    // Gmail SMTP via App Password (stored securely in Netlify env vars)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        disableFileAccess: true,
        disableUrlAccess: true,
        tls: { minVersion: 'TLSv1.2' },
        auth: {
            user: 'VertexMarquees@gmail.com',
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    try {
        const delivery = await transporter.sendMail({
            from:    '"Vertex Marquees Website" <VertexMarquees@gmail.com>',
            to:      'VertexMarquees@gmail.com',
            replyTo: { name, address: email },
            subject: `New Quote Request — ${name.replace(/[\r\n]/g, ' ')} (${county})`,
            html:    buildEmail({ name, email, phone, county, eventType, packageLabel, groundType, details }),
        });
        if (!delivery.accepted || delivery.accepted.length === 0 || (delivery.rejected && delivery.rejected.length > 0)) {
            throw new Error('Gmail did not accept the quote email.');
        }
        console.info('Quote email accepted by Gmail.', { messageId: delivery.messageId, acceptedRecipients: delivery.accepted.length });

        return { statusCode: 200, body: JSON.stringify({ success: true }) };

    } catch (err) {
        console.error('Mailer error:', err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send email. Please call us directly on 083 320 5052.' })
        };
    }
};
