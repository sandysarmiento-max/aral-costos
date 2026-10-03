// Ajuste visual compacto para las tarjetas de Productos.
(function () {
  const style = document.createElement('style');
  style.textContent = `
    .producto-card > div:last-child {
      display:grid;
      grid-template-columns:minmax(0,1fr);
      grid-template-areas:
        "nombre"
        "precio"
        "meta"
        "acciones";
      row-gap:3px;
      align-items:center;
      min-width:0;
    }

    .producto-card h3 {
      grid-area:nombre;
      margin:0 0 1px !important;
      font-weight:500 !important;
      font-size:.9rem !important;
      letter-spacing:-.1px;
    }

    .producto-card .producto-precio {
      grid-area:precio;
      margin:0 !important;
      align-self:center;
      font-weight:650 !important;
      color:#2F6F73 !important;
      font-size:.96rem !important;
    }

    body[data-aral-style="neutral"] .producto-card .producto-precio {
      color:#315B55 !important;
    }

    .producto-card .producto-actions {
      grid-area:acciones;
      margin:4px 0 0 !important;
      display:flex;
      gap:5px;
      flex-wrap:wrap;
    }

    .producto-card .producto-meta {
      grid-area:meta;
      margin:1px 0 0 !important;
      font-weight:400 !important;
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
      width:auto !important;
      min-width:0 !important;
      height:30px !important;
      padding:0 7px !important;
      border-radius:7px !important;
      font-size:.68rem !important;
      display:inline-flex !important;
      align-items:center;
      justify-content:center;
      gap:3px;
      white-space:nowrap;
      font-weight:500;
    }

    @media (max-width:380px) {
      .producto-actions button {
        padding:0 6px !important;
        font-size:.65rem !important;
      }
    }
  `;
  document.head.appendChild(style);
})();
