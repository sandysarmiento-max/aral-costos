// Permite editar la cantidad usada directamente en Materiales Seleccionados.
// Cargar después de v2-products.js y v2-inventory-edit.js.

(function () {
  function escapar(valor) {
    return typeof escaparHtml === 'function'
      ? escaparHtml(valor)
      : String(valor ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function textoUnidad(unidad) {
    const u = String(unidad || 'unidad');
    return u.startsWith('otro:') ? u.slice(5) : u;
  }

  function actualizarCantidadMaterial(index, valor) {
    const item = materialesDelProductoActual[index];
    if (!item) return;

    const nueva = parseFloat(valor);
    if (!Number.isFinite(nueva) || nueva <= 0) {
      renderizarMaterialesProducto();
      return showToast('Ingresa una cantidad mayor que 0.');
    }

    const anterior = Number(item.cantidadUsada) || 0;
    const costoAnterior = Number(item.costoFinalCalculado) || 0;

    if (anterior > 0) {
      item.costoFinalCalculado = costoAnterior * (nueva / anterior);
    }
    item.cantidadUsada = nueva;

    calcularPrecio();
    guardarDatosLocales();
    renderizarMaterialesProducto();
  }

  renderizarMaterialesProducto = function renderizarMaterialesProductoEditable() {
    const contenedor = document.getElementById('listaMaterialesProducto');
    if (!contenedor) return;

    contenedor.innerHTML = materialesDelProductoActual.map((item, i) => `
      <div class="item-row" style="gap:8px;">
        <div style="flex:1;min-width:0;">
          <div style="margin-bottom:4px;">${escapar(item.nombre)}</div>
          <div style="display:flex;align-items:center;gap:5px;font-size:.78rem;color:var(--texto-secundario);">
            <span>Cantidad:</span>
            <input
              type="number"
              min="0.0001"
              step="any"
              value="${Number(item.cantidadUsada) || 0}"
              aria-label="Cantidad usada de ${escapar(item.nombre)}"
              data-material-cantidad="${i}"
              style="width:70px;padding:4px 7px;border-radius:7px;font-size:.78rem;"
            >
            <span>${escapar(textoUnidad(item.unidadUsada))}</span>
          </div>
        </div>
        <span style="display:flex;align-items:center;gap:5px;white-space:nowrap;">
          <b>${Number(item.costoFinalCalculado).toFixed(2)}</b>
          <button class="btn-delete" onclick="eliminarMaterialProducto(${i})" aria-label="Eliminar ${escapar(item.nombre)}">❌</button>
        </span>
      </div>
    `).join('') || '<i>Selecciona materiales de tu despensa para empezar.</i>';
  };

  const lista = document.getElementById('listaMaterialesProducto');
  if (lista) {
    lista.addEventListener('change', event => {
      const input = event.target.closest('[data-material-cantidad]');
      if (!input) return;
      actualizarCantidadMaterial(Number(input.dataset.materialCantidad), input.value);
    });

    lista.addEventListener('keydown', event => {
      const input = event.target.closest('[data-material-cantidad]');
      if (!input || event.key !== 'Enter') return;
      event.preventDefault();
      input.blur();
    });
  }

  renderizarMaterialesProducto();
})();
