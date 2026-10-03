// Ajustes de interacción móvil: papeleras consistentes, cantidades táctiles y acciones con texto.
// Cargar después de v2-inventory-edit.js, v2-product-card-layout.js y v2-pro-ui.js.

(function () {
  const style = document.createElement('style');
  style.textContent = `
    .despensa-actions-v2 .btn-delete,
    .mat-delete {
      font-size:.78rem !important;
      line-height:1 !important;
      color:#D35A63 !important;
      display:grid !important;
      place-items:center !important;
    }

    .mat-head,
    .mat-row {
      grid-template-columns:minmax(0,1fr) 116px 58px 26px !important;
    }

    .mat-qty {
      gap:3px !important;
    }

    .mat-step-btn {
      width:27px;
      height:30px;
      min-width:27px;
      border:1px solid var(--borde);
      border-radius:7px;
      background:var(--bg-principal);
      color:var(--texto-principal);
      font-size:.9rem;
      font-weight:500;
      line-height:1;
      padding:0;
      display:grid;
      place-items:center;
      cursor:pointer;
      touch-action:manipulation;
    }

    .mat-qty input {
      width:42px !important;
      min-width:42px !important;
    }

    .producto-action-icon {
      font-size:.78rem;
      line-height:1;
    }

    @media (max-width:380px) {
      .mat-head,
      .mat-row {
        grid-template-columns:minmax(0,1fr) 108px 54px 24px !important;
      }
      .mat-step-btn {
        width:25px;
        min-width:25px;
      }
      .mat-qty input {
        width:38px !important;
        min-width:38px !important;
      }
    }
  `;
  document.head.appendChild(style);

  function aplicarPapeleras(root = document) {
    root.querySelectorAll('.despensa-actions-v2 .btn-delete, .mat-delete').forEach(btn => {
      if (btn.textContent.trim() !== '🗑️') {
        btn.textContent = '🗑️';
      }
      btn.title = 'Eliminar';
    });
  }

  function mejorarCantidades(root = document) {
    root.querySelectorAll('.mat-qty').forEach(wrap => {
      if (wrap.dataset.mobileReady === '1') return;
      const input = wrap.querySelector('[data-material-cantidad]');
      if (!input) return;

      const menos = document.createElement('button');
      menos.type = 'button';
      menos.className = 'mat-step-btn';
      menos.textContent = '−';
      menos.setAttribute('aria-label', 'Disminuir cantidad');

      const mas = document.createElement('button');
      mas.type = 'button';
      mas.className = 'mat-step-btn';
      mas.textContent = '+';
      mas.setAttribute('aria-label', 'Aumentar cantidad');

      menos.addEventListener('click', () => cambiarCantidad(input, -1));
      mas.addEventListener('click', () => cambiarCantidad(input, 1));

      wrap.insertBefore(menos, input);
      input.insertAdjacentElement('afterend', mas);
      wrap.dataset.mobileReady = '1';
    });
  }

  function pasoPara(input) {
    const valor = Number(input.value) || 0;
    if (valor < 1) return 0.1;
    if (!Number.isInteger(valor)) return 0.1;
    return 1;
  }

  function cambiarCantidad(input, direccion) {
    const actual = Number(input.value) || 0;
    const paso = pasoPara(input);
    const siguiente = Math.max(paso, actual + (direccion * paso));
    input.value = Number(siguiente.toFixed(4));
    input.dispatchEvent(new Event('change', { bubbles:true }));
  }

  function etiquetarAccionesProductos(root = document) {
    const textos = {
      edit: ['✏️', 'Editar'],
      duplicate: ['⧉', 'Duplicar'],
      delete: ['🗑️', 'Eliminar']
    };

    root.querySelectorAll('.producto-actions button[data-action]').forEach(btn => {
      const config = textos[btn.dataset.action];
      if (!config) return;
      const [icono, texto] = config;
      btn.innerHTML = `<span class="producto-action-icon" aria-hidden="true">${icono}</span><span>${texto}</span>`;
      btn.title = texto;
    });
  }

  function aplicarTodo(root = document) {
    aplicarPapeleras(root);
    mejorarCantidades(root);
    etiquetarAccionesProductos(root);
  }

  aplicarTodo();

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) aplicarTodo(node);
      });
    });
  });

  observer.observe(document.body, { childList:true, subtree:true });
})();
