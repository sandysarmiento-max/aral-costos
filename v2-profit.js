// Ganancia por porcentaje o monto fijo para Aral Costos V2.
// Se carga después de v2-fixes.js y v2-layout.js.

(function () {
  const margen = document.getElementById('margen');
  if (!margen) return;

  const grupoMargen = margen.closest('.input-group');
  if (!grupoMargen) return;

  const etiquetaMargen = grupoMargen.querySelector('label');
  if (etiquetaMargen) etiquetaMargen.textContent = 'Ganancia (%)';

  const selectorWrap = document.createElement('div');
  selectorWrap.className = 'input-group';
  selectorWrap.innerHTML = `
    <label for="modoGanancia">Cómo quieres calcular la ganancia</label>
    <select id="modoGanancia">
      <option value="porcentaje">Porcentaje</option>
      <option value="fijo">Monto fijo</option>
    </select>
  `;
  grupoMargen.parentElement.insertBefore(selectorWrap, grupoMargen);

  const fijoWrap = document.createElement('div');
  fijoWrap.className = 'input-group';
  fijoWrap.style.display = 'none';
  fijoWrap.innerHTML = `
    <label for="gananciaFija">Ganancia fija</label>
    <div style="position:relative;">
      <span id="simboloGananciaFija" style="position:absolute;left:12px;top:50%;transform:translateY(-50%);font-weight:600;color:var(--texto-secundario);pointer-events:none;">S/.</span>
      <input id="gananciaFija" type="number" min="0" step="any" value="10" style="padding-left:42px;">
    </div>
  `;
  grupoMargen.parentElement.insertBefore(fijoWrap, grupoMargen.nextSibling);

  const modo = document.getElementById('modoGanancia');
  const gananciaFija = document.getElementById('gananciaFija');
  const simboloGananciaFija = document.getElementById('simboloGananciaFija');

  function simboloMonedaLocal() {
    return document.getElementById('currency')?.selectedOptions?.[0]?.dataset?.symbol || 'S/.';
  }

  function refrescarModo() {
    const esFijo = modo.value === 'fijo';
    grupoMargen.style.display = esFijo ? 'none' : '';
    fijoWrap.style.display = esFijo ? '' : 'none';
    simboloGananciaFija.textContent = simboloMonedaLocal();
    calcularPrecio();
    guardarDatosLocales();
  }

  modo.addEventListener('change', refrescarModo);
  gananciaFija.addEventListener('input', () => {
    calcularPrecio();
    guardarDatosLocales();
  });

  const selectorMoneda = document.getElementById('currency');
  if (selectorMoneda) {
    selectorMoneda.addEventListener('change', () => {
      simboloGananciaFija.textContent = simboloMonedaLocal();
    });
  }

  const obtenerFormularioAnterior = obtenerFormularioActual;
  obtenerFormularioActual = function obtenerFormularioActualConGanancia() {
    return {
      ...obtenerFormularioAnterior(),
      modoGanancia: modo.value,
      gananciaFija: gananciaFija.value
    };
  };

  const aplicarFormularioAnterior = aplicarFormulario;
  aplicarFormulario = function aplicarFormularioConGanancia(datos = {}) {
    aplicarFormularioAnterior(datos);
    if (datos.modoGanancia === 'fijo' || datos.modoGanancia === 'porcentaje') {
      modo.value = datos.modoGanancia;
    }
    if (datos.gananciaFija !== undefined) gananciaFija.value = datos.gananciaFija;
    refrescarModo();
  };

  calcularPrecio = function calcularPrecioConModoGanancia() {
    const mat = materialesDelProductoActual.reduce((suma, item) => suma + (Number(item.costoFinalCalculado) || 0), 0);
    const hrs = numeroSeguro(document.getElementById('horas')?.value, 0);
    const valorHora = numeroSeguro(document.getElementById('valorHora')?.value, 0);
    const emp = empaquesProducto.reduce((suma, item) => suma + numeroSeguro(item.monto, 0), 0);
    const simbolo = simboloMonedaLocal();

    const tallerProrrateado = costoPorHoraOperativo * hrs;
    const manoObra = hrs * valorHora;
    const costoTotal = mat + manoObra + tallerProrrateado + emp;

    let ganancia = 0;
    if (modo.value === 'fijo') {
      ganancia = Math.max(numeroSeguro(gananciaFija.value, 0), 0);
    } else {
      const porcentaje = Math.max(numeroSeguro(margen.value, 0), 0);
      ganancia = costoTotal * (porcentaje / 100);
    }

    const precioVenta = costoTotal + ganancia;

    document.getElementById('precioFinal').innerText = `${simbolo} ${precioVenta.toFixed(2)}`;
    document.getElementById('desgloseCostos').innerHTML = `
      • Materiales: ${simbolo} ${mat.toFixed(2)}<br>
      • Mano de obra: ${simbolo} ${manoObra.toFixed(2)}<br>
      • Gastos operativos (${hrs}h): ${simbolo} ${tallerProrrateado.toFixed(2)}<br>
      • Empaque: ${simbolo} ${emp.toFixed(2)}<br>
      • Costo total: ${simbolo} ${costoTotal.toFixed(2)}<br>
      • Ganancia: ${simbolo} ${ganancia.toFixed(2)}
    `;

    guardarDatosLocales();
  };

  refrescarModo();
})();
