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
    btnAcceptConsent.onclick = function(e) {
      e.preventDefault();
      acceptLegalConsent();
    };
  }

  if (btnAcceptFromModal) {
    btnAcceptFromModal.onclick = function(e) {
      e.preventDefault();
      acceptLegalConsent();
    };
  }

  if (consentCloseAttemptBtn) {
    consentCloseAttemptBtn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      triggerBannerShake();
    };
  }

  if (consentOverlay) {
    consentOverlay.onclick = function() {
      triggerBannerShake();
    };
  }

  window.openLegalModal = function(tabName = 'terms') {
    if (legalModalOverlay) {
      legalModalOverlay.classList.add('open');
      switchLegalTab(tabName);
    }
  };

  window.closeLegalModal = function() {
    if (legalModalOverlay) {
      legalModalOverlay.classList.remove('open');
    }
  };

  function switchLegalTab(tabName) {
    if (!legalTabsBar) return;

    legalTabsBar.querySelectorAll('.legal-tab-btn').forEach(btn => {
      const isTarget = btn.getAttribute('data-legal-tab') === tabName;
      btn.classList.toggle('active', isTarget);
    });

    document.querySelectorAll('.legal-tab-pane').forEach(pane => {
      pane.classList.remove('active');
    });

    const activePane = document.getElementById(`pane-${tabName}`);
    if (activePane) activePane.classList.add('active');
  }

  document.querySelectorAll('[data-open-legal]').forEach(btn => {
    btn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      const tabTarget = btn.getAttribute('data-open-legal');
      window.openLegalModal(tabTarget);
    };
  });

  if (legalTabsBar) {
    legalTabsBar.querySelectorAll('.legal-tab-btn').forEach(btn => {
      btn.onclick = function(e) {
        e.preventDefault();
        const target = btn.getAttribute('data-legal-tab');
        switchLegalTab(target);
      };
    });
  }

  if (legalModalCloseBtn) {
    legalModalCloseBtn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.closeLegalModal();
    };
  }

  if (legalModalOverlay) {
    legalModalOverlay.onclick = function(e) {
      if (e.target === legalModalOverlay) {
        window.closeLegalModal();
      }
    };
  }

  checkLegalConsent();
	
  /* ==========================================================================
     1. CATÁLOGO DINÁMICO DESDE DECAP CMS (content/products.json)
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

  // Elementos del Carrito
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

  // Elementos del Modal de Vista Rápida
  const quickViewModal = document.getElementById('quickViewModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBody');

  // Elementos Menú Móvil
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
            <button class="quick-view-overlay-btn" type="button" aria-label="Vista rápida de ${product.title}">
              Vista Rápida
            </button>
          </div>

          <div class="product-info">
            <div class="badge-free-shipping">
              🚚 Envío Gratis
            </div>

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

            <div class="product-installments">
              💳 <span>${product.installments || '6 cuotas sin interés'}</span>
            </div>

            <button class="btn-buy-product" data-product-id="${product.id}" type="button">
              <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>COMPRAR AHORA</span>
            </button>
          </div>
        </article>
      `;
    }).join('');

    productsGrid.querySelectorAll('.btn-buy-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-product-id');
        const product = products.find(p => p.id === id);
        
        if (product && product.affiliateUrl) {
          window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
        } else {
          alert('Pronto habilitaremos el enlace directo para este producto.');
        }
      });
    });
  }

async function loadProductsFromCMS() {
    // Productos de respaldo por si el archivo JSON aún no fue creado en GitHub
    const fallbackProducts = [
      {
        id: 'tech-2',
        category: 'technology',
        categoryName: 'Tecnología',
        title: 'Smartwatch HUAWEI Watch Fit 4 Pro GPS',
        shortDesc: 'Pantalla Retina OLED curva de alto brillo, GPS dual de precisión quirúrgica, sensor ECG y 5 días de batería real.',
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

    try {
      const response = await fetch('content/products.json?v=' + new Date().getTime());
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          products = data.items;
        } else {
          products = fallbackProducts;
        }
      } else {
        products = fallbackProducts;
      }
    } catch (e) {
      console.log('Usando productos de respaldo mientras se genera el CMS', e);
      products = fallbackProducts;
    }
    renderProducts();
  }

  /* ==========================================================================
     2. CONTROL DE PESTAÑAS Y ENCABEZADOS
     ========================================================================== */
  const categoryMeta = {
    all: {
      title: 'Todas las Ofertas Hot Sale',
      desc: 'Explorá el catálogo completo de productos con cuotas sin interés y envío gratis a todo el país.'
    },
    technology: {
      title: 'Tecnología Hot Sale',
      desc: 'Auriculares inalámbricos, smartwatches, visores VR y dispositivos tecnológicos.'
    },
    'home-office': {
      title: 'Home Office y Escritorios Hot Sale',
      desc: 'Sillas ergonómicas, escritorios elevables, barras de luz y accesorios.'
    },
    coffee: {
      title: 'Café de Especialidad Hot Sale',
      desc: 'Cafeteras espresso, molinillos cónicos y granos de origen único.'
    }
  };

  function setCategory(category) {
    currentCategory = category;
    if (categoryTabs) {
      categoryTabs.querySelectorAll('.tab-btn').forEach(btn => {
        const match = btn.getAttribute('data-category') === category;
        btn.classList.toggle('active', match);
        btn.setAttribute('aria-selected', match ? 'true' : 'false');
      });
    }

    const meta = categoryMeta[category] || categoryMeta.all;
    if (currentCategoryTitle) currentCategoryTitle.textContent = meta.title;
    if (currentCategoryDesc) currentCategoryDesc.textContent = meta.desc;

    renderProducts();
  }

  if (categoryTabs) {
    categoryTabs.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-category');
        setCategory(cat);
      });
    });
  }

  document.querySelectorAll('[data-filter]').forEach(link => {
    link.addEventListener('click', () => {
      const filter = link.getAttribute('data-filter');
      if (filter) {
        setCategory(filter);
        closeMobileMenu();
      }
    });
  });

  if (showAllBtn) {
    showAllBtn.addEventListener('click', () => {
      searchQuery = '';
      if (productFilterInput) productFilterInput.value = '';
      if (headerSearchInput) headerSearchInput.value = '';
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      setCategory('all');
      const dealsSec = document.getElementById('deals');
      if (dealsSec) dealsSec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     3. BÚSQUEDA Y ORDENAMIENTO
     ========================================================================== */
  function handleSearch(val) {
    searchQuery = val;
    if (clearSearchBtn) {
      clearSearchBtn.style.display = val.length > 0 ? 'block' : 'none';
    }
    renderProducts();
  }

  if (productFilterInput) {
    productFilterInput.addEventListener('input', (e) => handleSearch(e.target.value));
  }

  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      if (productFilterInput) productFilterInput.value = '';
      handleSearch('');
      if (productFilterInput) productFilterInput.focus();
    });
  }

  if (headerSearchInput) {
    headerSearchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      if (productFilterInput) productFilterInput.value = val;
      handleSearch(val);
      const dealsSec = document.getElementById('deals');
      if (dealsSec && window.scrollY < dealsSec.offsetTop - 150) {
        dealsSec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderProducts();
    });
  }

  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      searchQuery = '';
      currentSort = 'featured';
      if (sortSelect) sortSelect.value = 'featured';
      if (productFilterInput) productFilterInput.value = '';
      if (headerSearchInput) headerSearchInput.value = '';
      if (clearSearchBtn) clearSearchBtn.style.display = 'none';
      setCategory('all');
    });
  }

  /* ==========================================================================
     4. CONTADOR
     ========================================================================== */
  const daysEl = document.getElementById('timerDays');
  const hoursEl = document.getElementById('timerHours');
  const minutesEl = document.getElementById('timerMinutes');
  const secondsEl = document.getElementById('timerSeconds');

  let countdownTarget = localStorage.getItem('worthit_hotsale_end');
  if (!countdownTarget) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 9);
    countdownTarget = targetDate.getTime();
    localStorage.setItem('worthit_hotsale_end', countdownTarget);
  } else {
    countdownTarget = parseInt(countdownTarget, 10);
  }

  function updateCountdown() {
    const now = new Date().getTime();
    let distance = countdownTarget - now;
    if (distance <= 0) distance = 9 * 86400000;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = days < 10 ? '0' + days : days;
    if (hoursEl) hoursEl.textContent = hours < 10 ? '0' + hours : hours;
    if (minutesEl) minutesEl.textContent = minutes < 10 ? '0' + minutes : minutes;
    if (secondsEl) secondsEl.textContent = seconds < 10 ? '0' + seconds : seconds;
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ==========================================================================
     5. CARRITO
     ========================================================================== */
  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
    showToast(`¡Agregaste <strong>${product.title}</strong> a tu carrito con <strong>Envío Gratis</strong>!`);

    if (cartCountBadge) {
      cartCountBadge.classList.remove('bump');
      void cartCountBadge.offsetWidth;
      cartCountBadge.classList.add('bump');
    }
  }

  function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter(i => i.id !== productId);
    }
    updateCartUI();
  }

  function removeFromCart(productId) {
    cart = cart.filter(i => i.id !== productId);
    updateCartUI();
    showToast('Producto eliminado del carrito');
  }

  function updateCartUI() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const originalTotal = cart.reduce((sum, item) => sum + ((item.originalPrice || item.salePrice) * item.quantity), 0);
    const finalTotal = cart.reduce((sum, item) => sum + ((item.salePrice || 0) * item.quantity), 0);
    const savings = originalTotal - finalTotal;

    if (cartCountBadge) cartCountBadge.textContent = totalItems;
    if (cartItemsCountLabel) cartItemsCountLabel.textContent = `${totalItems} producto${totalItems === 1 ? '' : 's'}`;

    if (cart.length === 0) {
      if (cartDrawerBody) {
        cartDrawerBody.innerHTML = `
          <div class="cart-empty-state">
            <svg class="icon-lg text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <h4>Tu carrito está vacío</h4>
            <p>¡Aprovechá las ofertas del Hot Sale antes de que se agoten!</p>
            <a href="#deals" class="btn btn-primary btn-sm" id="cartStartShoppingBtn">Explorar Ofertas</a>
          </div>
        `;
      }
      const btn = document.getElementById('cartStartShoppingBtn');
      if (btn) btn.addEventListener('click', closeCart);
      if (cartDrawerFooter) cartDrawerFooter.style.display = 'none';
      return;
    }

    if (cartDrawerFooter) cartDrawerFooter.style.display = 'flex';
    if (cartOriginalTotal) cartOriginalTotal.textContent = formatARS(originalTotal);
    if (cartSavingsTotal) cartSavingsTotal.textContent = '-' + formatARS(savings);
    if (cartFinalTotal) cartFinalTotal.textContent = formatARS(finalTotal);

    if (cartDrawerBody) {
      cartDrawerBody.innerHTML = cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-img">
            <img src="${item.image}" alt="${item.title}">
          </div>
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.title}</h4>
            <span class="cart-item-price">${formatARS(item.salePrice)} <small style="color: #6a7d93; text-decoration: line-through;">${formatARS(item.originalPrice)}</small></span>
            <div style="font-size: 0.72rem; color: var(--color-accent); font-weight: 700;">💳 ${item.installments || ''}</div>
            <div class="cart-item-qty">
              <button class="qty-btn" onclick="window.cartChangeQty('${item.id}', -1)">-</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" onclick="window.cartChangeQty('${item.id}', 1)">+</button>
            </div>
          </div>
          <button class="cart-item-remove" onclick="window.cartRemove('${item.id}')">&times;</button>
        </div>
      `).join('');
    }
  }

  window.cartChangeQty = (id, delta) => updateQuantity(id, delta);
  window.cartRemove = (id) => removeFromCart(id);

  function openCart() {
    if (cartDrawer) cartDrawer.classList.add('open');
    if (cartOverlay) cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartDrawer) cartDrawer.classList.remove('open');
    if (cartOverlay) cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (cartTrigger) cartTrigger.addEventListener('click', openCart);
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      alert(`🎉 ¡Compra iniciada en WorthIT!\n\nTotal: ${cartFinalTotal.textContent}\n¡Envío Gratis incluido!`);
      cart = [];
      updateCartUI();
      closeCart();
    });
  }

  /* ==========================================================================
     6. VISTA RÁPIDA
     ========================================================================== */
  window.openQuickView = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || !modalBody) return;

    modalBody.innerHTML = `
      <div class="modal-grid">
        <div class="modal-img-wrap">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="modal-info">
          <div class="badge-free-shipping">
            🚚 Envío Gratis a todo el país
          </div>
          <span class="modal-tag">${product.categoryName || ''} • OFERTA HOT SALE</span>
          <h2 class="modal-title">${product.title}</h2>
          <p class="modal-desc">${product.fullDesc || product.shortDesc || ''}</p>

          <ul class="modal-specs-list">
            ${Array.isArray(product.specs) ? product.specs.map(spec => `<li>${spec}</li>`).join('') : ''}
          </ul>

          <div class="modal-price-row">
            <span class="modal-old-price">${formatARS(product.originalPrice)}</span>
            <span class="modal-sale-price">${formatARS(product.salePrice)}</span>
            <span class="badge-discount">AHORRÁS ${product.discount || 0}%</span>
          </div>

          <div class="product-installments" style="margin-bottom: 16px;">
            💳 <strong>${product.installments || ''}</strong>
          </div>

          <div style="display: flex; gap: 12px; margin-top: 14px;">
            <a href="${product.affiliateUrl || '#'}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-block btn-lg" style="text-decoration: none;">
              <span>Ver Oferta Oficial • ${formatARS(product.salePrice)}</span>
            </a>
          </div>
        </div>
      </div>
    `;

    if (quickViewModal) quickViewModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeQuickView() {
    if (quickViewModal) quickViewModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeQuickView);
  if (quickViewModal) {
    quickViewModal.addEventListener('click', (e) => {
      if (e.target === quickViewModal) closeQuickView();
    });
  }

  /* ==========================================================================
     7. TOAST Y MENÚ MÓVIL
     ========================================================================== */
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<div class="toast-icon">✓</div><div class="toast-message">${message}</div>`;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 20);
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  if (mobileToggle) mobileToggle.addEventListener('click', () => {
    if (mobileMenuDrawer) mobileMenuDrawer.classList.add('open');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.add('open');
  });

  function closeMobileMenu() {
    if (mobileMenuDrawer) mobileMenuDrawer.classList.remove('open');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('open');
  }

  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
  if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Sticky Header
  const siteHeader = document.getElementById('siteHeader');
  const scrollProgressBar = document.getElementById('scrollProgressBar');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    if (siteHeader) siteHeader.classList.toggle('scrolled', scrollY > 40);
    if (scrollProgressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }
  }, { passive: true });

  // Inicializar cargando desde el CMS
  loadProductsFromCMS();
});
