/**
 * WorthIT Hot Sale - Landing Page (Edición Argentina)
 * Categorías: Tecnología (5), Home Office (5), Café de Especialidad (5)
 * Total: 15 Productos con Cuotas sin Interés y Envío Gratis
 * WhatsApp de Soporte: +54 9 223 456-5003
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     1. CONSENTIMIENTO LEGAL BLOQUEANTE — BANNER INFERIOR ORIGINAL
     ========================================================================== */
  const consentBanner = document.getElementById('consentBanner');
  const consentOverlay = document.getElementById('consentOverlay');
  const btnAcceptConsent = document.getElementById('btnAcceptConsent');
  const closeConsentAttempt = document.getElementById('consentCloseAttemptBtn');
  const CONSENT_KEY = 'worthit_navigation_consent_v4';
  const CONSENT_COOKIE = 'worthit_navigation_consent_v4=accepted';

  // Algunos navegadores integrados (por ejemplo, el de Instagram) pueden
  // restringir el almacenamiento. La interfaz nunca debe depender de él
  // para responder al toque del usuario.
  const hasAcceptedConsent = () => {
    try {
      if (window.localStorage && window.localStorage.getItem(CONSENT_KEY) === 'accepted') return true;
    } catch (error) {
      // Se consulta la cookie como alternativa.
    }
    try {
      return document.cookie.split(';').some(cookie => cookie.trim() === CONSENT_COOKIE);
    } catch (error) {
      return false;
    }
  };

  const saveConsent = () => {
    try {
      window.localStorage.setItem(CONSENT_KEY, 'accepted');
    } catch (error) {
      // El cierre del banner no debe depender de localStorage.
    }
    try {
      document.cookie = CONSENT_COOKIE + '; Max-Age=31536000; Path=/; SameSite=Lax; Secure';
    } catch (error) {
      // Si también se bloquean las cookies, el banner igual se cierra en esta visita.
    }
  };

  const showConsent = () => {
    if (!consentBanner || !consentOverlay) return;
    consentBanner.hidden = false;
    consentOverlay.hidden = false;
    consentBanner.classList.add('visible');
    consentOverlay.classList.add('visible');
    consentOverlay.setAttribute('aria-hidden', 'false');
    document.body.classList.add('consent-locked');
  };

  const hideConsent = () => {
    if (!consentBanner || !consentOverlay) return;
    // Cierre inmediato y explícito: no depende de cookies ni de localStorage,
    // y evita que Safari/iOS mantenga visible un elemento fixed tras la animación.
    consentBanner.classList.remove('visible', 'shake');
    consentOverlay.classList.remove('visible');
    consentBanner.hidden = true;
    consentOverlay.hidden = true;
    consentOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('consent-locked');
    saveConsent();
  };

  if (!hasAcceptedConsent()) {
    showConsent();
  } else {
    if (consentBanner) consentBanner.hidden = true;
    if (consentOverlay) consentOverlay.hidden = true;
    document.body.classList.remove('consent-locked');
  }

  if (btnAcceptConsent) {
    // Click cubre mouse y la mayoría de los navegadores móviles.
    btnAcceptConsent.addEventListener('click', event => {
      event.preventDefault();
      hideConsent();
    });
    // Respaldo para WebKit móvil y navegadores integrados.
    btnAcceptConsent.addEventListener('pointerup', event => {
      if (event.pointerType === 'touch') {
        event.preventDefault();
        hideConsent();
      }
    });
  }

  // Delegación en captura como respaldo si el botón se vuelve a renderizar.
  document.addEventListener('click', event => {
    const acceptButton = event.target && event.target.closest
      ? event.target.closest('#btnAcceptConsent')
      : null;
    if (!acceptButton) return;
    event.preventDefault();
    hideConsent();
  }, true);

  const remindConsent = (event) => {
    if (event) event.preventDefault();
    if (!consentBanner) return;
    consentBanner.classList.remove('shake');
    void consentBanner.offsetWidth;
    consentBanner.classList.add('shake');
  };
  if (closeConsentAttempt) closeConsentAttempt.addEventListener('click', remindConsent);
  if (consentOverlay) consentOverlay.addEventListener('click', remindConsent);


  /* Lector legal en modal: mantiene al visitante dentro de WorthIT */
  const legalModal = document.getElementById('legalModalOverlay');
  const legalModalContent = document.getElementById('legalModalContent');
  const legalModalCloseBtn = document.getElementById('legalModalCloseBtn');
  const btnAcceptFromModal = document.getElementById('btnAcceptFromModal');
  const legalTabButtons = document.querySelectorAll('[data-legal-tab]');
  const legalOpenButtons = document.querySelectorAll('[data-open-legal]');

  function openLegalModal(tabName) {
    if (!legalModal) return;
    legalModal.classList.add('open');
    legalModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('legal-modal-open');
    switchLegalTab(tabName || 'terms');
    if (legalModalCloseBtn) legalModalCloseBtn.focus();
  }

  function closeLegalModal() {
    if (!legalModal) return;
    legalModal.classList.remove('open');
    legalModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('legal-modal-open');
  }

  function switchLegalTab(tabName) {
    const validTab = ['terms', 'privacy', 'cookies'].includes(tabName) ? tabName : 'terms';
    document.querySelectorAll('.legal-tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === 'pane-' + validTab);
    });
    legalTabButtons.forEach(button => {
      const active = button.dataset.legalTab === validTab;
      button.classList.toggle('active', active);
      button.setAttribute('aria-selected', String(active));
    });
    if (legalModalContent) legalModalContent.scrollTop = 0;
  }

  legalOpenButtons.forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      openLegalModal(button.dataset.openLegal);
    });
  });
  legalTabButtons.forEach(button => {
    button.addEventListener('click', () => switchLegalTab(button.dataset.legalTab));
  });
  if (legalModalCloseBtn) legalModalCloseBtn.addEventListener('click', closeLegalModal);
  if (btnAcceptFromModal) btnAcceptFromModal.addEventListener('click', closeLegalModal);
  if (legalModal) legalModal.addEventListener('click', event => {
    if (event.target === legalModal) closeLegalModal();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && legalModal && legalModal.classList.contains('open')) closeLegalModal();
  });

  /* ==========================================================================
     2. CATÁLOGO DE PRODUCTOS (15 Productos: 5 Tecnología, 5 Home Office, 5 Café)
     ========================================================================== */
  const products =   [
    {
      id: "BV92HN-FP8C",
      category: "technology",
      categoryName: "Tecnología",
      title: "Freidora de aire Suono 12 L con pantalla digital",
      shortDesc: "Una freidora de aire de gran capacidad, con 12 litros y controles digitales para preparar distintas comidas en casa.",
      fullDesc: "La Suono ofrece una capacidad de 12 litros y una interfaz digital. Una alternativa para quienes buscan cocinar porciones abundantes con freidora de aire. Confirmá en la publicación las funciones, accesorios y medidas incluidas.",
      salePrice: 149459,
      installments: "2 cuotas de $74.730",
      freeShipping: true,
      image: "images/products/air-fryer.png",
      featured: false,
      affiliateUrl: "https://meli.la/2gGkHuK",
      specs: [
        "Capacidad declarada: 12 litros",
        "Pantalla y controles digitales"
      ]
    },
    {
      id: "BV92HN-MY02",
      category: "technology",
      categoryName: "Tecnología",
      title: "Smartwatch Smartbit W1 Pro sumergible",
      shortDesc: "Reloj inteligente Smartbit W1 Pro, una opción para acompañar la actividad cotidiana desde la muñeca.",
      fullDesc: "El Smartbit W1 Pro combina formato de reloj inteligente con resistencia al agua indicada en su denominación comercial. Antes de usarlo en agua, revisá en la publicación el nivel de protección y las condiciones de uso.",
      salePrice: 82500,
      installments: "3 cuotas de $27.500",
      freeShipping: true,
      image: "images/products/smartwatch.png",
      featured: false,
      affiliateUrl: "https://meli.la/2zoZ2Pa",
      specs: [
        "Modelo: W1 Pro",
        "Resistencia al agua indicada por el vendedor; verificar alcance y condiciones"
      ]
    },
    {
      id: "BV92HN-NCEV",
      category: "technology",
      categoryName: "Tecnología",
      title: "Smartwatch HUAWEI Watch Fit 4 Pro GPS",
      shortDesc: "Un reloj inteligente HUAWEI con GPS integrado, pensado para registrar actividad y acompañar entrenamientos.",
      fullDesc: "El Watch Fit 4 Pro es la alternativa destacada de esta selección. Su GPS integrado permite registrar recorridos sin depender exclusivamente del teléfono. Consultá en la publicación la compatibilidad y el detalle de sensores y funciones disponibles.",
      salePrice: 299999,
      installments: "6 cuotas de $50.000",
      freeShipping: true,
      image: "images/products/smartwatch2.png",
      featured: true,
      affiliateUrl: "https://meli.la/13CTiHx",
      specs: [
        "GPS integrado",
        "Consultar compatibilidad y funciones específicas en la publicación"
      ]
    },
    {
      id: "BV92HN-P85N",
      category: "technology",
      categoryName: "Tecnología",
      title: "Auriculares JBL Live 780 Bluetooth",
      shortDesc: "Auriculares inalámbricos JBL de la línea Live, para escuchar música, contenidos y atender llamadas mediante Bluetooth.",
      fullDesc: "Una opción de audio inalámbrico de JBL. Revisá en la publicación las características exactas de conectividad, autonomía, micrófono y accesorios incluidos para esta versión.",
      salePrice: 309999,
      installments: "6 cuotas de $51.666",
      freeShipping: true,
      image: "images/products/headphones-jbl.png",
      featured: false,
      affiliateUrl: "https://meli.la/2bgiQ1i",
      specs: [
        "Conectividad Bluetooth",
        "Línea JBL Live; verificar especificaciones de la versión publicada"
      ]
    },
    {
      id: "BV92HN-X7L4",
      category: "technology",
      categoryName: "Tecnología",
      title: "Auriculares Anker Soundcore P30i con cancelación de ruido",
      shortDesc: "Auriculares Soundcore P30i con cancelación de ruido, una opción compacta para escuchar audio en movimiento.",
      fullDesc: "Los Soundcore P30i se presentan con cancelación de ruido. Una alternativa para quienes buscan auriculares portátiles para uso diario. Consultá en el vendedor los detalles de autonomía, controles y compatibilidad.",
      salePrice: 68321,
      installments: "2 cuotas de $34.160",
      freeShipping: true,
      image: "images/products/headphones-anker-soundcore.png",
      featured: false,
      affiliateUrl: "https://meli.la/2mtnn8t",
      specs: [
        "Modelo: Soundcore P30i",
        "Cancelación de ruido indicada en la publicación"
      ]
    },
    {
      id: "BV92HN-8Q92",
      category: "home-office",
      categoryName: "Home Office",
      title: "Silla de oficina Celta giratoria negra",
      shortDesc: "Silla giratoria de oficina en color negro, para equipar un espacio de trabajo o estudio.",
      fullDesc: "Una silla de oficina de formato giratorio y terminación negra. Revisá en la publicación las dimensiones, materiales, regulación y capacidad de carga antes de elegirla.",
      salePrice: 84764,
      installments: "9 cuotas de $9.418",
      freeShipping: true,
      image: "images/products/silla.png",
      featured: false,
      affiliateUrl: "https://meli.la/29J9i9N",
      specs: [
        "Formato giratorio",
        "Color negro",
        "Verificar medidas y regulaciones en la publicación"
      ]
    },
    {
      id: "BV92HN-VT5S",
      category: "home-office",
      categoryName: "Home Office",
      title: "Impresora multifunción HP Smart Tank 580",
      shortDesc: "Multifunción HP Smart Tank 580 para imprimir y resolver tareas habituales de estudio y trabajo.",
      fullDesc: "La HP Smart Tank 580 reúne funciones de impresión y multifunción en un equipo de la línea Smart Tank. Consultá en la publicación los métodos de conexión, funciones de escaneo y copia, y contenido de la caja.",
      salePrice: 444347,
      installments: "9 cuotas de $49.372",
      freeShipping: true,
      image: "images/products/impresora-hp.png",
      featured: false,
      affiliateUrl: "https://meli.la/2DRrxWv",
      specs: [
        "Modelo: HP Smart Tank 580",
        "Funciones multifunción; confirmar conectividad y accesorios incluidos"
      ]
    },
    {
      id: "BV92HN-PJ2J",
      category: "home-office",
      categoryName: "Home Office",
      title: "Escritorio funcional con cajones y estantes",
      shortDesc: "Escritorio con espacio de guardado integrado, una solución práctica para organizar el área de trabajo.",
      fullDesc: "Este escritorio combina superficie de trabajo con cajones y estantes. Puede ayudar a mantener a mano útiles y accesorios sin sumar muebles adicionales. Verificá medidas, materiales y distribución en la publicación.",
      salePrice: 138999,
      installments: "6 cuotas de $23.166",
      freeShipping: true,
      image: "images/products/escritorio.png",
      featured: false,
      affiliateUrl: "https://meli.la/1skvE6U",
      specs: [
        "Cajones y estantes integrados",
        "Consultar dimensiones y materiales"
      ]
    },
    {
      id: "BV92HN-C5JH",
      category: "home-office",
      categoryName: "Home Office",
      title: "Escritorio eléctrico Gadnic 120 × 60 cm",
      shortDesc: "Escritorio eléctrico Gadnic de 120 × 60 cm para adaptar la altura de la superficie de trabajo.",
      fullDesc: "Una alternativa de escritorio regulable eléctricamente, con superficie de 120 × 60 cm. Antes de comprar, revisá en la publicación el rango de altura, capacidad de carga y sistema de regulación.",
      salePrice: 449999,
      installments: "3 cuotas de $150.000",
      freeShipping: true,
      image: "images/products/escritorio-gadnic-electrico.png",
      featured: false,
      affiliateUrl: "https://meli.la/2BNX2tU",
      specs: [
        "Superficie: 120 × 60 cm",
        "Regulación eléctrica de altura; verificar rango y carga máxima"
      ]
    },
    {
      id: "BV92HN-UF6D",
      category: "home-office",
      categoryName: "Home Office",
      title: "Lámpara de escritorio Gadnic LEDMax",
      shortDesc: "Lámpara LED de escritorio Gadnic LEDMax para sumar iluminación puntual al espacio de trabajo.",
      fullDesc: "Una lámpara de escritorio con iluminación LED. La publicación del vendedor permite confirmar niveles de intensidad, temperatura de color, alimentación y accesorios incluidos.",
      salePrice: 32799,
      installments: "9 cuotas de $3.644",
      freeShipping: false,
      image: "images/products/lampara-led-gadnic.png",
      featured: false,
      affiliateUrl: "https://meli.la/1avicxD",
      specs: [
        "Iluminación LED",
        "Envío gratis no informado para esta selección; revisar condiciones del vendedor"
      ]
    },
    {
      id: "BV92HN-492V",
      category: "coffee",
      categoryName: "Café",
      title: "Cafetera de filtro Oster DCS121B de 12 tazas",
      shortDesc: "Cafetera de filtro Oster con capacidad declarada para preparar hasta 12 tazas.",
      fullDesc: "Una cafetera de filtro para preparar varias tazas en una misma tanda. Su capacidad de 12 tazas la vuelve práctica para el hogar o para compartir. Consultá en la publicación las dimensiones y funciones adicionales.",
      salePrice: 69133,
      installments: "2 cuotas de $34.566",
      freeShipping: true,
      image: "images/products/coffee.png",
      featured: false,
      affiliateUrl: "https://meli.la/2yB92ov",
      specs: [
        "Capacidad declarada: 12 tazas",
        "Sistema de preparación por filtro"
      ]
    },
    {
      id: "BV92HN-4TVL",
      category: "coffee",
      categoryName: "Café",
      title: "Cafetera express Atma Pro Cappuccino 1,6 L",
      shortDesc: "Cafetera express Atma Pro Cappuccino con depósito de 1,6 litros.",
      fullDesc: "Una cafetera express de la línea Pro Cappuccino, con capacidad declarada de 1,6 litros. Revisá en la publicación la presión, accesorios y preparación de bebidas disponibles para esta versión.",
      salePrice: 139999,
      installments: "6 cuotas de $23.333",
      freeShipping: true,
      image: "images/products/Cafetera.png",
      featured: false,
      affiliateUrl: "https://meli.la/21qUHrZ",
      specs: [
        "Capacidad declarada: 1,6 litros",
        "Modelo: Atma Pro Cappuccino"
      ]
    },
    {
      id: "BV92HN-CCPY",
      category: "coffee",
      categoryName: "Café",
      title: "Molinillo de café Ultracomb MO8100A",
      shortDesc: "Molinillo Ultracomb MO8100A para moler café en casa antes de prepararlo.",
      fullDesc: "Un molinillo de café de uso doméstico, pensado para sumar molienda al momento de preparar la bebida. Consultá en la publicación el tipo de cuchillas o muelas, capacidad y ajustes disponibles.",
      salePrice: 39999,
      installments: "",
      freeShipping: true,
      image: "images/products/molinillo-cafe-ultracomb.png",
      featured: false,
      affiliateUrl: "https://meli.la/1ywMbkT",
      specs: [
        "Modelo: Ultracomb MO8100A",
        "Verificar capacidad y sistema de molienda en la publicación"
      ]
    },
    {
      id: "BV92HN-NSFD",
      category: "coffee",
      categoryName: "Café",
      title: "Cafetera express Yelmo CE5107 de 19 bares",
      shortDesc: "Cafetera express Yelmo CE5107 con presión declarada de 19 bares.",
      fullDesc: "Una cafetera express para preparar café en casa, con presión de 19 bares indicada en el modelo seleccionado. Revisá en la publicación los accesorios incluidos y las recomendaciones de uso y mantenimiento.",
      salePrice: 166350,
      installments: "3 cuotas de $55.450",
      freeShipping: true,
      image: "images/products/cafetera-yelmo.png",
      featured: false,
      affiliateUrl: "https://meli.la/214y3s8",
      specs: [
        "Presión declarada: 19 bares",
        "Modelo: Yelmo CE5107"
      ]
    },
    {
      id: "BV92HN-CYQ7",
      category: "coffee",
      categoryName: "Café",
      title: "Molinillo Hamilton Beach de muelas con 18 funciones",
      shortDesc: "Molinillo Hamilton Beach de muelas con 18 ajustes de molienda indicados para adaptar el café a distintas preparaciones.",
      fullDesc: "Este molinillo utiliza muelas y ofrece 18 ajustes de molienda según la denominación del producto. Una opción para ajustar el resultado según el método de preparación. Verificá en la publicación la capacidad y limpieza del equipo.",
      salePrice: 65399,
      installments: "2 cuotas de $32.700",
      freeShipping: true,
      image: "images/products/molinillo-hamilton-beach.png",
      featured: false,
      affiliateUrl: "https://meli.la/2Ck4KVF",
      specs: [
        "Sistema de muelas",
        "18 ajustes de molienda indicados"
      ]
    }
  ];

  /* ==========================================================================
     2. ESTADO Y VARIABLES
     ========================================================================== */
  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'featured';

  // Helper de formato en Pesos Argentinos
  function formatARS(amount) {
    return '$' + amount.toLocaleString('es-AR');
  }

  // Prioriza el enlace de afiliado validado. Si falta, abre una búsqueda normal
  // en Mercado Libre, sin atribuir esa visita como afiliada.
  function getProductUrl(product) {
    const affiliateUrl = (product.affiliateUrl || '').trim();
    if (/^https:\/\//i.test(affiliateUrl) && !/tu-link-de-afiliado|placeholder/i.test(affiliateUrl)) return affiliateUrl;
    return `https://listado.mercadolibre.com.ar/${encodeURIComponent(product.title)}`;
  }

  function openProductLink(product) {
    if (product) window.open(getProductUrl(product), '_blank', 'noopener,noreferrer');
  }


  // Elementos del DOM
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

  // Elementos del Modal de Vista Rápida
  const quickViewModal = document.getElementById('quickViewModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBody = document.getElementById('modalBody');

  // Elementos Menú Móvil
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenuDrawer = document.getElementById('mobileMenuDrawer');
  const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
  const mobileCloseBtn = document.getElementById('mobileCloseBtn');

  // Contenedor Toast
  const toastContainer = document.getElementById('toastContainer');

  /* ==========================================================================
     3. RENDERIZADO DE PRODUCTOS (Con Cuotas sin Interés y Envío Gratis)
     ========================================================================== */
  function getFilteredProducts() {
    return products.filter(product => {
      // Filtro por categoría
      const matchesCategory = (currentCategory === 'all') || (product.category === currentCategory);

      // Filtro por búsqueda
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch = !query || 
        product.title.toLowerCase().includes(query) ||
        product.shortDesc.toLowerCase().includes(query) ||
        product.categoryName.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (currentSort === 'discount') return Number(b.featured) - Number(a.featured);
      if (currentSort === 'price-asc') return a.salePrice - b.salePrice;
      if (currentSort === 'price-desc') return b.salePrice - a.salePrice;
      // Por defecto: producto destacado primero
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return 0;
    });
  }

  function renderProducts() {
    const filtered = getFilteredProducts();

    if (filtered.length === 0) {
      productsGrid.innerHTML = '';
      noResultsMsg.style.display = 'flex';
      currentCategoryCount.textContent = '0 Productos';
      return;
    }

    noResultsMsg.style.display = 'none';
    currentCategoryCount.textContent = `Mostrando ${filtered.length} Producto${filtered.length === 1 ? '' : 's'}`;

    productsGrid.innerHTML = filtered.map((product, index) => {
      const isCardFeatured = product.featured ? 'featured-card' : '';
      const cardDelay = (index * 0.04).toFixed(2);
      return `
        <article class="product-card ${isCardFeatured}" data-product-id="${product.id}" style="--card-delay: ${cardDelay}s" tabindex="0">
          <div class="card-top-badges">
            
            <span class="badge-tag">${product.categoryName}</span>
          </div>

          <div class="product-image-box" onclick="window.openQuickView('${product.id}')">
            <img src="${product.image}" alt="${product.title}" class="product-img" loading="lazy">
            <button class="quick-view-overlay-btn" type="button" aria-label="Vista rápida de ${product.title}">
              Vista Rápida
            </button>
          </div>

          <div class="product-info">
            <!-- Badge destacado de Envío Gratis -->
            ${product.freeShipping ? '<div class="badge-free-shipping">🚚 Envío Gratis</div>' : '<div class="badge-free-shipping">Consultar envío</div>'}

            <span class="product-category-label">${product.categoryName}</span>
            <h3 class="product-title" onclick="window.openQuickView('${product.id}')">${product.title}</h3>
            
            <!-- Breve descripción (Requisito explícito) -->
            <p class="product-description">${product.shortDesc}</p>
            <div class="product-price-box">
              
              <span class="product-price-current">${formatARS(product.salePrice)}</span>
            </div>

            <!-- Cantidad de cuotas disponibles para pago con tarjeta -->
            ${product.installments ? `<div class="product-installments">💳 <span>${product.installments}</span></div>` : '<div class="product-installments">Consultar medios de pago</div>'}

            <!-- CTA uniforme hacia la publicación de Mercado Libre -->
            <button class="btn-buy-product" data-product-id="${product.id}" type="button">
              <svg class="icon-sm" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
              <span>Ver en Mercado Libre</span>
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Compra directa: enlace afiliado validado o búsqueda de Mercado Libre.
    productsGrid.querySelectorAll('.btn-buy-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const product = products.find(p => p.id === btn.getAttribute('data-product-id'));
        openProductLink(product);
      });
    });
  }

  /* ==========================================================================
     4. CONTROL DE PESTAÑAS Y ENCABEZADOS DE CATEGORÍA
     ========================================================================== */
  const categoryMeta = {
    all: {
      title: 'Selección WorthIT',
      desc: '15 productos seleccionados en Tecnología, Home Office y Café. Compará características, precio y condiciones antes de comprar.'
    },
    technology: {
      title: 'Tecnología',
      desc: 'Dispositivos y accesorios para uso cotidiano, trabajo y entretenimiento.'
    },
    'home-office': {
      title: 'Home Office',
      desc: 'Equipamiento para organizar y mejorar tu espacio de trabajo.'
    },
    coffee: {
      title: 'Café',
      desc: 'Cafeteras y molinillos para preparar café en casa.'
    }
  };

  function setCategory(category) {
    currentCategory = category;

    // Actualizar botones de pestaña
    categoryTabs.querySelectorAll('.tab-btn').forEach(btn => {
      const match = btn.getAttribute('data-category') === category;
      btn.classList.toggle('active', match);
      btn.setAttribute('aria-selected', match ? 'true' : 'false');
    });

    // Actualizar encabezados
    const meta = categoryMeta[category] || categoryMeta.all;
    currentCategoryTitle.textContent = meta.title;
    currentCategoryDesc.textContent = meta.desc;

    // Renderizar
    renderProducts();
  }

  categoryTabs.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-category');
      setCategory(cat);
    });
  });

  document.querySelectorAll('[data-filter]').forEach(link => {
    link.addEventListener('click', () => {
      const filter = link.getAttribute('data-filter');
      if (filter) {
        setCategory(filter);
        closeMobileMenu();
      }
    });
  });

  document.querySelectorAll('[data-cat-target]').forEach(card => {
    card.addEventListener('click', () => {
      const targetCat = card.getAttribute('data-cat-target');
      if (targetCat) {
        setCategory(targetCat);
        const dealsSec = document.getElementById('deals');
        if (dealsSec) dealsSec.scrollIntoView({ behavior: 'smooth' });
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
     5. CONTROLES DE BÚSQUEDA Y ORDENAMIENTO
     ========================================================================== */
  function handleSearch(val) {
    searchQuery = val;
    if (clearSearchBtn) {
      clearSearchBtn.style.display = val.length > 0 ? 'block' : 'none';
    }
    renderProducts();
  }

  if (productFilterInput) {
    productFilterInput.addEventListener('input', (e) => {
      handleSearch(e.target.value);
    });
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
     6. MODAL DE VISTA RÁPIDA (CON CUOTAS Y ENVÍO GRATIS)
     ========================================================================== */
  window.openQuickView = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    modalBody.innerHTML = `
      <div class="modal-grid">
        <div class="modal-img-wrap">
          <img src="${product.image}" alt="${product.title}">
        </div>
        <div class="modal-info">
          <div class="badge-free-shipping">${product.freeShipping ? "🚚 Envío Gratis" : "Consultar envío"}</div>
          <span class="modal-tag">${product.categoryName}</span>
          <h2 class="modal-title">${product.title}</h2>
          <p class="modal-desc">${product.fullDesc}</p>

          ${product.specs.length ? `<ul class="modal-specs-list">${product.specs.map(spec => `<li>${spec}</li>`).join('')}</ul>` : ""}

          <div class="modal-price-row">
            
            <span class="modal-sale-price">${formatARS(product.salePrice)}</span>
            
          </div>

          <div class="product-installments" style="margin-bottom: 16px;">
            ${product.installments ? `💳 <strong>${product.installments}</strong>` : "Consultar medios de pago"}
          </div>

          <div style="display: flex; gap: 12px; margin-top: 14px;">
            <a href="${getProductUrl(product)}" target="_blank" rel="sponsored nofollow noopener noreferrer" class="btn btn-primary btn-block btn-lg" style="text-decoration: none;">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              <span>Ver en Mercado Libre</span>
            </a>
          </div>
        </div>
      </div>
    `;


    quickViewModal.classList.add('open');
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
     9. SISTEMA TOAST
     ========================================================================== */
  function showToast(message) {
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <div class="toast-icon">✓</div>
      <div class="toast-message">${message}</div>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 20);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  /* ==========================================================================
     10. MENÚ MÓVIL
     ========================================================================== */
  function openMobileMenu() {
    if (mobileMenuDrawer) mobileMenuDrawer.classList.add('open');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.add('open');
  }

  function closeMobileMenu() {
    if (mobileMenuDrawer) mobileMenuDrawer.classList.remove('open');
    if (mobileMenuOverlay) mobileMenuOverlay.classList.remove('open');
  }

  if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
  if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
  if (mobileMenuOverlay) mobileMenuOverlay.addEventListener('click', closeMobileMenu);

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  /* ==========================================================================
     12. EFECTO DE NAVEGACIÓN FIJA (STICKY HEADER) & SCROLL PROGRESS
     ========================================================================== */
  const siteHeader = document.getElementById('siteHeader');
  const scrollProgressBar = document.getElementById('scrollProgressBar');

  function onScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;

    // Header sticky con sombra
    if (siteHeader) {
      siteHeader.classList.toggle('scrolled', scrollY > 40);
    }

    // Barra de progreso de scroll suave
    if (scrollProgressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ==========================================================================
     13. SCROLL REVEAL (INTERSECTION OBSERVER NATIVO ULTRA LIVIANO)
     ========================================================================== */
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // Dejar de observar para cero impacto en rendimiento
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-scroll').forEach(el => {
    revealObserver.observe(el);
  });

  /* ==========================================================================
     14. SCROLLSPY (INDICADOR DE SECCIÓN ACTIVA EN EL MENÚ)
     ========================================================================== */
  const navSections = [
    { id: 'hero', link: document.querySelector('.nav-link[href="#hero"]') },
    { id: 'deals', link: document.querySelector('.nav-link[href="#deals"]') },
    { id: 'spotlight', link: document.querySelector('.nav-link[href="#spotlight"]') }
  ];

  window.addEventListener('scroll', () => {
    const currentPos = window.scrollY + 130;
    navSections.forEach(item => {
      const section = document.getElementById(item.id);
      if (section && item.link) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (currentPos >= top && currentPos < top + height) {
          document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
          item.link.classList.add('active');
        }
      }
    });
  }, { passive: true }); 

  /* ==========================================================================
     15. CUENTA REGRESIVA PROMOCIONAL REUTILIZABLE
     Para activar una campaña futura, cambiar enabled a true y cargar la fecha
     y hora reales de finalización en endsAt (hora local de Argentina).
     Ejemplo de formato: "2026-12-01T23:59:00".
     ==========================================================================
  */
  const PROMO_COUNTDOWN = {
    enabled: false, // Se mantiene apagada hasta que exista una promoción vigente.
    eventName: "EL EVENTO TERMINA EN:",
    endsAt: "" // Fecha real: AAAA-MM-DDTHH:MM:SS
  };

  const promoCountdown = document.getElementById('promoCountdown');
  if (promoCountdown && PROMO_COUNTDOWN.enabled && PROMO_COUNTDOWN.endsAt) {
    const endAt = new Date(PROMO_COUNTDOWN.endsAt);
    if (!Number.isNaN(endAt.getTime())) {
      promoCountdown.hidden = false;
      const heading = document.getElementById('countdownHeading');
      const expired = document.getElementById('countdownExpired');
      if (heading && PROMO_COUNTDOWN.eventName) heading.textContent = PROMO_COUNTDOWN.eventName;
      let promoInterval = null;
      const updatePromoCountdown = () => {
        const remaining = endAt.getTime() - Date.now();
        if (remaining <= 0) {
          document.getElementById('countdownTimer').hidden = true;
          if (expired) expired.hidden = false;
          window.clearInterval(promoInterval);
          return;
        }
        const totalSeconds = Math.floor(remaining / 1000);
        const values = {
          timerDays: Math.floor(totalSeconds / 86400),
          timerHours: Math.floor((totalSeconds % 86400) / 3600),
          timerMinutes: Math.floor((totalSeconds % 3600) / 60),
          timerSeconds: totalSeconds % 60
        };
        Object.entries(values).forEach(([id, value]) => {
          const node = document.getElementById(id);
          if (node) node.textContent = String(value).padStart(2, '0');
        });
      };
      updatePromoCountdown();
      promoInterval = window.setInterval(updatePromoCountdown, 1000);
    }
  }

  /* ==========================================================================
     16. INICIALIZACIÓN
     ========================================================================== */
  renderProducts(); 
});