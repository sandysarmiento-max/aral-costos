// Ajuste visual compacto para las tarjetas de Productos.
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .producto-card > div:last-child {
      display:grid;
      grid-template-columns:minmax(0,1fr) auto;
      grid-template-areas:
        "nombre nombre"
        "precio acciones"
        "meta meta";
      column-gap:8px;
      row-gap:2px;
      align-items:center;
      min-width:0;
    }

    .producto-card h3 {
      grid-area:nombre;
      margin:0 0 1px !important;
    }

    .producto-card .producto-precio {
      grid-area:precio;
      margin:0 !important;
      align-self:center;
    }

    .producto-card .producto-actions {
      grid-area:acciones;
      margin:0 !important;
      justify-self:end;
      align-self:center;
      display:flex;
      gap:3px;
    }

    .producto-card .producto-meta {
      grid-area:meta;
      margin:1px 0 0 !important;
    }

    .producto-card {
      padding:8px 9px !important;
      gap:9px !important;
      align-items:center;
    }

    .producto-foto,
    .producto-foto-placeholder {
      width:62px !important;
      height:62px !important;
    }

    .producto-actions button {
      width:28px !important;
      height:28px !important;
      border-radius:7px !important;
      font-size:.82rem !important;
    }
  `;
  document.head.appendChild(style);
})();
