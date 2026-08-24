(function () {
    'use strict';
    const endpoint = '/.netlify/functions/admin-media';
    const loginView = document.getElementById('login-view');
    const dashboardView = document.getElementById('dashboard-view');
    const loginStatus = document.getElementById('login-status');
    const dashboardStatus = document.getElementById('dashboard-status');
    let manifest = null;
    let draggingId = null;

    function setStatus(target, message, isError) { target.textContent = message || ''; target.classList.toggle('error', Boolean(isError)); }
    async function request(method, body, action) {
        const response = await fetch(`${endpoint}${action ? `?action=${encodeURIComponent(action)}` : ''}`, {
            method, credentials: 'same-origin', headers: method === 'POST' ? { 'Content-Type': 'application/json' } : undefined,
            body: method === 'POST' ? JSON.stringify(body) : undefined,
        });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) { const error = new Error(data.error || 'Something went wrong.'); error.status = response.status; throw error; }
        return data;
    }
    function showDashboard(data) { manifest = data; loginView.hidden = true; dashboardView.hidden = false; render(); }
    function mediaSource(item) { return item.type === 'video' ? item.thumb : item.src; }
    function moveItem(id, destinationId, placeAfter) {
        const sourceIndex = manifest.items.findIndex((item) => item.id === id);
        let destinationIndex = manifest.items.findIndex((item) => item.id === destinationId);
        if (sourceIndex === -1 || destinationIndex === -1 || sourceIndex === destinationIndex) return false;
        const [item] = manifest.items.splice(sourceIndex, 1);
        if (sourceIndex < destinationIndex) destinationIndex -= 1;
        manifest.items.splice(destinationIndex + (placeAfter ? 1 : 0), 0, item);
        return true;
    }
    async function saveOrder() {
        const data = await request('POST', { action: 'reorder', order: manifest.items.map((item) => item.id) });
        manifest = data.manifest;
        setStatus(dashboardStatus, 'Gallery order saved.');
        render();
    }
    function render() {
        const grid = document.getElementById('media-grid');
        const items = manifest.items || [];
        document.getElementById('image-count').textContent = `${items.length} item${items.length === 1 ? '' : 's'}`;
        if (!items.length) { grid.innerHTML = '<p class="empty-state">No gallery items yet. Upload a photo to get started.</p>'; return; }
        grid.replaceChildren(...items.map((item) => {
            const card = document.createElement('article'); card.className = 'media-card'; card.draggable = true; card.dataset.id = item.id;
            const image = document.createElement('img'); image.src = mediaSource(item); image.alt = item.alt; image.loading = 'lazy';
            const content = document.createElement('div'); content.className = 'media-card-content';
            const dragHint = document.createElement('span'); dragHint.className = 'drag-hint'; dragHint.textContent = 'Drag to reorder';
            const description = document.createElement('p'); description.textContent = item.alt;
            const actions = document.createElement('div'); actions.className = 'media-card-actions';
            if (item.type === 'photo') { const set = document.createElement('button'); set.type = 'button'; set.className = 'small-button'; set.dataset.setSlot = item.id; set.textContent = 'Set as home page image'; actions.appendChild(set); }
            const up = document.createElement('button'); up.type = 'button'; up.className = 'small-button'; up.dataset.move = 'up'; up.dataset.id = item.id; up.textContent = 'Move up'; up.disabled = items.indexOf(item) === 0; actions.appendChild(up);
            const down = document.createElement('button'); down.type = 'button'; down.className = 'small-button'; down.dataset.move = 'down'; down.dataset.id = item.id; down.textContent = 'Move down'; down.disabled = items.indexOf(item) === items.length - 1; actions.appendChild(down);
            const visibility = document.createElement('button'); visibility.type = 'button'; visibility.className = 'small-button'; visibility.dataset.toggleGallery = item.id; visibility.dataset.visible = String(item.visible !== false); visibility.textContent = item.visible === false ? 'Show in gallery' : 'Hide from gallery'; actions.appendChild(visibility);
            const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'small-button danger'; remove.dataset.delete = item.id; remove.textContent = 'Remove'; actions.appendChild(remove);
            content.append(dragHint, description, actions); card.append(image, content); return card;
        }));
    }
    async function fileToBase64(file) {
        const buffer = await file.arrayBuffer(); let binary = ''; const bytes = new Uint8Array(buffer);
        for (let index = 0; index < bytes.length; index += 0x8000) binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
        return btoa(binary);
    }
    document.getElementById('password-toggle').addEventListener('click', function () { const field = document.getElementById('admin-password'); const visible = field.type === 'text'; field.type = visible ? 'password' : 'text'; this.textContent = visible ? 'Show' : 'Hide'; this.setAttribute('aria-pressed', String(!visible)); });
    document.getElementById('login-form').addEventListener('submit', async function (event) { event.preventDefault(); const button = this.querySelector('button[type="submit"]'); button.disabled = true; setStatus(loginStatus, 'Signing in…'); try { await request('POST', { action: 'login', password: document.getElementById('admin-password').value }); const data = await request('GET', null, 'admin-data'); showDashboard(data); } catch (error) { setStatus(loginStatus, error.message, true); } finally { button.disabled = false; } });
    document.getElementById('upload-form').addEventListener('submit', async function (event) { event.preventDefault(); const file = document.getElementById('image-file').files[0]; const alt = document.getElementById('image-alt').value.trim(); const button = this.querySelector('button[type="submit"]'); if (!file || !alt) return; if (file.size > 4 * 1024 * 1024) { setStatus(dashboardStatus, 'Choose an image smaller than 4 MB.', true); return; } button.disabled = true; setStatus(dashboardStatus, 'Uploading photo…'); try { const data = await request('POST', { action: 'upload', base64: await fileToBase64(file), contentType: file.type, alt, addToGallery: document.getElementById('add-to-gallery').checked }); manifest = data.manifest; this.reset(); document.getElementById('add-to-gallery').checked = true; setStatus(dashboardStatus, 'Photo uploaded.'); render(); } catch (error) { setStatus(dashboardStatus, error.message, true); } finally { button.disabled = false; } });
    const mediaGrid = document.getElementById('media-grid');
    mediaGrid.addEventListener('click', async function (event) { const target = event.target.closest('button'); if (!target) return; try { if (target.dataset.setSlot) { const data = await request('POST', { action: 'set-slot', id: target.dataset.setSlot, slot: 'intro-home' }); manifest = data.manifest; setStatus(dashboardStatus, 'Home page image updated.'); } if (target.dataset.move) { const index = manifest.items.findIndex((item) => item.id === target.dataset.id); const neighbor = manifest.items[index + (target.dataset.move === 'up' ? -1 : 1)]; if (neighbor && moveItem(target.dataset.id, neighbor.id, target.dataset.move === 'down')) await saveOrder(); } if (target.dataset.toggleGallery) { const visible = target.dataset.visible !== 'true'; const data = await request('POST', { action: 'set-visible', id: target.dataset.toggleGallery, visible }); manifest = data.manifest; setStatus(dashboardStatus, visible ? 'Photo is now visible in the gallery.' : 'Photo is now hidden from the gallery.'); render(); } if (target.dataset.delete) { if (!window.confirm('Remove this item from the public gallery?')) return; const data = await request('POST', { action: 'delete', id: target.dataset.delete }); manifest = data.manifest; setStatus(dashboardStatus, 'Item removed.'); render(); } } catch (error) { setStatus(dashboardStatus, error.message, true); } });
    mediaGrid.addEventListener('dragstart', function (event) { const card = event.target.closest('.media-card'); if (!card) return; draggingId = card.dataset.id; card.classList.add('dragging'); event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', draggingId); });
    mediaGrid.addEventListener('dragover', function (event) { const card = event.target.closest('.media-card'); if (!card || card.dataset.id === draggingId) return; event.preventDefault(); card.classList.add('drop-target'); event.dataTransfer.dropEffect = 'move'; });
    mediaGrid.addEventListener('dragleave', function (event) { const card = event.target.closest('.media-card'); if (card) card.classList.remove('drop-target'); });
    mediaGrid.addEventListener('dragend', function () { draggingId = null; mediaGrid.querySelectorAll('.media-card').forEach((card) => card.classList.remove('dragging', 'drop-target')); });
    mediaGrid.addEventListener('drop', async function (event) { const card = event.target.closest('.media-card'); if (!card || !draggingId || card.dataset.id === draggingId) return; event.preventDefault(); const placeAfter = event.clientY > card.getBoundingClientRect().top + card.getBoundingClientRect().height / 2; try { if (moveItem(draggingId, card.dataset.id, placeAfter)) await saveOrder(); } catch (error) { setStatus(dashboardStatus, error.message, true); render(); } finally { draggingId = null; mediaGrid.querySelectorAll('.media-card').forEach((entry) => entry.classList.remove('dragging', 'drop-target')); } });
    document.getElementById('logout-button').addEventListener('click', async function () { await request('POST', { action: 'logout' }); dashboardView.hidden = true; loginView.hidden = false; document.getElementById('admin-password').value = ''; });
    request('GET', null, 'admin-data').then(showDashboard).catch(() => { document.getElementById('admin-password').focus(); });
}());
