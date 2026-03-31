// Vertex Marquees - Gallery Lightbox
// Supports photos and videos. Navigates only through currently visible (non-filtered) items.
(function() {
    'use strict';

    var lightbox        = document.getElementById('lightbox');
    var lightboxImg     = document.getElementById('lightbox-img');
    var lightboxVideo   = document.getElementById('lightbox-video');
    var lightboxVideoSrc = document.getElementById('lightbox-video-src');
    var lightboxCounter = document.getElementById('lightbox-counter');
    var allItems        = document.querySelectorAll('.gallery-item');
    var currentIndex    = 0;

    function getVisibleItems() {
        return Array.from(allItems).filter(function(item) {
            return item.style.display !== 'none';
        });
    }

    // Open lightbox on item click
    allItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var visible = getVisibleItems();
            currentIndex = visible.indexOf(this);
            if (currentIndex === -1) return;
            openLightbox();
        });
    });

    function openLightbox() {
        var visible  = getVisibleItems();
        var item     = visible[currentIndex];
        if (!item) return;

        var category = item.getAttribute('data-category');
        var videoSrc = item.getAttribute('data-video');
        var fullSrc  = item.getAttribute('data-full');
        var altText  = item.querySelector('img') ? item.querySelector('img').getAttribute('alt') : '';

        // Stop any playing video first
        lightboxVideo.pause();

        if (category === 'video' && videoSrc) {
            lightboxImg.style.display   = 'none';
            lightboxVideo.style.display = 'block';
            lightboxVideoSrc.src        = videoSrc;
            lightboxVideo.load();
            lightboxVideo.play();
        } else {
            lightboxVideo.style.display = 'none';
            lightboxImg.style.display   = 'block';
            lightboxImg.src             = fullSrc;
            lightboxImg.alt             = altText;
        }

        lightboxCounter.textContent = (currentIndex + 1) + ' / ' + visible.length;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightboxVideo.pause();
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImg.src          = '';
        lightboxVideoSrc.src     = '';
    }

    function nextImage() {
        var visible = getVisibleItems();
        currentIndex = (currentIndex + 1) % visible.length;
        openLightbox();
    }

    function prevImage() {
        var visible = getVisibleItems();
        currentIndex = (currentIndex - 1 + visible.length) % visible.length;
        openLightbox();
    }

    // Controls
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.querySelector('.lightbox-next').addEventListener('click', nextImage);
    document.querySelector('.lightbox-prev').addEventListener('click', prevImage);

    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape')     closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft')  prevImage();
    });

    // Touch swipe support
    var touchStartX = 0;

    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function(e) {
        var diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) {
            diff > 0 ? nextImage() : prevImage();
        }
    }, { passive: true });
})();
