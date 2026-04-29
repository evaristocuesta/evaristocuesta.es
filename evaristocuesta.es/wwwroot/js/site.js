// Constants
const DESKTOP_BREAKPOINT = 992;
const SCROLL_THRESHOLD = 300;
const ICON_DELAY = 10;
const ICONS = {
    MENU: '<i class="fas fa-bars"></i>',
    CLOSE: '<i class="fa-solid fa-xmark"></i>'
};
const COLORS = {
    BLACK: '#000',
    WHITE: '#fff',
    DEFAULT: ''
};

// Factory function to create navbar controller (testable)
function createNavbarController(elements, config = {}) {
    const isNavbarSolid = config.isNavbarSolid || false;
    const desktopBreakpoint = config.desktopBreakpoint || DESKTOP_BREAKPOINT;

    // Utility functions
    const isDesktop = () => window.innerWidth >= desktopBreakpoint;
    const isMobile = () => !isDesktop();
    const hasScrolled = () => window.scrollY > 0;
    const isMenuOpen = () => elements.navbarCollapse?.classList.contains('show');

    // Navbar color management
    const NavbarColors = {
        setBlack() {
            if (elements.navbarBrand) elements.navbarBrand.style.color = COLORS.BLACK;
            if (elements.navbarToggler) elements.navbarToggler.style.color = COLORS.BLACK;
        },
        setWhite() {
            if (elements.navbarBrand) elements.navbarBrand.style.color = COLORS.WHITE;
            if (elements.navbarToggler) elements.navbarToggler.style.color = COLORS.WHITE;
        },
        clearInline() {
            if (elements.navbarBrand) elements.navbarBrand.style.color = COLORS.DEFAULT;
            if (elements.navbarToggler) elements.navbarToggler.style.color = COLORS.DEFAULT;
        },
        update() {
            if (isNavbarSolid || !elements.mainNav) return;

            if (hasScrolled()) {
                this.clearInline();
            } else {
                this.setWhite();
            }
        }
    };

    // Navbar toggler icon management
    const TogglerIcon = {
        setMenu() {
            if (elements.navbarToggler) {
                elements.navbarToggler.innerHTML = ICONS.MENU;
            }
        },
        setClose() {
            if (elements.navbarToggler) {
                elements.navbarToggler.innerHTML = ICONS.CLOSE;
            }
        },
        toggle() {
            const isExpanded = elements.navbarToggler?.getAttribute('aria-expanded') === 'true';
            isExpanded ? this.setClose() : this.setMenu();
        }
    };

    // Navbar collapse event handlers
    const NavbarCollapse = {
        onShow() {
            NavbarColors.setBlack();
        },
        onHide() {
            if (isNavbarSolid) return;

            // Recalculate navbar state based on scroll position
            elements.mainNav?.classList.toggle('navbar-shrink', hasScrolled());
            NavbarColors.update();
        }
    };

    // Navbar shrink on scroll
    function updateNavbarShrink() {
        if (!elements.mainNav || isNavbarSolid) return;
        if (isMobile() && isMenuOpen()) return;

        const scrolled = hasScrolled();
        elements.mainNav.classList.toggle('navbar-shrink', scrolled);

        if (scrolled) {
            NavbarColors.clearInline();
        }
    }

    // Back to top button
    const BackToTop = {
        toggle() {
            if (!elements.toTopButton) return;
            elements.toTopButton.classList.toggle('show', window.pageYOffset > SCROLL_THRESHOLD);
        },
        scrollToTop(e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Dropdown behavior
    const Dropdown = {
        update() {
            if (!elements.dropdownToggle) return;

            if (isDesktop()) {
                elements.dropdownToggle.removeAttribute('data-bs-toggle');
            } else {
                elements.dropdownToggle.setAttribute('data-bs-toggle', 'dropdown');
            }
        },
        handleClick(e) {
            if (isDesktop()) {
                e.stopPropagation();
            }
        }
    };

    // Resize handler
    const ResizeHandler = (() => {
        let wasDesktopMode = isDesktop();

        function closeMobileMenu() {
            if (!elements.navbarCollapse) return;

            const bsCollapse = bootstrap.Collapse.getInstance(elements.navbarCollapse);
            if (bsCollapse) {
                bsCollapse.hide();
            } else if (elements.navbarCollapse.classList.contains('show')) {
                elements.navbarCollapse.classList.remove('show');
            }
        }

        function resetNavbarForDesktop() {
            if (isNavbarSolid) return;

            NavbarColors.setWhite();
            TogglerIcon.setMenu();
        }

        function resetIconForMobile() {
            // Ensure icon is burger when switching to mobile if menu is closed
            if (!isMenuOpen()) {
                TogglerIcon.setMenu();
            }
        }

        return function handleResize() {
            const isDesktopMode = isDesktop();

            // Close mobile menu when transitioning to desktop
            if (!wasDesktopMode && isDesktopMode) {
                if (isMenuOpen()) {
                    closeMobileMenu();
                    resetNavbarForDesktop();
                }
            }

            // Reset icon when transitioning back to mobile
            if (wasDesktopMode && !isDesktopMode) {
                resetIconForMobile();
            }

            Dropdown.update();
            wasDesktopMode = isDesktopMode;
        };
    })();

    return {
        NavbarColors,
        TogglerIcon,
        NavbarCollapse,
        updateNavbarShrink,
        BackToTop,
        Dropdown,
        ResizeHandler,
        // Expose utilities for testing
        utils: {
            isDesktop,
            isMobile,
            hasScrolled,
            isMenuOpen
        }
    };
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const elements = {
        navbarToggler: document.querySelector('.navbar-toggler'),
        navbarBrand: document.querySelector('.navbar-brand'),
        navbarCollapse: document.querySelector('#navbarResponsive'),
        mainNav: document.getElementById('mainNav'),
        toTopButton: document.getElementById('toTop'),
        dropdownToggle: document.querySelector('.dropdown-toggle')
    };

    const isNavbarSolid = elements.mainNav?.classList.contains('navbar-solid');
    const controller = createNavbarController(elements, { isNavbarSolid });

    // Event listeners setup
    function setupEventListeners() {
        if (elements.navbarToggler && elements.navbarCollapse) {
            elements.navbarCollapse.addEventListener('show.bs.collapse', controller.NavbarCollapse.onShow);
            elements.navbarCollapse.addEventListener('hide.bs.collapse', controller.NavbarCollapse.onHide);
            elements.navbarToggler.addEventListener('click', () => {
                setTimeout(() => controller.TogglerIcon.toggle(), ICON_DELAY);
            });
        }

        window.addEventListener('scroll', () => {
            controller.updateNavbarShrink();
            controller.BackToTop.toggle();
        });

        if (elements.toTopButton) {
            elements.toTopButton.addEventListener('click', controller.BackToTop.scrollToTop);
        }

        if (elements.dropdownToggle) {
            elements.dropdownToggle.addEventListener('click', controller.Dropdown.handleClick);
        }

        window.addEventListener('resize', controller.ResizeHandler);
    }

    // Initialize
    function init() {
        controller.updateNavbarShrink();
        controller.BackToTop.toggle();
        controller.Dropdown.update();
        controller.ResizeHandler();
        setupEventListeners();
    }

    init();
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createNavbarController,
        DESKTOP_BREAKPOINT,
        SCROLL_THRESHOLD,
        ICON_DELAY,
        ICONS,
        COLORS
    };
}
