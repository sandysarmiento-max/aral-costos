// Flujo para iniciar un producto nuevo después de guardar.
// Cargar después de v2-products.js.

(function () {
  const phone = document.querySelector('.phone-container');
  const btnGuardar = document.getElementById('confirmarGuardarProducto');
  const modalGuardar = document.getElementById('modalGuardarProducto');
  if (!phone || !btnGuardar || !modalGuardar) return;

  const modalNuevo = document.createElement('div');
  modalNuevo.className = 'modal';
  modalNuevo.id = 'modalNuevoProducto';
  modalNuevo.innerHTML = `
    <div class="modal-content" style="max-width:340px;">
      <div class="section-title" style="margin-bottom:6px;">Producto guardado</div>
      <div style="font-size:.82rem;line-height:1.45;color:var(--texto-secundario);margin-bottom:16px;">
        ¿Quieres seguir trabajando con este producto o empezar un cálculo nuevo?
      </div>
      <div style="display:flex;gap:8px;">
        <button type="button" class="btn-main btn-secondary" id="seguirProductoActual">Seguir con este</button>
        <button type="button" class="btn-main" id="crearProductoNuevo">Crear nuevo</button>
      </div>
    </div>
  `;
  phone.appendChild(modalNuevo);

  function cerrarModalNuevo() {
    modalNuevo.style.display = 'none';
  }

  function limpiarCalculoActual() {
    if (Array.isArray(materialesDelProductoActual)) {
      materialesDelProductoActual.splice(0, materialesDelProductoActual.length);
    }

    if (Array.isArray(empaquesProducto)) {
      empaquesProducto.splice(0, empaquesProducto.length);
    }

    // Salir del modo edición sin tocar el producto que acaba de guardarse.
    const btnSalirEdicion = document.getElementById('salirEdicionProducto');
    if (btnSalirEdicion) btnSalirEdicion.click();

    if (typeof renderizarMaterialesProducto === 'function') renderizarMaterialesProducto();
    if (typeof renderizarEmpaques === 'function') renderizarEmpaques();
    if (typeof calcularPrecio === 'function') calcularPrecio();
    if (typeof guardarDatosLocales === 'function') guardarDatosLocales();

    cerrarModalNuevo();

    if (typeof cambiarPestana === 'function') cambiarPestana('costear');

    const main = document.getElementById('tab-costear');
    if (main) main.scrollTop = 0;

    if (typeof showToast === 'function') {
      showToast('Listo para crear un nuevo producto.');
    }
  }

  document.getElementById('seguirProductoActual').addEventListener('click', cerrarModalNuevo);
  document.getElementById('crearProductoNuevo').addEventListener('click', limpiarCalculoActual);

  modalNuevo.addEventListener('click', event => {
    if (event.target === modalNuevo) cerrarModalNuevo();
  });

  // El manejador original guarda primero. Si la ventana de Guardar se cerró,
  // significa que el guardado pasó sus validaciones y terminó correctamente.
  btnGuardar.addEventListener('click', () => {
    setTimeout(() => {
      if (modalGuardar.style.display === 'none') {
        modalNuevo.style.display = 'flex';
      }
    }, 0);
  });
})();
