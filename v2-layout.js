// Ajuste visual V2: campo de costo de empaque más ancho y símbolo dentro del input.
(function () {
  function simboloMonedaActual() {
    return document.getElementById('currency')?.selectedOptions?.[0]?.dataset?.symbol || 'S/.';
  }

  renderizarEmpaques = function renderizarEmpaquesLayoutV2() {
    const contenedor = document.getElementById('listaEmpaques');
    if (!contenedor) return;
    const sym = simboloMonedaActual();

    contenedor.innerHTML = empaquesProducto.map((x, i) => `
      <div class="dynamic-row" style="display:grid;grid-template-columns:minmax(0,1.15fr) minmax(118px,.85fr) 30px;gap:8px;align-items:center;">
        <input aria-label="Nombre del empaque" placeholder="Ej: Caja" value="${escaparHtml(x.nombre)}" oninput="actualizarFila(empaquesProducto,${i},'nombre',this.value)" style="min-width:0;">
        <div style="position:relative;min-width:0;">
          <span style="position:absolute;left:11px;top:50%;transform:translateY(-50%);font-weight:600;color:var(--texto-secundario);pointer-events:none;white-space:nowrap;">${sym}</span>
          <input aria-label="Costo del empaque" type="number" min="0" step="any" placeholder="Costo" value="${x.monto || ''}" oninput="actualizarFila(empaquesProducto,${i},'monto',this.value)" style="width:100%;min-width:0;padding-left:${sym.length > 2 ? '42px' : '32px'};">
        </div>
        <button class="btn-delete" onclick="eliminarFila(empaquesProducto,${i})" style="margin-left:0;justify-self:center;">❌</button>
      </div>
    `).join('') || '<i>Aún no agregas empaques.</i>';
  };

  renderizarEmpaques();

  const selectorMoneda = document.getElementById('currency');
  if (selectorMoneda) selectorMoneda.addEventListener('change', renderizarEmpaques);
})();
