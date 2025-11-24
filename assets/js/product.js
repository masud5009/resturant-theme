/* Product Menu Renderer — Final Optimized */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        renderMenu();
        setupFilters();
    });

    function renderMenu() {
        var script = document.getElementById('menu-data');
        if (!script) return;

        var data = JSON.parse(script.textContent || '[]');
        var grid = document.querySelector('.menu-grid');
        if (!grid || !data.length) return;

        grid.innerHTML = '';

        data.forEach(function (item) {
            var col = document.createElement('div');
            col.className = 'col-md-4';

            col.innerHTML = `
                <div class="card special-card h-100">
                    <div class="card-img-top overflow-hidden rounded-3">
                        <img src="${item.img}" alt="${item.name}" loading="lazy" class="w-100">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title mb-0">${item.name}</h5>
                            <div class="price-badge">$${item.price}</div>
                        </div>
                        <p class="card-text text-muted small mb-3">${item.desc || 'Delicious dish'}</p>
                        <div class="mt-auto d-flex gap-2">
                            <button class="btn btn-glow w-100 add-to-cart"
                                data-id="${item.id}"
                                data-name="${item.name}"
                                data-price="${item.price}"
                                data-image="${item.img}">Add to Cart</button>
                            <button class="btn btn-outline-light w-100 view-detail">View Details</button>
                        </div>
                    </div>
                </div>`;

            grid.appendChild(col);
        });
    }

    function setupFilters() {
        var pills = document.querySelectorAll('.cat-pill');
        var grid = document.querySelector('.menu-grid');
        if (!grid || !pills.length) return;

        pills.forEach(function (pill) {
            pill.addEventListener('click', function () {
                pills.forEach(function (p) {
                    p.classList.remove('active');
                });
                pill.classList.add('active');

                var filter = pill.getAttribute('data-filter') || 'all';
                var cards = grid.querySelectorAll('.menu-card');

                cards.forEach(function (card) {
                    var col = card.closest('.col-md-4');
                    var cat = card.getAttribute('data-cat') || '';
                    col.style.display = (filter === 'all' || filter === cat) ? '' : 'none';
                });
            });
        });
    }

})();