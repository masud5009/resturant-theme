/* Main JS — Spice Palace upgraded */
(function () {
    'use strict';

    // --- Preloader ---
    window.addEventListener('load', function () {
        setTimeout(function () {
            hidePreloader();
        }, 300);
        // after load, initialize libs
        initAOS(); initSwipers(); initGLightbox(); initParticles(); initFlatpickr();
    });

    // Robust preloader hide helper: fade-out all matching preloader elements then remove
    function hidePreloader() {
        try {
            var nodes = document.querySelectorAll('#preloader');
            if (!nodes || !nodes.length) return;
            nodes.forEach(function (p) {
                try {
                    p.style.transition = p.style.transition || 'opacity .6s ease, visibility .6s';
                    p.style.opacity = '0';
                    // keep it non-interactive while fading
                    p.style.pointerEvents = 'none';
                    setTimeout(function () { try { p.remove(); } catch (e) { } }, 700);
                } catch (e) {/* ignore per-element errors */ }
            });
        } catch (e) { console.warn('hidePreloader', e); }
    }

    function safe(fn) { try { fn(); } catch (e) { console.warn(e); } }

    // --- AOS ---
    function initAOS() { if (window.AOS) safe(function () { AOS.init({ duration: 800, once: true, offset: 80 }); }); }

    // --- Swiper ---
    var specialsSwiper, testiSwiper, aboutSwiper;
    function initSwipers() {
        if (window.Swiper) {
            try {
                specialsSwiper = new Swiper('.mySwiper', { slidesPerView: 1.2, spaceBetween: 18, centeredSlides: true, loop: true, autoplay: { delay: 3000, disableOnInteraction: false }, breakpoints: { 768: { slidesPerView: 2.2 }, 992: { slidesPerView: 3 } }, pagination: { el: '.swiper-pagination', clickable: true } });
                testiSwiper = new Swiper('.testiSwiper', { slidesPerView: 1, spaceBetween: 18, loop: true, autoplay: { delay: 4500 } });

                // About section slider (if present)
                if (document.querySelector('.aboutSwiper')) {
                    try {
                        aboutSwiper = new Swiper('.aboutSwiper', {
                            slidesPerView: 1,
                            spaceBetween: 0,
                            loop: true,
                            effect: 'fade',
                            speed: 800,
                            autoplay: { delay: 3500, disableOnInteraction: false },
                            pagination: { el: '.aboutSwiper .swiper-pagination', clickable: true },
                            fadeEffect: { crossFade: true }
                        });
                    } catch (e) { console.warn('aboutSwiper init', e); }
                }
            } catch (e) { console.warn('Swiper init', e); }
        }
    }

    // --- GLightbox ---
    function initGLightbox() { if (window.GLightbox) safe(function () { GLightbox({ selector: '.glightbox' }); }); }

    // --- Particles ---
    function initParticles() { if (window.particlesJS) safe(function () { particlesJS('particles-js', { particles: { number: { value: 40, density: { enable: true, value_area: 800 } }, color: { value: ['#ff6b6b', '#ffd47a', '#667eea'] }, shape: { type: 'circle' }, opacity: { value: 0.6 }, size: { value: 3 }, move: { enable: true, speed: 1.5 } }, interactivity: { detect_on: 'canvas', events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } } }, retina_detect: true }); }); }

    // --- Flatpickr ---
    function initFlatpickr() { if (window.flatpickr) safe(function () { flatpickr('.fp-date', { minDate: 'today', dateFormat: 'Y-m-d' }); flatpickr('.fp-time', { enableTime: true, noCalendar: true, dateFormat: 'H:i', time_24hr: true }); }); }

    // --- Theme Toggle ---
    var themeToggle = document.getElementById('themeToggle');
    function applyTheme(t) {
        if (t === 'dark') { document.body.classList.add('dark'); document.body.classList.remove('light'); } else { document.body.classList.remove('dark'); document.body.classList.add('light'); }
        localStorage.setItem('sp_theme', t); if (themeToggle) themeToggle.innerHTML = t === 'dark' ? '<i class="fa fa-sun"></i>' : '<i class="fa fa-moon"></i>';
        safe(function () { var meta = document.querySelector('meta[name="theme-color"]'); if (meta) meta.setAttribute('content', t === 'dark' ? '#0f0f0f' : '#ffffff'); });
    }
    var savedTheme = localStorage.getItem('sp_theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'dark');
    applyTheme(savedTheme);
    if (themeToggle) themeToggle.addEventListener('click', function () { applyTheme(document.body.classList.contains('dark') ? 'light' : 'dark'); });

    // --- Back to top + progress ring ---
    var back = document.getElementById('backTop');
    if (back) { back.style.display = 'none'; back.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); }); window.addEventListener('scroll', updateBack); }
    function updateBack() { var pct = Math.min(100, Math.round(window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100)); var path = back.querySelector('.progress-ring'); if (path) path.setAttribute('d', 'M18 2 A 16 16 0 1 1 17.999 2'); back.style.display = (window.scrollY > 200) ? 'flex' : 'none'; }

    // --- Menu render from #menu-data ---
    function ensureAddButtons() { try { document.querySelectorAll('.add-to-cart').forEach(function (btn) { if (!btn.classList.contains('btn')) btn.classList.add('btn'); if (!btn.classList.contains('btn-sm')) btn.classList.add('btn-sm'); if (!btn.querySelector('i')) { var ic = document.createElement('i'); ic.className = 'fa fa-cart-plus me-2'; btn.insertBefore(ic, btn.firstChild); } if (!btn.getAttribute('aria-label')) btn.setAttribute('aria-label', (btn.textContent || 'Add to cart').trim()); }); } catch (e) { } }

    function renderMenu() {
        try {
            var menuScript = document.getElementById('menu-data'); if (!menuScript) return; var data = JSON.parse(menuScript.textContent || menuScript.innerText || '[]'); var grid = document.querySelector('.menu-grid'); if (!grid) return; grid.innerHTML = '';
            data.forEach(function (it) {
                var col = document.createElement('div'); col.className = 'col-md-4'; var card = document.createElement('div'); card.className = 'menu-card card p-0'; card.setAttribute('data-cat', it.cat || ''); card.innerHTML = '\n  <div class="position-relative">\n    <img src="' + it.img + '" alt="' + (it.name || 'Dish') + '" class="img-fluid">\n    <div class="price-badge">$' + it.price + '</div>\n  </div>\n  <div class="p-3 d-flex justify-content-between align-items-center">\n    <div class="menu-info">\n      <strong>' + it.name + '</strong>\n      <div class="desc">' + (it.desc || '') + '</div>\n    </div>\n    <div class="actions">\n      <button class="add-to-cart" data-id="' + it.id + '" data-name="' + it.name.replace(/"/g, '&quot;') + '" data-price="' + it.price + '" data-image="' + it.img + '">Add to Cart</button>\n      <button class="btn btn-link quick-view" data-id="' + it.id + '">View</button>\n    </div>\n  </div>';
                col.appendChild(card); grid.appendChild(col);
                // image fallback & lazy
                var mImg = card.querySelector('img'); if (mImg) { mImg.loading = 'lazy'; mImg.onerror = function () { this.onerror = null; this.src = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop&s=1'; }; }
            });
            ensureAddButtons(); setupCategoryFilters();
        } catch (e) { console.warn('menu render', e); }
    }

    function setupCategoryFilters() {
        try {
            var pills = document.querySelectorAll('.cat-pill'); var grid = document.querySelector('.menu-grid'); if (!pills || !grid) return; function apply(filter) { var cards = grid.querySelectorAll('.menu-card'); cards.forEach(function (c) { var cat = c.getAttribute('data-cat') || ''; var col = c.closest('.col-md-4'); if (!col) return; if (filter === 'all' || filter === cat) col.style.display = ''; else col.style.display = 'none'; }); }
            pills.forEach(function (p) { p.addEventListener('click', function () { pills.forEach(function (x) { x.classList.remove('active'); }); p.classList.add('active'); apply(p.getAttribute('data-filter') || 'all'); }); }); var active = document.querySelector('.cat-pill.active'); apply(active ? active.getAttribute('data-filter') : 'all');
        } catch (e) { }
    }

    // --- Cart ---
    var cart = { items: JSON.parse(localStorage.getItem('sp_cart') || '[]') };
    var cartCountEls = function () { var els = document.querySelectorAll('.cart-fab .count, .cart-fab-inline .count'); return els; };
    function saveCart() { localStorage.setItem('sp_cart', JSON.stringify(cart.items)); updateCartUI(); }
    function updateCartUI() {
        var count = cart.items.reduce(function (s, i) { return s + i.qty; }, 0); cartCountEls().forEach(function (el) { el.textContent = count; }); var list = document.getElementById('cartList'); if (list) { list.innerHTML = ''; cart.items.forEach(function (it) { var row = document.createElement('div'); row.className = 'd-flex align-items-center mb-2'; row.innerHTML = '<img src="' + it.image + '" width="56" class="rounded me-2"><div class="flex-grow-1 small"><strong>' + it.name + '</strong><div class="text-muted">' + it.qty + ' x $' + it.price + '</div></div><div><button class="btn btn-sm btn-outline-danger remove-item" data-id="' + it.id + '"><i class="fa fa-trash"></i></button></div>'; list.appendChild(row); }); }
        var sum = document.getElementById('cartSum'); if (sum) sum.textContent = '$' + cart.items.reduce(function (s, i) { return s + (i.price * i.qty); }, 0).toFixed(2);
    }

    function flyToCart(img, callback) { if (!img) { if (callback) callback(); return; } var target = document.querySelector('.cart-fab') || document.querySelector('.cart-fab-inline'); var f = img.cloneNode(true); var rect = img.getBoundingClientRect(); f.style.position = 'fixed'; f.style.left = rect.left + 'px'; f.style.top = rect.top + 'px'; f.style.width = rect.width + 'px'; f.style.zIndex = 99999; f.style.transition = 'all 700ms cubic-bezier(.2,.8,.2,1)'; document.body.appendChild(f); requestAnimationFrame(function () { var t = target.getBoundingClientRect(); f.style.left = (t.left + t.width / 2 - rect.width / 2) + 'px'; f.style.top = (t.top + t.height / 2 - rect.height / 2) + 'px'; f.style.transform = 'scale(.2) rotate(10deg)'; f.style.opacity = '0.8'; }); setTimeout(function () { f.remove(); if (callback) callback(); }, 750); }

    // Delegated add-to-cart
    document.addEventListener('click', function (e) { var t = e.target.closest('.add-to-cart'); if (t) { e.preventDefault(); var id = t.getAttribute('data-id'); var name = t.getAttribute('data-name'); var price = Number(t.getAttribute('data-price')) || 0; var image = t.getAttribute('data-image') || ''; var parent = t.closest('.menu-card, .special-card'); var imgEl = parent ? parent.querySelector('img') : null; flyToCart(imgEl, function () { var found = cart.items.find(function (x) { return x.id == id; }); if (found) found.qty += 1; else cart.items.push({ id: id, name: name, price: price, qty: 1, image: image }); saveCart(); Toastify({ text: 'Added ' + name + ' to cart', duration: 2200, gravity: 'bottom', position: 'left', backgroundColor: 'linear-gradient(90deg,#ff6b6b,#ffa047)' }).showToast(); }); } });

    // Remove item
    document.addEventListener('click', function (e) { if (e.target.closest('.remove-item')) { var id = e.target.closest('.remove-item').getAttribute('data-id'); cart.items = cart.items.filter(function (i) { return i.id != id; }); saveCart(); } });

    // Clear cart button support (if present)
    document.addEventListener('click', function (e) { if (e.target.id === 'clearCart') { cart.items = []; saveCart(); } });

    // Initialize cart UI from storage
    updateCartUI();

    // --- Reservation form submit ---
    var resForm = document.getElementById('resForm'); if (resForm) { resForm.addEventListener('submit', function (e) { e.preventDefault(); var btn = document.getElementById('resSubmit'); var spinner = btn.querySelector('.spinner-border'); btn.querySelector('.btn-text').textContent = 'Submitting'; spinner.classList.remove('d-none'); setTimeout(function () { spinner.classList.add('d-none'); btn.querySelector('.btn-text').textContent = 'Confirmed'; Toastify({ text: 'Reservation received — we will contact you shortly', duration: 3000, gravity: 'bottom', position: 'right', backgroundColor: '#28a745' }).showToast(); resForm.reset(); }, 1500); }); }

    // --- Counters ---
    function initCounters() { var els = document.querySelectorAll('.counter'); els.forEach(function (el) { var target = +el.getAttribute('data-target') || 0; el.textContent = '0'; var io = new IntersectionObserver(function (entries, obs) { entries.forEach(function (entry) { if (entry.isIntersecting) { var start = 0; var dur = 1200; var startTime = null; function step(ts) { if (!startTime) startTime = ts; var progress = Math.min(1, (ts - startTime) / dur); el.textContent = Math.floor(progress * target); if (progress < 1) requestAnimationFrame(step); else el.textContent = target + (target >= 1000 ? '+' : ''); } requestAnimationFrame(step); obs.disconnect(); } }); }, { threshold: 0.2 }); io.observe(el); }); }
    initCounters();

    // --- Render menu after DOM ready ---
    document.addEventListener('DOMContentLoaded', function () { try { renderMenu(); ensureAddButtons(); } catch (e) { } });

    // --- Newsletter subscribe ---
    var newsBtn = document.getElementById('newsBtn'); if (newsBtn) { newsBtn.addEventListener('click', function () { var e = document.getElementById('newsEmail'); Toastify({ text: 'Thanks for subscribing!', duration: 2000, gravity: 'bottom', position: 'right', backgroundColor: '#28a745' }).showToast(); if (e) e.value = ''; }); }

    // --- Simple quick view (lightbox) support: open image in GLightbox if available ---
    document.addEventListener('click', function (e) { var q = e.target.closest('.quick-view'); if (q) { var id = q.getAttribute('data-id'); var el = document.querySelector('.menu-card[data-cat]'); var img = q.closest('.menu-card') ? q.closest('.menu-card').querySelector('img') : null; if (img && window.GLightbox) { GLightbox({ elements: [{ href: img.src, type: 'image' }] }).open(); } } });

    // Ensure safety for libs that might not load
    // Re-initialize AOS on demand
    window.reinitAOS = initAOS;

})();
// Main JS for Spice Palace (refactored selectors & safety checks)
(function () {

    // Ensure add-to-cart buttons use a consistent design and include an icon + ARIA label
    function ensureAddButtons() {
        try {
            document.querySelectorAll('.add-to-cart').forEach(function (btn) {
                // Ensure baseline button classes for consistent sizing
                if (!btn.classList.contains('btn')) btn.classList.add('btn');
                if (!btn.classList.contains('btn-sm')) btn.classList.add('btn-sm');

                // Prefer the glow style if neither variant present
                if (!btn.classList.contains('btn-glow') && !btn.classList.contains('btn-outline-primary')) {
                    btn.classList.add('btn-glow');
                }

                // Prepend a cart icon if none exists
                if (!btn.querySelector('i')) {
                    var ic = document.createElement('i');
                    ic.className = 'fa fa-cart-plus me-2';
                    btn.insertBefore(ic, btn.firstChild);
                }

                // Ensure accessible name
                if (!btn.getAttribute('aria-label')) {
                    var txt = (btn.textContent || '').trim() || 'Add to cart';
                    btn.setAttribute('aria-label', txt);
                }
            });
        } catch (e) { /* ignore */ }
    }
    window.addEventListener('load', function () {
        setTimeout(function () {
            hidePreloader();
            // Initialize AOS after preloader
            if (window.AOS) {
                AOS.init({ duration: 800, once: true, offset: 80 });
            }
            // Initialize Swiper sliders (if available)
            if (window.Swiper) {
                try {
                    if (document.querySelector('.mySwiper')) {
                        new Swiper('.mySwiper', { slidesPerView: 1.2, spaceBetween: 18, centeredSlides: true, pagination: { el: '.swiper-pagination', clickable: true }, breakpoints: { 768: { slidesPerView: 2.2 }, 992: { slidesPerView: 3 } } });
                    }
                    if (document.querySelector('.testiSwiper')) {
                        new Swiper('.testiSwiper', { slidesPerView: 1, spaceBetween: 18, loop: true, autoplay: { delay: 4000 }, breakpoints: { 768: { slidesPerView: 2 } } });
                    }
                    // Ensure special-card images lazy-load and have a fallback to avoid broken images
                    try {
                        document.querySelectorAll('.special-card img').forEach(function (simg) {
                            if (!simg.getAttribute('loading')) simg.setAttribute('loading', 'lazy');
                            simg.onerror = function () { try { this.onerror = null; this.src = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop&s=1'; } catch (e) { /* ignore */ } };
                        });
                    } catch (e) { /* ignore */ }
                } catch (e) { console.warn('Swiper init failed', e); }
            }
            // Init GLightbox
            if (window.GLightbox) {
                try { GLightbox({ selector: '.glightbox' }); } catch (e) { console.warn('GLightbox init failed', e); }
            }
            // Init Particles (light config)
            if (window.particlesJS) {
                try {
                    particlesJS('particles-js', {
                        particles: { number: { value: 40, density: { enable: true, value_area: 800 } }, color: { value: ['#ff6b6b', '#ffd47a', '#667eea'] }, shape: { type: 'circle' }, opacity: { value: 0.6 }, size: { value: 3 }, move: { enable: true, speed: 1.5 } },
                        interactivity: { detect_on: 'canvas', events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } } }, retina_detect: true
                    });
                } catch (e) { console.warn('Particles init failed', e); }
            }
            // Render interactive menu from #menu-data
            try {
                var menuScript = document.getElementById('menu-data');
                if (menuScript) {
                    var data = JSON.parse(menuScript.textContent || menuScript.innerText || '[]');
                    var grid = document.querySelector('.menu-grid');
                    if (grid && data && data.length) {
                        grid.innerHTML = '';
                        data.forEach(function (item) {
                            var col = document.createElement('div'); col.className = 'col-md-4';
                            col.innerHTML = '\n<div class="menu-card card glass p-2 h-100" data-cat="' + (item.cat || '') + '">\n  <img src="' + item.img + '" alt="' + (item.name || 'Dish') + '" class="img-fluid rounded">\n  <div class="p-3 d-flex justify-content-between align-items-center">\n    <div>\n      <strong>' + item.name + '</strong>\n      <div class="small text-muted">$' + item.price + '</div>\n    </div>\n    <div>\n      <button class="btn btn-sm btn-outline-primary add-to-cart" data-id="' + item.id + '" data-name="' + item.name.replace(/"/g, '&quot;') + '" data-price="' + item.price + '" data-image="' + item.img + '">Add</button>\n      <button class="btn btn-sm btn-link quick-view" data-id="' + item.id + '">View</button>\n    </div>\n  </div>\n</div>\n';
                            grid.appendChild(col);
                            // Add lazy loading and a fallback image for broken external URLs
                            try {
                                var mImg = col.querySelector('img');
                                if (mImg) {
                                    mImg.loading = 'lazy';
                                    mImg.onerror = function () {
                                        this.onerror = null;
                                        this.src = 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop&s=1';
                                    };
                                }
                                // If data-image points to a broken URL, ensure add-to-cart has a fallback too
                                var addBtn = col.querySelector('.add-to-cart');
                                if (addBtn && (!addBtn.getAttribute('data-image') || addBtn.getAttribute('data-image') === '')) {
                                    addBtn.setAttribute('data-image', mImg ? mImg.src : '');
                                }
                            } catch (e) { /* ignore image fallback errors */ }
                        });

                        // Normalize any add-to-cart buttons that were just injected
                        ensureAddButtons();

                        // Setup category filter pills (makes the tabs filter rendered items)
                        try {
                            var pills = document.querySelectorAll('.cat-pill');
                            function applyFilter(filter) {
                                var cards = grid.querySelectorAll('.menu-card');
                                cards.forEach(function (card) {
                                    var cat = card.getAttribute('data-cat') || '';
                                    var colEl = card.closest('.col-md-4') || card.parentElement;
                                    if (!colEl) return;
                                    if (filter === 'all' || filter === cat) colEl.style.display = '';
                                    else colEl.style.display = 'none';
                                });
                            }
                            pills.forEach(function (p) {
                                p.addEventListener('click', function () {
                                    pills.forEach(function (x) { x.classList.remove('active'); });
                                    p.classList.add('active');
                                    applyFilter(p.getAttribute('data-filter') || 'all');
                                });
                            });
                            // ensure initial filter state
                            var active = document.querySelector('.cat-pill.active');
                            applyFilter(active ? (active.getAttribute('data-filter') || 'all') : 'all');
                        } catch (e) { /* ignore filter setup errors */ }
                    }
                }
            } catch (e) { console.warn('Menu render failed', e); }
        }, 400);
    });

    var themeToggle = document.getElementById('themeToggle');
    function applyTheme(t) {
        // Ensure body has either 'dark' or 'light' for predictable CSS targeting
        if (t === 'dark') {
            document.body.classList.add('dark');
            document.body.classList.remove('light');
        } else {
            document.body.classList.remove('dark');
            document.body.classList.add('light');
        }
        localStorage.setItem('sp_theme', t);
        if (themeToggle) themeToggle.innerHTML = t === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
        // Update meta theme-color for browser UI (mobile address bar color)
        try {
            var meta = document.querySelector('meta[name="theme-color"]');
            if (meta) {
                meta.setAttribute('content', t === 'dark' ? '#0f0f0f' : '#ffffff');
            }
        } catch (e) { /* ignore */ }
    }
    var saved = localStorage.getItem('sp_theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(saved);
    if (themeToggle) themeToggle.addEventListener('click', function () { applyTheme(document.body.classList.contains('dark') ? 'light' : 'dark'); });

    var back = document.getElementById('backTop');
    if (back) {
        back.style.display = 'none';
        back.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
        window.addEventListener('scroll', function () { back.style.display = (window.scrollY > 200) ? 'flex' : 'none'; });
    }

    var navLinks = document.querySelectorAll('.navbar .nav-link');
    function setActive() {
        var fromTop = window.scrollY + 120;
        navLinks.forEach(function (link) {
            if (!link.hash) return;
            var section = document.querySelector(link.hash);
            if (!section) return;
            if (section.offsetTop <= fromTop && section.offsetTop + section.offsetHeight > fromTop) link.classList.add('active'); else link.classList.remove('active');
        });
    }
    window.addEventListener('scroll', setActive); setActive();

    if (window.flatpickr) {
        flatpickr('.fp-date', { minDate: 'today', dateFormat: 'Y-m-d' });
        flatpickr('.fp-time', { enableTime: true, noCalendar: true, dateFormat: 'H:i', time_24hr: true });
    }

    var cart = { items: JSON.parse(localStorage.getItem('sp_cart') || '[]') };
    var cartCountEl = document.querySelector('.cart-fab .count');
    var cartItemsEl = document.getElementById('cartList');
    var cartTotalEl = document.getElementById('cartSum');
    var cartFab = document.querySelector('.cart-fab');

    function saveCart() { localStorage.setItem('sp_cart', JSON.stringify(cart.items)); updateCartUI(); }

    function updateCartUI() {
        var count = cart.items.reduce(function (s, i) { return s + i.qty; }, 0);
        if (cartCountEl) cartCountEl.textContent = count;
        if (cartItemsEl) {
            cartItemsEl.innerHTML = '';
            cart.items.forEach(function (it) {
                var row = document.createElement('div'); row.className = 'd-flex align-items-center mb-2';
                row.innerHTML = '<img src="' + it.image + '" width="56" class="rounded me-2"><div class="flex-grow-1 small"><strong>' + it.name + '</strong><div class="text-muted">' + it.qty + ' x $' + it.price + '</div></div><div><button class="btn btn-sm btn-outline-danger remove-item" data-id="' + it.id + '"><i class="fa fa-trash"></i></button></div>';
                cartItemsEl.appendChild(row);
            });
        }
        if (cartTotalEl) cartTotalEl.textContent = '$' + cart.items.reduce(function (s, i) { return s + (i.price * i.qty); }, 0).toFixed(2);
    }

    function flyToCart(img, callback) {
        if (!img) { if (callback) callback(); return; }
        var targetEl = cartFab || document.querySelector('.cart-fab');
        var f = img.cloneNode(true);
        f.style.position = 'fixed'; f.style.width = img.width + 'px'; f.style.zIndex = 9999; f.style.pointerEvents = 'none';
        document.body.appendChild(f);
        var rect = img.getBoundingClientRect();
        var target = targetEl ? targetEl.getBoundingClientRect() : { left: window.innerWidth - 80, top: 20, width: 40, height: 40 };
        f.style.left = rect.left + 'px'; f.style.top = rect.top + 'px'; f.style.transition = 'all 700ms cubic-bezier(.2,.8,.2,1)';
        requestAnimationFrame(function () {
            f.style.left = (target.left + target.width / 2 - rect.width / 2) + 'px';
            f.style.top = (target.top + target.height / 2 - rect.height / 2) + 'px';
            f.style.transform = 'scale(.2) rotate(10deg)';
            f.style.opacity = '0.8';
        });
        setTimeout(function () { f.remove(); if (callback) callback(); }, 750);
    }

    $(document).on('click', '.add-to-cart', function () {
        var btn = this;
        var id = $(btn).data('id');
        var name = $(btn).data('name');
        var price = Number($(btn).data('price')) || 0;
        var image = $(btn).data('image') || '';
        var $card = $(btn).closest('.special-card, .menu-card, .card');
        var imgEl = $card.find('img')[0] || null;
        flyToCart(imgEl, function () {
            var found = cart.items.find(function (x) { return x.id == id; });
            if (found) found.qty += 1; else cart.items.push({ id: id, name: name, price: price, qty: 1, image: image });
            saveCart();
            Toastify({ text: 'Added ' + name + ' to cart', duration: 2200, gravity: 'bottom', position: 'left', backgroundColor: 'linear-gradient(90deg,var(--primary),#ffa047)' }).showToast();
        });
    });

    $(document).on('click', '.remove-item', function () { var id = $(this).data('id'); cart.items = cart.items.filter(function (i) { return i.id != id; }); saveCart(); });
    document.getElementById('clearCart') && document.getElementById('clearCart').addEventListener('click', function () { cart.items = []; saveCart(); });
    updateCartUI();

    // Normalize any existing static add-to-cart buttons on load
    try { ensureAddButtons(); } catch (e) { }
    document.addEventListener('DOMContentLoaded', function () { try { ensureAddButtons(); } catch (e) { } });

    $('#newsForm').on('submit', function (e) { e.preventDefault(); Toastify({ text: 'Thanks for subscribing!', duration: 2000, gravity: 'bottom', position: 'right', backgroundColor: '#28a745' }).showToast(); $(this).find('input').val(''); });

    /* Mobile app-style menu bindings */
    function initMobileMenu() {
        try {
            var toggle = document.getElementById('mobileToggle');
            var closeBtn = document.getElementById('mobileClose');
            var menu = document.getElementById('mobileMenu');
            var overlay = document.getElementById('mobileOverlay');
            if (!menu || !overlay || !toggle) return;

            var focusableSelectors = 'a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])';
            var lastFocused = null;

            function openMenu() {
                lastFocused = document.activeElement;
                menu.classList.add('open');
                overlay.classList.add('open');
                try { menu.setAttribute('aria-hidden', 'false'); } catch (e) { }
                document.body.style.overflow = 'hidden';
                var f = menu.querySelector(focusableSelectors);
                if (f) try { f.focus(); } catch (e) { }
            }

            function closeMenu() {
                menu.classList.remove('open');
                overlay.classList.remove('open');
                try { menu.setAttribute('aria-hidden', 'true'); } catch (e) { }
                document.body.style.overflow = '';
                if (lastFocused && typeof lastFocused.focus === 'function') try { lastFocused.focus(); } catch (e) { }
            }

            toggle.addEventListener('click', function (e) { e.preventDefault(); openMenu(); });
            if (closeBtn) closeBtn.addEventListener('click', function (e) { e.preventDefault(); closeMenu(); });
            overlay.addEventListener('click', function (e) { if (e.target === overlay) closeMenu(); });

            // Close on Escape
            document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && menu.classList.contains('open')) closeMenu(); });

            // Simple focus trap inside the menu
            menu.addEventListener('keydown', function (ev) {
                if (ev.key !== 'Tab') return;
                var focusables = Array.prototype.slice.call(menu.querySelectorAll(focusableSelectors)).filter(function (n) { return n.offsetParent !== null; });
                if (!focusables.length) return;
                var first = focusables[0];
                var last = focusables[focusables.length - 1];
                if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
                else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
            });

            // Micro-interactions: touch/mouse feedback for items
            menu.querySelectorAll('.mobile-menu-item').forEach(function (it) {
                it.addEventListener('touchstart', function () { it.classList.add('active'); });
                it.addEventListener('touchend', function () { it.classList.remove('active'); });
                it.addEventListener('mousedown', function () { it.classList.add('active'); });
                it.addEventListener('mouseup', function () { it.classList.remove('active'); });
                it.addEventListener('mouseleave', function () { it.classList.remove('active'); });
            });
        } catch (e) { console.warn('initMobileMenu', e); }
    }

    // Wire it up once DOM ready
    document.addEventListener('DOMContentLoaded', function () { try { initMobileMenu(); } catch (e) { } });

    window.addEventListener('scroll', function () {
        var hb = document.querySelector('.hero .bg'); if (!hb) return; var y = window.scrollY; hb.style.transform = 'translateY(' + (y * 0.2) + 'px) scale(' + (1 + Math.min(y / 450, 0.06)) + ')';
    });

    // Safety fallback: if for some reason load doesn't fire or script errors occur,
    // remove any lingering preloader after 8 seconds to avoid blocking UX.
    try { document.addEventListener('DOMContentLoaded', function () { setTimeout(hidePreloader, 6000); }); } catch (e) { }
    setTimeout(function () { try { hidePreloader(); } catch (e) { } }, 8000);

})();
