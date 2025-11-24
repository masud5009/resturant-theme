/* Main JS — Spice Palace (Optimized & Cleaned) */
(function () {
    'use strict';

    // ============================================
    // CONFIG & STATE
    // ============================================
    const STATE = {
        cart: { items: JSON.parse(localStorage.getItem('sp_cart') || '[]') },
        theme: localStorage.getItem('sp_theme') || (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark')
    };

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    const safe = (fn) => {
        try { fn(); } catch (e) { console.warn(e); }
    };

    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    // ============================================
    // PRELOADER
    // ============================================
    function hidePreloader() {
        safe(() => {
            const preloader = $('#preloader');
            if (!preloader) return;
            
            preloader.style.transition = 'opacity .6s ease';
            preloader.style.opacity = '0';
            preloader.style.pointerEvents = 'none';
            
            setTimeout(() => preloader?.remove(), 700);
        });
    }

    // ============================================
    // THEME TOGGLE
    // ============================================
    function applyTheme(theme) {
        document.body.classList.toggle('dark', theme === 'dark');
        document.body.classList.toggle('light', theme === 'light');
        localStorage.setItem('sp_theme', theme);
        
        const toggle = $('#themeToggle');
        if (toggle) {
            toggle.innerHTML = theme === 'dark' 
                ? '<i class="fa fa-sun"></i>' 
                : '<i class="fa fa-moon"></i>';
        }
        
        safe(() => {
            const meta = $('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', theme === 'dark' ? '#0f0f0f' : '#ffffff');
        });
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    function initLibraries() {
        // AOS
        if (window.AOS) safe(() => AOS.init({ duration: 800, once: true, offset: 80 }));
        
        // GLightbox
        if (window.GLightbox) safe(() => GLightbox({ selector: '.glightbox' }));
        
        // Particles
        if (window.particlesJS) {
            safe(() => {
                particlesJS('particles-js', {
                    particles: {
                        number: { value: 40, density: { enable: true, value_area: 800 } },
                        color: { value: ['#ff6b6b', '#ffd47a', '#667eea'] },
                        shape: { type: 'circle' },
                        opacity: { value: 0.6 },
                        size: { value: 3 },
                        move: { enable: true, speed: 1.5 }
                    },
                    interactivity: {
                        detect_on: 'canvas',
                        events: {
                            onhover: { enable: true, mode: 'repulse' },
                            onclick: { enable: true, mode: 'push' }
                        }
                    },
                    retina_detect: true
                });
            });
        }
        
        // Flatpickr
        if (window.flatpickr) {
            safe(() => {
                flatpickr('.fp-date', { minDate: 'today', dateFormat: 'Y-m-d' });
                flatpickr('.fp-time', { enableTime: true, noCalendar: true, dateFormat: 'H:i', time_24hr: true });
            });
        }
    }

    function initSwipers() {
        if (!window.Swiper) return;
        
        safe(() => {
            // Specials Swiper
            if ($('.specialsSwiper')) {
                new Swiper('.specialsSwiper', {
                    slidesPerView: 1.05,
                    spaceBetween: 18,
                    loop: true,
                    autoplay: { delay: 3000, disableOnInteraction: false },
                    breakpoints: {
                        576: { slidesPerView: 1.2 },
                        768: { slidesPerView: 1.6 },
                        992: { slidesPerView: 2.2 },
                        1200: { slidesPerView: 3 }
                    },
                    pagination: { el: '.specials-block .swiper-pagination', clickable: true }
                });
            }
            
            // Testimonials Swiper
            if ($('.testiSwiper')) {
                new Swiper('.testiSwiper', {
                    slidesPerView: 1,
                    spaceBetween: 18,
                    loop: true,
                    autoplay: { delay: 4500 }
                });
            }
            
            // About Swiper
            if ($('.aboutSwiper')) {
                new Swiper('.aboutSwiper', {
                    slidesPerView: 1,
                    loop: true,
                    effect: 'fade',
                    speed: 800,
                    autoplay: { delay: 3500, disableOnInteraction: false },
                    pagination: { el: '.aboutSwiper .swiper-pagination', clickable: true },
                    fadeEffect: { crossFade: true }
                });
            }
        });
    }

    // ============================================
    // NAVIGATION
    // ============================================
    function initNavigation() {
        const navLinks = $$('.navbar .nav-link');
        
        function setActiveNav() {
            const fromTop = window.scrollY + 120;
            
            navLinks.forEach(link => {
                if (!link.hash) return;
                const section = $(link.hash);
                if (!section) return;
                
                const isActive = section.offsetTop <= fromTop && 
                               section.offsetTop + section.offsetHeight > fromTop;
                
                link.classList.toggle('active', isActive);
            });
        }
        
        window.addEventListener('scroll', setActiveNav);
        setActiveNav();
    }

    // ============================================
    // BACK TO TOP
    // ============================================
    function initBackToTop() {
        const backBtn = $('#backTop');
        if (!backBtn) return;
        
        backBtn.style.display = 'none';
        
        backBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        window.addEventListener('scroll', () => {
            backBtn.style.display = window.scrollY > 200 ? 'flex' : 'none';
        });
    }

    // ============================================
    // CART FUNCTIONALITY
    // ============================================
    function saveCart() {
        localStorage.setItem('sp_cart', JSON.stringify(STATE.cart.items));
        updateCartUI();
    }

    function updateCartUI() {
        const count = STATE.cart.items.reduce((sum, item) => sum + item.qty, 0);
        
        // Update count badges
        $$('.cart-fab .count, .cart-fab-inline .count').forEach(el => {
            el.textContent = count;
        });
        
        // Update cart list
        const cartList = $('#cartList');
        if (cartList) {
            cartList.innerHTML = STATE.cart.items.map(item => `
                <div class="d-flex align-items-center mb-2">
                    <img src="${item.image}" width="56" class="rounded me-2">
                    <div class="flex-grow-1 small">
                        <strong>${item.name}</strong>
                        <div class="text-muted">${item.qty} x $${item.price}</div>
                    </div>
                    <button class="btn btn-sm btn-outline-danger remove-item" data-id="${item.id}">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }
        
        // Update total
        const total = STATE.cart.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const cartSum = $('#cartSum');
        if (cartSum) cartSum.textContent = `$${total.toFixed(2)}`;
    }

    function flyToCart(imgElement, callback) {
        if (!imgElement) {
            callback?.();
            return;
        }
        
        const target = $('.cart-fab') || $('.cart-fab-inline');
        if (!target) {
            callback?.();
            return;
        }
        
        const clone = imgElement.cloneNode(true);
        const rect = imgElement.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        
        Object.assign(clone.style, {
            position: 'fixed',
            left: `${rect.left}px`,
            top: `${rect.top}px`,
            width: `${rect.width}px`,
            zIndex: '99999',
            transition: 'all 700ms cubic-bezier(.2,.8,.2,1)',
            pointerEvents: 'none'
        });
        
        document.body.appendChild(clone);
        
        requestAnimationFrame(() => {
            Object.assign(clone.style, {
                left: `${targetRect.left + targetRect.width / 2 - rect.width / 2}px`,
                top: `${targetRect.top + targetRect.height / 2 - rect.height / 2}px`,
                transform: 'scale(.2) rotate(10deg)',
                opacity: '0.8'
            });
        });
        
        setTimeout(() => {
            clone.remove();
            callback?.();
        }, 750);
    }

    function initCart() {
        // Add to cart
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.add-to-cart');
            if (!btn) return;
            
            e.preventDefault();
            
            const id = btn.dataset.id;
            const name = btn.dataset.name;
            const price = Number(btn.dataset.price) || 0;
            const image = btn.dataset.image || '';
            
            const card = btn.closest('.menu-card, .special-card');
            const imgEl = card?.querySelector('img');
            
            flyToCart(imgEl, () => {
                const existing = STATE.cart.items.find(item => item.id == id);
                
                if (existing) {
                    existing.qty += 1;
                } else {
                    STATE.cart.items.push({ id, name, price, qty: 1, image });
                }
                
                saveCart();
                
                if (window.Toastify) {
                    Toastify({
                        text: `Added ${name} to cart`,
                        duration: 2200,
                        gravity: 'bottom',
                        position: 'left',
                        backgroundColor: 'linear-gradient(90deg,#ff6b6b,#ffa047)'
                    }).showToast();
                }
            });
        });
        
        // Remove from cart
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.remove-item');
            if (!btn) return;
            
            const id = btn.dataset.id;
            STATE.cart.items = STATE.cart.items.filter(item => item.id != id);
            saveCart();
        });
        
        // Clear cart
        const clearBtn = $('#clearCart');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                STATE.cart.items = [];
                saveCart();
            });
        }
        
        updateCartUI();
    }

    // ============================================
    // MOBILE MENU
    // ============================================
    function initMobileMenu() {
        const toggle = $('#mobileToggle');
        const closeBtn = $('#mobileClose');
        const menu = $('#mobileMenu');
        const overlay = $('#mobileOverlay');
        
        if (!menu || !overlay || !toggle) return;
        
        let lastFocused = null;
        
        function openMenu() {
            lastFocused = document.activeElement;
            menu.classList.add('open');
            overlay.classList.add('open');
            menu.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            const focusable = menu.querySelector('a, button');
            focusable?.focus();
        }
        
        function closeMenu() {
            menu.classList.remove('open');
            overlay.classList.remove('open');
            menu.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            lastFocused?.focus();
        }
        
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            openMenu();
        });
        
        closeBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            closeMenu();
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeMenu();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && menu.classList.contains('open')) {
                closeMenu();
            }
        });
        
        // Touch feedback
        $$('.mobile-menu-item').forEach(item => {
            ['touchstart', 'mousedown'].forEach(evt => {
                item.addEventListener(evt, () => item.classList.add('active'));
            });
            ['touchend', 'mouseup', 'mouseleave'].forEach(evt => {
                item.addEventListener(evt, () => item.classList.remove('active'));
            });
        });
    }

    // ============================================
    // COUNTERS
    // ============================================
    function initCounters() {
        $$('.counter').forEach(el => {
            const target = Number(el.dataset.target) || 0;
            
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;
                    
                    let current = 0;
                    const duration = 1200;
                    const start = Date.now();
                    
                    function step() {
                        const elapsed = Date.now() - start;
                        const progress = Math.min(elapsed / duration, 1);
                        
                        current = Math.floor(progress * target);
                        el.textContent = current;
                        
                        if (progress < 1) {
                            requestAnimationFrame(step);
                        } else {
                            el.textContent = target + (target >= 1000 ? '+' : '');
                        }
                    }
                    
                    step();
                    obs.disconnect();
                });
            }, { threshold: 0.2 });
            
            observer.observe(el);
        });
    }

    // ============================================
    // RESERVATION FORM
    // ============================================
    function initReservation() {
        const form = $('#resForm');
        if (!form) return;
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const btn = $('#resSubmit');
            const spinner = btn?.querySelector('.spinner-border');
            const btnText = btn?.querySelector('.btn-text');
            
            if (btnText) btnText.textContent = 'Submitting';
            spinner?.classList.remove('d-none');
            
            setTimeout(() => {
                spinner?.classList.add('d-none');
                if (btnText) btnText.textContent = 'Confirmed';
                
                if (window.Toastify) {
                    Toastify({
                        text: 'Reservation received — we will contact you shortly',
                        duration: 3000,
                        gravity: 'bottom',
                        position: 'right',
                        backgroundColor: '#28a745'
                    }).showToast();
                }
                
                form.reset();
            }, 1500);
        });
    }

    // ============================================
    // NEWSLETTER
    // ============================================
    function initNewsletter() {
        const btn = $('#newsBtn');
        if (!btn) return;
        
        btn.addEventListener('click', () => {
            const emailInput = $('#newsEmail');
            
            if (window.Toastify) {
                Toastify({
                    text: 'Thanks for subscribing!',
                    duration: 2000,
                    gravity: 'bottom',
                    position: 'right',
                    backgroundColor: '#28a745'
                }).showToast();
            }
            
            if (emailInput) emailInput.value = '';
        });
    }

    // ============================================
    // MAIN INITIALIZATION
    // ============================================
    window.addEventListener('load', () => {
        setTimeout(() => {
            hidePreloader();
            initLibraries();
            initSwipers();
        }, 300);
    });

    document.addEventListener('DOMContentLoaded', () => {
        applyTheme(STATE.theme);
        
        const themeToggle = $('#themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const newTheme = document.body.classList.contains('dark') ? 'light' : 'dark';
                applyTheme(newTheme);
                STATE.theme = newTheme;
            });
        }
        
        initNavigation();
        initBackToTop();
        initCart();
        initMobileMenu();
        initCounters();
        initReservation();
        initNewsletter();
    });

    // Fallback preloader removal
    setTimeout(hidePreloader, 8000);

})();