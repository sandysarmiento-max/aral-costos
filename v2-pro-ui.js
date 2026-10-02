// Capa visual profesional para Aral Costos V2.
// Cargar al final, después de los módulos funcionales.

(function () {
  const style = document.createElement('style');
  style.textContent = `
    :root {
      --ui-radius: 12px;
      --ui-line: #E8E5DF;
      --ui-soft: #F7F6F3;
      --ui-ink: #263238;
      --ui-muted: #778087;
    }

    * { -webkit-tap-highlight-color: transparent; }

    body {
      background:#E9E6E1;
      color:var(--texto-principal);
    }

    .phone-container {
      border-radius:20px;
      box-shadow:0 8px 28px rgba(42,48,52,.10);
    }

    header {
      padding:10px 16px;
      min-height:58px;
    }
    .logo-text {
      font-size:1.2rem;
      letter-spacing:-.5px;
      font-weight:650;
    }
    .tagline {
      font-size:.68rem;
      margin-top:1px;
      font-weight:400;
    }

    main {
      padding:10px 12px 82px;
    }

    .card {
      border-radius:13px;
      padding:14px;
      margin-bottom:10px;
      border:1px solid var(--borde);
      box-shadow:0 1px 2px rgba(30,40,45,.025);
    }

    .section-title {
      font-size:.94rem;
      font-weight:600;
      margin-bottom:10px;
      letter-spacing:-.1px;
    }

    label {
      font-size:.74rem;
      font-weight:500;
      margin-bottom:4px;
    }

    input, select {
      min-height:36px;
      padding:7px 10px;
      border-radius:9px;
      font-size:.84rem;
      font-weight:400;
      border-color:var(--borde);
    }

    .input-group { margin-bottom:9px; }
    .flex-inputs { gap:7px; }

    .btn-main {
      min-height:40px;
      padding:9px 12px;
      border-radius:10px;
      font-size:.85rem;
      font-weight:600;
      box-shadow:none;
    }

    .btn-secondary {
      background:var(--acento-lavanda);
    }

    .backup-note {
      font-size:.74rem;
      line-height:1.35;
      margin-bottom:9px;
      font-weight:400;
    }

    .bottom-nav {
      height:64px;
    }
    .nav-item {
      font-size:.66rem;
      font-weight:400;
      gap:1px;
    }
    .nav-item.active {
      font-weight:600;
    }
    .nav-item span {
      font-size:1.05rem;
      margin-bottom:1px;
    }

    .result-box {
      padding:12px;
      border-radius:11px;
    }
    .result-box .price {
      font-size:1.5rem;
      font-weight:700;
      letter-spacing:-.35px;
    }
    .desglose-texto {
      font-size:.74rem;
      line-height:1.45;
      margin-top:8px;
      font-weight:400;
    }

    /* Materiales: tabla compacta estilo app nativa */
    #listaMaterialesProducto {
      margin-top:2px;
      border:1px solid var(--borde);
      border-radius:11px;
      overflow:hidden;
      background:var(--bg-tarjeta);
    }
    .mat-head {
      display:grid;
      grid-template-columns:minmax(0,1fr) 82px 62px 26px;
      gap:6px;
      align-items:center;
      padding:7px 8px;
      background:var(--bg-principal);
      border-bottom:1px solid var(--borde);
      color:var(--texto-secundario);
      font-size:.63rem;
      font-weight:600;
      text-transform:uppercase;
      letter-spacing:.22px;
    }
    .mat-row {
      display:grid;
      grid-template-columns:minmax(0,1fr) 82px 62px 26px;
      gap:6px;
      align-items:center;
      min-height:50px;
      padding:6px 8px;
      border-bottom:1px solid var(--borde);
      background:var(--bg-tarjeta);
    }
    .mat-row:last-child { border-bottom:none; }
    .mat-name {
      min-width:0;
      font-size:.77rem;
      font-weight:500;
      line-height:1.18;
      color:var(--texto-principal);
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .mat-unit-cost {
      margin-top:3px;
      font-size:.62rem;
      color:var(--texto-secundario);
      font-weight:400;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .mat-qty {
      display:flex;
      align-items:center;
      justify-content:flex-end;
      gap:4px;
      min-width:0;
    }
    .mat-qty input {
      width:50px !important;
      min-height:30px !important;
      height:30px;
      padding:3px 5px !important;
      border-radius:7px !important;
      font-size:.74rem !important;
      font-weight:400 !important;
      text-align:right;
      background:var(--bg-principal);
    }
    .mat-qty span {
      font-size:.65rem;
      font-weight:400;
      color:var(--texto-secundario);
      white-space:nowrap;
      max-width:28px;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .mat-cost {
      text-align:right;
      font-size:.77rem;
      font-weight:650;
      white-space:nowrap;
    }
    .mat-delete {
      width:26px;
      height:26px;
      border:none;
      background:transparent;
      color:#D35A63;
      font-size:1rem;
      cursor:pointer;
      padding:0;
      line-height:1;
    }
    .mat-empty {
      padding:14px 10px;
      font-size:.74rem;
      font-weight:400;
      color:var(--texto-secundario);
      text-align:center;
    }

    #tab-costear .card:first-child {
      padding:9px 12px !important;
      border-radius:11px;
      margin-bottom:10px;
    }
    #tab-costear .card:first-child label {
      font-size:.71rem;
      font-weight:500;
    }
    #tab-costear .card:first-child select {
      min-height:34px;
      padding:5px 8px !important;
    }

    #listaEmpaques .dynamic-row,
    #listaGastosMensuales .dynamic-row {
      margin:6px 0;
      gap:6px;
    }

    /* Despensa: menos peso visual */
    #listaDespensaGlobal .item-row b {
      font-weight:600;
    }
    #listaDespensaGlobal .item-row small {
      font-weight:400;
      font-size:.7rem;
    }

    @media (max-width:380px) {
      .mat-head,
      .mat-row { grid-template-columns:minmax(0,1fr) 76px 55px 24px; gap:4px; }
      .mat-qty input { width:46px !important; }
      .card { padding:12px; }
      main { padding-left:9px; padding-right:9px; }
    }
  `;
  document.head.appendChild(style);

  function escapar(valor) {
    return typeof escaparHtml === 'function'
      ? escaparHtml(valor)
      : String(valor ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function textoUnidad(unidad) {
    const u = String(unidad || 'unidad');
    return u.startsWith('otro:') ? u.slice(5) : u;
  }

  function simbolo() {
    return document.getElementById('currency')?.selectedOptions?.[0]?.dataset?.symbol || 'S/.';
  }

  // Conserva la edición de cantidad, pero presenta los materiales como una tabla compacta.
  renderizarMaterialesProducto = function renderizarMaterialesProductoPro() {
    const contenedor = document.getElementById('listaMaterialesProducto');
    if (!contenedor) return;
    const sym = simbolo();

    if (!materialesDelProductoActual.length) {
      contenedor.innerHTML = '<div class="mat-empty">Selecciona materiales de tu despensa para empezar.</div>';
      return;
    }

    contenedor.innerHTML = `
      <div class="mat-head">
        <span>Material</span><span style="text-align:right;">Cantidad</span><span style="text-align:right;">Costo</span><span></span>
      </div>
      ${materialesDelProductoActual.map((item, i) => {
        const cantidad = Number(item.cantidadUsada) || 0;
        const costo = Number(item.costoFinalCalculado) || 0;
        const costoUnidad = cantidad > 0 ? costo / cantidad : 0;
        const unidad = textoUnidad(item.unidadUsada);
        return `
          <div class="mat-row">
            <div style="min-width:0;">
              <div class="mat-name">${escapar(item.nombre)}</div>
              <div class="mat-unit-cost">${sym} ${costoUnidad.toFixed(4)} / ${escapar(unidad)}</div>
            </div>
            <div class="mat-qty">
              <input type="number" min="0.0001" step="any" value="${cantidad}" aria-label="Cantidad usada de ${escapar(item.nombre)}" data-material-cantidad="${i}">
              <span title="${escapar(unidad)}">${escapar(unidad)}</span>
            </div>
            <div class="mat-cost">${costo.toFixed(2)}</div>
            <button class="mat-delete" onclick="eliminarMaterialProducto(${i})" aria-label="Eliminar ${escapar(item.nombre)}">×</button>
          </div>
        `;
      }).join('')}
    `;
  };

  const botonDespensa = Array.from(document.querySelectorAll('#tab-costear .btn-main'))
    .find(btn => btn.textContent.includes('Traer de mi Despensa'));
  if (botonDespensa) {
    botonDespensa.textContent = '+ Agregar material';
    botonDespensa.style.marginBottom = '10px';
  }

  // Quita emojis decorativos de títulos, manteniendo textos y etiquetas internas.
  document.querySelectorAll('.section-title').forEach(el => {
    Array.from(el.childNodes).forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        node.textContent = node.textContent.replace(/^\s*[\u{1F300}-\u{1FAFF}\u2600-\u27BF]+\s*/u, '');
      }
    });
  });

  renderizarMaterialesProducto();
})();
