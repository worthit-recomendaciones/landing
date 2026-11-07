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
     CARGA DE CONTENIDOS DINÁMICOS DESDE EL CMS (Productos + Settings)
     ========================================================================== */
  let products = [];

  const productsGrid = document.getElementById('productsGrid');
  const categoryTabs = document.getElementById('categoryTabs');
  const productFilterInput = document.getElementById('productFilterInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const currentCategoryTitle = document.getElementById('currentCategoryTitle');
  const currentCategoryCount = document.getElementById('currentCategoryCount');
  const currentCategoryDesc = document.getElementById('currentCategoryDesc');

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
      productsGrid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #fff;">No hay productos cargados todavía. Entrá a /admin/ para agregar el primero.</div>';
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

  // Cargar datos del CMS (Productos y Ajustes Generales)
  async function loadCMSData() {
    try {
      // 1. Cargar Productos
      const prodRes = await fetch('content/products.json?v=' + Date.now());
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData && Array.isArray(prodData.items)) {
          products = prodData.items;
        }
      }
      renderProducts();
    } catch (e) {
      console.log('Esperando archivo de productos del CMS');
    }

    try {
      // 2. Cargar Configuración / Footer / Anuncios
      const settingsRes = await fetch('content/settings.json?v=' + Date.now());
      if (settingsRes.ok) {
        const settings = await settingsRes.json();
        
        // Actualizar textos globales si existen en el HTML
        const announcementEl = document.querySelector('.top-announcement-bar, [data-cms-announcement]');
        if (announcementEl && settings.announcementText) {
          announcementEl.textContent = settings.announcementText;
        }

        const footerEl = document.querySelector('footer p, [data-cms-footer]');
        if (footerEl && settings.footerCopyright) {
          footerEl.textContent = settings.footerCopyright;
        }
      }
    } catch (e) {
      console.log('Esperando archivo de configuración del CMS');
    }
  }

  // Pestañas de categorías
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
