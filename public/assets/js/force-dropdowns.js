// Force dropdowns to be visible
document.addEventListener('DOMContentLoaded', function() {
    // Force all dropdowns to be absolutely positioned
    document.querySelectorAll('.nav__item.has-dropdown').forEach(item => {
        item.style.position = 'relative';
        item.style.zIndex = '10000';
    });

    // Desktop behavior
    if (window.innerWidth >= 992) {
        document.querySelectorAll('.nav__item.has-dropdown').forEach(item => {
            const dropdown = item.querySelector('.dropdown-menu');
            if (dropdown) {
                // Set initial styles
                dropdown.style.cssText = `
                    position: absolute !important;
                    top: 100% !important;
                    left: 0 !important;
                    min-width: 220px !important;
                    background: #fff !important;
                    border: none !important;
                    border-radius: 4px !important;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
                    padding: 10px 0 !important;
                    margin-top: 0 !important;
                    z-index: 99999 !important;
                    display: none !important;
                `;

                // Add hover listeners
                item.addEventListener('mouseenter', () => {
                    dropdown.style.cssText += `
                        display: block !important;
                        visibility: visible !important;
                        opacity: 1 !important;
                        pointer-events: auto !important;
                    `;
                });

                item.addEventListener('mouseleave', () => {
                    dropdown.style.cssText += `
                        display: none !important;
                        visibility: hidden !important;
                        opacity: 0 !important;
                        pointer-events: none !important;
                    `;
                });
            }
        });
    }
    // Mobile behavior
    else {
        document.querySelectorAll('.nav__item.has-dropdown > a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                const parent = link.parentElement;
                const dropdown = link.nextElementSibling;

                // Close other dropdowns
                document.querySelectorAll('.nav__item.has-dropdown').forEach(item => {
                    if (item !== parent) {
                        item.classList.remove('opened');
                        const otherDropdown = item.querySelector('.dropdown-menu');
                        if (otherDropdown) {
                            otherDropdown.style.display = 'none';
                        }
                    }
                });

                // Toggle current dropdown
                parent.classList.toggle('opened');
                if (dropdown) {
                    dropdown.style.display = parent.classList.contains('opened') ? 'block' : 'none';
                }
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav__item.has-dropdown')) {
                document.querySelectorAll('.nav__item.has-dropdown').forEach(item => {
                    item.classList.remove('opened');
                    const dropdown = item.querySelector('.dropdown-menu');
                    if (dropdown) {
                        dropdown.style.display = 'none';
                    }
                });
            }
        });
    }

    // Force all dropdown items to be visible
    document.querySelectorAll('.dropdown-menu .nav__item-link').forEach(link => {
        link.style.cssText = `
            display: block !important;
            padding: 8px 20px !important;
            color: #333 !important;
            font-size: 14px !important;
            line-height: 1.5 !important;
            text-decoration: none !important;
        `;
    });
});
