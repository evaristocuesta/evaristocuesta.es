/**
 * @jest-environment jsdom
 */

const {
    createNavbarController,
    DESKTOP_BREAKPOINT,
    ICONS,
    COLORS
} = require('../wwwroot/js/site.js');

describe('Navbar Controller', () => {
    let elements;
    let controller;

    // Helper to normalize color comparison (jsdom converts hex to rgb)
    const normalizeColor = (color) => {
        const el = document.createElement('div');
        el.style.color = color;
        return el.style.color;
    };

    const NORMALIZED_COLORS = {
        BLACK: normalizeColor(COLORS.BLACK),
        WHITE: normalizeColor(COLORS.WHITE),
        DEFAULT: COLORS.DEFAULT
    };

    beforeEach(() => {
        // Reset DOM
        document.body.innerHTML = `
            <nav id="mainNav" class="navbar">
                <a class="navbar-brand">BRAND</a>
                <button class="navbar-toggler" aria-expanded="false">
                    ${ICONS.MENU}
                </button>
                <div id="navbarResponsive" class="navbar-collapse"></div>
            </nav>
            <button id="toTop"></button>
            <a class="dropdown-toggle"></a>
        `;

        elements = {
            navbarToggler: document.querySelector('.navbar-toggler'),
            navbarBrand: document.querySelector('.navbar-brand'),
            navbarCollapse: document.querySelector('#navbarResponsive'),
            mainNav: document.getElementById('mainNav'),
            toTopButton: document.getElementById('toTop'),
            dropdownToggle: document.querySelector('.dropdown-toggle')
        };

        // Reset window
        Object.defineProperty(window, 'innerWidth', { writable: true, value: 1024 });
        Object.defineProperty(window, 'scrollY', { writable: true, value: 0 });
        Object.defineProperty(window, 'pageYOffset', { writable: true, value: 0 });

        // Reset Bootstrap mock
        global.bootstrap.Collapse.getInstance.mockReset();

        controller = createNavbarController(elements);
    });

    describe('Navbar Colors', () => {
        test('should set black colors when menu opens', () => {
            controller.NavbarCollapse.onShow();

            expect(elements.navbarBrand.style.color).toBe(NORMALIZED_COLORS.BLACK);
            expect(elements.navbarToggler.style.color).toBe(NORMALIZED_COLORS.BLACK);
        });

        test('should set white colors when menu closes at top of page', () => {
            window.scrollY = 0;

            controller.NavbarCollapse.onHide();

            expect(elements.navbarBrand.style.color).toBe(NORMALIZED_COLORS.WHITE);
            expect(elements.navbarToggler.style.color).toBe(NORMALIZED_COLORS.WHITE);
        });

        test('should clear inline styles when menu closes after scrolling', () => {
            window.scrollY = 100;

            controller.NavbarCollapse.onHide();

            expect(elements.navbarBrand.style.color).toBe('');
            expect(elements.navbarToggler.style.color).toBe('');
        });
    });

    describe('Toggler Icon', () => {
        test('should toggle to close icon when menu is expanded', () => {
            elements.navbarToggler.setAttribute('aria-expanded', 'true');

            controller.TogglerIcon.toggle();

            expect(elements.navbarToggler.innerHTML).toBe(ICONS.CLOSE);
        });

        test('should toggle to menu icon when menu is collapsed', () => {
            elements.navbarToggler.setAttribute('aria-expanded', 'false');

            controller.TogglerIcon.toggle();

            expect(elements.navbarToggler.innerHTML).toBe(ICONS.MENU);
        });

        test('should reset to menu icon after closing on desktop', () => {
            controller.TogglerIcon.setMenu();

            expect(elements.navbarToggler.innerHTML).toBe(ICONS.MENU);
        });
    });

    describe('Navbar Shrink on Scroll', () => {
        test('should add navbar-shrink class when scrolled', () => {
            window.scrollY = 100;

            controller.updateNavbarShrink();

            expect(elements.mainNav.classList.contains('navbar-shrink')).toBe(true);
        });

        test('should remove navbar-shrink class when at top', () => {
            elements.mainNav.classList.add('navbar-shrink');
            window.scrollY = 0;

            controller.updateNavbarShrink();

            expect(elements.mainNav.classList.contains('navbar-shrink')).toBe(false);
        });

        test('should not change navbar-shrink when mobile menu is open', () => {
            window.innerWidth = 500; // Mobile
            elements.navbarCollapse.classList.add('show');
            window.scrollY = 100;

            controller.updateNavbarShrink();

            expect(elements.mainNav.classList.contains('navbar-shrink')).toBe(false);
        });

        test('should clear inline styles when scrolled', () => {
            elements.navbarBrand.style.color = COLORS.WHITE;
            elements.navbarToggler.style.color = COLORS.WHITE;
            window.scrollY = 100;

            controller.updateNavbarShrink();

            expect(elements.navbarBrand.style.color).toBe('');
            expect(elements.navbarToggler.style.color).toBe('');
        });
    });

    describe('Mobile to Desktop Transition', () => {
        test('should close menu when resizing from mobile to desktop', () => {
            window.innerWidth = 500; // Mobile
            elements.navbarCollapse.classList.add('show');

            const mockHide = jest.fn();
            global.bootstrap.Collapse.getInstance.mockReturnValue({ hide: mockHide });

            // First call to establish wasDesktop state
            controller.ResizeHandler();

            // Now transition to desktop
            window.innerWidth = 1024; // Desktop
            controller.ResizeHandler();

            expect(mockHide).toHaveBeenCalled();
        });

        test('should reset colors when closing menu on resize to desktop', () => {
            window.innerWidth = 500; // Mobile
            elements.navbarCollapse.classList.add('show');
            elements.navbarBrand.style.color = COLORS.BLACK;

            global.bootstrap.Collapse.getInstance.mockReturnValue({ hide: jest.fn() });

            // First call to establish wasDesktop state
            controller.ResizeHandler();

            // Now transition to desktop
            window.innerWidth = 1024; // Desktop
            controller.ResizeHandler();

            expect(elements.navbarBrand.style.color).toBe(NORMALIZED_COLORS.WHITE);
        });

        test('should reset icon to burger when closing menu on resize', () => {
            window.innerWidth = 500; // Mobile
            elements.navbarCollapse.classList.add('show');
            elements.navbarToggler.innerHTML = ICONS.CLOSE;

            global.bootstrap.Collapse.getInstance.mockReturnValue({ hide: jest.fn() });

            // First call to establish wasDesktop state
            controller.ResizeHandler();

            // Now transition to desktop
            window.innerWidth = 1024; // Desktop
            controller.ResizeHandler();

            expect(elements.navbarToggler.innerHTML).toBe(ICONS.MENU);
        });

        test('should reset icon to burger when returning to mobile after desktop', () => {
            // Scenario: Mobile with menu closed (X icon) → Desktop → Mobile again
            window.innerWidth = 500; // Mobile
            elements.navbarCollapse.classList.add('show'); // Menu was open
            elements.navbarToggler.innerHTML = ICONS.CLOSE; // Icon is X

            global.bootstrap.Collapse.getInstance.mockReturnValue({ hide: jest.fn() });

            // First call establishes mobile state
            controller.ResizeHandler();

            // Close the menu manually (simulating user closing it)
            elements.navbarCollapse.classList.remove('show');
            elements.navbarToggler.setAttribute('aria-expanded', 'false');
            // But icon might still be X here (the bug)

            // Transition to desktop
            window.innerWidth = 1024; // Desktop
            controller.ResizeHandler();

            // Return to mobile
            window.innerWidth = 500; // Mobile
            controller.ResizeHandler();

            // Icon should be reset to burger since menu is closed
            expect(elements.navbarToggler.innerHTML).toBe(ICONS.MENU);
        });
    });

    describe('Menu Close with Scroll Position', () => {
        test('should update navbar-shrink and colors when closing menu with scroll down', () => {
            // Scenario: Open menu at top, scroll down, close menu
            window.scrollY = 0;
            elements.navbarCollapse.classList.add('show');

            window.scrollY = 100; // Scroll down while menu is open
            controller.NavbarCollapse.onHide();

            expect(elements.mainNav.classList.contains('navbar-shrink')).toBe(true);
            expect(elements.navbarBrand.style.color).toBe('');
            expect(elements.navbarToggler.style.color).toBe('');
        });

        test('should keep white colors when closing menu at top', () => {
            // Scenario: Open menu, close without scrolling
            window.scrollY = 0;
            controller.NavbarCollapse.onHide();

            expect(elements.mainNav.classList.contains('navbar-shrink')).toBe(false);
            expect(elements.navbarBrand.style.color).toBe(NORMALIZED_COLORS.WHITE);
            expect(elements.navbarToggler.style.color).toBe(NORMALIZED_COLORS.WHITE);
        });

        test('should handle scroll up after menu close', () => {
            // Scenario: Scroll down, open menu, scroll up, close menu
            window.scrollY = 100;
            elements.navbarCollapse.classList.add('show');

            window.scrollY = 0; // Scroll up while menu is open
            controller.NavbarCollapse.onHide();

            expect(elements.mainNav.classList.contains('navbar-shrink')).toBe(false);
            expect(elements.navbarBrand.style.color).toBe(NORMALIZED_COLORS.WHITE);
        });
    });

    describe('Navbar Solid (No Hero Image)', () => {
        beforeEach(() => {
            elements.mainNav.classList.add('navbar-solid');
            controller = createNavbarController(elements, { isNavbarSolid: true });
        });

        test('should not apply shrink behavior on solid navbar', () => {
            window.scrollY = 100;

            controller.updateNavbarShrink();

            expect(elements.mainNav.classList.contains('navbar-shrink')).toBe(false);
        });

        test('should not update colors on hide when navbar is solid', () => {
            elements.navbarBrand.style.color = COLORS.BLACK;

            controller.NavbarCollapse.onHide();

            expect(elements.navbarBrand.style.color).toBe(NORMALIZED_COLORS.BLACK);
        });
    });

    describe('Dropdown Behavior', () => {
        test('should remove data-bs-toggle on desktop', () => {
            window.innerWidth = 1024;

            controller.Dropdown.update();

            expect(elements.dropdownToggle.hasAttribute('data-bs-toggle')).toBe(false);
        });

        test('should add data-bs-toggle on mobile', () => {
            window.innerWidth = 500;

            controller.Dropdown.update();

            expect(elements.dropdownToggle.getAttribute('data-bs-toggle')).toBe('dropdown');
        });

        test('should stop propagation on desktop click', () => {
            window.innerWidth = 1024;
            const event = { stopPropagation: jest.fn() };

            controller.Dropdown.handleClick(event);

            expect(event.stopPropagation).toHaveBeenCalled();
        });
    });

    describe('Back to Top Button', () => {
        test('should show button after scrolling threshold', () => {
            window.pageYOffset = 400;

            controller.BackToTop.toggle();

            expect(elements.toTopButton.classList.contains('show')).toBe(true);
        });

        test('should hide button before scrolling threshold', () => {
            elements.toTopButton.classList.add('show');
            window.pageYOffset = 200;

            controller.BackToTop.toggle();

            expect(elements.toTopButton.classList.contains('show')).toBe(false);
        });
    });
});
