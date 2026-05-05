/**
 * Gallery Lightbox Module
 * Manages lightbox functionality for image galleries
 * @version 2.0.0
 */
(function () {
    'use strict';

    // ============================================
    // CONSTANTS
    // ============================================
    const SELECTORS = {
        lightbox: 'lightbox',
        lightboxImage: 'lightbox-image',
        lightboxTitle: 'lightbox-title',
        lightboxCurrent: 'lightbox-current',
        lightboxTotal: 'lightbox-total',
        closeBtn: '.lightbox-close',
        prevBtn: '.lightbox-prev',
        nextBtn: '.lightbox-next',
        galleryLinks: '[data-gallery]'
    };

    const KEYS = {
        ARROW_LEFT: 'ArrowLeft',
        ARROW_RIGHT: 'ArrowRight',
        ESCAPE: 'Escape'
    };

    const CSS_CLASSES = {
        visible: 'flex',
        hidden: 'none'
    };

    // ============================================
    // STATE
    // ============================================
    const state = {
        currentIndex: 0,
        totalImages: 0,
        currentGalleryData: [],
        isOpen: false
    };

    // ============================================
    // DOM ELEMENTS CACHE
    // ============================================
    const elements = {
        lightbox: null,
        lightboxImage: null,
        lightboxTitle: null,
        lightboxCurrent: null,
        lightboxTotal: null,
        closeBtn: null,
        prevBtn: null,
        nextBtn: null
    };

    // ============================================
    // INITIALIZATION
    // ============================================

    /**
     * Initialize the lightbox module
     */
    function init() {
        if (!cacheDOMElements()) {
            return;
        }

        initializeGalleries();
        attachEventListeners();
    }

    /**
     * Cache all required DOM elements
     * @returns {boolean} True if all required elements were found
     */
    function cacheDOMElements() {
        elements.lightbox = document.getElementById(SELECTORS.lightbox);
        elements.lightboxImage = document.getElementById(SELECTORS.lightboxImage);
        elements.lightboxTitle = document.getElementById(SELECTORS.lightboxTitle);
        elements.lightboxCurrent = document.getElementById(SELECTORS.lightboxCurrent);
        elements.lightboxTotal = document.getElementById(SELECTORS.lightboxTotal);
        elements.closeBtn = document.querySelector(SELECTORS.closeBtn);
        elements.prevBtn = document.querySelector(SELECTORS.prevBtn);
        elements.nextBtn = document.querySelector(SELECTORS.nextBtn);

        return elements.lightbox !== null;
    }

    /**
     * Attach all event listeners
     */
    function attachEventListeners() {
        if (elements.closeBtn) {
            elements.closeBtn.addEventListener('click', closeLightbox);
        }

        if (elements.prevBtn) {
            elements.prevBtn.addEventListener('click', navigateToPrevious);
        }

        if (elements.nextBtn) {
            elements.nextBtn.addEventListener('click', navigateToNext);
        }

        document.addEventListener('keydown', handleKeyboardNavigation);
        elements.lightbox.addEventListener('click', handleBackgroundClick);
    }

    // ============================================
    // GALLERY INITIALIZATION
    // ============================================

    /**
     * Initialize all galleries found in the DOM
     */
    function initializeGalleries() {
        const galleries = buildGalleriesFromDOM();
        attachGalleryClickHandlers(galleries);
    }

    /**
     * Build gallery data structure from DOM elements
     * @returns {Object} Object containing all galleries grouped by name
     */
    function buildGalleriesFromDOM() {
        const galleries = {};
        const galleryLinks = document.querySelectorAll(SELECTORS.galleryLinks);

        galleryLinks.forEach((link) => {
            const galleryName = link.getAttribute('data-gallery');

            if (!galleries[galleryName]) {
                galleries[galleryName] = [];
            }

            const imageData = createImageDataFromLink(link);
            galleries[galleryName].push(imageData);
        });

        return galleries;
    }

    /**
     * Create image data object from a link element
     * @param {HTMLElement} link - The link element
     * @returns {Object} Image data object
     */
    function createImageDataFromLink(link) {
        const title = link.getAttribute('title') || '';
        return {
            Image: link.getAttribute('href'),
            Alt: title,
            Title: title
        };
    }

    /**
     * Attach click handlers to all gallery links
     * @param {Object} galleries - All galleries data
     */
    function attachGalleryClickHandlers(galleries) {
        const galleryLinks = document.querySelectorAll(SELECTORS.galleryLinks);

        galleryLinks.forEach((link, globalIndex) => {
            const galleryName = link.getAttribute('data-gallery');
            const galleryData = galleries[galleryName];
            const indexInGallery = calculateIndexInGallery(link, galleryLinks, galleryName);

            link.addEventListener('click', (e) => {
                e.preventDefault();
                openGallery(galleryData, indexInGallery);
            });
        });
    }

    /**
     * Calculate the index of a link within its gallery
     * @param {HTMLElement} link - The current link
     * @param {NodeList} allLinks - All gallery links
     * @param {string} galleryName - Name of the gallery
     * @returns {number} Index within the gallery
     */
    function calculateIndexInGallery(link, allLinks, galleryName) {
        let index = 0;
        for (let i = 0; i < allLinks.length; i++) {
            if (allLinks[i] === link) {
                break;
            }
            if (allLinks[i].getAttribute('data-gallery') === galleryName) {
                index++;
            }
        }
        return index;
    }

    // ============================================
    // LIGHTBOX CONTROL
    // ============================================

    /**
     * Open the lightbox with a specific gallery
     * @param {Array} galleryData - Array of image data
     * @param {number} index - Starting index
     */
    function openGallery(galleryData, index) {
        if (!elements.lightbox || !galleryData || galleryData.length === 0) {
            return;
        }

        state.currentGalleryData = galleryData;
        state.currentIndex = index;
        state.totalImages = galleryData.length;
        state.isOpen = true;

        updateDisplay();
        showLightbox();
    }

    /**
     * Show the lightbox
     */
    function showLightbox() {
        elements.lightbox.style.display = CSS_CLASSES.visible;
        document.body.style.overflow = 'hidden';
    }

    /**
     * Close the lightbox
     */
    function closeLightbox() {
        if (!elements.lightbox) {
            return;
        }

        elements.lightbox.style.display = CSS_CLASSES.hidden;
        document.body.style.overflow = '';
        state.isOpen = false;
    }

    // ============================================
    // NAVIGATION
    // ============================================

    /**
     * Navigate to the previous image
     */
    function navigateToPrevious() {
        state.currentIndex = (state.currentIndex - 1 + state.totalImages) % state.totalImages;
        updateDisplay();
    }

    /**
     * Navigate to the next image
     */
    function navigateToNext() {
        state.currentIndex = (state.currentIndex + 1) % state.totalImages;
        updateDisplay();
    }

    // ============================================
    // DISPLAY UPDATE
    // ============================================

    /**
     * Update the lightbox display with current image
     */
    function updateDisplay() {
        const currentImage = state.currentGalleryData[state.currentIndex];

        if (!currentImage) {
            return;
        }

        updateImageElement(currentImage);
        updateTitleElement(currentImage);
        updateCounterElements();
    }

    /**
     * Update the image element
     * @param {Object} imageData - Image data object
     */
    function updateImageElement(imageData) {
        elements.lightboxImage.src = imageData.Image;
        elements.lightboxImage.alt = imageData.Alt;
        elements.lightboxImage.title = imageData.Title;
    }

    /**
     * Update the title element
     * @param {Object} imageData - Image data object
     */
    function updateTitleElement(imageData) {
        elements.lightboxTitle.textContent = imageData.Title;
    }

    /**
     * Update the counter elements
     */
    function updateCounterElements() {
        elements.lightboxCurrent.textContent = state.currentIndex + 1;
        elements.lightboxTotal.textContent = state.totalImages;
    }

    // ============================================
    // EVENT HANDLERS
    // ============================================

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} event - Keyboard event
     */
    function handleKeyboardNavigation(event) {
        if (!state.isOpen) {
            return;
        }

        const actionMap = {
            [KEYS.ARROW_LEFT]: navigateToPrevious,
            [KEYS.ARROW_RIGHT]: navigateToNext,
            [KEYS.ESCAPE]: closeLightbox
        };

        const action = actionMap[event.key];
        if (action) {
            event.preventDefault();
            action();
        }
    }

    /**
     * Handle background click to close lightbox
     * @param {MouseEvent} event - Mouse event
     */
    function handleBackgroundClick(event) {
        if (event.target === elements.lightbox) {
            closeLightbox();
        }
    }

    // ============================================
    // MODULE INITIALIZATION
    // ============================================

    /**
     * Start the module when DOM is ready
     */
    function bootstrap() {
        if (document.readyState === 'complete') {
            init();
        } else {
            window.addEventListener('load', init);
        }
    }

    // Start the module
    bootstrap();
})();
