// Correcciones temporales de la V2 mientras terminamos de integrar todo en index.html.
// Este archivo se carga después del script principal y puede acceder a los bindings globales
// declarados con let/const en el script anterior por su nombre directo (no vía window).

(function () {
  // Asegura gastos iniciales en instalaciones nuevas.
  if (Array.isArray(gastosMensuales) && gastosMensuales.length === 0) {
    gastosMensuales = gastoMensualInicial.map(item => ({ ...item }));
  }

  // Corrige el selector de unidad usada, incluida la unidad personalizada.
  prepararUnidadUsada = function prepararUnidadUsadaCorregida() {
    const selectorInsumo = document.getElementById('selectInsumoModal');
    if (!selectorInsumo) return;

    const idx = Number(selectorInsumo.value);
    const item = despensaGlobal[idx];
    if (!item) return;

    const compra = String(item.unidadCompra || 'unidad');
    const select = document.getElementById('unidadUsada');
    const inputOtro = document.getElementById('unidadUsadaOtra');
    if (!select || !inputOtro) return;

    const personalizada = compra.startsWith('otro:');
    select.innerHTML = opcionesUnidad(personalizada ? 'otro' : compra);

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

  // Corrige el cálculo antiguo que todavía buscaba el campo gastoEmpaque eliminado.
  calcularPrecio = function calcularPrecioCorregido() {
    const mat = materialesDelProductoActual.reduce(
      (suma, item) => suma + (Number(item.costoFinalCalculado) || 0),
      0
    );

    const hrs = numeroSeguro(document.getElementById('horas')?.value, 0);
    const valorHora = numeroSeguro(document.getElementById('valorHora')?.value, 0);
    const margen = numeroSeguro(document.getElementById('margen')?.value, 0);
    const emp = empaquesProducto.reduce(
      (suma, item) => suma + numeroSeguro(item.monto, 0),
      0
    );

    const selectorMoneda = document.getElementById('currency');
    const simbolo = selectorMoneda?.selectedOptions?.[0]?.dataset?.symbol || 'S/.';

    const tallerProrrateado = costoPorHoraOperativo * hrs;
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

    guardarDatosLocales();
  };

  // Inicialización que quedó incompleta al agotarse Codex.
  const selectorUnidadCompra = document.getElementById('despensaUnidadCompra');
  if (selectorUnidadCompra) {
    selectorUnidadCompra.innerHTML = opcionesUnidad('unidad');
  }

  renderizarDespensaGlobal();
  renderizarMaterialesProducto();
  renderizarEmpaques();
  renderizarGastosMensuales();
  recalcularGastosVariables();

  const valorHora = document.getElementById('valorHora');
  if (valorHora) valorHora.addEventListener('input', calcularPrecio);
})();
