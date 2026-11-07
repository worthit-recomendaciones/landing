document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     SISTEMA DE CONSENTIMIENTO Y MODAL LEGAL
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
     CATÁLOGO DE PRODUCTOS Y AJUSTES DESDE EL CMS
     ========================================================================== */
  let products = [];

  const productsGrid = document.getElementById('productsGrid');
  const categoryTabs = document.getElementById('categoryTabs');
  const productFilterInput = document.getElementById('productFilterInput');
  const currentCategoryCount = document.getElementById('currentCategoryCount');

  let currentCategory = 'all';
  let searchQuery = '';

  function formatARS(amount) {
    return '$' + Number(amount || 0).toLocaleString('es-AR');
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
      productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #fff;">No hay productos cargados en esta categoría. Entrá a /admin/ para agregar nuevos.</div>';
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
        } else {
          alert('Enlace de afiliado no configurado.');
        }
      });
    });
  }

  async function loadCMSData() {
    // Como estamos usando carpetas para productos, cargamos por defecto un array base o simulamos la lectura
    // (En producción con Decap por carpetas, los productos se pueden mapear o listar limpiamente)
    try {
      const response = await fetch('content/products.json?v=' + Date.now());
      if (response.ok) {
        const data = await response.json();
        if (data && Array.isArray(data.items)) {
          products = data.items;
        }
      }
    } catch (e) {
      console.log('Modo de carpetas individuales activo');
    }

    // Cargar Ajustes Generales
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
      console.log('Ajustes generales pendientes de creación en el CMS');
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
