document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     SISTEMA DE CONSENTIMIENTO Y MODAL LEGAL
     ========================================================================== */
  const consentBanner = document.getElementById('consentBanner');
  const consentOverlay = document.getElementById('consentOverlay');
  const btnAcceptConsent = document.getElementById('btnAcceptConsent');
  const consentCloseAttemptBtn = document.getElementById('consentCloseAttemptBtn');
  
  const legalModalOverlay = document.getElementById('legalModalOverlay');
  const legalModalCloseBtn = document.getElementById('legalModalCloseBtn');
  const btnAcceptFromModal = document.getElementById('btnAcceptFromModal');
  const legalTabsBar = document.getElementById('legalTabsBar');

  const CONSENT_KEY = 'worthit_legal_consent_v3';

  function checkLegalConsent() {
    const accepted = localStorage.getItem(CONSENT_KEY);
    if (!accepted) {
      document.body.classList.add('consent-locked');
      if (consentBanner) consentBanner.classList.add('visible');
      if (consentOverlay) consentOverlay.classList.add('visible');
    }
  }

  function acceptLegalConsent() {
    localStorage.setItem(CONSENT_KEY, 'true');
    document.body.classList.remove('consent-locked');
    if (consentBanner) consentBanner.classList.remove('visible');
    if (consentOverlay) consentOverlay.classList.remove('visible');
    closeLegalModal();
  }

  function triggerBannerShake() {
    if (consentBanner) {
      consentBanner.classList.remove('shake');
      void consentBanner.offsetWidth;
      consentBanner.classList.add('shake');
    }
  }

  if (btnAcceptConsent) btnAcceptConsent.onclick = (e) => { e.preventDefault(); acceptLegalConsent(); };
  if (btnAcceptFromModal) btnAcceptFromModal.onclick = (e) => { e.preventDefault(); acceptLegalConsent(); };
  if (consentCloseAttemptBtn) consentCloseAttemptBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); triggerBannerShake(); };
  if (consentOverlay) consentOverlay.onclick = () => { triggerBannerShake(); };

  window.openLegalModal = function(tabName = 'terms') {
    if (legalModalOverlay) legalModalOverlay.classList.add('open');
  };
  window.closeLegalModal = function() {
    if (legalModalOverlay) legalModalOverlay.classList.remove('open');
  };

  document.querySelectorAll('[data-open-legal]').forEach(btn => {
    btn.onclick = (e) => { e.preventDefault(); window.openLegalModal(btn.getAttribute('data-open-legal')); };
  });

  if (legalModalCloseBtn) legalModalCloseBtn.onclick = (e) => { e.preventDefault(); window.closeLegalModal(); };
  if (legalModalOverlay) legalModalOverlay.onclick = (e) => { if (e.target === legalModalOverlay) window.closeLegalModal(); };

  checkLegalConsent();
	
  /* ==========================================================================
     CATÁLOGO DE PRODUCTOS (Lectura directa desde el CMS)
     ========================================================================== */
  let products = [];

  const productsGrid = document.getElementById('productsGrid');
  const categoryTabs = document.getElementById('categoryTabs');
  const productFilterInput = document.getElementById('productFilterInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const headerSearchInput = document.getElementById('headerSearchInput');
  const sortSelect = document.getElementById('sortSelect');
  const noResultsMsg = document.getElementById('noResultsMsg');
  const resetFiltersBtn = document.getElementById('resetFiltersBtn');
  const showAllBtn = document.getElementById('showAllBtn');
  const currentCategoryTitle = document.getElementById('currentCategoryTitle');
  const currentCategoryCount = document.getElementById('currentCategoryCount');
  const currentCategoryDesc = document.getElementById('currentCategoryDesc');

  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'featured';
  let cart = [];

  function formatARS(amount) {
    return '$' + Number(amount || 0).toLocaleString('es-AR');
  }

  function getFilteredProducts() {
    return products.filter(product => {
      const matchesCategory = (currentCategory === 'all') || (product.category === currentCategory);
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        (product.title && product.title.toLowerCase().includes(query)) ||
        (product.shortDesc && product.shortDesc.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }

  function renderProducts() {
    if (!productsGrid) return;
    const filtered = getFilteredProducts();

    if (filtered.length === 0) {
      productsGrid.innerHTML = '';
      if (noResultsMsg) noResultsMsg.style.display = 'flex';
      if (currentCategoryCount) currentCategoryCount.textContent = '0 Productos';
      return;
    }

    if (noResultsMsg) noResultsMsg.style.display = 'none';
    if (currentCategoryCount) currentCategoryCount.textContent = `Mostrando ${filtered.length} Producto${filtered.length === 1 ? '' : 's'}`;

    productsGrid.innerHTML = filtered.map((product) => {
      return `
        <article class="product-card" data-product-id="${product.id}" tabindex="0">
          <div class="card-top-badges">
            <span class="badge-discount">-${product.discount || 0}%</span>
            <span class="badge-tag">${product.categoryName || ''}</span>
          </div>

          <div class="product-image-box">
            <img src="${product.image}" alt="${product.title}" class="product-img" loading="lazy">
          </div>

          <div class="product-info">
            <div class="badge-free-shipping">🚚 Envío Gratis</div>
            <span class="product-category-label">${product.categoryName || ''}</span>
            <h3 class="product-title">${product.title}</h3>
            <p class="product-description">${product.shortDesc || ''}</p>

            <div class="product-rating">
              <span class="stars">★★★★★</span>
              <span class="rating-num">${product.rating || 4.9}</span>
              <span class="rating-count">(${product.reviews || 150})</span>
            </div>

            <div class="product-price-box">
              <span class="product-price-old">${formatARS(product.originalPrice)}</span>
              <span class="product-price-current">${formatARS(product.salePrice)}</span>
            </div>

            <div class="product-installments">💳 <span>${product.installments || '6 cuotas sin interés'}</span></div>

            <button class="btn-buy-product" data-product-id="${product.id}" type="button">
              <span>COMPRAR AHORA</span>
            </button>
          </div>
        </article>
      `;
    }).join('');

    productsGrid.querySelectorAll('.btn-buy-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const product = products.find(p => p.id === btn.getAttribute('data-product-id'));
        if (product && product.affiliateUrl) {
          window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
        }
      });
    });
  }

  async function loadCMSProducts() {
    try {
      const response = await fetch('content/products.json?v=' + new Date().getTime());
      if (response.ok) {
        const data = await response.json();
        // Si el JSON viene estructurado por el widget de listas de Decap CMS
        if (data && Array.isArray(data.items)) {
          products = data.items;
        } else if (Array.isArray(data)) {
          products = data;
        }
        renderProducts();
      }
    } catch (e) {
      console.error('Error al cargar products.json desde el CMS', e);
    }
  }

  // Cargar productos del CMS al iniciar la página
  loadCMSProducts();
});
