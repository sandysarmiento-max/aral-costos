// Ajustes de compatibilidad de la V2 mientras terminamos de integrar todo en index.html.
// Se carga después del script principal y accede a los bindings globales por nombre directo.

(function () {
  const UNIDADES_V2 = [
    { value: 'unidad', label: 'unidad' },
    { value: 'kg', label: 'kg' },
    { value: 'g', label: 'g' },
    { value: 'litro', label: 'litro' },
    { value: 'ml', label: 'ml' },
    { value: 'metro', label: 'metro' },
    { value: 'cm', label: 'cm' },
    { value: 'gota', label: 'gota' },
    { value: 'otro', label: 'otro' }
  ];

  const PERFILES_GOTAS = [
    { value: '22.5', label: 'Tipo agua / muy líquido — 22.5 gotas/ml' },
    { value: '16.5', label: 'Sérum medio — 16.5 gotas/ml' },
    { value: '15', label: 'Aceite ligero — 15 gotas/ml' },
    { value: '13', label: 'Aceite espeso — 13 gotas/ml' },
    { value: '12', label: 'Muy espeso — 12 gotas/ml' },
    { value: '27.5', label: 'Solución alcohólica — 27.5 gotas/ml' },
    { value: '20', label: 'Referencia general — 20 gotas/ml' }
  ];

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

  function opciones(lista, seleccionada) {
    return lista.map(u => `<option value="${u.value}" ${seleccionada === u.value ? 'selected' : ''}>${u.label}</option>`).join('');
  }

  function unidadesCompatibles(unidadCompra) {
    const compra = String(unidadCompra || 'unidad');
    if (compra.startsWith('otro:')) return [{ value: 'otro', label: textoUnidad(compra) }];
    if (compra === 'kg' || compra === 'g') return UNIDADES_V2.filter(u => ['kg', 'g'].includes(u.value));
    if (compra === 'litro' || compra === 'ml') return UNIDADES_V2.filter(u => ['litro', 'ml', 'gota'].includes(u.value));
    if (compra === 'metro' || compra === 'cm') return UNIDADES_V2.filter(u => ['metro', 'cm'].includes(u.value));
    if (compra === 'gota') return UNIDADES_V2.filter(u => u.value === 'gota');
    if (compra === 'unidad') return UNIDADES_V2.filter(u => u.value === 'unidad');
    return [{ value: 'otro', label: textoUnidad(compra) }];
  }

  opcionesUnidad = function opcionesUnidadV2(seleccionada) {
    const actual = String(seleccionada || 'unidad');
    return opciones(UNIDADES_V2, actual.startsWith('otro:') ? 'otro' : actual);
  };

  function asegurarPanelGotas() {
    let panel = document.getElementById('conversionGotasWrap');
    if (panel) return panel;

    const selectUnidad = document.getElementById('unidadUsada');
    const grupo = selectUnidad?.closest('.input-group');
    if (!grupo) return null;

    panel = document.createElement('div');
    panel.id = 'conversionGotasWrap';
    panel.style.display = 'none';
    panel.style.marginTop = '10px';
    panel.style.padding = '10px';
    panel.style.border = '1px solid var(--borde)';
    panel.style.borderRadius = '10px';
    panel.style.background = 'var(--bg-principal)';
    panel.innerHTML = `
      <label style="margin-bottom:6px;font-weight:600;">Conversión aproximada de gotas</label>
      <label style="margin-bottom:6px;">¿Qué tan espeso es el líquido?</label>
      <select id="tipoLiquidoGotas" style="margin-bottom:8px;">
        ${PERFILES_GOTAS.map(p => `<option value="${p.value}">${p.label}</option>`).join('')}
      </select>
      <label style="margin-bottom:6px;">Gotas por ml</label>
      <input id="gotasPorMl" type="number" min="1" step="0.1" value="22.5">
      <small style="display:block;margin-top:6px;color:var(--texto-secundario);line-height:1.35;">
        Valor aproximado. Puede variar según el espesor del líquido y el gotero. Si conoces el rendimiento de tu producto, puedes editarlo.
      </small>
    `;
    grupo.appendChild(panel);

    const perfil = panel.querySelector('#tipoLiquidoGotas');
    const gotas = panel.querySelector('#gotasPorMl');
    perfil.addEventListener('change', () => { gotas.value = perfil.value; });
    return panel;
  }

  function actualizarPanelGotas(unidadCompra) {
    const select = document.getElementById('unidadUsada');
    const panel = asegurarPanelGotas();
    if (!select || !panel) return;
    panel.style.display = (['ml', 'litro'].includes(unidadCompra) && select.value === 'gota') ? 'block' : 'none';
  }

  prepararUnidadUsada = function prepararUnidadUsadaV2() {
    const selectorInsumo = document.getElementById('selectInsumoModal');
    if (!selectorInsumo) return;
    const item = despensaGlobal[Number(selectorInsumo.value)];
    if (!item) return;

    const compra = String(item.unidadCompra || 'unidad');
    const select = document.getElementById('unidadUsada');
    const inputOtro = document.getElementById('unidadUsadaOtra');
    if (!select || !inputOtro) return;

    const compatibles = unidadesCompatibles(compra);
    const personalizada = compra.startsWith('otro:') || !UNIDADES_V2.some(u => u.value === compra);
    select.innerHTML = opciones(compatibles, personalizada ? 'otro' : compra);

    if (personalizada) {
      inputOtro.value = textoUnidad(compra);
      inputOtro.style.display = 'block';
    } else {
      inputOtro.value = '';
      inputOtro.style.display = 'none';
    }

    select.onchange = () => {
      const esOtro = select.value === 'otro';
      inputOtro.style.display = esOtro ? 'block' : 'none';
      if (!esOtro) inputOtro.value = '';
      actualizarPanelGotas(compra);
    };

    actualizarPanelGotas(compra);
  };

  confirmarAdicionInsumo = function confirmarAdicionInsumoV2() {
    const selector = document.getElementById('selectInsumoModal');
    if (!selector) return;
    const item = despensaGlobal[Number(selector.value)];
    if (!item) return;

    const cant = numeroSeguro(document.getElementById('cantidadUnidadesUsadas')?.value, 0);
    const selectUnidad = document.getElementById('unidadUsada');
    const inputOtro = document.getElementById('unidadUsadaOtra');
    let unidad = selectUnidad?.value || item.unidadCompra || 'unidad';
    if (unidad === 'otro') unidad = `otro:${(inputOtro?.value || '').trim()}`;
    if (cant <= 0) return showToast('Ingresa una cantidad válida');

    let cantidadEnCompra = null;
    if (unidad === 'gota' && (item.unidadCompra === 'ml' || item.unidadCompra === 'litro')) {
      const gotasPorMl = Number(document.getElementById('gotasPorMl')?.value || 0);
      if (!Number.isFinite(gotasPorMl) || gotasPorMl <= 0) return showToast('Ingresa una cantidad válida de gotas por ml');
      const mlUsados = cant / gotasPorMl;
      cantidadEnCompra = item.unidadCompra === 'litro' ? mlUsados / 1000 : mlUsados;
    } else {
      cantidadEnCompra = convertirCantidad(cant, unidad, item.unidadCompra);
    }

    if (cantidadEnCompra === null) return showToast('La unidad usada debe ser igual o convertible a la unidad de compra.');

    materialesDelProductoActual.push({
      insumoId: String(item.id || ''),
      nombre: item.nombre,
      cantidadUsada: cant,
      unidadUsada: unidad,
      costoFinalCalculado: item.costoPaquete * cantidadEnCompra / item.cantidadPaquete
    });

    cerrarModalCatalogo();
    renderizarMaterialesProducto();
    calcularPrecio();
  };

  renderizarDespensaGlobal = function renderizarDespensaGlobalV2() {
    const contenedor = document.getElementById('listaDespensaGlobal');
    if (!contenedor) return;
    const sym = simboloMoneda();
    contenedor.innerHTML = despensaGlobal.map((item, i) => `
      <div class="item-row">
        <div>
          <b>${escapar(item.nombre)}</b><br>
          <small>Compra: ${item.cantidadPaquete} ${escapar(textoUnidad(item.unidadCompra))} — ${sym} ${Number(item.costoPaquete).toFixed(2)}</small>
        </div>
        <span>
          <b>${sym} ${formatoCosto(item.costoUnitario)} por ${escapar(textoUnidad(item.unidadCompra))}</b>
          <button class="btn-delete" onclick="eliminarDeDespensa(${i})">❌</button>
        </span>
      </div>
    `).join('') || '<i>Aún no tienes insumos guardados.</i>';
  };

  renderizarEmpaques = function renderizarEmpaquesV2() {
    const contenedor = document.getElementById('listaEmpaques');
    if (!contenedor) return;
    const sym = simboloMoneda();
    contenedor.innerHTML = empaquesProducto.map((x, i) => `
      <div class="dynamic-row">
        <input aria-label="Nombre del empaque" placeholder="Ej: Caja" value="${escapar(x.nombre)}" oninput="actualizarFila(empaquesProducto,${i},'nombre',this.value)">
        <div style="display:flex;align-items:center;gap:6px;flex:1;min-width:0;">
          <span style="font-weight:600;color:var(--texto-secundario);white-space:nowrap;">${sym}</span>
          <input aria-label="Costo del empaque" type="number" min="0" step="any" placeholder="Costo" value="${x.monto || ''}" oninput="actualizarFila(empaquesProducto,${i},'monto',this.value)">
        </div>
        <button class="btn-delete" onclick="eliminarFila(empaquesProducto,${i})">❌</button>
      </div>
    `).join('') || '<i>Aún no agregas empaques.</i>';
  };

  calcularPrecio = function calcularPrecioV2() {
    const mat = materialesDelProductoActual.reduce((suma, item) => suma + (Number(item.costoFinalCalculado) || 0), 0);
    const hrs = numeroSeguro(document.getElementById('horas')?.value, 0);
    const valorHora = numeroSeguro(document.getElementById('valorHora')?.value, 0);
    const margen = numeroSeguro(document.getElementById('margen')?.value, 0);
    const emp = empaquesProducto.reduce((suma, item) => suma + numeroSeguro(item.monto, 0), 0);
    const simbolo = simboloMoneda();

    const tallerProrrateado = costoPorHoraOperativo * hrs;
    const manoObra = hrs * valorHora;
    const costoTotal = mat + manoObra + tallerProrrateado + emp;
    const precioVenta = costoTotal * (1 + margen / 100);

    document.getElementById('precioFinal').innerText = `${simbolo} ${precioVenta.toFixed(2)}`;
    document.getElementById('desgloseCostos').innerHTML = `
      • Materiales: ${simbolo} ${mat.toFixed(2)}<br>
      • Mano de Obra: ${simbolo} ${manoObra.toFixed(2)}<br>
      • Gastos operativos (${hrs}h): ${simbolo} ${tallerProrrateado.toFixed(2)}<br>
      • Empaque: ${simbolo} ${emp.toFixed(2)}
    `;
    guardarDatosLocales();
  };

  const selectorUnidadCompra = document.getElementById('despensaUnidadCompra');
  if (selectorUnidadCompra) selectorUnidadCompra.innerHTML = opcionesUnidad('unidad');

  const selectorMoneda = document.getElementById('currency');
  if (selectorMoneda) {
    selectorMoneda.addEventListener('change', () => {
      renderizarDespensaGlobal();
      renderizarEmpaques();
      recalcularGastosVariables();
    });
  }

  renderizarDespensaGlobal();
  renderizarMaterialesProducto();
  renderizarEmpaques();
  renderizarGastosMensuales();
  recalcularGastosVariables();

  const valorHora = document.getElementById('valorHora');
  if (valorHora) valorHora.addEventListener('input', calcularPrecio);
})();
