/**
 * WorthIT Hot Sale - Landing Page (Edición Argentina)
 * Categorías: Tecnología (5), Home Office (5), Café de Especialidad (5)
 * Total: 15 Productos con Cuotas sin Interés y Envío Gratis
 * WhatsApp de Soporte: +54 9 223 456-5003
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================================================
     SISTEMA DE CONSENTIMIENTO Y MODAL LEGAL (CORREGIDO)
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

  // 1. Verificar si ya acept� previamente
  function checkLegalConsent() {
    const accepted = localStorage.getItem(CONSENT_KEY);
    if (!accepted) {
      document.body.classList.add('consent-locked');
      if (consentBanner) consentBanner.classList.add('visible');
      if (consentOverlay) consentOverlay.classList.add('visible');
    }
  }

  // 2. Aceptar y desbloquear todo
  function acceptLegalConsent() {
    localStorage.setItem(CONSENT_KEY, 'true');
    document.body.classList.remove('consent-locked');
    if (consentBanner) consentBanner.classList.remove('visible');
    if (consentOverlay) consentOverlay.classList.remove('visible');
    closeLegalModal();
    
    // Toast con entidad HTML limpia sin caracteres raros
    if (typeof showToast === 'function') {
      showToast('&iexcl;T&eacute;rminos y condiciones aceptados! Disfrut&aacute; de WorthIT.');
    }
  }

  // 3. Efecto de aviso si presiona fuera
  function triggerBannerShake() {
    if (consentBanner) {
      consentBanner.classList.remove('shake');
      void consentBanner.offsetWidth;
      consentBanner.classList.add('shake');
    }
  }

  // Event Listeners de Botones de Aceptaci�n
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

  // 4. L�gica de Pesta�as y Modal Legal
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

  // Asignar clics a los enlaces del banner (T�rminos, Privacidad, Cookies)
  document.querySelectorAll('[data-open-legal]').forEach(btn => {
    btn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      const tabTarget = btn.getAttribute('data-open-legal');
      window.openLegalModal(tabTarget);
    };
  });

  // Asignar clics a las pesta�as superiores dentro del modal
  if (legalTabsBar) {
    legalTabsBar.querySelectorAll('.legal-tab-btn').forEach(btn => {
      btn.onclick = function(e) {
        e.preventDefault();
        const target = btn.getAttribute('data-legal-tab');
        switchLegalTab(target);
      };
    });
  }

  // Cruz de cierre del modal legal
  if (legalModalCloseBtn) {
    legalModalCloseBtn.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      window.closeLegalModal();
    };
  }

  // Clic fuera del modal para cerrar
  if (legalModalOverlay) {
    legalModalOverlay.onclick = function(e) {
      if (e.target === legalModalOverlay) {
        window.closeLegalModal();
      }
    };
  }

  // Ejecutar verificaci�n inicial
  checkLegalConsent();
	
  /* ==========================================================================
     1. CATÁLOGO DE PRODUCTOS (15 Productos: 5 Tecnología, 5 Home Office, 5 Café)
     ========================================================================== */
  const products = [
    // --- TECNOLOGÍA (5 Productos) ---
    {
      id: 'tech-1',
      category: 'technology',
      categoryName: 'Tecnología',
      title: 'Auriculares AeroSound Pro ANC',
      shortDesc: 'Cancelación activa de ruido híbrida, 40 horas de batería, audio espacial inmersivo y almohadillas viscoelásticas ultra suaves.',
      fullDesc: 'Diseñados para audiófilos exigentes y jornadas de trabajo prolongadas. Cuentan con cancelación de ruido híbrida de 3 niveles, diafragmas de berilio y conexión multipunto Bluetooth 5.3.',
      specs: [
        'Drivers acústicos de Berilio de 40mm',
        'Cancelación Activa de Ruido Híbrida (-42dB)',
        'Hasta 40 horas de reproducción ininterrumpida',
        'Conexión Multipoint Bluetooth 5.3 y micrófono HD'
      ],
      originalPrice: 249000,
      salePrice: 179000,
      discount: 28,
      installments: '6 cuotas sin interés de $29.833',
      freeShipping: true,
      image: 'images/products/smartwatch.png',
      rating: 4.9,
      reviews: 218,
      featured: false,
	  affiliateUrl: 'https://meli.la/13CTiHx' // <--- �Ac� peg�s tu enlace de afiliado real!
    },
    {
      id: 'tech-2',
      category: 'technology',
      categoryName: 'Tecnología',
      title: 'Smartwatch HUAWEI Watch Fit 4 Pro GPS',
      shortDesc: 'Pantalla Retina OLED curva de alto brillo, GPS dual de precisión quirúrgica, sensor ECG y 5 días de batería real.',
      fullDesc: 'Chasis de titanio de grado aeroespacial resistente a golpes y rayones. Medición continua de frecuencia cardíaca, saturación SpO2, fases de sueño y más de 100 modos deportivos.',
      specs: [
        'Pantalla Retina OLED de 1.92" curva (1000 nits)',
        'Caja forjada en aleación de titanio aeroespacial',
        'Sensor óptico ECG + oximetría SpO2 en tiempo real',
        'Resistencia al agua 5 ATM (sumergible 50 metros)'
      ],
      originalPrice: 229000,
      salePrice: 189000,
      discount: 17,
      installments: '6 cuotas sin interés de $31.500',
      freeShipping: true,
      image: 'images/products/smartwatch2.png',
      rating: 4.8,
      reviews: 342,
      featured: true, // Destacado con reborde neón brillante (como en Referencia 2)
	  affiliateUrl: 'https://meli.la/13CTiHx' // <--- �Ac� peg�s tu enlace de afiliado real!
    },
    {
      id: 'tech-3',
      category: 'technology',
      categoryName: 'Tecnología',
      title: 'Visor VR CyberVision X Reality',
      shortDesc: 'Lentes ópticos duales 4K Pancake, tracking espacial submilimétrico sin cables y diadema ergonómica ultraliviana.',
      fullDesc: 'Experimentá mundos virtuales y productividad espacial en resolución 4K real. Frecuencia de 120Hz fluida, cámaras de seguimiento de baja latencia y audio binaural integrado.',
      specs: [
        'Doble pantalla Micro-OLED 4K (2160x2160 por ojo)',
        'Campo de visión ultra amplio de 110 grados',
        'Seguimiento espacial 6-DoF de adentro hacia afuera',
        'Latencia ultra baja movimiento-a-fotón de 12ms'
      ],
      originalPrice: 499000,
      salePrice: 349000,
      discount: 30,
      installments: '12 cuotas sin interés de $29.083',
      freeShipping: true,
      image: 'images/products/tech-vr-headset.svg',
      rating: 4.9,
      reviews: 124,
      featured: false,
	  affiliateUrl: 'https://mercadolibre.com/tu-link-de-afiliado-aqui' // <--- �Ac� peg�s tu enlace de afiliado real!
    },
    {
      id: 'tech-4',
      category: 'technology',
      categoryName: 'Tecnología',
      title: 'Parlante Acústico Pulse 360°',
      shortDesc: 'Sonido envolvente 360 grados de alta fidelidad, radiadores pasivos de graves profundos y aro táctil iluminado.',
      fullDesc: 'Potencia acústica que llena cualquier habitación. Certificación impermeable IPX7 para usar en interiores o al aire libre, y emparejamiento estéreo True Wireless.',
      specs: [
        'Dispersión acústica omnidireccional en 360°',
        'Doble radiador de neodimio para bajos profundos',
        'Certificación IPX7 resistente a inmersión en agua',
        'Dial táctil superior con anillo LED inteligente'
      ],
      originalPrice: 179000,
      salePrice: 99000,
      discount: 45,
      installments: '6 cuotas sin interés de $16.500',
      freeShipping: true,
      image: 'images/products/tech-speaker.svg',
      rating: 4.7,
      reviews: 189,
      featured: false,
	  affiliateUrl: 'https://mercadolibre.com/tu-link-de-afiliado-aqui' // <--- �Ac� peg�s tu enlace de afiliado real!
    },
    {
      id: 'tech-5',
      category: 'technology',
      categoryName: 'Tecnología',
      title: 'Smartphone Vortex 15 Pro 256GB',
      shortDesc: 'Estructura de titanio azul medianoche, pantalla Super AMOLED 120Hz, triple cámara pro de 48MP y batería para todo el día.',
      fullDesc: 'Diseño insignia con bordes biselados de titanio grado 5. Sensor fotográfico computacional de última generación, zoom periscópico óptico y carga ultra rápida de 45W.',
      specs: [
        'Pantalla 6.7" Super AMOLED 120Hz adaptativa',
        'Triple cámara pro con sensor principal de 48MP',
        'Borde de titanio grado 5 y vidrio esmerilado mate',
        'Batería para todo el día con carga rápida 45W'
      ],
      originalPrice: 999000,
      salePrice: 799000,
      discount: 20,
      installments: '12 cuotas sin interés de $66.583',
      freeShipping: true,
      image: 'images/products/tech-smartphone.svg',
      rating: 5.0,
      reviews: 512,
      featured: false,
	  affiliateUrl: 'https://mercadolibre.com/tu-link-de-afiliado-aqui' // <--- �Ac� peg�s tu enlace de afiliado real!
    },

    // --- HOME OFFICE (5 Productos) ---
    {
      id: 'office-1',
      category: 'home-office',
      categoryName: 'Home Office',
      title: 'Silla Ergonómica ErgoFlex Pro',
      shortDesc: 'Soporte lumbar dinámico autorregulable, malla transpirable antitranspirante y apoyabrazos 4D regulables.',
      fullDesc: 'Diseñada para jornadas intensivas de más de 12 horas. Se amolda con precisión a la curvatura natural de la columna vertebral y disipa el calor corporal de manera constante.',
      specs: [
        'Soporte lumbar adaptativo a los movimientos del cuerpo',
        'Malla técnica de alta densidad y respirabilidad',
        'Apoyabrazos 4D multidireccionales acolchados',
        'Pistón de gas reforzado Clase 4 certificado BIFMA'
      ],
      originalPrice: 420000,
      salePrice: 289000,
      discount: 31,
      installments: '6 cuotas sin interés de $48.166',
      freeShipping: true,
      image: 'images/products/office-chair.svg',
      rating: 4.9,
      reviews: 265,
      featured: false,
	  affiliateUrl: 'https://mercadolibre.com/tu-link-de-afiliado-aqui' // <--- �Ac� peg�s tu enlace de afiliado real!
    },
    {
      id: 'office-2',
      category: 'home-office',
      categoryName: 'Home Office',
      title: 'Escritorio Elevable ApexLift Dual-Motor',
      shortDesc: 'Sistema eléctrico de doble motor ultra silencioso, tapa de roble macizo biselado (160x80cm) y panel LED con 4 memorias.',
      fullDesc: 'Mejorá tu salud y postura alternando entre trabajar de pie y sentado. Motores duales sincronizados con sensor anti-colisión, canaleta organizadora y tablero de madera premium.',
      specs: [
        'Doble motor eléctrico sincronizado (<45dB)',
        'Rango de elevación de 62cm a 128cm con sensor anti-choque',
        'Tablero de roble macizo con bordes biselados (160x80cm)',
        'Panel digital táctil con 4 alturas memorizables'
      ],
      originalPrice: 650000,
      salePrice: 469000,
      discount: 28,
      installments: '12 cuotas sin interés de $39.083',
      freeShipping: true,
      image: 'images/products/office-desk.svg',
      rating: 4.9,
      reviews: 198,
      featured: false,
	  affiliateUrl: 'https://mercadolibre.com/tu-link-de-afiliado-aqui' // <--- �Ac� peg�s tu enlace de afiliado real!
    },
    {
      id: 'office-3',
      category: 'home-office',
      categoryName: 'Home Office',
      title: 'Barra de Luz Monitor LuminaScreen',
      shortDesc: 'Óptica asimétrica anti-reflejo en pantalla, sensor de luz ambiente inteligente y control dial inalámbrico de escritorio.',
      fullDesc: 'Protegé tu vista en horas de trabajo nocturno. Se monta directamente sobre cualquier monitor curvo o plano sin ocupar espacio en el escritorio, proyectando luz homogénea sin reflejos.',
      specs: [
        'Diseño óptico asimétrico que no refleja en la pantalla',
        'Puck dial inalámbrico rotatorio de 2.4GHz',
        'Temperatura de color ajustable de 2700K a 6500K',
        'Sensor frontal de auto-atenuación según la luz ambiente'
      ],
      originalPrice: 129000,
      salePrice: 79000,
      discount: 39,
      installments: '3 cuotas sin interés de $26.333',
      freeShipping: true,
      image: 'images/products/office-lightbar.svg',
      rating: 4.8,
      reviews: 310,
      featured: false,
	  affiliateUrl: 'https://mercadolibre.com/tu-link-de-afiliado-aqui' // <--- �Ac� peg�s tu enlace de afiliado real!
    },
    {
      id: 'office-4',
      category: 'home-office',
      categoryName: 'Home Office',
      title: 'Soporte Articulado de Aluminio Stratos',
      shortDesc: 'Aluminio mecanizado CNC de grado espacial con doble eje articulado, calados de ventilación y pads de silicona.',
      fullDesc: 'Elevá la pantalla de tu notebook a la altura ergonómica ideal de tus ojos. Resiste laptops de hasta 17 pulgadas con bisagras reforzadas de alta fricción que no ceden.',
      specs: [
        'Estructura de aleación de aluminio mecanizado CNC',
        'Bisagras dobles de alta tensión con capacidad de 10 kg',
        'Ventilación hexagonal para refrigeración pasiva de la notebook',
        'Protectores de silicona anti-deslizantes y anti-rayas'
      ],
      originalPrice: 89000,
      salePrice: 49000,
      discount: 45,
      installments: '3 cuotas sin interés de $16.333',
      freeShipping: true,
      image: 'images/products/office-laptop-stand.svg',
      rating: 4.7,
      reviews: 142,
      featured: false,
	  affiliateUrl: 'https://mercadolibre.com/tu-link-de-afiliado-aqui' // <--- �Ac� peg�s tu enlace de afiliado real!
    },
    {
      id: 'office-5',
      category: 'home-office',
      categoryName: 'Home Office',
      title: 'Desk Mat Minimalista Fieltro y Cuero',
      shortDesc: 'Superficie combinada de fieltro suave y cuero vegano impermeable (90x40cm) con organizador magnético de cables.',
      fullDesc: 'Transformá la estética de tu setup de trabajo. Base antideslizante con tratamiento hidrófugo ante derrames accidentales y soporte magnético imantado para cables de carga.',
      specs: [
        'Zona dual: fieltro de lana gris + cuero vegano suave',
        'Medidas amplias de 90cm x 40cm para teclado y mouse',
        'Nano-recubrimiento resistente a manchas y líquidos',
        'Incluye pasacables magnético de bronce anodizado'
      ],
      originalPrice: 60000,
      salePrice: 34000,
      discount: 43,
      installments: '3 cuotas sin interés de $11.333',
      freeShipping: true,
      image: 'images/products/office-deskmat.svg',
      rating: 4.8,
      reviews: 215,
      featured: false,
	  affiliateUrl: 'https://mercadolibre.com/tu-link-de-afiliado-aqui' // <--- �Ac� peg�s tu enlace de afiliado real!
    },

    // --- CAFÉ DE ESPECIALIDAD (5 Productos) ---
    {
      id: 'coffee-1',
      category: 'coffee',
      categoryName: 'Café',
      title: 'Cafetera Espresso BaristaCraft Touch',
      shortDesc: 'Bomba italiana de 15 bares, control térmico PID de alta precisión, pantalla táctil y lanceta de vapor profesional.',
      fullDesc: 'Llevá la experiencia de una cafetería de especialidad a tu casa. Elegí con un toque en la pantalla entre Espresso, Flat White, Capuccino o personalizá la receta de tu café favorito.',
      specs: [
        'Portafiltro comercial de acero inoxidable de 58mm',
        'Bomba italiana de 15 bares con pre-infusión suave',
        'Control digital de temperatura PID (estabilidad ±1°C)',
        'Lanceta de vapor profesional para microespuma sedosa'
      ],
      originalPrice: 799000,
      salePrice: 549000,
      discount: 31,
      installments: '12 cuotas sin interés de $45.750',
      freeShipping: true,
      image: 'images/products/coffee-espresso.svg',
      rating: 5.0,
      reviews: 178,
      featured: false,
	  affiliateUrl: 'https://mercadolibre.com/tu-link-de-afiliado-aqui' // <--- �Ac� peg�s tu enlace de afiliado real!
    },
    {
      id: 'coffee-2',
      category: 'coffee',
      categoryName: 'Café',
      title: 'Molinillo Cónico ApexGrind Gen-2',
      shortDesc: '31 niveles de molienda desde Espresso hasta Cold Brew con conducto antiestático de retención cero.',
      fullDesc: 'Consistencia de molienda insuperable que resalta las notas más sutiles del grano. Muelas planas de acero inoxidable de 64mm, ionizador estático y vaso receptor magnético.',
      specs: [
        'Muelas planas profesionales de 64mm de acero templado',
        '31 puntos de molienda con micro-ajuste gradual',
        'Sistema antiestático con retención casi nula (<0.1g)',
        'Vaso receptor con acople magnético de precisión'
      ],
      originalPrice: 240000,
      salePrice: 169000,
      discount: 30,
      installments: '6 cuotas sin interés de $28.166',
      freeShipping: true,
      image: 'images/products/coffee-grinder.svg',
      rating: 4.9,
      reviews: 240,
      featured: false,
	  affiliateUrl: 'https://mercadolibre.com/tu-link-de-afiliado-aqui' // <--- �Ac� peg�s tu enlace de afiliado real!
    },
    {
      id: 'coffee-3',
      category: 'coffee',
      categoryName: 'Café',
      title: 'Pava Cuello de Cisne StaggFlow',
      shortDesc: 'Capacidad de 1.0L con pico vertedor de flujo exacto, pantalla LCD digital y función de mantenimiento térmico 60 min.',
      fullDesc: 'La herramienta definitiva para los amantes del café filtrado. Su mango contrapesado ergonómico te da un control milimétrico del vertido, logrando extracciones perfectas.',
      specs: [
        'Pico vertedor cuello de cisne para caudal constante',
        'Base digital LCD con selector grado a grado (40° a 100°C)',
        'Función Hold: mantiene la temperatura exacta por 60 min',
        'Mango ergonómico con contrapeso de apoyo para el pulgar'
      ],
      originalPrice: 165000,
      salePrice: 115000,
      discount: 30,
      installments: '6 cuotas sin interés de $19.166',
      freeShipping: true,
      image: 'images/products/coffee-kettle.svg',
      rating: 4.9,
      reviews: 388,
      featured: false,
	  affiliateUrl: 'https://mercadolibre.com/tu-link-de-afiliado-aqui' // <--- �Ac� peg�s tu enlace de afiliado real!
    },
    {
      id: 'coffee-4',
      category: 'coffee',
      categoryName: 'Café',
      title: 'Cafetera de Vidrio PureDrip 8 Tazas',
      shortDesc: 'Jarra de vidrio borosilicato artesanal con collar de madera pulida aislante y lazo de cuero genuino.',
      fullDesc: 'Extracción limpia y cristalina que conserva todos los aceites esenciales del café. Vidrio resistente a choques térmicos que no absorbe olores ni deja residuos químicos.',
      specs: [
        'Capacidad para 8 tazas (1.2 Litros)',
        'Vidrio borosilicato de laboratorio ultra transparente',
        'Collar de madera natural pulida con lazo de cuero',
        'Compatible con filtros cónicos de papel y reutilizables'
      ],
      originalPrice: 65000,
      salePrice: 42000,
      discount: 35,
      installments: '3 cuotas sin interés de $14.000',
      freeShipping: true,
      image: 'images/products/coffee-pourover.svg',
      rating: 4.8,
      reviews: 195,
      featured: false,
	  affiliateUrl: 'https://mercadolibre.com/tu-link-de-afiliado-aqui' // <--- �Ac� peg�s tu enlace de afiliado real!
    },
    {
      id: 'coffee-5',
      category: 'coffee',
      categoryName: 'Café',
      title: 'Trío de Cafés Especiales Highland (3x250g)',
      shortDesc: 'Granos recién tostados en Argentina: Etiopía Yirgacheffe, Colombia Geisha y Sumatra Mandheling en bolsas con válvula desgasificadora.',
      fullDesc: 'Una selección de los orígenes más aclamados del mundo. Tostados semanalmente en lotes pequeños para garantizar máxima frescura, notas florales, frutales y a chocolate amargo.',
      specs: [
        'Trío: Etiopía Yirgacheffe, Colombia Geisha, Sumatra',
        'Granos 100% Arábica con puntaje SCA 86+',
        'Envases de 250g con válvula aromática y cierre zipper',
        'Notas de cata: Jazmín, Bergamota, Cacao Fino y Frutas de Carozo'
      ],
      originalPrice: 54000,
      salePrice: 36000,
      discount: 33,
      installments: '3 cuotas sin interés de $12.000',
      freeShipping: true,
      image: 'images/products/coffee-beans.svg',
      rating: 5.0,
      reviews: 422,
      featured: false,
	  affiliateUrl: 'https://mercadolibre.com/tu-link-de-afiliado-aqui' // <--- �Ac� peg�s tu enlace de afiliado real!
    }
  ];

  /* ==========================================================================
     2. ESTADO Y VARIABLES
     ========================================================================== */
  let currentCategory = 'all';
  let searchQuery = '';
  let currentSort = 'featured';
  let cart = [];

  // Helper de formato en Pesos Argentinos
  function formatARS(amount) {
    return '$' + amount.toLocaleString('es-AR');
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
      if (currentSort === 'discount') return b.discount - a.discount;
      if (currentSort === 'price-asc') return a.salePrice - b.salePrice;
      if (currentSort === 'price-desc') return b.salePrice - a.salePrice;
      if (currentSort === 'rating') return b.rating - a.rating;
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
            <span class="badge-discount">-${product.discount}%</span>
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
            <div class="badge-free-shipping">
              🚚 Envío Gratis
            </div>

            <span class="product-category-label">${product.categoryName}</span>
            <h3 class="product-title" onclick="window.openQuickView('${product.id}')">${product.title}</h3>
            
            <!-- Breve descripción (Requisito explícito) -->
            <p class="product-description">${product.shortDesc}</p>

            <div class="product-rating">
              <span class="stars">★★★★★</span>
              <span class="rating-num">${product.rating}</span>
              <span class="rating-count">(${product.reviews})</span>
            </div>

            <div class="product-price-box">
              <span class="product-price-old">${formatARS(product.originalPrice)}</span>
              <span class="product-price-current">${formatARS(product.salePrice)}</span>
            </div>

            <!-- Cantidad de cuotas disponibles para pago con tarjeta -->
            <div class="product-installments">
              💳 <span>${product.installments}</span>
            </div>

            <!-- Botón COMPRAR AHORA (#315CF5 como fue solicitado) -->
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

    // Listener de botones Comprar Ahora
    productsGrid.querySelectorAll('.btn-buy-product').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-product-id');
        const product = products.find(p => p.id === id);
        
        if (product && product.affiliateUrl) {
          // Abre la oferta en una pesta�a nueva con seguridad de afiliados
          window.open(product.affiliateUrl, '_blank', 'noopener,noreferrer');
        } else {
          alert('Pronto habilitaremos el enlace directo para este producto.');
        }
      });
    });
  }

  /* ==========================================================================
     4. CONTROL DE PESTAÑAS Y ENCABEZADOS DE CATEGORÍA
     ========================================================================== */
  const categoryMeta = {
    all: {
      title: 'Todas las Ofertas Hot Sale',
      desc: 'Explorá el catálogo completo con 15 productos destacados en Tecnología, Home Office y Café con cuotas sin interés y envío gratis a todo el país.'
    },
    technology: {
      title: 'Tecnología Hot Sale',
      desc: 'Auriculares inalámbricos con cancelación activa de ruido, smartwatches de titanio, visores VR 4K, parlantes inteligentes y smartphones premium.'
    },
    'home-office': {
      title: 'Home Office y Escritorios Hot Sale',
      desc: 'Sillas ergonómicas de alta densidad, escritorios elevables de doble motor, barras de luz antifatiga visual, soportes de aluminio y desk mats.'
    },
    coffee: {
      title: 'Café de Especialidad Hot Sale',
      desc: 'Cafeteras espresso comerciales con pantalla táctil, molinillos cónicos con retención cero, pavas cuello de cisne y granos de origen único.'
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
     6. CONTADOR EN TIEMPO REAL
     ========================================================================== */
  const daysEl = document.getElementById('timerDays');
  const hoursEl = document.getElementById('timerHours');
  const minutesEl = document.getElementById('timerMinutes');
  const secondsEl = document.getElementById('timerSeconds');

  let countdownTarget = localStorage.getItem('worthit_hotsale_end');
  if (!countdownTarget) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 9);
    targetDate.setHours(targetDate.getHours() + 14);
    targetDate.setMinutes(targetDate.getMinutes() + 38);
    targetDate.setSeconds(targetDate.getSeconds() + 50);
    countdownTarget = targetDate.getTime();
    localStorage.setItem('worthit_hotsale_end', countdownTarget);
  } else {
    countdownTarget = parseInt(countdownTarget, 10);
  }

  function updateCountdown() {
    const now = new Date().getTime();
    let distance = countdownTarget - now;

    if (distance <= 0) {
      distance = 9 * 86400000 + 14 * 3600000;
    }

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
     7. CARRITO DE COMPRAS CON CUOTAS Y ENVÍO GRATIS
     ========================================================================== */
  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        ...product,
        quantity: 1
      });
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
    const originalTotal = cart.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    const finalTotal = cart.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
    const savings = originalTotal - finalTotal;

    if (cartCountBadge) cartCountBadge.textContent = totalItems;
    if (cartItemsCountLabel) cartItemsCountLabel.textContent = `${totalItems} producto${totalItems === 1 ? '' : 's'}`;

    if (cart.length === 0) {
      cartDrawerBody.innerHTML = `
        <div class="cart-empty-state">
          <svg class="icon-lg text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          <h4>Tu carrito está vacío</h4>
          <p>¡Aprovechá las 15 ofertas del Hot Sale antes de que se agoten!</p>
          <a href="#deals" class="btn btn-primary btn-sm" id="cartStartShoppingBtn">Explorar Ofertas</a>
        </div>
      `;
      const btn = document.getElementById('cartStartShoppingBtn');
      if (btn) btn.addEventListener('click', closeCart);
      if (cartDrawerFooter) cartDrawerFooter.style.display = 'none';
      return;
    }

    if (cartDrawerFooter) cartDrawerFooter.style.display = 'flex';
    if (cartOriginalTotal) cartOriginalTotal.textContent = formatARS(originalTotal);
    if (cartSavingsTotal) cartSavingsTotal.textContent = '-' + formatARS(savings);
    if (cartFinalTotal) cartFinalTotal.textContent = formatARS(finalTotal);

    cartDrawerBody.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-img">
          <img src="${item.image}" alt="${item.title}">
        </div>
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.title}</h4>
          <span class="cart-item-price">${formatARS(item.salePrice)} <small style="color: #6a7d93; text-decoration: line-through;">${formatARS(item.originalPrice)}</small></span>
          <div style="font-size: 0.72rem; color: var(--color-accent); font-weight: 700;">💳 ${item.installments}</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="window.cartChangeQty('${item.id}', -1)" aria-label="Restar una unidad">-</button>
            <span class="qty-val">${item.quantity}</span>
            <button class="qty-btn" onclick="window.cartChangeQty('${item.id}', 1)" aria-label="Sumar una unidad">+</button>
          </div>
        </div>
        <button class="cart-item-remove" onclick="window.cartRemove('${item.id}')" title="Eliminar del carrito">&times;</button>
      </div>
    `).join('');
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

  // Botón compra en banner destacado
  /*const spotlightBuyBtn = document.querySelector('.btn-buy-spotlight');
  if (spotlightBuyBtn) {
    spotlightBuyBtn.addEventListener('click', () => {
      const pid = spotlightBuyBtn.getAttribute('data-product-id') || 'tech-4';
      addToCart(pid);
      openCart();
    });
  }*/

  // Checkout
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (cart.length === 0) return;
      alert(`🎉 ¡Compra iniciada en WorthIT Hot Sale!\n\nTotal a abonar: ${cartFinalTotal.textContent}\n¡Envío Gratis a todo el país incluido!\nCupón de descuento HOTSALE2026 aplicado.\n\nNos pondremos en contacto contigo.`);
      cart = [];
      updateCartUI();
      closeCart();
    });
  }

  /* ==========================================================================
     8. MODAL DE VISTA RÁPIDA (CON CUOTAS Y ENVÍO GRATIS)
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
          <div class="badge-free-shipping">
            🚚 Envío Gratis a todo el país
          </div>
          <span class="modal-tag">${product.categoryName} • OFERTA HOT SALE</span>
          <h2 class="modal-title">${product.title}</h2>
          <p class="modal-desc">${product.fullDesc}</p>

          <ul class="modal-specs-list">
            ${product.specs.map(spec => `<li>${spec}</li>`).join('')}
          </ul>

          <div class="modal-price-row">
            <span class="modal-old-price">${formatARS(product.originalPrice)}</span>
            <span class="modal-sale-price">${formatARS(product.salePrice)}</span>
            <span class="badge-discount">AHORRÁS ${product.discount}%</span>
          </div>

          <div class="product-installments" style="margin-bottom: 16px;">
            💳 <strong>${product.installments}</strong> con tarjetas bancarias
          </div>

          <div style="display: flex; gap: 12px; margin-top: 14px;">
            <a href="${product.affiliateUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-block btn-lg" style="text-decoration: none;">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              <span>Ver Oferta Oficial � ${formatARS(product.salePrice)}</span>
            </a>
          </div>
        </div>
      </div>
    `;

    document.getElementById('modalBuyBtn').addEventListener('click', () => {
      addToCart(product.id);
      closeQuickView();
      openCart();
    });

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
     10. FORMULARIO NEWSLETTER / VIP
     ========================================================================== */
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const email = input.value.trim();
      if (!email) return;

      showToast(`🎉 ¡Bienvenido al Club VIP! Tu cupón de $20.000 es: <strong>HOTSALE2026</strong>`);
      input.value = '';
    });
  }

  /* ==========================================================================
     11. MENÚ MÓVIL
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
     15. INICIALIZACIÓN
     ========================================================================== */
  renderProducts(); 
});
