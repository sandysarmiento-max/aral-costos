// Edición de insumos para Aral Costos V2.
// Cargar después de v2-products.js.

(function () {
  const phone = document.querySelector('.phone-container');
  const lista = document.getElementById('listaDespensaGlobal');
  if (!phone || !lista) return;

  let indiceEdicion = null;

  function numero(valor, respaldo = 0) {
    const n = parseFloat(valor);
    return Number.isFinite(n) ? n : respaldo;
  }

  function escapar(valor) {
    return typeof escaparHtml === 'function'
      ? escaparHtml(valor)
      : String(valor ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function textoUnidad(unidad) {
    const u = String(unidad || 'unidad');
    return u.startsWith('otro:') ? u.slice(5) : u;
  }

  function simboloMoneda() {
    return document.getElementById('currency')?.selectedOptions?.[0]?.dataset?.symbol || 'S/.';
  }

  function formatoCosto(valor) {
    const n = Number(valor) || 0;
    let texto = n.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
    if (!texto.includes('.')) texto += '.00';
    else if (texto.split('.')[1].length < 2) texto += '0';
    return texto;
  }

  function unidadBase(unidad) {
    const u = String(unidad || 'unidad');
    return u.startsWith('otro:') ? 'otro' : u;
  }

  const style = document.createElement('style');
  style.textContent = `
    .despensa-row-v2 {
      display:grid !important;
      grid-template-columns:minmax(0,1fr) minmax(120px,auto) 30px;
      gap:10px;
      align-items:center !important;
    }
    .despensa-row-v2 > div:first-child { min-width:0; }
    .despensa-row-v2 > div:first-child b {
      font-weight:500;
    }
    .despensa-row-v2 .despensa-cost-v2 {
      display:block;
      min-width:0;
      text-align:right;
    }
    .despensa-row-v2 .despensa-cost-v2 > b {
      display:block;
      font-weight:600;
      line-height:1.25;
      color:#2F6F73;
      overflow-wrap:anywhere;
    }
    body[data-aral-style="neutral"] .despensa-row-v2 .despensa-cost-v2 > b {
      color:#315B55;
    }
    .despensa-actions-v2 {
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
      gap:3px;
      margin:0;
      flex:0 0 auto;
    }
    .despensa-edit-btn,
    .despensa-actions-v2 .btn-delete {
      width:26px;
      height:26px;
      display:grid;
      place-items:center;
      border:none;
      background:transparent;
      cursor:pointer;
      padding:0;
      margin:0;
      border-radius:6px;
      line-height:1;
    }
    .despensa-edit-btn {
      color:var(--texto-secundario);
      font-size:.9rem;
    }
    .despensa-actions-v2 .btn-delete {
      font-size:.9rem;
    }
    .despensa-edit-btn:hover,
    .despensa-actions-v2 .btn-delete:hover { background:var(--acento-lavanda); }

    @media (max-width:380px) {
      .despensa-row-v2 {
        grid-template-columns:minmax(0,1fr) minmax(104px,auto) 28px;
        gap:7px;
      }
    }
  `;
  document.head.appendChild(style);

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'modalEditarInsumo';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="section-title">Editar insumo</div>
      <div class="input-group">
        <label>Nombre del insumo</label>
        <input type="text" id="editarInsumoNombre" maxlength="80">
      </div>
      <div class="flex-inputs">
        <div style="flex:1;">
          <label>Cantidad comprada</label>
          <input type="number" id="editarInsumoCantidad" min="0" step="any">
        </div>
        <div style="flex:1;">
          <label>Unidad de compra</label>
          <select id="editarInsumoUnidad"></select>
        </div>
      </div>
      <div class="input-group" id="editarInsumoOtraWrap" style="display:none;margin-top:8px;">
        <label>Nombre de la unidad</label>
        <input type="text" id="editarInsumoOtra" maxlength="30" placeholder="Ej: plancha, frasco">
      </div>
      <div class="input-group" style="margin-top:12px;">
        <label>Costo total de la compra</label>
        <div style="display:flex;align-items:center;gap:7px;">
          <span id="editarInsumoSimbolo" style="font-weight:700;color:var(--texto-secundario);"></span>
          <input type="number" id="editarInsumoCosto" min="0" step="any">
        </div>
      </div>
      <div style="display:flex;gap:8px;margin-top:14px;">
        <button type="button" class="btn-main btn-secondary" id="cancelarEditarInsumo">Cancelar</button>
        <button type="button" class="btn-main" id="guardarEditarInsumo">Guardar cambios</button>
      </div>
    </div>
  `;
  phone.appendChild(modal);

  const nombre = modal.querySelector('#editarInsumoNombre');
  const cantidad = modal.querySelector('#editarInsumoCantidad');
  const unidad = modal.querySelector('#editarInsumoUnidad');
  const otraWrap = modal.querySelector('#editarInsumoOtraWrap');
  const otra = modal.querySelector('#editarInsumoOtra');
  const costo = modal.querySelector('#editarInsumoCosto');
  const simbolo = modal.querySelector('#editarInsumoSimbolo');

  function cargarOpcionesUnidad(seleccionada) {
    unidad.innerHTML = typeof opcionesUnidad === 'function'
      ? opcionesUnidad(seleccionada)
      : ['unidad','kg','g','litro','ml','metro','cm','gota','otro'].map(u => `<option value="${u}" ${u === seleccionada ? 'selected' : ''}>${u}</option>`).join('');
  }

  function actualizarOtraUnidad() {
    otraWrap.style.display = unidad.value === 'otro' ? 'block' : 'none';
  }

  unidad.addEventListener('change', actualizarOtraUnidad);

  function abrirEdicion(i) {
    const item = despensaGlobal[i];
    if (!item) return;
    indiceEdicion = i;
    nombre.value = item.nombre || '';
    cantidad.value = item.cantidadPaquete || '';
    const base = unidadBase(item.unidadCompra);
    cargarOpcionesUnidad(base);
    otra.value = base === 'otro' ? textoUnidad(item.unidadCompra) : '';
    actualizarOtraUnidad();
    costo.value = item.costoPaquete || '';
    simbolo.textContent = simboloMoneda();
    modal.style.display = 'flex';
    setTimeout(() => nombre.focus(), 50);
  }

  function cerrarEdicion() {
    indiceEdicion = null;
    modal.style.display = 'none';
  }

  modal.querySelector('#cancelarEditarInsumo').addEventListener('click', cerrarEdicion);
  modal.addEventListener('click', event => {
    if (event.target === modal) cerrarEdicion();
  });

  modal.querySelector('#guardarEditarInsumo').addEventListener('click', () => {
    if (!Number.isInteger(indiceEdicion) || !despensaGlobal[indiceEdicion]) return;

    const nuevoNombre = String(nombre.value || '').trim();
    const nuevaCantidad = numero(cantidad.value, 0);
    const nuevoCosto = numero(costo.value, 0);
    let nuevaUnidad = unidad.value || 'unidad';
    if (nuevaUnidad === 'otro') {
      const personalizada = String(otra.value || '').trim();
      if (!personalizada) return showToast('Escribe el nombre de la unidad.');
      nuevaUnidad = `otro:${personalizada}`;
    }

    if (!nuevoNombre) return showToast('Escribe el nombre del insumo.');
    if (nuevaCantidad <= 0) return showToast('La cantidad comprada debe ser mayor que 0.');
    if (nuevoCosto < 0) return showToast('El costo no puede ser negativo.');

    const anterior = despensaGlobal[indiceEdicion];
    const nombreAnterior = String(anterior.nombre || '').trim();
    const insumoId = String(anterior.id || '');

    despensaGlobal[indiceEdicion] = {
      ...anterior,
      nombre: nuevoNombre,
      cantidadPaquete: nuevaCantidad,
      unidadCompra: nuevaUnidad,
      costoPaquete: nuevoCosto,
      costoUnitario: nuevoCosto / nuevaCantidad
    };

    if (Array.isArray(materialesDelProductoActual)) {
      materialesDelProductoActual.forEach(item => {
        const coincidePorId = insumoId && String(item.insumoId || '') === insumoId;
        const coincidePorNombre = !item.insumoId && nombreAnterior &&
          String(item.nombre || '').trim().toLowerCase() === nombreAnterior.toLowerCase();

        if (coincidePorId || coincidePorNombre) {
          if (insumoId) item.insumoId = insumoId;
          item.nombre = nuevoNombre;
        }
      });
    }

    if (nombreAnterior !== nuevoNombre && typeof window.costaliaActualizarInsumoEnProductos === 'function') {
      window.costaliaActualizarInsumoEnProductos({
        insumoId,
        nombreAnterior,
        nuevoNombre
      });
    }

    guardarDatosLocales();
    renderizarDespensaGlobal();
    if (typeof renderizarMaterialesProducto === 'function') renderizarMaterialesProducto();
    if (typeof calcularPrecio === 'function') calcularPrecio();
    cerrarEdicion();
    showToast('Insumo actualizado.');
  });

  renderizarDespensaGlobal = function renderizarDespensaGlobalEditable() {
    const contenedor = document.getElementById('listaDespensaGlobal');
    if (!contenedor) return;
    const sym = simboloMoneda();
    contenedor.innerHTML = despensaGlobal.map((item, i) => `
      <div class="item-row despensa-row-v2">
        <div>
          <b>${escapar(item.nombre)}</b><br>
          <small>Compra: ${item.cantidadPaquete} ${escapar(textoUnidad(item.unidadCompra))} — ${sym} ${Number(item.costoPaquete).toFixed(2)}</small>
        </div>
        <div class="despensa-cost-v2">
          <b>${sym} ${formatoCosto(item.costoUnitario)} por ${escapar(textoUnidad(item.unidadCompra))}</b>
        </div>
        <div class="despensa-actions-v2">
          <button type="button" class="despensa-edit-btn" data-editar-insumo="${i}" aria-label="Editar ${escapar(item.nombre)}" title="Editar">✏️</button>
          <button type="button" class="btn-delete" onclick="eliminarDeDespensa(${i})" aria-label="Eliminar ${escapar(item.nombre)}">❌</button>
        </div>
      </div>
    `).join('') || '<i>Aún no tienes insumos guardados.</i>';
  };

  lista.addEventListener('click', event => {
    const btn = event.target.closest('[data-editar-insumo]');
    if (!btn) return;
    abrirEdicion(Number(btn.dataset.editarInsumo));
  });

  renderizarDespensaGlobal();
})();
