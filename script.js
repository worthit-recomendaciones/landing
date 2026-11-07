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
    
    if (typeof showToast === 'function') {
      showToast('&iexcl;T&eacute;rminos y condiciones aceptados! Disfrut&aacute; de WorthIT.');
    }
  }

  function triggerBannerShake() {
    if (consentBanner) {
      consentBanner.classList.remove('shake');
      void consentBanner.offsetWidth;
      consentBanner.classList.add('shake');
    }
  }

  if (btnAcceptConsent) {
    btnAcceptConsent.onclick = function(e) { e.preventDefault(); acceptLegalConsent(); };
  }
  if (btnAcceptFromModal) {
    btnAcceptFromModal.onclick = function(e) { e.preventDefault(); acceptLegalConsent(); };
  }
  if (consentCloseAttemptBtn) {
    consentCloseAttemptBtn.onclick = function(e) { e.preventDefault(); e.stopPropagation(); triggerBannerShake(); };
  }
  if (consentOverlay) {
    consentOverlay.onclick = function() { triggerBannerShake(); };
  }

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
    btn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.openLegalModal(btn.getAttribute('data-open-legal'));
    };
  });

  if (legalTabsBar) {
    legalTabsBar.querySelectorAll('.legal-tab-btn').forEach(btn => {
      btn.onclick = function(e) {
        e.preventDefault();
        switchLegalTab(btn.getAttribute('data-legal-tab'));
      };
    });
  }

  if (legalModalCloseBtn) {
    legalModalCloseBtn.onclick = function(e) { e.preventDefault(); e.stopPropagation(); window.closeLegalModal(); };
  }

  if (legalModalOverlay) {
    legalModalOverlay.onclick = function(e) { if (e.target === legalModalOverlay) window.closeLegalModal(); };
  }

  checkLegalConsent();
	
  /* ==========================================================================
     CATÁLOGO DE PRODUCTOS (Respaldo robusto + Sincronización CMS)
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
      shortDesc: 'Pantalla Retina OLED curva de alto brillo, GPS dual de precisión quirúrgica, sensor ECG y 5 días de batería real.',
      fullDesc: 'Chasis de titanio de grado aeroespacial resistente a golpes y rayones.',
      specs: ['Pantalla Retina OLED de 1.92" curva', 'Caja forjada en aleación de titanio'],
      originalPrice: 229000,
      salePrice: 189000,
      discount: 17,
      installments: '6 cuotas sin interés de $31.500',
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

  const cartTrigger = document.getElementById('cartTrigger');
  const cartDrawer = document.getElementById('cartDrawer');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartCloseBtn = document.getElementById('cartCloseBtn');
  const cartCountBadge = document.getElementById('cartCountBadge');
  const cartItemsCountLabel = document.getElementById('cartItemsCountLabel');
  const cartDrawerBody = document.getElementById('cartDrawerBody');
  const cartDrawerFooter = document.getElementById('cartDrawerFooter');
  const cartOriginalTotal = document.getElementById('cartOriginalTotal');
  const cartSavingsTotal = document.getElementById('cartSavingsTotal');
  const cartFinalTotal = document.getElementById('cartFinalTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  const quickViewModal = document.getElementById('quickViewModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBody');

  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');
  const toastContainer = document.getElementById('toastContainer');

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
        (product.shortDesc && product.shortDesc.toLowerCase().includes(query)) ||
        (product.categoryName && product.categoryName.toLowerCase().includes(query));
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

    productsGrid.innerHTML = filtered.map((product, index) => {
      const isCardFeatured = product.featured ? 'featured-card' : '';
      const cardDelay = (index * 0.04).toFixed(2);
      return `
        <article class="product-card ${isCardFeatured}" data-product-id="${product.id}" style="--card-delay: ${cardDelay}s" tabindex="0">
          <div class="card-top-badges">
            <span class="badge-discount">-${product.discount || 0}%</span>
            <span class="badge-tag">${product.categoryName || ''}</span>
          </div>

          <div class="product-image-box" onclick="window.openQuickView('${product.id}')">
            <img src="${product.image}" alt="${product.title}" class="product-img" loading="lazy">
            <button class="quick-view-overlay-btn" type="button">Vista Rápida</button>
          </div>

          <div class="product-info">
            <div class="badge-free-shipping">🚚 Envío Gratis</div>
            <span class="product-category-label">${product.categoryName || ''}</span>
            <h3 class="product-title" onclick="window.openQuickView('${product.id}')">${product.title}</h3>
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

  async function syncCMSProducts() {
    try {
      const response = await fetch('content/products.json?v=' + new Date().getTime());
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          products = data.items;
          renderProducts();
        }
      }
    } catch (e) {
      console.log('Usando catálogo base');
    }
  }

  const categoryMeta = {
    all: { title: 'Todas las Ofertas Hot Sale', desc: 'Catálogo completo con cuotas sin interés y envío gratis.' },
    technology: { title: 'Tecnología Hot Sale', desc: 'Auriculares, smartwatches y dispositivos.' },
    'home-office': { title: 'Home Office', desc: 'Sillas ergonómicas y escritorios.' },
    coffee: { title: 'Café de Especialidad', desc: 'Cafeteras y molinillos.' }
  };

  function setCategory(category) {
    currentCategory = category;
    if (categoryTabs) {
      categoryTabs.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-category') === category);
      });
    }
    const meta = categoryMeta[category] || categoryMeta.all;
    if (currentCategoryTitle) currentCategoryTitle.textContent = meta.title;
    if (currentCategoryDesc) currentCategoryDesc.textContent = meta.desc;
    renderProducts();
  }

  if (categoryTabs) {
    categoryTabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => setCategory(btn.getAttribute('data-category')));
    });
  }

  if (showAllBtn) {
    showAllBtn.addEventListener('click', () => { setCategory('all'); });
  }

  // Inicializar render de inmediato con los productos base y luego buscar actualización del CMS
  renderProducts();
  syncCMSProducts();
});
