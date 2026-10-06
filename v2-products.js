// Productos guardados para Costalia.
// Se carga después de v2-tools.js.

(function () {
  const phone = document.querySelector('.phone-container');
  const nav = document.querySelector('.bottom-nav');
  const tabCostear = document.getElementById('tab-costear');
  const resultadoCard = document.getElementById('precioFinal')?.closest('.card');
  if (!phone || !nav || !tabCostear || !resultadoCard) return;

  let productos = [];
  let productoEnEdicionId = null;
  let productoPendienteEliminarId = null;
  let fotoTemporal = '';

  function numero(valor, respaldo = 0) {
    const n = parseFloat(valor);
    return Number.isFinite(n) ? n : respaldo;
  }

  function escapar(valor) {
    return typeof escaparHtml === 'function'
      ? escaparHtml(valor)
      : String(valor ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function clonar(valor) {
    return JSON.parse(JSON.stringify(valor));
  }

  function idNuevo() {
    return `prod_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  function simboloPorIndice(indice) {
    const select = document.getElementById('currency');
    const option = select?.options?.[Math.min(Math.max(numero(indice, 0), 0), Math.max((select?.options?.length || 1) - 1, 0))];
    return option?.dataset?.symbol || 'S/.';
  }

  function nombreClave(valor) {
    return String(valor || '').trim().toLowerCase();
  }

  function insumoActual(material) {
    if (!Array.isArray(despensaGlobal) || !material) return null;
    const id = String(material.insumoId || '');
    if (id) {
      const porId = despensaGlobal.find(x => String(x.id || '') === id);
      if (porId) return porId;
    }
    const clave = nombreClave(material.nombre);
    return clave ? despensaGlobal.find(x => nombreClave(x.nombre) === clave) || null : null;
  }

  function materialParaGuardar(item) {
    const insumo = insumoActual(item);
    const copia = {
      insumoId: String(insumo?.id || item.insumoId || ''),
      nombre: String(insumo?.nombre || item.nombre || '').trim(),
      cantidadUsada: numero(item.cantidadUsada, 0),
      unidadUsada: String(item.unidadUsada || 'unidad'),
      costoFinalCalculado: numero(item.costoFinalCalculado, 0),
      cantidadCompraEquivalente: null
    };

    const costoPorUnidadCompra = insumo && numero(insumo.cantidadPaquete, 0) > 0
      ? numero(insumo.costoPaquete, 0) / numero(insumo.cantidadPaquete, 1)
      : 0;

    if (costoPorUnidadCompra > 0) {
      copia.cantidadCompraEquivalente = copia.costoFinalCalculado / costoPorUnidadCompra;
    }
    return copia;
  }

  function materialConCostoActual(item) {
    const copia = clonar(item);
    const insumo = insumoActual(copia);
    const equivalente = numero(copia.cantidadCompraEquivalente, NaN);
    if (insumo) {
      copia.insumoId = String(insumo.id || copia.insumoId || '');
      copia.nombre = String(insumo.nombre || copia.nombre || '').trim();
    }
    if (insumo && Number.isFinite(equivalente) && equivalente >= 0 && numero(insumo.cantidadPaquete, 0) > 0) {
      const costoUnidadCompra = numero(insumo.costoPaquete, 0) / numero(insumo.cantidadPaquete, 1);
      copia.costoFinalCalculado = costoUnidadCompra * equivalente;
    }
    return copia;
  }

  function normalizarProducto(item) {
    if (!item || typeof item !== 'object') return null;
    const nombre = String(item.nombre || '').trim();
    if (!nombre) return null;
    return {
      id: String(item.id || idNuevo()),
      nombre,
      foto: typeof item.foto === 'string' ? item.foto : '',
      materiales: Array.isArray(item.materiales) ? item.materiales.map(x => {
        const base = {
          insumoId: String(x.insumoId || ''),
          nombre: String(x.nombre || '').trim(),
          cantidadUsada: numero(x.cantidadUsada, 0),
          unidadUsada: String(x.unidadUsada || 'unidad'),
          costoFinalCalculado: numero(x.costoFinalCalculado, 0),
          cantidadCompraEquivalente: Number.isFinite(Number(x.cantidadCompraEquivalente)) ? Number(x.cantidadCompraEquivalente) : null
        };
        const insumo = insumoActual(base);
        if (insumo) {
          base.insumoId = String(insumo.id || '');
          base.nombre = String(insumo.nombre || base.nombre).trim();
        }
        return base;
      }).filter(x => x.nombre) : [],
      empaques: Array.isArray(item.empaques) ? item.empaques.map(x => ({ nombre: String(x.nombre || ''), monto: Math.max(numero(x.monto, 0), 0) })) : [],
      formulario: item.formulario && typeof item.formulario === 'object' ? clonar(item.formulario) : {},
      currencyIndex: numero(item.currencyIndex, 0),
      creadoEn: item.creadoEn || new Date().toISOString(),
      actualizadoEn: item.actualizadoEn || item.creadoEn || new Date().toISOString()
    };
  }

  function normalizarProductos(items) {
    return Array.isArray(items) ? items.map(normalizarProducto).filter(Boolean) : [];
  }

  try {
    const crudo = localStorage.getItem('aralCostosDataV1');
    const guardado = crudo ? JSON.parse(crudo) : null;
    productos = normalizarProductos(guardado?.productosGuardados);
  } catch (_) {
    productos = [];
  }

  const obtenerDatosRespaldoAnterior = obtenerDatosRespaldo;
  obtenerDatosRespaldo = function obtenerDatosRespaldoConProductos() {
    return {
      ...obtenerDatosRespaldoAnterior(),
      productosGuardados: clonar(productos)
    };
  };

  const aplicarDatosRespaldoAnterior = aplicarDatosRespaldo;
  aplicarDatosRespaldo = function aplicarDatosRespaldoConProductos(datos) {
    aplicarDatosRespaldoAnterior(datos);
    productos = normalizarProductos(datos?.productosGuardados);
    productoEnEdicionId = null;
    actualizarEstadoEdicion();
    renderizarProductos();
  };

  const style = document.createElement('style');
  style.textContent = `
    .producto-save-wrap { margin-top: 12px; }
    .producto-edit-banner {
      display:none;
      margin-top:10px;
      padding:10px 12px;
      border-radius:10px;
      background:var(--acento-lavanda);
      color:var(--texto-principal);
      font-size:.82rem;
      align-items:center;
      justify-content:space-between;
      gap:8px;
    }
    .producto-edit-banner.visible { display:flex; }
    .producto-edit-banner button {
      border:none;
      background:none;
      color:var(--texto-principal);
      font-weight:700;
      cursor:pointer;
      font-size:.8rem;
    }
    .productos-head {
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap:10px;
      margin-bottom:12px;
    }
    .productos-grid { display:grid; gap:9px; }
    .producto-card {
      display:grid;
      grid-template-columns:68px 1fr;
      gap:10px;
      padding:10px;
      border:1px solid var(--borde);
      border-radius:13px;
      background:var(--bg-tarjeta);
    }
    .producto-foto,
    .producto-foto-placeholder {
      width:68px;
      height:68px;
      border-radius:11px;
      border:1px solid var(--borde);
      background:var(--bg-principal);
    }
    .producto-foto { object-fit:cover; }
    .producto-foto-placeholder {
      display:flex;
      align-items:center;
      justify-content:center;
      color:var(--texto-secundario);
      font-size:1.25rem;
    }
    .producto-card h3 {
      margin:0 0 2px;
      font-size:.94rem;
      color:var(--texto-principal);
      line-height:1.22;
    }
    .producto-precio {
      font-size:.96rem;
      font-weight:800;
      color:var(--texto-menta);
      margin-bottom:3px;
    }
    .producto-meta {
      font-size:.72rem;
      color:var(--texto-secundario);
      margin-bottom:5px;
    }
    .producto-actions {
      display:flex;
      gap:4px;
    }
    .producto-actions button {
      width:30px;
      height:30px;
      display:grid;
      place-items:center;
      border:1px solid var(--borde);
      background:var(--bg-principal);
      color:var(--texto-principal);
      padding:0;
      border-radius:8px;
      cursor:pointer;
      font-size:.88rem;
      line-height:1;
    }
    .producto-actions button[data-action="delete"] { color:#A64B4B; }
    .producto-empty {
      text-align:center;
      padding:28px 18px;
      color:var(--texto-secundario);
      border:1px dashed var(--borde);
      border-radius:14px;
      line-height:1.5;
    }
    .producto-foto-preview {
      width:92px;
      height:92px;
      border-radius:14px;
      object-fit:cover;
      border:1px solid var(--borde);
      background:var(--bg-principal);
      display:none;
      margin:0 auto 10px;
    }
    .producto-foto-preview.visible { display:block; }
    .producto-delete-texto {
      color:var(--texto-secundario);
      font-size:.9rem;
      line-height:1.45;
      margin:4px 0 16px;
    }
  `;
  document.head.appendChild(style);

  const tabProductos = document.createElement('main');
  tabProductos.id = 'tab-productos';
  tabProductos.style.display = 'none';
  tabProductos.innerHTML = `
    <div class="card">
      <div class="productos-head">
        <div>
          <div class="section-title" style="margin-bottom:4px;">Productos guardados</div>
          <div class="backup-note" style="margin:0;">Tus productos se recalculan con el costo actual de los insumos guardados en tu despensa.</div>
        </div>
      </div>
      <div id="listaProductosGuardados" class="productos-grid"></div>
    </div>
  `;
  phone.insertBefore(tabProductos, nav);

  const btnProductos = document.createElement('button');
  btnProductos.className = 'nav-item';
  btnProductos.id = 'btnNavProductos';
  btnProductos.innerHTML = '<span>▦</span>Productos';
  btnProductos.onclick = () => cambiarPestana('productos');
  nav.insertBefore(btnProductos, document.getElementById('btnNavGastos'));

  const saveWrap = document.createElement('div');
  saveWrap.className = 'producto-save-wrap';
  saveWrap.innerHTML = `
    <button type="button" class="btn-main" id="btnGuardarProducto">Guardar como producto</button>
    <div id="productoEditBanner" class="producto-edit-banner">
      <span id="productoEditTexto"></span>
      <button type="button" id="salirEdicionProducto">Salir de edición</button>
    </div>
  `;
  resultadoCard.appendChild(saveWrap);

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'modalGuardarProducto';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="section-title">Guardar producto</div>
      <img id="fotoProductoPreview" class="producto-foto-preview" alt="Vista previa del producto">
      <div class="input-group">
        <label>Nombre del producto</label>
        <input id="nombreProductoGuardado" type="text" maxlength="80" placeholder="Ej: Torta de chocolate de 3 pisos">
      </div>
      <div class="input-group">
        <label>Foto del producto <span style="font-weight:400;">(opcional)</span></label>
        <input id="fotoProductoArchivo" type="file" accept="image/*">
        <small style="display:block;margin-top:5px;color:var(--texto-secundario);line-height:1.35;">La foto se optimiza antes de guardarse para no ocupar demasiado espacio.</small>
      </div>
      <div style="display:flex;gap:8px;margin-top:14px;">
        <button type="button" class="btn-main btn-secondary" id="cancelarGuardarProducto">Cancelar</button>
        <button type="button" class="btn-main" id="confirmarGuardarProducto">Guardar</button>
      </div>
    </div>
  `;
  phone.appendChild(modal);

  const modalEliminar = document.createElement('div');
  modalEliminar.className = 'modal';
  modalEliminar.id = 'modalEliminarProducto';
  modalEliminar.innerHTML = `
    <div class="modal-content">
      <div class="section-title">Eliminar producto</div>
      <div id="textoEliminarProducto" class="producto-delete-texto"></div>
      <div style="display:flex;gap:8px;">
        <button type="button" class="btn-main btn-secondary" id="cancelarEliminarProducto">Cancelar</button>
        <button type="button" class="btn-main" id="confirmarEliminarProducto" style="background:#D96B68;color:white;">Eliminar</button>
      </div>
    </div>
  `;
  phone.appendChild(modalEliminar);

  function actualizarEstadoEdicion() {
    const banner = document.getElementById('productoEditBanner');
    const texto = document.getElementById('productoEditTexto');
    const btn = document.getElementById('btnGuardarProducto');
    const prod = productos.find(x => x.id === productoEnEdicionId);
    if (prod) {
      banner?.classList.add('visible');
      if (texto) texto.textContent = `Editando: ${prod.nombre}`;
      if (btn) btn.textContent = 'Guardar cambios del producto';
    } else {
      banner?.classList.remove('visible');
      if (texto) texto.textContent = '';
      if (btn) btn.textContent = 'Guardar como producto';
    }
  }

  function snapshotActual(nombre, foto, idExistente) {
    const formulario = typeof obtenerFormularioActual === 'function' ? obtenerFormularioActual() : {};
    const ahora = new Date().toISOString();
    const existente = productos.find(x => x.id === idExistente);
    return {
      id: idExistente || idNuevo(),
      nombre,
      foto: foto || '',
      materiales: materialesDelProductoActual.map(materialParaGuardar),
      empaques: empaquesProducto.map(x => ({ nombre: String(x.nombre || ''), monto: Math.max(numero(x.monto, 0), 0) })),
      formulario: clonar(formulario),
      currencyIndex: document.getElementById('currency')?.selectedIndex || 0,
      creadoEn: existente?.creadoEn || ahora,
      actualizadoEn: ahora
    };
  }

  function calcularResumenProducto(prod) {
    const materialesActuales = prod.materiales.map(materialConCostoActual);
    const materiales = materialesActuales.reduce((s, x) => s + numero(x.costoFinalCalculado, 0), 0);
    const f = prod.formulario || {};
    const horas = Math.max(numero(f.horas, 0), 0);
    const valorHora = Math.max(numero(f.valorHora, 0), 0);
    const empaque = prod.empaques.reduce((s, x) => s + Math.max(numero(x.monto, 0), 0), 0);
    const operativo = Math.max(numero(typeof costoPorHoraOperativo !== 'undefined' ? costoPorHoraOperativo : 0, 0), 0) * horas;
    const costoTotal = materiales + (horas * valorHora) + operativo + empaque;
    const modo = f.modoGanancia === 'fijo' ? 'fijo' : 'porcentaje';
    const margen = Math.max(numero(f.margen, 0), 0);
    const fija = Math.max(numero(f.gananciaFija, 0), 0);
    const ganancia = modo === 'fijo' ? fija : costoTotal * (margen / 100);
    const base = costoTotal + ganancia;
    let sumado = 0;
    const cargos = Array.isArray(f.cargosVenta) ? f.cargosVenta : [];
    cargos.forEach(c => {
      const valor = Math.max(numero(c.valor, 0), 0);
      const importe = c.tipo === 'fijo' ? valor : base * (valor / 100);
      if (c.tratamiento !== 'descontar') sumado += importe;
    });
    return {
      costo: costoTotal,
      precio: base + sumado,
      materialesActuales,
      simbolo: simboloPorIndice(prod.currencyIndex)
    };
  }

  function renderizarProductos() {
    const cont = document.getElementById('listaProductosGuardados');
    if (!cont) return;
    if (!productos.length) {
      cont.innerHTML = '<div class="producto-empty"><b>Aún no tienes productos guardados.</b><br>Haz un cálculo en Costear y usa “Guardar como producto”.</div>';
      return;
    }

    cont.innerHTML = productos.map(prod => {
      const resumen = calcularResumenProducto(prod);
      const foto = prod.foto
        ? `<img class="producto-foto" src="${prod.foto}" alt="${escapar(prod.nombre)}">`
        : '<div class="producto-foto-placeholder">▦</div>';
      const nInsumos = prod.materiales.length;
      return `
        <div class="producto-card" data-producto-id="${escapar(prod.id)}">
          ${foto}
          <div>
            <h3>${escapar(prod.nombre)}</h3>
            <div class="producto-precio">${resumen.simbolo} ${resumen.precio.toFixed(2)}</div>
            <div class="producto-meta">Precio actual · ${nInsumos} ${nInsumos === 1 ? 'insumo' : 'insumos'}</div>
            <div class="producto-actions">
              <button type="button" data-action="edit" data-id="${escapar(prod.id)}" onclick="window.costaliaEditarProducto && window.costaliaEditarProducto('${escapar(prod.id)}'); return false;" aria-label="Editar ${escapar(prod.nombre)}" title="Editar">✏️</button>
              <button type="button" data-action="duplicate" data-id="${escapar(prod.id)}" aria-label="Duplicar ${escapar(prod.nombre)}" title="Duplicar">⧉</button>
              <button type="button" data-action="delete" data-id="${escapar(prod.id)}" aria-label="Eliminar ${escapar(prod.nombre)}" title="Eliminar">🗑️</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function cargarProductoEnCostear(prod) {
    if (!prod) return;
    try {
      const resumen = calcularResumenProducto(prod);

      materialesDelProductoActual.splice(0, materialesDelProductoActual.length, ...resumen.materialesActuales.map(clonar));
      empaquesProducto.splice(0, empaquesProducto.length, ...prod.empaques.map(clonar));

      const currency = document.getElementById('currency');
      if (currency) currency.selectedIndex = Math.min(Math.max(numero(prod.currencyIndex, 0), 0), currency.options.length - 1);

      if (typeof aplicarFormulario === 'function') aplicarFormulario(clonar(prod.formulario));
      if (typeof renderizarMaterialesProducto === 'function') renderizarMaterialesProducto();
      if (typeof renderizarEmpaques === 'function') renderizarEmpaques();

      productoEnEdicionId = prod.id;
      actualizarEstadoEdicion();
      cambiarPestana('costear');

      if (typeof calcularPrecio === 'function') calcularPrecio();
      showToast(`Producto abierto: ${prod.nombre}`);
    } catch (error) {
      console.error('No se pudo abrir el producto para editar:', error);
      showToast('No se pudo abrir el producto para editar.', 'error');
    }
  }

  window.costaliaEditarProducto = function costaliaEditarProducto(id) {
    const prod = productos.find(x => String(x.id) === String(id));
    if (!prod) {
      showToast('No se encontró el producto guardado.', 'error');
      return;
    }
    cargarProductoEnCostear(prod);
  };

  function comprimirImagen(archivo) {
    return new Promise((resolve, reject) => {
      if (!archivo) return resolve('');
      const lector = new FileReader();
      lector.onerror = () => reject(new Error('No se pudo leer la imagen'));
      lector.onload = () => {
        const img = new Image();
        img.onerror = () => reject(new Error('No se pudo abrir la imagen'));
        img.onload = () => {
          const max = 420;
          const escala = Math.min(1, max / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width * escala));
          const h = Math.max(1, Math.round(img.height * escala));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.76));
        };
        img.src = lector.result;
      };
      lector.readAsDataURL(archivo);
    });
  }

  function abrirModalGuardar() {
    const actual = productos.find(x => x.id === productoEnEdicionId);
    const inputNombre = document.getElementById('nombreProductoGuardado');
    const inputFoto = document.getElementById('fotoProductoArchivo');
    const preview = document.getElementById('fotoProductoPreview');
    fotoTemporal = actual?.foto || '';
    inputNombre.value = actual?.nombre || '';
    inputFoto.value = '';
    preview.src = fotoTemporal;
    preview.classList.toggle('visible', !!fotoTemporal);
    modal.style.display = 'flex';
    setTimeout(() => inputNombre.focus(), 50);
  }

  function cerrarModalGuardar() {
    modal.style.display = 'none';
  }

  function abrirModalEliminar(prod) {
    productoPendienteEliminarId = prod.id;
    const texto = document.getElementById('textoEliminarProducto');
    if (texto) texto.textContent = `¿Quieres eliminar “${prod.nombre}”? Esta acción no se puede deshacer.`;
    modalEliminar.style.display = 'flex';
  }

  function cerrarModalEliminar() {
    productoPendienteEliminarId = null;
    modalEliminar.style.display = 'none';
  }

  document.getElementById('btnGuardarProducto').addEventListener('click', abrirModalGuardar);
  document.getElementById('cancelarGuardarProducto').addEventListener('click', cerrarModalGuardar);
  document.getElementById('salirEdicionProducto').addEventListener('click', () => {
    productoEnEdicionId = null;
    actualizarEstadoEdicion();
  });

  document.getElementById('cancelarEliminarProducto').addEventListener('click', cerrarModalEliminar);
  document.getElementById('confirmarEliminarProducto').addEventListener('click', () => {
    const prod = productos.find(x => x.id === productoPendienteEliminarId);
    if (!prod) return cerrarModalEliminar();
    productos = productos.filter(x => x.id !== prod.id);
    if (productoEnEdicionId === prod.id) productoEnEdicionId = null;
    guardarDatosLocales();
    actualizarEstadoEdicion();
    renderizarProductos();
    cerrarModalEliminar();
    showToast('Producto eliminado.');
  });

  document.getElementById('fotoProductoArchivo').addEventListener('change', async event => {
    const archivo = event.target.files?.[0];
    if (!archivo) return;
    try {
      fotoTemporal = await comprimirImagen(archivo);
      const preview = document.getElementById('fotoProductoPreview');
      preview.src = fotoTemporal;
      preview.classList.add('visible');
    } catch (_) {
      showToast('No se pudo procesar esa imagen. Prueba con otra foto.');
    }
  });

  document.getElementById('confirmarGuardarProducto').addEventListener('click', () => {
    const nombre = String(document.getElementById('nombreProductoGuardado').value || '').trim();
    if (!nombre) return showToast('Escribe un nombre para el producto.');
    if (!materialesDelProductoActual.length && !empaquesProducto.some(x => numero(x.monto, 0) > 0)) {
      return showToast('Agrega al menos un material o un costo de empaque antes de guardar.');
    }

    const snapshot = snapshotActual(nombre, fotoTemporal, productoEnEdicionId);
    const idx = productos.findIndex(x => x.id === snapshot.id);
    if (idx >= 0) productos[idx] = snapshot;
    else productos.unshift(snapshot);

    productoEnEdicionId = snapshot.id;
    guardarDatosLocales();
    renderizarProductos();
    actualizarEstadoEdicion();
    cerrarModalGuardar();
    showToast(idx >= 0 ? 'Producto actualizado.' : 'Producto guardado.');
  });

  document.getElementById('listaProductosGuardados').addEventListener('click', event => {
    const btn = event.target.closest('button[data-action]');
    if (!btn) return;
    const prod = productos.find(x => x.id === btn.dataset.id);
    if (!prod) return;

    if (btn.dataset.action === 'edit') {
      // El botón Editar ya ejecuta costaliaEditarProducto directamente.
      return;
    }

    if (btn.dataset.action === 'duplicate') {
      const copia = clonar(prod);
      copia.id = idNuevo();
      copia.nombre = `Copia de ${prod.nombre}`;
      copia.creadoEn = new Date().toISOString();
      copia.actualizadoEn = copia.creadoEn;
      productos.unshift(copia);
      guardarDatosLocales();
      renderizarProductos();
      showToast('Producto duplicado.');
      return;
    }

    if (btn.dataset.action === 'delete') {
      abrirModalEliminar(prod);
    }
  });

  const cambiarPestanaAnterior = cambiarPestana;
  cambiarPestana = function cambiarPestanaConProductos(tab) {
    if (tab === 'productos') {
      document.getElementById('tab-costear').style.display = 'none';
      document.getElementById('tab-despensa').style.display = 'none';
      document.getElementById('tab-gastos').style.display = 'none';
      tabProductos.style.display = 'block';
      document.getElementById('btnNavCostear').classList.remove('active');
      document.getElementById('btnNavDespensa').classList.remove('active');
      document.getElementById('btnNavGastos').classList.remove('active');
      btnProductos.classList.add('active');
      renderizarProductos();
      return;
    }

    tabProductos.style.display = 'none';
    btnProductos.classList.remove('active');
    cambiarPestanaAnterior(tab);
  };

  renderizarProductos();
  actualizarEstadoEdicion();
  guardarDatosLocales();
})();
