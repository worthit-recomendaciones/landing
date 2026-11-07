document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. CONSENTIMIENTO Y MODAL LEGAL
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
  if (consentOverlay) consentOverlay.onclick = () => triggerBannerShake();

  window.openLegalModal = function(tabName = 'terms') {
    if (legalModalOverlay) {
      legalModalOverlay.classList.add('open');
      switchLegalTab(tabName);
    }
  };

  window.closeLegalModal = function() {
    if (legalModalOverlay) legalModalOverlay.classList.remove('open');
  };

  function switchLegalTab(tabName) {
    if (!legalTabsBar) return;
    legalTabsBar.querySelectorAll('.legal-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-legal-tab') === tabName);
    });
    document.querySelectorAll('.legal-tab-pane').forEach(pane => pane.classList.remove('active'));
    const activePane = document.getElementById(`pane-${tabName}`);
    if (activePane) activePane.classList.add('active');
  }

  document.querySelectorAll('[data-open-legal]').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      window.openLegalModal(btn.getAttribute('data-open-legal'));
    };
  });

  if (legalTabsBar) {
    legalTabsBar.querySelectorAll('.legal-tab-btn').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        switchLegalTab(btn.getAttribute('data-legal-tab'));
      };
    });
  }

  if (legalModalCloseBtn) legalModalCloseBtn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); window.closeLegalModal(); };
  if (legalModalOverlay) legalModalOverlay.onclick = (e) => { if (e.target === legalModalOverlay) window.closeLegalModal(); };

  checkLegalConsent();

  /* ==========================================================================
     2. CATÁLOGO BASE DE PRODUCTOS
     ========================================================================== */
  const defaultProducts = [
    {
      id: 'tech-1',
      category: 'technology',
      categoryName: 'Tecnología',
      title: 'Auriculares AeroSound Pro ANC',
      shortDesc: 'Cancelación activa de ruido híbrida, 40 horas de batería, audio espacial inmersivo y almohadillas viscoelásticas ultra suaves.',
      fullDesc: 'Diseñados para audiófilos exigentes y jornadas de trabajo prolongadas.',
      specs: ['Drivers acústicos de Berilio de 40mm', 'Cancelación Activa de Ruido Híbrida (-42dB)'],
      originalPrice: 249000,
      salePrice: 179000,
      discount: 28,
      installments: '6 cuotas sin interés de $29.833',
      image: 'images/products/smartwatch.png',
      rating: 4.9,
      reviews: 218,
      featured: false,
      affiliateUrl: 'https://meli.la/13CTiHx'
    },
    {
      id: 'tech-2',
      category: 'technology',
      categoryName: 'Tecnología',
      title: 'Smartwatch HUAWEI Watch Fit 4 Pro GPS',
      shortDesc: 'Pantalla zafiro, bisel titanio ECG y batería de diez días.',
      fullDesc: 'Chasis de titanio de grado aeroespacial resistente a golpes y rayones.',
      specs: ['Pantalla Retina OLED curva de 1.92"', 'Sensor óptico ECG + SpO2'],
      originalPrice: 443999,
      salePrice: 259999,
      discount: 41,
      installments: '6 cuotas sin interés de $43.333',
      image: 'images/products/smartwatch2.png',
      rating: 4.8,
      reviews: 342,
      featured: true,
      affiliateUrl: 'https://meli.la/13CTiHx'
    },
    {
      id: 'coffee-1',
      category: 'coffee',
      categoryName: 'Café',
      title: 'Cafetera Espresso BaristaCraft Touch',
      shortDesc: 'Bomba italiana de 15 bares, control térmico PID de alta precisión, pantalla táctil y lanceta de vapor profesional.',
      fullDesc: 'Llevá la experiencia de una cafetería de especialidad a tu casa.',
      specs: ['Portafiltro de 58mm', 'Bomba italiana de 15 bares'],
      originalPrice: 799000,
      salePrice: 549000,
      discount: 31,
      installments: '12 cuotas sin interés de $45.750',
      image: 'images/products/coffee-espresso.svg',
      rating: 5.0,
      reviews: 178,
      featured: false,
      affiliateUrl: 'https://meli.la/13CTiHx'
    }
  ];

  let products = [...defaultProducts];

  /* ==========================================================================
     3. RENDERIZADO Y BANNER DESTACADO (SPOTLIGHT)
     ========================================================================== */
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

  function formatARS(amount) {
    return '$' + Number(amount || 0).toLocaleString('es-AR');
  }

  function renderSpotlight() {
    const spotlightSection = document.getElementById('spotlight');
    if (!spotlightSection) return;

    const featuredProduct = products.find(p => p.featured) || products[0];
    if (!featuredProduct) return;

    const savings = (featuredProduct.originalPrice || 0) - (featuredProduct.salePrice || 0);

    spotlightSection.innerHTML = `
      <div class="container">
        <div class="spotlight-card fade-in-scroll">
          <div class="spotlight-content">
            <span class="spotlight-badge">DESTACADO DEL DÍA</span>
            <h2 class="spotlight-title">${featuredProduct.title}</h2>
            <p class="spotlight-desc">${featuredProduct.shortDesc}</p>
            
            <div class="spotlight-benefits">
              <span class="benefit-tag">💳 ${featuredProduct.installments}</span>
              <span class="benefit-tag">🚚 Envío Gratis a todo el país</span>
            </div>

            <div class="spotlight-price-row">
              <button class="btn btn-primary btn-lg btn-buy-spotlight" data-url="${featuredProduct.affiliateUrl}">
                <span>COMPRAR AHORA • ${formatARS(featuredProduct.salePrice)}</span>
              </button>
              ${savings > 0 ? `<span class="spotlight-savings">Ahorrás ${formatARS(savings)} hoy</span>` : ''}
            </div>
          </div>
          <div class="spotlight-image-wrap">
            <img src="${featuredProduct.image}" alt="${featuredProduct.title}" class="spotlight-img">
          </div>
        </div>
      </div>
    `;

    const buyBtn = spotlightSection.querySelector('.btn-buy-spotlight');
    if (buyBtn) {
      buyBtn.onclick = () => {
        const url = buyBtn.getAttribute('data-url');
        if (url && url !== '#') window.open(url, '_blank', 'noopener,noreferrer');
      };
    }
  }

  function getFilteredProducts() {
    return products.filter(product => {
      const matchesCategory = (currentCategory === 'all') || (product.category === currentCategory);
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        (product.title && product.title.toLowerCase().includes(query)) ||
        (product.shortDesc && product.shortDesc.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (currentSort === 'discount') return (b.discount || 0) - (a.discount || 0);
      if (currentSort === 'price-asc') return (a.salePrice || 0) - (b.salePrice || 0);
      if (currentSort === 'price-desc') return (b.salePrice || 0) - (a.salePrice || 0);
      if (currentSort === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
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

    productsGrid.innerHTML = filtered.map((product) => `
      <article class="product-card ${product.featured ? 'featured-card' : ''}" data-product-id="${product.id}" tabindex="0">
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

          <button class="btn-buy-product" data-affiliate-url="${product.affiliateUrl || '#'}" type="button">
            <span>COMPRAR AHORA</span>
          </button>
        </div>
      </article>
    `).join('');

    productsGrid.querySelectorAll('.btn-buy-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const url = btn.getAttribute('data-affiliate-url');
        if (url && url !== '#') {
          window.open(url, '_blank', 'noopener,noreferrer');
        }
      });
    });

    renderSpotlight();
  }

  /* ==========================================================================
     4. LECTURA DE ARCHIVOS CREADOS POR DECAP CMS
     ========================================================================== */
  async function syncCMSProducts() {
    try {
      // Intenta obtener el índice o el archivo compilado si existe
      const response = await fetch('content/products.json?v=' + Date.now());
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          products = data;
          renderProducts();
        }
      }
    } catch (e) {
      console.log('Manteniendo catálogo base activo');
    }
  }

  // Pestañas
  if (categoryTabs) {
    categoryTabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentCategory = btn.getAttribute('data-category');
        categoryTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
        renderProducts();
      });
    });
  }

  if (productFilterInput) {
    productFilterInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderProducts();
    });
  }

  renderProducts();
  syncCMSProducts();
});
