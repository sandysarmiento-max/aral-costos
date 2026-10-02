// Herramientas visuales para Aral Costos V2: tema Suave/Neutro y calculadora flotante.
// Se carga después de v2-charges.js.

(function () {
  const STYLE_KEY = 'aralCostosStyleV2';
  const body = document.body;
  const phone = document.querySelector('.phone-container');
  if (!body || !phone) return;

  // --- Tema Suave / Neutro -------------------------------------------------
  const style = document.createElement('style');
  style.textContent = `
    body[data-aral-style="neutral"] {
      --bg-principal: #F5F3EE;
      --bg-tarjeta: #FFFFFF;
      --texto-principal: #303B3B;
      --texto-secundario: #6F7775;
      --primario-rosa: #C9D8D2;
      --primario-rosa-hover: #6F8E88;
      --acento-menta: #DDE8E4;
      --texto-menta: #315B55;
      --acento-lavanda: #E3E8EA;
      --borde: #E3E1DC;
    }

    .aral-theme-button {
      background: none;
      border: none;
      font-size: 1.15rem;
      cursor: pointer;
      padding: 4px 6px;
      border-radius: 8px;
    }

    .aral-calc-btn {
      position: absolute;
      right: 16px;
      bottom: 82px;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      border: none;
      background: var(--texto-principal);
      color: var(--bg-tarjeta);
      font-size: 1.35rem;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(0,0,0,.18);
      z-index: 35;
    }

    .aral-calc-panel {
      position: absolute;
      right: 14px;
      bottom: 142px;
      width: min(320px, calc(100% - 28px));
      background: var(--bg-tarjeta);
      border: 1px solid var(--borde);
      border-radius: 18px;
      padding: 12px;
      box-shadow: 0 14px 36px rgba(0,0,0,.18);
      z-index: 40;
      display: none;
    }

    .aral-calc-panel.open { display: block; }

    .aral-calc-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .aral-calc-display {
      width: 100%;
      padding: 12px;
      border-radius: 10px;
      border: 1px solid var(--borde);
      background: var(--bg-principal);
      text-align: right;
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--texto-principal);
      margin-bottom: 10px;
      overflow: hidden;
      white-space: nowrap;
    }

    .aral-calc-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }

    .aral-calc-key {
      padding: 11px 6px;
      border: 1px solid var(--borde);
      border-radius: 10px;
      background: var(--bg-principal);
      color: var(--texto-principal);
      font-size: 1rem;
      cursor: pointer;
    }

    .aral-calc-key.op { background: var(--acento-lavanda); }
    .aral-calc-key.eq { background: var(--primario-rosa); font-weight: 700; }
  `;
  document.head.appendChild(style);

  function aplicarEstilo(nombre) {
    const estilo = nombre === 'neutral' ? 'neutral' : 'soft';
    body.removeAttribute('data-theme');
    body.setAttribute('data-aral-style', estilo);
    try { localStorage.setItem(STYLE_KEY, estilo); } catch (_) {}
    const boton = document.querySelector('.aral-theme-button');
    if (boton) boton.title = estilo === 'soft' ? 'Cambiar a estilo Neutro' : 'Cambiar a estilo Suave';
  }

  let estiloGuardado = 'soft';
  try { estiloGuardado = localStorage.getItem(STYLE_KEY) || 'soft'; } catch (_) {}
  aplicarEstilo(estiloGuardado);

  const headerButton = document.querySelector('header button[onclick="toggleTheme()"]');
  if (headerButton) {
    headerButton.classList.add('aral-theme-button');
    headerButton.textContent = '🎨';
    headerButton.setAttribute('aria-label', 'Cambiar estilo visual');
  }

  toggleTheme = function cambiarEstiloVisual() {
    const actual = body.getAttribute('data-aral-style') || 'soft';
    aplicarEstilo(actual === 'soft' ? 'neutral' : 'soft');
  };

  // --- Calculadora flotante -------------------------------------------------
  const calcBtn = document.createElement('button');
  calcBtn.type = 'button';
  calcBtn.className = 'aral-calc-btn';
  calcBtn.textContent = '🧮';
  calcBtn.setAttribute('aria-label', 'Abrir calculadora');
  calcBtn.title = 'Calculadora';

  const panel = document.createElement('div');
  panel.className = 'aral-calc-panel';
  panel.innerHTML = `
    <div class="aral-calc-top">
      <strong style="color:var(--texto-principal);">Calculadora</strong>
      <button type="button" id="cerrarCalcAral" style="border:none;background:none;font-size:1.2rem;cursor:pointer;color:var(--texto-secundario);">✕</button>
    </div>
    <div id="displayCalcAral" class="aral-calc-display">0</div>
    <div class="aral-calc-grid">
      <button class="aral-calc-key op" data-action="clear">C</button>
      <button class="aral-calc-key op" data-action="back">⌫</button>
      <button class="aral-calc-key op" data-op="/">÷</button>
      <button class="aral-calc-key op" data-op="*">×</button>
      <button class="aral-calc-key" data-num="7">7</button>
      <button class="aral-calc-key" data-num="8">8</button>
      <button class="aral-calc-key" data-num="9">9</button>
      <button class="aral-calc-key op" data-op="-">−</button>
      <button class="aral-calc-key" data-num="4">4</button>
      <button class="aral-calc-key" data-num="5">5</button>
      <button class="aral-calc-key" data-num="6">6</button>
      <button class="aral-calc-key op" data-op="+">+</button>
      <button class="aral-calc-key" data-num="1">1</button>
      <button class="aral-calc-key" data-num="2">2</button>
      <button class="aral-calc-key" data-num="3">3</button>
      <button class="aral-calc-key eq" data-action="equals" style="grid-row:span 2;">=</button>
      <button class="aral-calc-key" data-num="0" style="grid-column:span 2;">0</button>
      <button class="aral-calc-key" data-num=".">.</button>
    </div>
  `;

  phone.appendChild(calcBtn);
  phone.appendChild(panel);

  let actual = '0';
  let previo = null;
  let operador = null;
  let esperandoNuevo = false;
  const display = panel.querySelector('#displayCalcAral');

  function pintar() {
    display.textContent = actual;
  }

  function operar(a, b, op) {
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '*') return a * b;
    if (op === '/') return b === 0 ? null : a / b;
    return b;
  }

  function resolverPendiente() {
    if (previo === null || !operador) return;
    const resultado = operar(previo, Number(actual), operador);
    actual = resultado === null ? 'Error' : String(Number(resultado.toFixed(10)));
    previo = null;
    operador = null;
    esperandoNuevo = true;
    pintar();
  }

  calcBtn.addEventListener('click', () => panel.classList.toggle('open'));
  panel.querySelector('#cerrarCalcAral').addEventListener('click', () => panel.classList.remove('open'));

  panel.addEventListener('click', event => {
    const key = event.target.closest('.aral-calc-key');
    if (!key) return;

    if (key.dataset.num !== undefined) {
      const n = key.dataset.num;
      if (actual === 'Error' || esperandoNuevo) {
        actual = n === '.' ? '0.' : n;
        esperandoNuevo = false;
      } else if (n === '.') {
        if (!actual.includes('.')) actual += '.';
      } else {
        actual = actual === '0' ? n : actual + n;
      }
      pintar();
      return;
    }

    if (key.dataset.op) {
      if (actual === 'Error') return;
      if (previo !== null && operador && !esperandoNuevo) {
        const resultado = operar(previo, Number(actual), operador);
        if (resultado === null) {
          actual = 'Error'; previo = null; operador = null; esperandoNuevo = true; pintar(); return;
        }
        actual = String(Number(resultado.toFixed(10)));
      }
      previo = Number(actual);
      operador = key.dataset.op;
      esperandoNuevo = true;
      pintar();
      return;
    }

    if (key.dataset.action === 'clear') {
      actual = '0'; previo = null; operador = null; esperandoNuevo = false; pintar();
    } else if (key.dataset.action === 'back') {
      if (!esperandoNuevo && actual !== 'Error') {
        actual = actual.length > 1 ? actual.slice(0, -1) : '0';
        pintar();
      }
    } else if (key.dataset.action === 'equals') {
      resolverPendiente();
    }
  });
})();
