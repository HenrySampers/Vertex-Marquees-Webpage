// Vertex Marquees - Gallery Lightbox
(function() {
    'use strict';

    var lightbox = document.getElementById('lightbox');
    var lightboxImg = document.getElementById('lightbox-img');
    var lightboxCounter = document.getElementById('lightbox-counter');
    var galleryItems = document.querySelectorAll('.gallery-item');
    var currentIndex = 0;
    var totalImages = galleryItems.length;

    // Open lightbox
    galleryItems.forEach(function(item) {
        item.addEventListener('click', function() {
            currentIndex = parseInt(this.getAttribute('data-index'));
            openLightbox();
        });
    });

    function openLightbox() {
        var fullSrc = galleryItems[currentIndex].getAttribute('data-full');
        var altText = galleryItems[currentIndex].querySelector('img').getAttribute('alt');
        lightboxImg.src = fullSrc;
        lightboxImg.alt = altText;
        lightboxCounter.textContent = (currentIndex + 1) + ' / ' + totalImages;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImg.src = '';
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % totalImages;
        openLightbox();
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        openLightbox();
    }

    // Close button
    document.querySelector('.lightbox-close').addEventListener('click', closeLightbox);

    // Navigation buttons
    document.querySelector('.lightbox-next').addEventListener('click', nextImage);
    document.querySelector('.lightbox-prev').addEventListener('click', prevImage);

    // Close on background click
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextImage();
        if (e.key === 'ArrowLeft') prevImage();
    });

    // Touch swipe support for mobile
    var touchStartX = 0;
    var touchEndX = 0;

    lightbox.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextImage();
            } else {
                prevImage();
            }
        }
    }, { passive: true });
})();
