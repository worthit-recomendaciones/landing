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
      return;
    }

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
     4. SINCRONIZACIÓN CON EL CMS (PRODUCTS.JSON & SETTINGS.JSON)
     ========================================================================== */
  async function loadCMSData() {
    try {
      const prodRes = await fetch('content/products.json?v=' + Date.now());
      if (prodRes.ok) {
        const data = await prodRes.json();
        if (data && Array.isArray(data.items) && data.items.length > 0) {
          products = data.items;
        }
      }
    } catch (e) {
      console.log('Usando catálogo base de respaldo');
    }

    try {
      const settingsRes = await fetch('content/settings.json?v=' + Date.now());
      if (settingsRes.ok) {
        const settings = await settingsRes.json();
        const heroTitleEl = document.querySelector('.hero-title, [data-cms-hero-title]');
        if (heroTitleEl && settings.heroTitle) heroTitleEl.textContent = settings.heroTitle;

        const footerEl = document.querySelector('footer p, [data-cms-footer]');
        if (footerEl && settings.footerText) footerEl.textContent = settings.footerText;
      }
    } catch (e) {
      console.log('Ajustes generales pendientes');
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
