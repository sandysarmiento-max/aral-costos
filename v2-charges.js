// Cargos e impuestos opcionales para Aral Costos V2.
// Se carga después de v2-profit.js.

(function () {
  const resultadoCard = document.getElementById('precioFinal')?.closest('.card');
  if (!resultadoCard) return;

  let cargos = [];

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <div class="section-title">🧾 Impuestos y cargos <span style="font-size:.75rem;font-weight:500;color:var(--texto-secundario);">Opcional</span></div>
    <div class="backup-note">Agrega solo los cargos que correspondan a tu venta, por ejemplo impuesto, comisión de plataforma o pasarela de pago.</div>
    <div id="listaCargosVenta"></div>
    <button type="button" class="btn-main btn-secondary" id="btnAgregarCargoVenta">+ Agregar impuesto o cargo</button>
  `;
  resultadoCard.parentElement.insertBefore(card, resultadoCard);

  const lista = card.querySelector('#listaCargosVenta');
  const btnAgregar = card.querySelector('#btnAgregarCargoVenta');

  function numero(valor, respaldo = 0) {
    const n = parseFloat(valor);
    return Number.isFinite(n) ? n : respaldo;
  }

  function simbolo() {
    return document.getElementById('currency')?.selectedOptions?.[0]?.dataset?.symbol || 'S/.';
  }

  function escapar(valor) {
    return typeof escaparHtml === 'function'
      ? escaparHtml(valor)
      : String(valor ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function normalizarCargos(items) {
    if (!Array.isArray(items)) return [];
    return items.map(item => ({
      nombre: String(item?.nombre || '').trim(),
      tipo: item?.tipo === 'fijo' ? 'fijo' : 'porcentaje',
      valor: Math.max(numero(item?.valor, 0), 0),
      tratamiento: item?.tratamiento === 'descontar' ? 'descontar' : 'sumar'
    }));
  }

  function guardarYCalcular() {
    calcularPrecio();
    guardarDatosLocales();
  }

  function renderizar() {
    const sym = simbolo();
    lista.innerHTML = cargos.map((cargo, i) => `
      <div style="border:1px solid var(--borde);border-radius:12px;padding:10px;margin-bottom:10px;background:var(--bg-principal);">
        <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;">
          <input style="flex:1;min-width:0;" aria-label="Nombre del impuesto o cargo" placeholder="Ej: Impuesto, comisión" value="${escapar(cargo.nombre)}" data-cargo-index="${i}" data-cargo-campo="nombre">
          <button type="button" class="btn-delete" data-eliminar-cargo="${i}" aria-label="Eliminar cargo">❌</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
          <select aria-label="Tipo de cargo" data-cargo-index="${i}" data-cargo-campo="tipo">
            <option value="porcentaje" ${cargo.tipo === 'porcentaje' ? 'selected' : ''}>Porcentaje</option>
            <option value="fijo" ${cargo.tipo === 'fijo' ? 'selected' : ''}>Monto fijo</option>
          </select>
          <div style="position:relative;min-width:0;">
            <span style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-weight:600;color:var(--texto-secundario);pointer-events:none;">${cargo.tipo === 'fijo' ? sym : '%'}</span>
            <input style="padding-left:${cargo.tipo === 'fijo' ? '42px' : '34px'};" aria-label="Valor del cargo" type="number" min="0" step="any" value="${cargo.valor || ''}" data-cargo-index="${i}" data-cargo-campo="valor">
          </div>
        </div>
        <label style="margin-bottom:5px;">Cómo se aplica</label>
        <select aria-label="Cómo se aplica el cargo" data-cargo-index="${i}" data-cargo-campo="tratamiento">
          <option value="sumar" ${cargo.tratamiento === 'sumar' ? 'selected' : ''}>Se suma al precio</option>
          <option value="descontar" ${cargo.tratamiento === 'descontar' ? 'selected' : ''}>Se descuenta de la venta</option>
        </select>
      </div>
    `).join('') || '<i>No has agregado impuestos ni cargos.</i>';
  }

  lista.addEventListener('input', event => {
    const el = event.target;
    const idx = Number(el.dataset.cargoIndex);
    const campo = el.dataset.cargoCampo;
    if (!Number.isInteger(idx) || !cargos[idx] || !campo) return;
    cargos[idx][campo] = campo === 'valor' ? Math.max(numero(el.value, 0), 0) : el.value;
    guardarYCalcular();
  });

  lista.addEventListener('change', event => {
    const el = event.target;
    const idx = Number(el.dataset.cargoIndex);
    const campo = el.dataset.cargoCampo;
    if (!Number.isInteger(idx) || !cargos[idx] || !campo) return;
    cargos[idx][campo] = campo === 'valor' ? Math.max(numero(el.value, 0), 0) : el.value;
    renderizar();
    guardarYCalcular();
  });

  lista.addEventListener('click', event => {
    const boton = event.target.closest('[data-eliminar-cargo]');
    if (!boton) return;
    const idx = Number(boton.dataset.eliminarCargo);
    if (!Number.isInteger(idx)) return;
    cargos.splice(idx, 1);
    renderizar();
    guardarYCalcular();
  });

  btnAgregar.addEventListener('click', () => {
    cargos.push({ nombre: '', tipo: 'porcentaje', valor: 0, tratamiento: 'sumar' });
    renderizar();
    guardarDatosLocales();
  });

  // Amplía el respaldo V2 para incluir cargos.
  const obtenerFormularioAnterior = obtenerFormularioActual;
  obtenerFormularioActual = function obtenerFormularioActualConCargos() {
    return {
      ...obtenerFormularioAnterior(),
      cargosVenta: normalizarCargos(cargos)
    };
  };

  const aplicarFormularioAnterior = aplicarFormulario;
  aplicarFormulario = function aplicarFormularioConCargos(datos = {}) {
    aplicarFormularioAnterior(datos);
    cargos = normalizarCargos(datos.cargosVenta);
    renderizar();
    calcularPrecio();
  };

  // Extiende el cálculo que dejó v2-profit.js. La base es costo + ganancia.
  calcularPrecio = function calcularPrecioConCargos() {
    const materiales = materialesDelProductoActual.reduce((suma, item) => suma + (Number(item.costoFinalCalculado) || 0), 0);
    const horas = numero(document.getElementById('horas')?.value, 0);
    const valorHora = numero(document.getElementById('valorHora')?.value, 0);
    const empaque = empaquesProducto.reduce((suma, item) => suma + numero(item.monto, 0), 0);
    const costoTaller = costoPorHoraOperativo * horas;
    const manoObra = horas * valorHora;
    const costoTotal = materiales + manoObra + costoTaller + empaque;

    const modo = document.getElementById('modoGanancia')?.value || 'porcentaje';
    const margen = Math.max(numero(document.getElementById('margen')?.value, 0), 0);
    const fija = Math.max(numero(document.getElementById('gananciaFija')?.value, 0), 0);
    const ganancia = modo === 'fijo' ? fija : costoTotal * (margen / 100);
    const precioBase = costoTotal + ganancia;

    let totalSumado = 0;
    let totalDescontado = 0;
    const detalles = [];

    cargos.forEach(cargo => {
      const importe = cargo.tipo === 'fijo'
        ? cargo.valor
        : precioBase * (cargo.valor / 100);

      if (cargo.tratamiento === 'descontar') totalDescontado += importe;
      else totalSumado += importe;

      if (cargo.nombre || importe > 0) {
        detalles.push({
          nombre: cargo.nombre || 'Cargo',
          importe,
          tratamiento: cargo.tratamiento
        });
      }
    });

    // Lo que se suma aumenta el precio al cliente. Lo que se descuenta representa
    // un importe retenido de la venta; no baja el precio mostrado al cliente.
    const precioCliente = precioBase + totalSumado;
    const netoRecibido = precioCliente - totalDescontado;
    const sym = simbolo();

    document.getElementById('precioFinal').innerText = `${sym} ${precioCliente.toFixed(2)}`;

    const lineasCargos = detalles.map(item =>
      `• ${escapar(item.nombre)} (${item.tratamiento === 'sumar' ? 'se suma' : 'se descuenta'}): ${sym} ${item.importe.toFixed(2)}<br>`
    ).join('');

    document.getElementById('desgloseCostos').innerHTML = `
      • Materiales: ${sym} ${materiales.toFixed(2)}<br>
      • Mano de obra: ${sym} ${manoObra.toFixed(2)}<br>
      • Gastos operativos (${horas}h): ${sym} ${costoTaller.toFixed(2)}<br>
      • Empaque: ${sym} ${empaque.toFixed(2)}<br>
      • Costo total: ${sym} ${costoTotal.toFixed(2)}<br>
      • Ganancia: ${sym} ${ganancia.toFixed(2)}<br>
      ${lineasCargos}
      ${totalDescontado > 0 ? `• Neto que recibes: ${sym} ${netoRecibido.toFixed(2)}` : ''}
    `;

    guardarDatosLocales();
  };

  // Restaura los campos añadidos por scripts cargados después del script principal.
  try {
    const crudo = localStorage.getItem('aralCostosDataV1');
    const guardado = crudo ? JSON.parse(crudo) : null;
    const formulario = guardado?.formulario || {};

    const modoGanancia = document.getElementById('modoGanancia');
    const gananciaFija = document.getElementById('gananciaFija');
    if (modoGanancia && ['porcentaje', 'fijo'].includes(formulario.modoGanancia)) {
      modoGanancia.value = formulario.modoGanancia;
      modoGanancia.dispatchEvent(new Event('change'));
    }
    if (gananciaFija && formulario.gananciaFija !== undefined) {
      gananciaFija.value = formulario.gananciaFija;
    }

    cargos = normalizarCargos(formulario.cargosVenta);
  } catch (error) {
    console.log('No se pudieron restaurar los ajustes V2 adicionales:', error);
  }

  const selectorMoneda = document.getElementById('currency');
  if (selectorMoneda) selectorMoneda.addEventListener('change', renderizar);

  renderizar();
  calcularPrecio();
})();
