// Change navbar-toggler icon when opened/closed
document.addEventListener('DOMContentLoaded', function () {
    const navbarToggler = document.querySelector('.navbar-toggler');

    if (navbarToggler) {
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
});
