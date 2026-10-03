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

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute('content', '#1F4E4E');

  // Usa el nuevo símbolo de Costalia también como favicon sin tocar index.html.
  document.querySelectorAll('link[rel="icon"]').forEach(el => el.remove());
  const favicon = document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/svg+xml';
  favicon.href = './costalia-icon.svg';
  document.head.appendChild(favicon);

  const logo = document.querySelector('.logo-text');
  if (logo) logo.textContent = NOMBRE_APP;

  const tagline = document.querySelector('.tagline');
  if (tagline) tagline.textContent = SUBTITULO;

  // Marca visual en el encabezado: símbolo con mayor protagonismo y texto compacto.
  const headerLeft = document.querySelector('.header-left');
  if (headerLeft && logo && tagline && !headerLeft.querySelector('.costalia-brand-mark')) {
    const style = document.createElement('style');
    style.textContent = `
      .header-left.costalia-brand {
        flex-direction:row;
        align-items:center;
        gap:8px;
      }
      .costalia-brand-mark {
        width:34px;
        height:34px;
        flex:0 0 34px;
        display:block;
      }
      .costalia-brand-copy {
        display:flex;
        flex-direction:column;
        align-items:flex-start;
        min-width:0;
        line-height:1;
      }
      .costalia-brand .logo-text {
        font-size:1.05rem !important;
        font-weight:600 !important;
        letter-spacing:-.25px !important;
        color:#1F4E4E !important;
      }
      .costalia-brand .tagline {
        font-size:.62rem !important;
        font-weight:400 !important;
        margin-top:3px !important;
        color:var(--texto-secundario) !important;
        white-space:nowrap;
      }
      @media (max-width:360px) {
        .costalia-brand-mark {
          width:31px;
          height:31px;
          flex-basis:31px;
        }
        .costalia-brand .tagline { font-size:.59rem !important; }
      }
    `;
    document.head.appendChild(style);

    const mark = document.createElement('img');
    mark.className = 'costalia-brand-mark';
    mark.src = './costalia-mark.svg';
    mark.alt = '';
    mark.setAttribute('aria-hidden', 'true');

    const copy = document.createElement('div');
    copy.className = 'costalia-brand-copy';

    headerLeft.classList.add('costalia-brand');
    headerLeft.insertBefore(mark, headerLeft.firstChild);
    copy.appendChild(logo);
    copy.appendChild(tagline);
    headerLeft.appendChild(copy);
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
