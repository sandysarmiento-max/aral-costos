// Identidad de marca Costalia para Aral Costos V2.
// Mantiene las claves de almacenamiento existentes para no perder datos.

(function () {
  const NOMBRE_APP = 'Costalia';
  const SUBTITULO = 'Costos y precios para tu negocio';

  document.title = NOMBRE_APP;

  const metaApp = document.querySelector('meta[name="application-name"]');
  if (metaApp) metaApp.setAttribute('content', NOMBRE_APP);

  const metaApple = document.querySelector('meta[name="apple-mobile-web-app-title"]');
  if (metaApple) metaApple.setAttribute('content', NOMBRE_APP);

  const logo = document.querySelector('.logo-text');
  if (logo) {
    logo.textContent = NOMBRE_APP;
  }

  const tagline = document.querySelector('.tagline');
  if (tagline) {
    tagline.textContent = SUBTITULO;
  }

  document.querySelectorAll('.section-title').forEach(el => {
    const texto = el.textContent.trim();
    if (/Precio\s+Sugerido\s+Aral/i.test(texto)) {
      Array.from(el.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          node.textContent = node.textContent.replace(/Precio\s+Sugerido\s+Aral/i, 'Precio sugerido');
        }
      });
    }
  });

  document.querySelectorAll('button').forEach(btn => {
    if (/Traer de mi Despensa Aral/i.test(btn.textContent)) {
      btn.textContent = '+ Agregar material';
    }
  });

  // Mantiene todos los datos del respaldo, incluida la extensión de Productos,
  // pero cambia solo la identidad visible del archivo nuevo.
  if (typeof obtenerDatosRespaldo === 'function') {
    const obtenerDatosRespaldoAnterior = obtenerDatosRespaldo;
    obtenerDatosRespaldo = function obtenerDatosRespaldoCostalia() {
      const datos = obtenerDatosRespaldoAnterior();
      return {
        ...datos,
        app: NOMBRE_APP
      };
    };
  }

  if (typeof exportarRespaldo === 'function') {
    exportarRespaldo = function exportarRespaldoCostalia() {
      guardarDatosLocales();
      const fecha = new Date().toISOString().slice(0, 10);
      const datos = obtenerDatosRespaldo();
      const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `costalia-respaldo-${fecha}.json`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      showToast('Respaldo descargado. Guárdalo en Drive, correo o WhatsApp para poder recuperarlo si cambias de celular.');
    };
  }
})();
