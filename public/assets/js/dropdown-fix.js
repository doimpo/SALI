// Direct dropdown JavaScript fix
document.addEventListener('DOMContentLoaded', function() {
    // Desktop: Handle hover state
    if (window.innerWidth >= 992) {
        const dropdowns = document.querySelectorAll('.nav__item.has-dropdown');
        dropdowns.forEach(dropdown => {
            dropdown.addEventListener('mouseenter', function() {
                const menu = this.querySelector('.dropdown-menu');
                if (menu) {
                    menu.style.opacity = '1';
                    menu.style.visibility = 'visible';
                    menu.style.transform = 'translateY(0)';
                    menu.style.pointerEvents = 'auto';
                }
            });

            dropdown.addEventListener('mouseleave', function() {
                const menu = this.querySelector('.dropdown-menu');
                if (menu) {
                    menu.style.opacity = '0';
                    menu.style.visibility = 'hidden';
                    menu.style.transform = 'translateY(10px)';
                    menu.style.pointerEvents = 'none';
                }
            });
        });
    }

    // Mobile: Handle click state
    if (window.innerWidth < 992) {
        const dropdownLinks = document.querySelectorAll('.nav__item.has-dropdown > a');
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                const parent = this.parentElement;
                const menu = this.nextElementSibling;

                // Close other dropdowns
                document.querySelectorAll('.nav__item.has-dropdown').forEach(item => {
                    if (item !== parent) {
                        item.classList.remove('opened');
                        const otherMenu = item.querySelector('.dropdown-menu');
                        if (otherMenu) {
                            otherMenu.classList.remove('show');
                            otherMenu.style.display = 'none';
                        }
                    }
                });

                // Toggle current dropdown
                parent.classList.toggle('opened');
                if (menu) {
                    menu.classList.toggle('show');
                    menu.style.display = menu.classList.contains('show') ? 'block' : 'none';
                }
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.nav__item.has-dropdown')) {
                document.querySelectorAll('.nav__item.has-dropdown').forEach(item => {
                    item.classList.remove('opened');
                    const menu = item.querySelector('.dropdown-menu');
                    if (menu) {
                        menu.classList.remove('show');
                        menu.style.display = 'none';
                    }
                });
            }
        });
    }

    // Add direct styles
    const style = document.createElement('style');
    style.textContent = `
        /* Base dropdown styles */
        .navbar .nav__item.has-dropdown {
            position: relative !important;
        }
        
        .navbar .nav__item.has-dropdown > .dropdown-menu {
            min-width: 220px !important;
            background: #fff !important;
            border: none !important;
            border-radius: 4px !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
            padding: 10px 0 !important;
            margin-top: 0 !important;
        }

        /* Desktop styles */
        @media (min-width: 992px) {
            .navbar .nav__item.has-dropdown > .dropdown-menu {
                position: absolute !important;
                top: 100% !important;
                left: 0 !important;
                display: block !important;
                opacity: 0 !important;
                visibility: hidden !important;
                transform: translateY(10px) !important;
                transition: all 0.3s ease !important;
                z-index: 9999 !important;
            }

            .navbar .nav__item.has-dropdown:hover > .dropdown-menu {
                opacity: 1 !important;
                visibility: visible !important;
                transform: translateY(0) !important;
                pointer-events: auto !important;
            }

            .navbar .dropdown-menu .nav__item-link {
                padding: 8px 20px !important;
                display: block !important;
                color: #333 !important;
                font-size: 14px !important;
                transition: all 0.3s ease !important;
            }

            .navbar .dropdown-menu .nav__item-link:hover {
                color: #D1A648 !important;
                background: rgba(209,166,72,0.1) !important;
                padding-left: 25px !important;
            }
        }

        /* Mobile styles */
        @media (max-width: 991px) {
            .navbar .nav__item.has-dropdown > .dropdown-menu {
                display: none !important;
                position: static !important;
                box-shadow: none !important;
                border-radius: 0 !important;
                padding-left: 15px !important;
                background: rgba(0,0,0,0.02) !important;
            }

            .navbar .nav__item.has-dropdown.opened > .dropdown-menu,
            .navbar .nav__item.has-dropdown > .dropdown-menu.show {
                display: block !important;
            }
        }
    `;
    document.head.appendChild(style);
});
