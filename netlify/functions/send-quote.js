const nodemailer = require('nodemailer');

// Package slug → display label
const PACKAGE_LABELS = {
    'single-party': 'Single Party Package',
    'double-party': 'Double Party Package',
    'single-event': 'Single Event Package',
    'double-event': 'Double Event Package',
    'bespoke':      'Bespoke / Custom',
    'not-sure':     'Not sure yet',
};

function field(label, value) {
    if (!value) return '';
    return `
        <tr>
            <td style="padding: 10px 16px; color: #C9A96E; font-size: 13px; font-weight: bold;
                        text-transform: uppercase; letter-spacing: 1px; width: 140px;
                        vertical-align: top; white-space: nowrap;">
                ${label}
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
                    <strong style="color:#C9A96E;">vertexmarquees.ie</strong>
                </p>
            </td>
        </tr>

        <!-- Contact details -->
        <tr>
            <td style="padding: 8px 16px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                    ${field('Name',       name)}
                    ${field('Phone',      `<a href="tel:${phone.replace(/\s/g,'')}" style="color:#C9A96E;">${phone}</a>`)}
                    ${field('Email',      `<a href="mailto:${email}" style="color:#C9A96E;">${email}</a>`)}
                    ${field('County',     county)}
                    ${field('Event Type', eventType !== 'Not specified' ? eventType : '')}
                    ${field('Package',    packageLabel !== 'Not specified' ? packageLabel : '')}
                    ${field('Ground',     groundType !== 'Not specified' ? groundType : '')}
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
                               white-space: pre-wrap;">${details}</p>
                </div>
            </td>
        </tr>

        <!-- Reply prompt -->
        <tr>
            <td style="background-color:#F8F8F8; padding: 16px 32px; text-align: center;
                        border-top: 1px solid #EEEEEE;">
                <p style="margin: 0; color: #555555; font-size: 13px;">
                    Hit <strong>Reply</strong> to respond directly to
                    <strong>${name}</strong> at <strong>${email}</strong>
                </p>
            </td>
        </tr>

        <!-- Footer -->
        <tr>
            <td style="background-color:#0A0A0A; padding: 16px 32px; text-align: center;">
                <p style="margin: 0; color: #4A4A4A; font-size: 11px; letter-spacing: 1px;">
                    Submitted on ${date} &nbsp;|&nbsp; vertexmarquees.ie
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

    // Parse form-encoded body
    const params   = new URLSearchParams(event.body);
    const name       = params.get('name')        || '';
    const email      = params.get('email')       || '';
    const phone      = params.get('phone')       || '';
    const county     = params.get('county')      || '';
    const eventType  = params.get('event_type')  || 'Not specified';
    const pkgKey     = params.get('package')     || '';
    const groundType = params.get('ground_type') || 'Not specified';
    const details    = params.get('details')     || '';
    const consent    = params.get('gdpr_consent');

    // Validation
    if (!name || !email || !phone || !county || !details || !consent) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Please fill in all required fields.' })
        };
    }

    const packageLabel = PACKAGE_LABELS[pkgKey] || 'Not specified';

    // Gmail SMTP via App Password (stored securely in Netlify env vars)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'VertexMarquees@gmail.com',
            pass: process.env.GMAIL_APP_PASSWORD,
        },
    });

    try {
        await transporter.sendMail({
            from:    '"Vertex Marquees Website" <VertexMarquees@gmail.com>',
            to:      'VertexMarquees@gmail.com',
            replyTo: `${name} <${email}>`,
            subject: `New Quote Request — ${name} (${county})`,
            html:    buildEmail({ name, email, phone, county, eventType, packageLabel, groundType, details }),
        });

        return { statusCode: 200, body: JSON.stringify({ success: true }) };

    } catch (err) {
        console.error('Mailer error:', err.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send email. Please call us directly on 083 320 5052.' })
        };
    }
};
