// Correcciones temporales de la V2 mientras terminamos de integrar todo en index.html.
// Se carga después del script principal para reemplazar funciones incompletas de la primera pasada de Codex.

(function () {
  if (typeof window === 'undefined') return;

  // Asegura gastos iniciales en instalaciones nuevas.
  if (Array.isArray(window.gastosMensuales) && window.gastosMensuales.length === 0) {
    const base = Array.isArray(window.gastoMensualInicial)
      ? window.gastoMensualInicial
      : [
          { nombre: 'Luz', monto: 40 },
          { nombre: 'Agua', monto: 15 },
          { nombre: 'Alquiler / Espacio', monto: 150 },
          { nombre: 'Otros gastos', monto: 20 }
        ];
    window.gastosMensuales = base.map(item => ({ ...item }));
  }

  // Corrige el selector de unidad usada, incluida la unidad personalizada.
  window.prepararUnidadUsada = function prepararUnidadUsada() {
    const selectorInsumo = document.getElementById('selectInsumoModal');
    if (!selectorInsumo || !Array.isArray(window.despensaGlobal)) return;

    const idx = Number(selectorInsumo.value);
    const item = window.despensaGlobal[idx];
    if (!item) return;

    const compra = String(item.unidadCompra || 'unidad');
    const select = document.getElementById('unidadUsada');
    const inputOtro = document.getElementById('unidadUsadaOtra');
    if (!select || !inputOtro || typeof window.opcionesUnidad !== 'function') return;

    const personalizada = compra.startsWith('otro:');
    select.innerHTML = window.opcionesUnidad(personalizada ? 'otro' : compra);

    if (personalizada) {
      inputOtro.value = compra.slice(5);
      inputOtro.style.display = 'block';
    } else {
      inputOtro.value = '';
      inputOtro.style.display = 'none';
    }

    select.onchange = () => {
      const esOtro = select.value === 'otro';
      inputOtro.style.display = esOtro ? 'block' : 'none';
      if (!esOtro) inputOtro.value = '';
    };
  };

  // Reemplaza el cálculo antiguo que todavía buscaba gastoEmpaque.
  window.calcularPrecio = function calcularPrecio() {
    const numero = typeof window.numeroSeguro === 'function'
      ? window.numeroSeguro
      : (valor, respaldo = 0) => {
          const n = parseFloat(valor);
          return Number.isFinite(n) ? n : respaldo;
        };

    const materiales = Array.isArray(window.materialesDelProductoActual)
      ? window.materialesDelProductoActual
      : [];
    const empaques = Array.isArray(window.empaquesProducto) ? window.empaquesProducto : [];

    const mat = materiales.reduce((suma, item) => suma + (Number(item.costoFinalCalculado) || 0), 0);
    const hrs = numero(document.getElementById('horas')?.value, 0);
    const valorHora = numero(document.getElementById('valorHora')?.value, 0);
    const margen = numero(document.getElementById('margen')?.value, 0);
    const emp = empaques.reduce((suma, item) => suma + numero(item.monto, 0), 0);

    const selectorMoneda = document.getElementById('currency');
    const simbolo = selectorMoneda?.selectedOptions?.[0]?.dataset?.symbol || 'S/.';

    const tallerProrrateado = (Number(window.costoPorHoraOperativo) || 0) * hrs;
    const manoObra = hrs * valorHora;
    const costoTotal = mat + manoObra + tallerProrrateado + emp;
    const precioVenta = costoTotal * (1 + margen / 100);

    const precioFinal = document.getElementById('precioFinal');
    if (precioFinal) precioFinal.innerText = `${simbolo} ${precioVenta.toFixed(2)}`;

    const desglose = document.getElementById('desgloseCostos');
    if (desglose) {
      desglose.innerHTML = `
        • Materiales: ${simbolo} ${mat.toFixed(2)}<br>
        • Mano de Obra: ${simbolo} ${manoObra.toFixed(2)}<br>
        • Gastos operativos (${hrs}h): ${simbolo} ${tallerProrrateado.toFixed(2)}<br>
        • Empaque: ${simbolo} ${emp.toFixed(2)}
      `;
    }

    if (typeof window.guardarDatosLocales === 'function') window.guardarDatosLocales();
  };

  // Inicialización que quedó cortada al agotarse Codex.
  const selectorUnidadCompra = document.getElementById('despensaUnidadCompra');
  if (selectorUnidadCompra && typeof window.opcionesUnidad === 'function') {
    selectorUnidadCompra.innerHTML = window.opcionesUnidad('unidad');
  }

  if (typeof window.renderizarDespensaGlobal === 'function') window.renderizarDespensaGlobal();
  if (typeof window.renderizarMaterialesProducto === 'function') window.renderizarMaterialesProducto();
  if (typeof window.renderizarEmpaques === 'function') window.renderizarEmpaques();
  if (typeof window.renderizarGastosMensuales === 'function') window.renderizarGastosMensuales();
  if (typeof window.recalcularGastosVariables === 'function') window.recalcularGastosVariables();

  const valorHora = document.getElementById('valorHora');
  if (valorHora) valorHora.addEventListener('input', window.calcularPrecio);
})();
