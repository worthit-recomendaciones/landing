# WorthIT — versión estática

## Publicación
Sitio estático sin CMS, backend, carrito ni dependencia de Netlify. Se sirve desde GitHub Pages o cualquier hosting estático.

## Activar GitHub Pages
En GitHub: **Settings → Pages → Build and deployment → Deploy from a branch**. Elegir la rama `production/manual-static` y la carpeta `/(root)`, y guardar. El dominio personalizado se configura en ese mismo panel cuando se confirme el dominio principal; no se incluye un archivo `CNAME` porque el dominio exacto no está disponible en los archivos de este proyecto.

## Archivos principales
- `index.html`: estructura y textos generales.
- `styles.css`: diseño visual y responsive.
- `script.js`: catálogo manual, filtros, búsqueda, orden y fecha de campaña.
- `images/products/`: imágenes locales de productos.
- `logo-worthit.svg`: identidad visual.

## Cómo agregar o editar un producto
Editar el arreglo `products` al comienzo de `script.js`. Cada objeto incluye `id`, `category`, `categoryName`, `title`, `shortDesc`, `fullDesc`, `specs`, `originalPrice`, `salePrice`, `discount`, `installments`, `freeShipping`, `image`, `featured` y `affiliateUrl`.

1. Duplicar un objeto existente y asignar un `id` único.
2. Usar `technology`, `home-office` o `coffee` como categoría.
3. Guardar la imagen en `images/products/` y escribir la ruta exacta en `image`.
4. Pegar únicamente un enlace de afiliado verificado en `affiliateUrl`. Si se deja vacío, el botón abre una búsqueda normal de Mercado Libre (sin atribución de afiliado).
5. Verificar precio, disponibilidad, envío, cuotas y cualquier especificación en la publicación del vendedor antes de publicar.

## Cuenta regresiva
Cambiar `PROMO_END_DATE` en `script.js` usando formato ISO con zona horaria, por ejemplo `2026-11-30T23:59:59-03:00`. Al llegar a cero no se reinicia sola.

## Antes de cada publicación
- Comprobar todos los enlaces de afiliado.
- Comprobar que cada imagen exista y corresponda al producto.
- Verificar precios, cuotas, envío y afirmaciones comerciales.
- Probar filtros, búsqueda, vista rápida, WhatsApp y navegación móvil.

La versión no utiliza carrito ni procesa pagos: el usuario compra directamente en Mercado Libre.
