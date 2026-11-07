document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. CONSENTIMIENTO Y MODAL LEGAL
     ========================================================================== */
  const consentBanner = document.getElementById('consentBanner');
  const consentOverlay = document.getElementById('consentOverlay');
  const btnAcceptConsent = document.getElementById('btnAcceptConsent');
  const CONSENT_KEY = 'worthit_legal_consent_v3';

  if (!localStorage.getItem(CONSENT_KEY)) {
    if (consentBanner) consentBanner.classList.add('visible');
    if (consentOverlay) consentOverlay.classList.add('visible');
  }

  if (btnAcceptConsent) {
    btnAcceptConsent.onclick = (e) => {
      e.preventDefault();
      localStorage.setItem(CONSENT_KEY, 'true');
      if (consentBanner) consentBanner.classList.remove('visible');
      if (consentOverlay) consentOverlay.classList.remove('visible');
    };
  }

  /* ==========================================================================
     2. CATÁLOGO BASE Y PRODUCTOS DINÁMICOS
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
  const currentCategoryCount = document.getElementById('currentCategoryCount');

  let currentCategory = 'all';
  let searchQuery = '';

  function formatARS(amount) {
    return '$' + Number(amount || 0).toLocaleString('es-AR');
  }

  function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
  }

  function renderSpotlight() {
    const spotlightSection = document.getElementById('spotlight');
    if (!spotlightSection) return;
    const featuredProduct = products.find(product => product.featured);
    if (!featuredProduct) {
      spotlightSection.hidden = true;
      return;
    }

    spotlightSection.hidden = false;
    const savings = Math.max(0, Number(featuredProduct.originalPrice || 0) - Number(featuredProduct.salePrice || 0));
    const image = escapeHTML(featuredProduct.image || '');
    const title = escapeHTML(featuredProduct.title || '');
    const description = escapeHTML(featuredProduct.shortDesc || '');
    const installments = escapeHTML(featuredProduct.installments || 'Consultar cuotas');
    const affiliateUrl = escapeHTML(featuredProduct.affiliateUrl || '#');

    spotlightSection.innerHTML = `
      <div class="spotlight-banner fade-in-scroll">
        <div class="spotlight-left">
          <span class="spotlight-pill">DESTACADO DEL DÍA</span>
          <h3 class="spotlight-title">${title}</h3>
          <p class="spotlight-subtitle">${description}</p>
          <div class="spotlight-installments-pill">
            💳 ${installments} • 🚚 <strong>Envío Gratis a todo el país</strong>
          </div>
          <div class="spotlight-cta">
            <a href="${affiliateUrl}" class="btn btn-accent btn-buy-spotlight" target="_blank" rel="noopener noreferrer">
              <span>COMPRAR AHORA • ${formatARS(featuredProduct.salePrice)}</span>
            </a>
            ${savings > 0 ? `<span class="spotlight-saving">Ahorrás ${formatARS(savings)} hoy</span>` : ''}
          </div>
        </div>
        <div class="spotlight-right">
          <div class="sound-wave wave-1"></div>
          <div class="sound-wave wave-2"></div>
          <div class="sound-wave wave-3"></div>
          <img src="${image}" alt="${title}" class="spotlight-speaker-img">
        </div>
      </div>
    `;
  }

  function renderProducts() {
    if (!productsGrid) return;
    const filtered = products.filter(product => {
      const matchesCategory = (currentCategory === 'all') || (product.category === currentCategory);
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        (product.title && product.title.toLowerCase().includes(query)) ||
        (product.shortDesc && product.shortDesc.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #fff;">No hay productos en esta categoría.</div>';
      if (currentCategoryCount) currentCategoryCount.textContent = '0 Productos';
      renderSpotlight();
      updateCatalogCounts();
      return;
    }

    if (currentCategoryCount) currentCategoryCount.textContent = `Mostrando ${filtered.length} Producto${filtered.length === 1 ? '' : 's'}`;
    updateCatalogCounts();

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
     4. CONTENIDO ADMINISTRABLE DESDE DECAP CMS
     ========================================================================== */
  function updateCatalogCounts() {
    const counts = {
      all: products.length,
      technology: products.filter(product => product.category === 'technology').length,
      'home-office': products.filter(product => product.category === 'home-office').length,
      coffee: products.filter(product => product.category === 'coffee').length
    };

    Object.entries(counts).forEach(([category, count]) => {
      const tab = document.querySelector(`.tab-btn[data-category="${category}"] .tab-count`);
      if (tab) tab.textContent = count;
    });
    const totalLink = document.querySelector('.mobile-link[data-filter="all"]');
    if (totalLink) totalLink.textContent = `Todas las Ofertas (${counts.all})`;
    const searchInput = document.getElementById('headerSearchInput');
    if (searchInput) searchInput.placeholder = `Buscar ${counts.all} ofertas...`;
    const showAll = document.querySelector('#showAllBtn span');
    if (showAll) showAll.textContent = `Ver los ${counts.all} Productos`;
  }

  function applySiteSettings(settings) {
    const setText = (selector, value) => {
      const element = document.querySelector(selector);
      if (element && typeof value === 'string' && value.trim()) element.textContent = value;
    };

    const hero = document.querySelector('.hero-title');
    if (hero && (settings.heroTitleLine1 || settings.heroTitleHighlight || settings.heroTitleSuffix)) {
      hero.innerHTML = `${escapeHTML(settings.heroTitleLine1 || 'ENCONTRÁ')}<br><span class="highlight-accent">${escapeHTML(settings.heroTitleHighlight || 'BUENAS COMPRAS')}</span> ${escapeHTML(settings.heroTitleSuffix || 'SIN PERDER EL TIEMPO!')}`;
    }
    setText('.hero-subtitle', settings.heroSubtitle);
    setText('.top-announcement .badge-accent', settings.announcementBadge);
    setText('.announcement-text', settings.announcementText);
    setText('.announcement-code strong', settings.announcementCoupon);
    const eyebrow = document.querySelector('.section-tag');
    if (eyebrow && settings.catalogEyebrow) {
      eyebrow.textContent = settings.catalogEyebrow;
    }
    const catalogTitle = document.querySelector('.section-title');
    if (catalogTitle && (settings.catalogTitleLine1 || settings.catalogTitleHighlight)) {
      catalogTitle.innerHTML = `${escapeHTML(settings.catalogTitleLine1 || 'OFERTAS RECOMENDADAS')}<br><span class="highlight-accent">${escapeHTML(settings.catalogTitleHighlight || 'CON CRITERIO')}</span>`;
    }
    setText('.section-desc', settings.catalogDescription);
    setText('.newsletter-content .badge-accent', settings.newsletterBadge);
    setText('.newsletter-content h2', settings.newsletterTitle);
    setText('.newsletter-content > p', settings.newsletterDescription);
    setText('.newsletter-content .form-disclaimer', settings.newsletterDisclaimer);
    setText('.footer-bio', settings.footerBio);
    setText('.footer-bottom p', settings.footerCopyright);

    if (settings.whatsappNumber) {
      const digits = settings.whatsappNumber.replace(/\D/g, '');
      const supportLink = document.querySelector('.footer-col a[href^="https://wa.me/"]');
      const floatingLink = document.querySelector('.whatsapp-float-btn');
      if (digits && supportLink) supportLink.href = `https://wa.me/${digits}`;
      if (digits && floatingLink) floatingLink.href = `https://wa.me/${digits}`;
    }
  }

  async function loadCMSData() {
    try {
      const prodRes = await fetch('content/products.json?v=' + Date.now(), { cache: 'no-store' });
      if (prodRes.ok) {
        const data = await prodRes.json();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          products = data.items.filter(product => product && product.title && product.category);
        }
      }
    } catch (e) {
      console.warn('No se pudo leer content/products.json; se conserva el catálogo de respaldo.', e);
    }

    try {
      const settingsRes = await fetch('content/settings.json?v=' + Date.now(), { cache: 'no-store' });
      if (settingsRes.ok) applySiteSettings(await settingsRes.json());
    } catch (e) {
      console.warn('No se pudieron cargar los textos del CMS; se conserva el contenido original.', e);
    }
    renderProducts();
  }

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

  loadCMSData();
});
