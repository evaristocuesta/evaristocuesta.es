// Change navbar-toggler icon when opened/closed
document.addEventListener('DOMContentLoaded', function () {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarBrand = document.querySelector('.navbar-brand');
    const navbarCollapse = document.querySelector('#navbarResponsive');

    if (navbarToggler && navbarCollapse) {
        // Listen for navbar collapse events
        navbarCollapse.addEventListener('show.bs.collapse', function () {
            // When menu starts opening, change brand and toggler to black
            if (navbarBrand) {
                navbarBrand.style.color = '#000';
            }
            navbarToggler.style.color = '#000';
        });

        navbarCollapse.addEventListener('hide.bs.collapse', function () {
            // When menu starts closing, revert to white (unless navbar is shrunk)
            const mainNav = document.getElementById('mainNav');
            if (mainNav && !mainNav.classList.contains('navbar-shrink')) {
                if (navbarBrand) {
                    navbarBrand.style.color = '#fff';
                }
                navbarToggler.style.color = '#fff';
            }
        });

        navbarToggler.addEventListener('click', function () {
            // Little delay needed for Bootstrap to update aria-expanded
            setTimeout(() => {
                const isExpanded = this.getAttribute('aria-expanded') === 'true';

                // Replace the HTML content with the correct icon
                // Font Awesome will automatically convert it to SVG
                if (isExpanded) {
                    this.innerHTML = '<i class="fa-solid fa-xmark"></i>';
                } else {
                    this.innerHTML = '<i class="fas fa-bars"></i>';
                }
            }, 10);
        });
    }

    // Navbar shrink functionality
    const mainNav = document.getElementById('mainNav');

    function navbarShrink() {
        if (!mainNav) {
            return;
        }
        if (window.scrollY === 0) {
            mainNav.classList.remove('navbar-shrink');
        } else {
            mainNav.classList.add('navbar-shrink');
        }
    }

    // Shrink the navbar when page is scrolled
    navbarShrink();
    window.addEventListener('scroll', navbarShrink);

    // Back to top button functionality
    const toTopButton = document.getElementById('toTop');

    if (toTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                toTopButton.classList.add('show');
            } else {
                toTopButton.classList.remove('show');
            }
        });

        // Scroll to top when button is clicked
        toTopButton.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Disable dropdown behavior on desktop (>=992px) - allow direct navigation
    const dropdownToggle = document.querySelector('.dropdown-toggle');

    if (dropdownToggle) {
        function handleDropdownClick(e) {
            // If screen is desktop size (>=992px), prevent dropdown and navigate
            if (window.innerWidth >= 992) {
                e.stopPropagation();
                // Let the link work normally (navigate to href)
                return true;
            }
        }

        dropdownToggle.addEventListener('click', handleDropdownClick);

        // Re-check on window resize
        window.addEventListener('resize', function() {
            if (window.innerWidth >= 992) {
                // Remove Bootstrap's dropdown behavior on desktop
                dropdownToggle.removeAttribute('data-bs-toggle');
            } else {
                // Re-enable dropdown on mobile
                dropdownToggle.setAttribute('data-bs-toggle', 'dropdown');
            }
        });

        // Initial check
        if (window.innerWidth >= 992) {
            dropdownToggle.removeAttribute('data-bs-toggle');
        }
    }
});
