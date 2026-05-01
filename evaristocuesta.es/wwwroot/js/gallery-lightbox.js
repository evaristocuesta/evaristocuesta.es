// Gallery Lightbox
(function () {
    'use strict';

    let currentIndex = 0;
    let totalImages = 0;
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCurrent = document.getElementById('lightbox-current');
    const lightboxTotal = document.getElementById('lightbox-total');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    const galleryItems = document.querySelectorAll('.gallery-grid-item');

    // Initialize gallery
    function init() {
        totalImages = galleryData.length;
        lightboxTotal.textContent = totalImages;

        // Add click event to each gallery item
        galleryItems.forEach((item, index) => {
            item.addEventListener('click', () => openLightbox(index));
        });

        // Close button
        closeBtn.addEventListener('click', closeLightbox);

        // Navigation buttons
        prevBtn.addEventListener('click', showPrevious);
        nextBtn.addEventListener('click', showNext);

        // Keyboard navigation
        document.addEventListener('keydown', handleKeyboard);

        // Close on background click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    function openLightbox(index) {
        currentIndex = index;
        updateImage();
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
    }

    function showPrevious() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateImage();
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % totalImages;
        updateImage();
    }

    function updateImage() {
        const currentImage = galleryData[currentIndex];
        lightboxImage.src = currentImage.Image;
        lightboxImage.alt = currentImage.Alt;
        lightboxImage.title = currentImage.Title;
        lightboxCurrent.textContent = currentIndex + 1;
    }

    function handleKeyboard(e) {
        if (lightbox.style.display !== 'flex') return;

        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                showPrevious();
                break;
            case 'ArrowRight':
                e.preventDefault();
                showNext();
                break;
            case 'Escape':
                e.preventDefault();
                closeLightbox();
                break;
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
