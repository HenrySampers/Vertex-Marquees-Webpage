(function () {
    'use strict';
    const endpoint = '/.netlify/functions/admin-media?action=manifest';
    function card(item) {
        const element = document.createElement('div');
        element.className = `gallery-item${item.type === 'video' ? ' gallery-item--video' : ''}`;
        element.dataset.full = item.src;
        element.dataset.category = item.type;
        if (item.type === 'video') element.dataset.video = item.src;
        const image = document.createElement('img');
        image.src = item.thumb || item.src; image.alt = item.alt || 'Vertex Marquees gallery image'; image.loading = 'lazy'; image.width = 400; image.height = 300;
        const overlay = document.createElement('div'); overlay.className = 'overlay'; if (item.type !== 'video') { const label = document.createElement('span'); label.textContent = 'View'; overlay.appendChild(label); }
        element.append(image, overlay); return element;
    }
    function renderGallery(items) {
        const grid = document.getElementById('gallery-grid');
        const visibleItems = items.filter((item) => item.visible !== false);
        if (grid) grid.replaceChildren(...visibleItems.map(card));
        const preview = document.getElementById('homepage-gallery-preview');
        if (preview) preview.replaceChildren(...visibleItems.filter((item) => item.type === 'photo').slice(0, 4).map((item) => { const column = document.createElement('div'); column.className = 'col-6 col-md-3'; column.appendChild(card(item)); return column; }));
    }
    function applySlots(slots) {
        document.querySelectorAll('[data-media-slot]').forEach((element) => {
            const image = slots[element.dataset.mediaSlot]; if (!image) return;
            if (element.tagName === 'IMG') { element.src = image.src; element.alt = image.alt || element.alt; }
            else element.style.backgroundImage = `url("${image.src}")`;
        });
    }
    fetch(endpoint, { credentials: 'same-origin' }).then((response) => response.ok ? response.json() : Promise.reject()).then((manifest) => {
        applySlots(manifest.slots || {}); renderGallery(manifest.items || []); document.dispatchEvent(new CustomEvent('vertex-media-ready'));
    }).catch(() => { /* Static images remain visible if storage is temporarily unavailable. */ });
}());
