// Costalia UI consolidada.
// Reúne ajustes de proyecto, tarjetas, UI profesional, interacción móvil e identidad visual.
// Cargar después de v2-products.js, v2-inventory-edit.js y v2-material-quantity.js.

// --- Limpiar proyecto ---
(function () {
  const lista = document.getElementById('listaMaterialesProducto');
  const materialesCard = lista?.closest('.card');
  if (!materialesCard || !lista) return;

  const style = document.createElement('style');
  style.textContent = `
    .limpiar-proyecto-wrap { margin:0 0 8px; display:flex; justify-content:flex-end; }
    .btn-limpiar-proyecto {
      border:none; background:transparent; color:var(--texto-secundario);
      font-size:.74rem; font-weight:500; padding:5px 8px; cursor:pointer; border-radius:8px;
    }
    .btn-limpiar-proyecto:hover { background:var(--bg-principal); color:var(--texto-principal); }
    #listaMaterialesProducto.materiales-vacio { display:none !important; border:none !important; margin:0 !important; }
  `;
  document.head.appendChild(style);

  const titulo = materialesCard.querySelector('.section-title');
  if (titulo) titulo.textContent = 'Elegir material de despensa';

  const botonAgregar = Array.from(materialesCard.querySelectorAll('button'))
    .find(btn => btn.textContent.includes('Agregar material') || btn.textContent.includes('Traer de mi Despensa'));

  if (!document.getElementById('btnLimpiarProyecto')) {
    const wrap = document.createElement('div');
    wrap.className = 'limpiar-proyecto-wrap';
    wrap.innerHTML = '<button type="button" class="btn-limpiar-proyecto" id="btnLimpiarProyecto">Limpiar proyecto</button>';
    if (botonAgregar) materialesCard.insertBefore(wrap, botonAgregar);
    else materialesCard.insertBefore(wrap, lista);
  }

  function actualizarEstadoLista() {
    const sinMateriales = !Array.isArray(materialesDelProductoActual) || materialesDelProductoActual.length === 0;
    lista.classList.toggle('materiales-vacio', sinMateriales);
    if (sinMateriales) lista.innerHTML = '';
  }

  const observer = new MutationObserver(actualizarEstadoLista);
  observer.observe(lista, { childList:true, subtree:true });

  function limpiarCalculoActual() {
    if (Array.isArray(materialesDelProductoActual)) materialesDelProductoActual.splice(0, materialesDelProductoActual.length);
    if (Array.isArray(empaquesProducto)) empaquesProducto.splice(0, empaquesProducto.length);
    const btnSalirEdicion = document.getElementById('salirEdicionProducto');
    if (btnSalirEdicion) btnSalirEdicion.click();
    if (typeof renderizarMaterialesProducto === 'function') renderizarMaterialesProducto();
    actualizarEstadoLista();
    if (typeof renderizarEmpaques === 'function') renderizarEmpaques();
    if (typeof calcularPrecio === 'function') calcularPrecio();
    if (typeof guardarDatosLocales === 'function') guardarDatosLocales();
    const main = document.getElementById('tab-costear');
    if (main) main.scrollTop = 0;
    if (typeof showToast === 'function') showToast('Proyecto limpiado.');
  }

  document.getElementById('btnLimpiarProyecto')?.addEventListener('click', limpiarCalculoActual);
  actualizarEstadoLista();
})();

// --- Tarjetas de Productos ---
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .producto-card > div:last-child {
      display:grid; grid-template-columns:minmax(0,1fr);
      grid-template-areas:"nombre" "precio" "meta" "acciones";
      row-gap:3px; align-items:center; min-width:0;
    }
    .producto-card h3 {
      grid-area:nombre; margin:0 0 1px !important; font-weight:500 !important;
      font-size:.9rem !important; letter-spacing:-.1px;
    }
    .producto-card .producto-precio {
      grid-area:precio; margin:0 !important; align-self:center; font-weight:650 !important;
      color:#2F6F73 !important; font-size:.96rem !important;
    }
    body[data-aral-style="neutral"] .producto-card .producto-precio { color:#315B55 !important; }
    .producto-card .producto-actions {
      grid-area:acciones; margin:4px 0 0 !important; display:flex; gap:5px; flex-wrap:wrap;
    }
    .producto-card .producto-meta { grid-area:meta; margin:1px 0 0 !important; font-weight:400 !important; }
    .producto-card { padding:8px 9px !important; gap:9px !important; align-items:center; }
    .producto-foto, .producto-foto-placeholder { width:62px !important; height:62px !important; }
    .producto-actions button {
      width:auto !important; min-width:0 !important; height:30px !important; padding:0 7px !important;
      border-radius:7px !important; font-size:.68rem !important; display:inline-flex !important;
      align-items:center; justify-content:center; gap:3px; white-space:nowrap; font-weight:500;
    }
    @media (max-width:380px) {
      .producto-actions button { padding:0 6px !important; font-size:.65rem !important; }
    }
  `;
  document.head.appendChild(style);
})();

// --- UI profesional ---
(function () {
  const style = document.createElement('style');
  style.textContent = `
    :root { --ui-radius:12px; --ui-line:#E8E5DF; --ui-soft:#F7F6F3; --ui-ink:#263238; --ui-muted:#778087; }
    * { -webkit-tap-highlight-color:transparent; }
    body { background:#E9E6E1; color:var(--texto-principal); }
    .phone-container { border-radius:20px; box-shadow:0 8px 28px rgba(42,48,52,.10); }
    header { padding:10px 16px; min-height:58px; }
    .logo-text { font-size:1.2rem; letter-spacing:-.5px; font-weight:650; }
    .tagline { font-size:.68rem; margin-top:1px; font-weight:400; }
    main { padding:10px 12px 82px; }
    .card { border-radius:13px; padding:14px; margin-bottom:10px; border:1px solid var(--borde); box-shadow:0 1px 2px rgba(30,40,45,.025); }
    .section-title { font-size:.94rem; font-weight:600; margin-bottom:10px; letter-spacing:-.1px; }
    label { font-size:.74rem; font-weight:500; margin-bottom:4px; }
    input, select { min-height:36px; padding:7px 10px; border-radius:9px; font-size:.84rem; font-weight:400; border-color:var(--borde); }
    .input-group { margin-bottom:9px; }
    .flex-inputs { gap:7px; }
    .btn-main { min-height:40px; padding:9px 12px; border-radius:10px; font-size:.85rem; font-weight:600; box-shadow:none; }
    .btn-secondary { background:var(--acento-lavanda); }
    .backup-note { font-size:.74rem; line-height:1.35; margin-bottom:9px; font-weight:400; }
    .bottom-nav { height:64px; }
    .nav-item { font-size:.66rem; font-weight:400; gap:1px; }
    .nav-item.active { font-weight:600; }
    .nav-item span { font-size:1.05rem; margin-bottom:1px; }
    .result-box { padding:12px; border-radius:11px; }
    .result-box .price { font-size:1.5rem; font-weight:700; letter-spacing:-.35px; }
    .desglose-texto { font-size:.74rem; line-height:1.45; margin-top:8px; font-weight:400; }
    #listaMaterialesProducto { margin-top:2px; border:1px solid var(--borde); border-radius:11px; overflow:hidden; background:var(--bg-tarjeta); }
    .mat-head {
      display:grid; grid-template-columns:minmax(0,1fr) 82px 62px 26px; gap:6px; align-items:center;
      padding:7px 8px; background:var(--bg-principal); border-bottom:1px solid var(--borde);
      color:var(--texto-secundario); font-size:.63rem; font-weight:600; text-transform:uppercase; letter-spacing:.22px;
    }
    .mat-row {
      display:grid; grid-template-columns:minmax(0,1fr) 82px 62px 26px; gap:6px; align-items:center;
      min-height:50px; padding:6px 8px; border-bottom:1px solid var(--borde); background:var(--bg-tarjeta);
    }
    .mat-row:last-child { border-bottom:none; }
    .mat-name { min-width:0; font-size:.77rem; font-weight:500; line-height:1.18; color:var(--texto-principal); overflow:hidden; text-overflow:ellipsis; }
    .mat-unit-cost { margin-top:3px; font-size:.62rem; color:var(--texto-secundario); font-weight:400; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .mat-qty { display:flex; align-items:center; justify-content:flex-end; gap:4px; min-width:0; }
    .mat-qty input {
      width:50px !important; min-height:30px !important; height:30px; padding:3px 5px !important;
      border-radius:7px !important; font-size:.74rem !important; font-weight:400 !important;
      text-align:right; background:var(--bg-principal);
    }
    .mat-qty span { font-size:.65rem; font-weight:400; color:var(--texto-secundario); white-space:nowrap; max-width:28px; overflow:hidden; text-overflow:ellipsis; }
    .mat-cost { text-align:right; font-size:.77rem; font-weight:650; white-space:nowrap; }
    .mat-delete { width:26px; height:26px; border:none; background:transparent; color:#D35A63; font-size:1rem; cursor:pointer; padding:0; line-height:1; }
    .mat-empty { padding:14px 10px; font-size:.74rem; font-weight:400; color:var(--texto-secundario); text-align:center; }
    #tab-costear .card:first-child { padding:9px 12px !important; border-radius:11px; margin-bottom:10px; }
    #tab-costear .card:first-child label { font-size:.71rem; font-weight:500; }
    #tab-costear .card:first-child select { min-height:34px; padding:5px 8px !important; }
    #listaEmpaques .dynamic-row, #listaGastosMensuales .dynamic-row { margin:6px 0; gap:6px; }
    #listaDespensaGlobal .item-row b { font-weight:600; }
    #listaDespensaGlobal .item-row small { font-weight:400; font-size:.7rem; }
    @media (max-width:380px) {
      .mat-head, .mat-row { grid-template-columns:minmax(0,1fr) 76px 55px 24px; gap:4px; }
      .mat-qty input { width:46px !important; }
      .card { padding:12px; }
      main { padding-left:9px; padding-right:9px; }
    }
  `;
  document.head.appendChild(style);

  function escapar(valor) {
    return typeof escaparHtml === 'function' ? escaparHtml(valor) : String(valor ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function textoUnidad(unidad) {
    const u = String(unidad || 'unidad');
    return u.startsWith('otro:') ? u.slice(5) : u;
  }
  function simbolo() {
    return document.getElementById('currency')?.selectedOptions?.[0]?.dataset?.symbol || 'S/.';
  }

  renderizarMaterialesProducto = function renderizarMaterialesProductoPro() {
    const contenedor = document.getElementById('listaMaterialesProducto');
    if (!contenedor) return;
    const sym = simbolo();
    if (!materialesDelProductoActual.length) {
      contenedor.innerHTML = '<div class="mat-empty">Selecciona materiales de tu despensa para empezar.</div>';
      return;
    }
    contenedor.innerHTML = `
      <div class="mat-head">
        <span>Material</span><span style="text-align:right;">Cantidad</span><span style="text-align:right;">Costo</span><span></span>
      </div>
      ${materialesDelProductoActual.map((item, i) => {
        const cantidad = Number(item.cantidadUsada) || 0;
        const costo = Number(item.costoFinalCalculado) || 0;
        const costoUnidad = cantidad > 0 ? costo / cantidad : 0;
        const unidad = textoUnidad(item.unidadUsada);
        return `
          <div class="mat-row">
            <div style="min-width:0;">
              <div class="mat-name">${escapar(item.nombre)}</div>
              <div class="mat-unit-cost">${sym} ${costoUnidad.toFixed(4)} / ${escapar(unidad)}</div>
            </div>
            <div class="mat-qty">
              <input type="number" min="0.0001" step="any" value="${cantidad}" aria-label="Cantidad usada de ${escapar(item.nombre)}" data-material-cantidad="${i}">
              <span title="${escapar(unidad)}">${escapar(unidad)}</span>
            </div>
            <div class="mat-cost">${costo.toFixed(2)}</div>
            <button class="mat-delete" onclick="eliminarMaterialProducto(${i})" aria-label="Eliminar ${escapar(item.nombre)}">×</button>
          </div>
        `;
      }).join('')}
    `;
  };

  const botonDespensa = Array.from(document.querySelectorAll('#tab-costear .btn-main')).find(btn => btn.textContent.includes('Traer de mi Despensa'));
  if (botonDespensa) {
    botonDespensa.textContent = '+ Agregar material';
    botonDespensa.style.marginBottom = '10px';
  }

  document.querySelectorAll('.section-title').forEach(el => {
    Array.from(el.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) node.textContent = node.textContent.replace(/^\s*[\u{1F300}-\u{1FAFF}\u2600-\u27BF]+\s*/u, '');
    });
  });

  renderizarMaterialesProducto();
})();

// --- Interacción móvil y acciones consistentes ---
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .despensa-actions-v2 .btn-delete, .mat-delete, #listaCargosVenta .btn-delete,
    #listaEmpaques .btn-delete, #listaGastosMensuales .btn-delete {
      font-size:.78rem !important; line-height:1 !important; color:#D35A63 !important;
      display:grid !important; place-items:center !important;
    }
    .mat-head, .mat-row { grid-template-columns:minmax(0,1fr) 116px 58px 26px !important; }
    .mat-qty { gap:3px !important; }
    .mat-step-btn {
      width:27px; height:30px; min-width:27px; border:1px solid var(--borde); border-radius:7px;
      background:var(--bg-principal); color:var(--texto-principal); font-size:.9rem; font-weight:500;
      line-height:1; padding:0; display:grid; place-items:center; cursor:pointer; touch-action:manipulation;
    }
    .mat-qty input { width:42px !important; min-width:42px !important; }
    .producto-action-icon { font-size:.78rem; line-height:1; }
    @media (max-width:380px) {
      .mat-head, .mat-row { grid-template-columns:minmax(0,1fr) 108px 54px 24px !important; }
      .mat-step-btn { width:25px; min-width:25px; }
      .mat-qty input { width:38px !important; min-width:38px !important; }
    }
  `;
  document.head.appendChild(style);

  function aplicarPapeleras(root = document) {
    root.querySelectorAll('.despensa-actions-v2 .btn-delete, .mat-delete, #listaCargosVenta .btn-delete, #listaEmpaques .btn-delete, #listaGastosMensuales .btn-delete').forEach(btn => {
      if (btn.textContent.trim() !== '🗑️') btn.textContent = '🗑️';
      btn.title = 'Eliminar';
      btn.setAttribute('aria-label', btn.getAttribute('aria-label') || 'Eliminar');
    });
  }

  function mejorarCantidades(root = document) {
    root.querySelectorAll('.mat-qty').forEach(wrap => {
      if (wrap.dataset.mobileReady === '1') return;
      const input = wrap.querySelector('[data-material-cantidad]');
      if (!input) return;
      const menos = document.createElement('button');
      menos.type = 'button'; menos.className = 'mat-step-btn'; menos.textContent = '−'; menos.setAttribute('aria-label', 'Disminuir cantidad');
      const mas = document.createElement('button');
      mas.type = 'button'; mas.className = 'mat-step-btn'; mas.textContent = '+'; mas.setAttribute('aria-label', 'Aumentar cantidad');
      menos.addEventListener('click', () => cambiarCantidad(input, -1));
      mas.addEventListener('click', () => cambiarCantidad(input, 1));
      wrap.insertBefore(menos, input);
      input.insertAdjacentElement('afterend', mas);
      wrap.dataset.mobileReady = '1';
    });
  }

  function pasoPara(input) {
    const valor = Number(input.value) || 0;
    if (valor < 1) return 0.1;
    if (!Number.isInteger(valor)) return 0.1;
    return 1;
  }
  function cambiarCantidad(input, direccion) {
    const actual = Number(input.value) || 0;
    const paso = pasoPara(input);
    const siguiente = Math.max(paso, actual + (direccion * paso));
    input.value = Number(siguiente.toFixed(4));
    input.dispatchEvent(new Event('change', { bubbles:true }));
  }

  function etiquetarAccionesProductos(root = document) {
    const textos = { edit:['✏️','Editar'], duplicate:['⧉','Duplicar'], delete:['🗑️','Eliminar'] };
    root.querySelectorAll('.producto-actions button[data-action]').forEach(btn => {
      const config = textos[btn.dataset.action];
      if (!config) return;
      const [icono, texto] = config;
      btn.innerHTML = `<span class="producto-action-icon" aria-hidden="true">${icono}</span><span>${texto}</span>`;
      btn.title = texto;
    });
  }

  function aplicarTodo(root = document) {
    aplicarPapeleras(root);
    mejorarCantidades(root);
    etiquetarAccionesProductos(root);
  }

  aplicarTodo();
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) aplicarTodo(node);
    }));
  });
  observer.observe(document.body, { childList:true, subtree:true });
})();

// --- Identidad Costalia ---
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

  document.querySelectorAll('link[rel="icon"]').forEach(el => el.remove());
  const favicon = document.createElement('link');
  favicon.rel = 'icon'; favicon.type = 'image/svg+xml'; favicon.href = './costalia-icon.svg';
  document.head.appendChild(favicon);

  const logo = document.querySelector('.logo-text');
  if (logo) logo.textContent = NOMBRE_APP;
  const tagline = document.querySelector('.tagline');
  if (tagline) tagline.textContent = SUBTITULO;

  const headerLeft = document.querySelector('.header-left');
  if (headerLeft && logo && tagline && !headerLeft.querySelector('.costalia-brand-mark')) {
    const style = document.createElement('style');
    style.textContent = `
      .header-left.costalia-brand { flex-direction:row; align-items:center; gap:8px; }
      .costalia-brand-mark { width:34px; height:34px; flex:0 0 34px; display:block; }
      .costalia-brand-copy { display:flex; flex-direction:column; align-items:flex-start; min-width:0; line-height:1; }
      .costalia-brand .logo-text { font-size:1.05rem !important; font-weight:600 !important; letter-spacing:-.25px !important; color:#1F4E4E !important; }
      .costalia-brand .tagline { font-size:.62rem !important; font-weight:400 !important; margin-top:3px !important; color:var(--texto-secundario) !important; white-space:nowrap; }
      @media (max-width:360px) {
        .costalia-brand-mark { width:31px; height:31px; flex-basis:31px; }
        .costalia-brand .tagline { font-size:.59rem !important; }
      }
    `;
    document.head.appendChild(style);
    const mark = document.createElement('img');
    mark.className = 'costalia-brand-mark'; mark.src = './costalia-mark.svg'; mark.alt = ''; mark.setAttribute('aria-hidden', 'true');
    const copy = document.createElement('div');
    copy.className = 'costalia-brand-copy';
    headerLeft.classList.add('costalia-brand');
    headerLeft.insertBefore(mark, headerLeft.firstChild);
    copy.appendChild(logo); copy.appendChild(tagline); headerLeft.appendChild(copy);
  }

  document.querySelectorAll('.section-title').forEach(el => {
    const texto = el.textContent.trim();
    if (/Precio\s+Sugerido\s+Aral/i.test(texto)) {
      Array.from(el.childNodes).forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) node.textContent = node.textContent.replace(/Precio\s+Sugerido\s+Aral/i, 'Precio sugerido');
      });
    }
  });

  document.querySelectorAll('button').forEach(btn => {
    if (/Traer de mi Despensa Aral/i.test(btn.textContent)) btn.textContent = '+ Agregar material';
  });

  if (typeof obtenerDatosRespaldo === 'function') {
    const obtenerDatosRespaldoAnterior = obtenerDatosRespaldo;
    obtenerDatosRespaldo = function obtenerDatosRespaldoCostalia() {
      return { ...obtenerDatosRespaldoAnterior(), app:NOMBRE_APP };
    };
  }

  if (typeof exportarRespaldo === 'function') {
    exportarRespaldo = function exportarRespaldoCostalia() {
      guardarDatosLocales();
      const fecha = new Date().toISOString().slice(0, 10);
      const datos = obtenerDatosRespaldo();
      const blob = new Blob([JSON.stringify(datos, null, 2)], { type:'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `costalia-respaldo-${fecha}.json`;
      document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
      showToast('Respaldo descargado. Guárdalo en Drive, correo o WhatsApp para poder recuperarlo si cambias de celular.');
    };
  }
})();
