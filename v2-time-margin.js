// COSTALIA - Controles compactos de Tiempo y Margen.
// Se carga después de v2-profit.js y v2-currencies.js.
// Mantiene los IDs existentes para no romper cálculos, respaldo ni restauración.

(function () {
  const horas = document.getElementById('horas');
  const valorHora = document.getElementById('valorHora');
  const margen = document.getElementById('margen');

  if (!horas || !valorHora || !margen) return;

  const card = horas.closest('.card');
  const grupoHoras = horas.closest('.input-group');
  const grupoValorHora = valorHora.closest('.input-group');
  const grupoMargen = margen.closest('.input-group');

  if (!card || !grupoHoras || !grupoValorHora || !grupoMargen) return;

  card.classList.add('costalia-tiempo-margen');

  const style = document.createElement('style');
  style.id = 'costalia-tiempo-margen-estilos';
  style.textContent = `
    .costalia-tiempo-margen {
      padding: 16px;
    }

    .costalia-tiempo-margen .section-title {
      margin-bottom: 10px;
    }

    .costalia-tiempo-margen .costalia-tiempo-costo-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) minmax(0, .95fr);
      gap: 12px;
      align-items: start;
    }

    .costalia-tiempo-margen .input-group {
      margin-bottom: 10px;
    }

    .costalia-tiempo-margen label {
      margin-bottom: 6px;
    }

    .costalia-stepper {
      display: grid;
      grid-template-columns: 44px minmax(64px, 1fr) 44px;
      width: 100%;
      height: 44px;
    }

    .costalia-stepper button {
      width: 44px;
      height: 44px;
      border: 1px solid var(--borde);
      background: var(--bg-principal);
      color: var(--texto-principal);
      font-size: 24px;
      font-weight: 800;
      line-height: 1;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }

    .costalia-stepper button:first-child {
      border-radius: 10px 0 0 10px;
    }

    .costalia-stepper button:last-child {
      border-radius: 0 10px 10px 0;
    }

    .costalia-stepper input {
      height: 44px;
      min-width: 0;
      border-radius: 0;
      border-left: 0;
      border-right: 0;
      text-align: center;
      padding: 0 6px;
      font-weight: 700;
      background: var(--bg-principal);
    }

    .costalia-stepper button:active {
      transform: scale(.96);
    }

    .costalia-money-input,
    .costalia-percent-input {
      display: flex;
      align-items: center;
      gap: 7px;
      min-width: 0;
    }

    .costalia-money-input input,
    .costalia-percent-input input {
      height: 44px;
      min-width: 0;
    }

    .costalia-money-symbol,
    .costalia-percent-symbol {
      flex: 0 0 auto;
      color: var(--texto-principal);
      font-size: 1rem;
      font-weight: 700;
      white-space: nowrap;
    }

    .costalia-tiempo-margen .costalia-profit-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(120px, .72fr);
      gap: 12px;
      align-items: end;
    }

    .costalia-tiempo-margen .costalia-profit-row > .input-group {
      margin-bottom: 0;
    }

    .costalia-tiempo-margen .range-value {
      display: none !important;
    }

    .costalia-tiempo-margen input[type="number"]::-webkit-outer-spin-button,
    .costalia-tiempo-margen input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .costalia-tiempo-margen input[type="number"] {
      appearance: textfield;
      -moz-appearance: textfield;
    }

    @media (max-width: 390px) {
      .costalia-tiempo-margen {
        padding: 14px;
      }

      .costalia-tiempo-margen .costalia-tiempo-costo-grid,
      .costalia-tiempo-margen .costalia-profit-row {
        grid-template-columns: 1fr;
        gap: 8px;
      }

      .costalia-stepper {
        grid-template-columns: 46px minmax(80px, 1fr) 46px;
      }

      .costalia-stepper button {
        width: 46px;
      }
    }
  `;
  document.head.appendChild(style);

  // Horas: convertir el slider en campo numérico editable, sin máximo de 12 h.
  horas.type = 'number';
  horas.min = '0';
  horas.step = '0.5';
  horas.removeAttribute('max');
  horas.setAttribute('inputmode', 'decimal');
  horas.removeAttribute('oninput');

  const sliderHoras = horas.closest('.slider-container');
  const stepper = document.createElement('div');
  stepper.className = 'costalia-stepper';

  const btnMenos = document.createElement('button');
  btnMenos.type = 'button';
  btnMenos.setAttribute('aria-label', 'Restar media hora');
  btnMenos.textContent = '−';

  const btnMas = document.createElement('button');
  btnMas.type = 'button';
  btnMas.setAttribute('aria-label', 'Sumar media hora');
  btnMas.textContent = '+';

  if (sliderHoras) {
    sliderHoras.parentElement.insertBefore(stepper, sliderHoras);
    stepper.append(btnMenos, horas, btnMas);
    sliderHoras.remove();
  } else {
    grupoHoras.appendChild(stepper);
    stepper.append(btnMenos, horas, btnMas);
  }

  function normalizarHoras(valor) {
    const n = Number.parseFloat(valor);
    return Number.isFinite(n) ? Math.max(0, n) : 0;
  }

  function recalcularDesdeTiempo() {
    if (typeof globalThis.calcularPrecio === 'function') {
      globalThis.calcularPrecio();
    } else if (typeof calcularPrecio === 'function') {
      calcularPrecio();
    }
    if (typeof globalThis.guardarDatosLocales === 'function') {
      globalThis.guardarDatosLocales();
    }
  }

  function cambiarHoras(delta) {
    const actual = normalizarHoras(horas.value);
    const siguiente = Math.max(0, Math.round((actual + delta) * 2) / 2);
    horas.value = String(siguiente);

    // Recalcular de forma explícita al usar + / -.
    recalcularDesdeTiempo();

    // Mantener eventos para cualquier otra lógica que escuche estos cambios.
    horas.dispatchEvent(new Event('input', { bubbles: true }));
    horas.dispatchEvent(new Event('change', { bubbles: true }));
  }

  btnMenos.addEventListener('click', () => cambiarHoras(-0.5));
  btnMas.addEventListener('click', () => cambiarHoras(0.5));

  horas.addEventListener('input', () => {
    // También recalcula cuando la usuaria escribe el tiempo manualmente.
    recalcularDesdeTiempo();
  });

  horas.addEventListener('blur', () => {
    const valor = normalizarHoras(horas.value);
    horas.value = String(Math.round(valor * 2) / 2);
    recalcularDesdeTiempo();
  });

  const etiquetaHoras = grupoHoras.querySelector('label');
  if (etiquetaHoras) etiquetaHoras.textContent = 'Tiempo dedicado';

  // Pago por hora: solo entrada manual, con la moneda visible.
  valorHora.type = 'number';
  valorHora.min = '0';
  valorHora.step = 'any';
  valorHora.setAttribute('inputmode', 'decimal');

  const moneyWrap = document.createElement('div');
  moneyWrap.className = 'costalia-money-input';
  const moneySymbol = document.createElement('span');
  moneySymbol.className = 'costalia-money-symbol';
  moneySymbol.setAttribute('aria-hidden', 'true');

  valorHora.parentElement.insertBefore(moneyWrap, valorHora);
  moneyWrap.append(moneySymbol, valorHora);

  const etiquetaValorHora = grupoValorHora.querySelector('label');
  if (etiquetaValorHora) etiquetaValorHora.textContent = 'Costo por hora';

  valorHora.addEventListener('input', () => {
    if (typeof calcularPrecio === 'function') calcularPrecio();
  });

  // Porcentaje: entrada manual, sin slider ni límite superior artificial.
  margen.type = 'number';
  margen.min = '0';
  margen.step = 'any';
  margen.removeAttribute('max');
  margen.setAttribute('inputmode', 'decimal');
  margen.removeAttribute('oninput');

  const sliderMargen = margen.closest('.slider-container');
  const percentWrap = document.createElement('div');
  percentWrap.className = 'costalia-percent-input';
  const percentSymbol = document.createElement('span');
  percentSymbol.className = 'costalia-percent-symbol';
  percentSymbol.textContent = '%';
  percentSymbol.setAttribute('aria-hidden', 'true');

  if (sliderMargen) {
    sliderMargen.parentElement.insertBefore(percentWrap, sliderMargen);
    percentWrap.append(margen, percentSymbol);
    sliderMargen.remove();
  } else {
    grupoMargen.appendChild(percentWrap);
    percentWrap.append(margen, percentSymbol);
  }

  const etiquetaMargen = grupoMargen.querySelector('label');
  if (etiquetaMargen) etiquetaMargen.textContent = 'Ganancia';

  margen.addEventListener('input', () => {
    if (typeof updateMargenLabel === 'function') updateMargenLabel(margen.value);
    else if (typeof calcularPrecio === 'function') calcularPrecio();
  });

  // Compactar Tiempo + Costo por hora en una misma fila.
  const gridTiempoCosto = document.createElement('div');
  gridTiempoCosto.className = 'costalia-tiempo-costo-grid';
  grupoHoras.parentElement.insertBefore(gridTiempoCosto, grupoHoras);
  gridTiempoCosto.append(grupoHoras, grupoValorHora);

  // Compactar selector de ganancia + campo de valor.
  const modoGanancia = document.getElementById('modoGanancia');
  const selectorWrap = modoGanancia?.closest('.input-group');
  const gananciaFija = document.getElementById('gananciaFija');
  const fijoWrap = gananciaFija?.closest('.input-group');

  if (selectorWrap) {
    const profitRow = document.createElement('div');
    profitRow.className = 'costalia-profit-row';
    selectorWrap.parentElement.insertBefore(profitRow, selectorWrap);
    profitRow.appendChild(selectorWrap);

    if (grupoMargen.parentElement !== profitRow) profitRow.appendChild(grupoMargen);

    // v2-profit alterna display entre porcentaje y monto fijo.
    if (fijoWrap) {
      fijoWrap.classList.add('costalia-fijo-wrap');

      const observarModo = () => {
        if (modoGanancia.value === 'fijo') {
          if (grupoMargen.parentElement === profitRow) grupoMargen.remove();
          if (fijoWrap.parentElement !== profitRow) profitRow.appendChild(fijoWrap);
        } else {
          if (fijoWrap.parentElement === profitRow) fijoWrap.remove();
          if (grupoMargen.parentElement !== profitRow) profitRow.appendChild(grupoMargen);
        }
      };

      modoGanancia.addEventListener('change', () => {
        requestAnimationFrame(observarModo);
      });

      observarModo();
    }
  }

  function simboloMonedaActual() {
    return document.getElementById('currency')?.selectedOptions?.[0]?.dataset?.symbol || 'S/.';
  }

  function refrescarMoneda() {
    moneySymbol.textContent = simboloMonedaActual();
  }

  const currency = document.getElementById('currency');
  if (currency) currency.addEventListener('change', refrescarMoneda);
  refrescarMoneda();

  // Recalcular al terminar de montar los nuevos controles.
  if (typeof calcularPrecio === 'function') calcularPrecio();
})();
