(function () {
    'use strict';

    const hamburgerBtn = document.querySelector('[data-menu-toggle]');
    const closeBtn = document.querySelector('[data-menu-close]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const mobileOverlay = document.querySelector('[data-mobile-overlay]');
    const submenuToggles = document.querySelectorAll('[data-submenu-toggle]');
    const body = document.body;

    if (!hamburgerBtn || !mobileMenu || !mobileOverlay) return;

    function openMenu() {
        mobileMenu.classList.remove('hidden');
        void mobileMenu.offsetWidth;
        mobileMenu.classList.remove('-translate-x-full');
        mobileOverlay.classList.remove('hidden');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        body.classList.add('overflow-hidden');
    }

    function closeMenu() {
        mobileMenu.classList.add('-translate-x-full');
        mobileOverlay.classList.add('hidden');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        body.classList.remove('overflow-hidden');
        
        submenuToggles.forEach(function(toggle) {
            const menuItem = toggle.closest('li');
            const submenu = menuItem ? menuItem.querySelector('ul') : null;
            const icon = toggle.querySelector('svg');
            
            if (submenu) {
                submenu.classList.remove('max-h-screen', 'opacity-100', 'py-2');
                submenu.classList.add('max-h-0', 'opacity-0', 'py-0');
            }
            
            if (icon) {
                icon.classList.remove('rotate-180');
            }
            
            toggle.setAttribute('aria-expanded', 'false');
        });
        
        setTimeout(function() {
            mobileMenu.classList.add('hidden');
        }, 300);
    }

    hamburgerBtn.addEventListener('click', openMenu);

    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }

    mobileOverlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden') && !mobileMenu.classList.contains('-translate-x-full')) {
            closeMenu();
        }
    });

    submenuToggles.forEach(function (toggle) {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            
            const menuItem = this.closest('li');
            const submenu = menuItem ? menuItem.querySelector('ul') : null;
            const icon = this.querySelector('svg');
            const isExpanded = this.getAttribute('aria-expanded') === 'true';

            if (submenu) {
                if (isExpanded) {
                    submenu.classList.remove('max-h-screen', 'opacity-100', 'py-2');
                    submenu.classList.add('max-h-0', 'opacity-0', 'py-0');
                    this.setAttribute('aria-expanded', 'false');
                } else {
                    submenuToggles.forEach(function(otherToggle) {
                        if (otherToggle !== toggle) {
                            const otherMenuItem = otherToggle.closest('li');
                            const otherSubmenu = otherMenuItem ? otherMenuItem.querySelector('ul') : null;
                            const otherIcon = otherToggle.querySelector('svg');
                            
                            if (otherSubmenu) {
                                otherSubmenu.classList.remove('max-h-screen', 'opacity-100', 'py-2');
                                otherSubmenu.classList.add('max-h-0', 'opacity-0', 'py-0');
                            }
                            
                            if (otherIcon) {
                                otherIcon.classList.remove('rotate-180');
                            }
                            
                            otherToggle.setAttribute('aria-expanded', 'false');
                        }
                    });
                    
                    submenu.classList.remove('max-h-0', 'opacity-0', 'py-0');
                    submenu.classList.add('max-h-screen', 'opacity-100', 'py-2');
                    this.setAttribute('aria-expanded', 'true');
                }

                if (icon) {
                    icon.classList.toggle('rotate-180');
                }
            }
        });
    });
})();

