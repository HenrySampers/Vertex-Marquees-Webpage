const crypto = require('crypto');
const { connectLambda, getStore } = require('@netlify/blobs');

const STORE_NAME = 'vertex-media';
const MANIFEST_KEY = 'manifest.json';
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const SESSION_SECONDS = 4 * 60 * 60;
const loginAttempts = new Map();
const EDITABLE_SLOTS = new Set(['intro-home']);

const DEFAULT_ITEMS = [
    ['gallery-01', 'images/gallery/full/gallery-01.jpg', 'Pagoda marquee setup in Limerick', 'photo'],
    ['gallery-02', 'images/gallery/full/gallery-02.jpg', 'Marquee interior with hardwood flooring and lighting', 'photo'],
    ['gallery-03', 'images/gallery/full/gallery-03.jpg', 'Pagoda marquee exterior view in Ireland', 'photo'],
    ['gallery-04', 'images/gallery/full/gallery-04.jpg', 'Marquee setup for an outdoor event', 'photo'],
    ['gallery-05', 'images/gallery/full/gallery-05.jpg', 'Marquee interior lighting', 'photo'],
    ['gallery-06', 'images/gallery/full/gallery-06.jpg', 'Double pagoda marquee hire in Limerick', 'photo'],
    ['gallery-07', 'images/gallery/full/gallery-07.jpg', 'Marquee with panoramic window walls', 'photo'],
    ['gallery-08', 'images/gallery/full/gallery-08.jpg', 'Event marquee at dusk in Ireland', 'photo'],
    ['gallery-09', 'images/gallery/full/gallery-09.jpg', 'Pagoda marquee garden party setup', 'photo'],
    ['gallery-10', 'images/gallery/full/gallery-10.jpg', 'Marquee with white walls and flooring', 'photo'],
    ['gallery-11', 'images/gallery/full/gallery-11.jpg', 'Vertex Marquees celebration setup', 'photo'],
    ['gallery-12', 'images/gallery/full/gallery-12.jpg', 'Marquee hire in Limerick, Ireland', 'photo'],
    ['gallery-13', 'images/gallery/full/gallery-13.jpg', 'Premium pagoda marquee setup in Ireland', 'photo'],
    ['video-01', 'images/gallery/videos/gallery-video-01.mp4', 'Vertex Marquees event video 1', 'video', 'images/gallery/thumbs/gallery-video-thumb-01.png'],
    ['video-02', 'images/gallery/videos/gallery-video-02.mp4', 'Vertex Marquees event video 2', 'video', 'images/gallery/thumbs/gallery-video-thumb-02.png'],
].map(([id, src, alt, type, thumb]) => ({ id, src, alt, type, thumb: thumb || (type === 'photo' ? `images/gallery/thumbs/${id}.jpg` : src), managed: false, visible: true }));

const DEFAULT_MANIFEST = { items: DEFAULT_ITEMS, slots: {} };

function json(statusCode, body, extraHeaders = {}) {
    return {
        statusCode,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...extraHeaders },
        body: JSON.stringify(body),
    };
}

function getHeader(event, name) {
    const titleCase = name.replace(/(^|-)\w/g, (letter) => letter.toUpperCase());
    return event.headers?.[name] || event.headers?.[name.toLowerCase()] || event.headers?.[titleCase] || event.headers?.[name.toUpperCase()] || '';
}

function getClientIp(event) {
    return (getHeader(event, 'x-nf-client-connection-ip') || getHeader(event, 'x-forwarded-for')).split(',')[0].trim() || 'unknown';
}

function allowedOrigin(origin) {
    const configured = (process.env.ALLOWED_ORIGINS || 'https://vertex-marquees.ie,https://www.vertex-marquees.ie').split(',').map((value) => value.trim()).filter(Boolean);
    return Boolean(origin && configured.includes(origin));
}

function rateLimited(ip) {
    const now = Date.now();
    const entries = (loginAttempts.get(ip) || []).filter((time) => now - time < 15 * 60 * 1000);
    entries.push(now);
    loginAttempts.set(ip, entries);
    return entries.length > 8;
}

function parseCookies(event) {
    try {
        return Object.fromEntries(String(getHeader(event, 'cookie')).split(';').map((entry) => entry.trim()).filter(Boolean).map((entry) => {
            const index = entry.indexOf('=');
            return index === -1 ? [entry, ''] : [entry.slice(0, index), decodeURIComponent(entry.slice(index + 1))];
        }));
    } catch { return {}; }
}

function encode(value) {
    return Buffer.from(value).toString('base64url');
}

function sign(value) {
    return crypto.createHmac('sha256', process.env.ADMIN_SESSION_SECRET || '').update(value).digest('base64url');
}

function createSession() {
    const payload = encode(JSON.stringify({ role: 'admin', exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS }));
    return `${payload}.${sign(payload)}`;
}

function sessionCookie(event, value, maxAge) {
    const host = getHeader(event, 'host');
    const local = /^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(host);
    return `vertex_admin=${value}; Path=/.netlify/functions/admin-media; Max-Age=${maxAge}; HttpOnly; SameSite=Strict${local ? '' : '; Secure'}`;
}

function isAuthenticated(event) {
    const token = parseCookies(event).vertex_admin;
    if (!token || !process.env.ADMIN_SESSION_SECRET || token.length > 1000) return false;
    const [payload, signature] = token.split('.');
    const expected = sign(payload);
    if (!payload || !signature || signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return false;
    try {
        const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
        return session.role === 'admin' && Number.isInteger(session.exp) && session.exp > Math.floor(Date.now() / 1000);
    } catch {
        return false;
    }
}

function verifyPassword(password) {
    const stored = process.env.ADMIN_PASSWORD_HASH || '';
    const [algorithm, salt, expected] = stored.split('$');
    if (algorithm !== 'scrypt' || !salt || !expected || !password) return false;
    const actual = crypto.scryptSync(password, Buffer.from(salt, 'base64url'), 64).toString('base64url');
    return actual.length === expected.length && crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

function imageType(buffer, requestedType) {
    const signatures = {
        'image/jpeg': buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff])),
        'image/png': buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
        'image/webp': buffer.subarray(0, 4).toString() === 'RIFF' && buffer.subarray(8, 12).toString() === 'WEBP',
    };
    return signatures[requestedType] ? requestedType : null;
}

async function loadManifest(store) {
    const manifest = (await store.get(MANIFEST_KEY, { type: 'json' })) || structuredClone(DEFAULT_MANIFEST);
    const slots = Object.fromEntries(Object.entries(manifest.slots || {}).filter(([slot]) => EDITABLE_SLOTS.has(slot)));
    return { ...manifest, slots };
}

async function saveManifest(store, manifest) {
    await store.setJSON(MANIFEST_KEY, manifest);
}

function mediaUrl(id) {
    return `/.netlify/functions/admin-media?action=media&id=${encodeURIComponent(id)}`;
}

async function publicMedia(store, id) {
    if (!/^[a-f0-9-]{36}$/i.test(id)) return json(404, { error: 'Image not found.' });
    const [bytes, metadata] = await Promise.all([
        store.get(`media/${id}`, { type: 'arrayBuffer' }),
        store.get(`metadata/${id}`, { type: 'json' }),
    ]);
    if (!bytes || !metadata) return json(404, { error: 'Image not found.' });
    return {
        statusCode: 200,
        isBase64Encoded: true,
        headers: { 'Content-Type': metadata.contentType, 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' },
        body: Buffer.from(bytes).toString('base64'),
    };
}

exports.handler = async function(event) {
    connectLambda(event);
    const store = getStore(STORE_NAME);
    const action = event.queryStringParameters?.action || '';

    if (event.httpMethod === 'GET' && action === 'manifest') return json(200, await loadManifest(store), { 'Cache-Control': 'public, max-age=60' });
    if (event.httpMethod === 'GET' && action === 'media') return publicMedia(store, event.queryStringParameters?.id || '');

    if (event.httpMethod !== 'POST' && event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed.' });
    if (event.httpMethod === 'POST' && !allowedOrigin(getHeader(event, 'origin'))) return json(403, { error: 'Request origin is not allowed.' });

    let data = {};
    if (event.httpMethod === 'POST') {
        if (Buffer.byteLength(event.body || '', 'utf8') > 5.5 * 1024 * 1024) return json(413, { error: 'Upload is too large. Maximum image size is 4 MB.' });
        try { data = JSON.parse(event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : (event.body || '{}')); } catch { return json(400, { error: 'Invalid request.' }); }
    }

    const requestAction = data.action || action;
    if (requestAction === 'login') {
        if (!process.env.ADMIN_PASSWORD_HASH || !process.env.ADMIN_SESSION_SECRET) return json(503, { error: 'Admin access has not been configured yet.' });
        const ip = getClientIp(event);
        if (rateLimited(ip) || !verifyPassword(String(data.password || ''))) return json(401, { error: 'Incorrect password.' });
        const cookie = sessionCookie(event, createSession(), SESSION_SECONDS);
        return json(200, { success: true }, { 'Set-Cookie': cookie });
    }
    if (requestAction === 'logout') return json(200, { success: true }, { 'Set-Cookie': sessionCookie(event, '', 0) });
    if (!isAuthenticated(event)) return json(401, { error: 'Please sign in.' });
    if (requestAction === 'admin-data') return json(200, await loadManifest(store));

    const manifest = await loadManifest(store);
    if (requestAction === 'upload') {
        const contentType = String(data.contentType || '');
        const bytes = Buffer.from(String(data.base64 || ''), 'base64');
        const alt = String(data.alt || '').replace(/[<>]/g, '').trim().slice(0, 180);
        if (!alt || bytes.length === 0 || bytes.length > MAX_UPLOAD_BYTES || !imageType(bytes, contentType)) return json(400, { error: 'Upload a JPG, PNG, or WebP image under 4 MB and provide descriptive alt text.' });
        const id = crypto.randomUUID();
        await Promise.all([
            store.set(`media/${id}`, bytes),
            store.setJSON(`metadata/${id}`, { contentType }),
        ]);
        const item = { id, src: mediaUrl(id), thumb: mediaUrl(id), alt, type: 'photo', managed: true, visible: data.addToGallery !== false };
        manifest.items.unshift(item);
        await saveManifest(store, manifest);
        return json(201, { item, manifest });
    }
    if (requestAction === 'delete') {
        const id = String(data.id || '');
        const item = manifest.items.find((entry) => entry.id === id);
        if (!item) return json(404, { error: 'Image not found.' });
        manifest.items = manifest.items.filter((entry) => entry.id !== id);
        for (const [slot, value] of Object.entries(manifest.slots || {})) if (value.id === id) delete manifest.slots[slot];
        await saveManifest(store, manifest);
        if (item.managed) await Promise.all([store.delete(`media/${id}`), store.delete(`metadata/${id}`)]);
        return json(200, { manifest });
    }
    if (requestAction === 'set-visible') {
        const item = manifest.items.find((entry) => entry.id === String(data.id || ''));
        if (!item || typeof data.visible !== 'boolean') return json(400, { error: 'Choose a valid gallery photo.' });
        item.visible = data.visible;
        await saveManifest(store, manifest);
        return json(200, { manifest });
    }
    if (requestAction === 'reorder') {
        const order = Array.isArray(data.order) ? data.order.map((id) => String(id)) : [];
        const currentIds = manifest.items.map((item) => item.id);
        if (order.length !== currentIds.length || new Set(order).size !== order.length || order.some((id) => !currentIds.includes(id))) {
            return json(400, { error: 'The gallery order is invalid. Refresh the page and try again.' });
        }
        const byId = new Map(manifest.items.map((item) => [item.id, item]));
        manifest.items = order.map((id) => byId.get(id));
        await saveManifest(store, manifest);
        return json(200, { manifest });
    }
    if (requestAction === 'set-slot') {
        const slot = String(data.slot || '');
        const item = manifest.items.find((entry) => entry.id === String(data.id || ''));
        if (!EDITABLE_SLOTS.has(slot) || !item || item.type !== 'photo') return json(400, { error: 'Choose a valid image and location.' });
        manifest.slots[slot] = { id: item.id, src: item.src, alt: item.alt };
        await saveManifest(store, manifest);
        return json(200, { manifest });
    }
    if (requestAction === 'clear-slot') {
        const slot = String(data.slot || '');
        if (!EDITABLE_SLOTS.has(slot)) return json(400, { error: 'Choose a valid image location.' });
        delete manifest.slots[slot];
        await saveManifest(store, manifest);
        return json(200, { manifest });
    }
    return json(400, { error: 'Unknown request.' });
};
