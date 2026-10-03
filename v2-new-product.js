// Botón para limpiar el cálculo actual y empezar otro proyecto cuando el usuario quiera.
// Cargar después de v2-products.js.

(function () {
  const lista = document.getElementById('listaMaterialesProducto');
  const materialesCard = lista?.closest('.card');
  if (!materialesCard || !lista) return;

  const style = document.createElement('style');
  style.textContent = `
    .limpiar-proyecto-wrap {
      margin:0 0 8px;
      display:flex;
      justify-content:flex-end;
    }
    .btn-limpiar-proyecto {
      border:none;
      background:transparent;
      color:var(--texto-secundario);
      font-size:.74rem;
      font-weight:500;
      padding:5px 8px;
      cursor:pointer;
      border-radius:8px;
    }
    .btn-limpiar-proyecto:hover {
      background:var(--bg-principal);
      color:var(--texto-principal);
    }
    #listaMaterialesProducto.materiales-vacio {
      display:none !important;
      border:none !important;
      margin:0 !important;
    }
  `;
  document.head.appendChild(style);

  const titulo = materialesCard.querySelector('.section-title');
  if (titulo) titulo.textContent = 'Elegir material de despensa';

  const botonAgregar = Array.from(materialesCard.querySelectorAll('button'))
    .find(btn => btn.textContent.includes('Agregar material') || btn.textContent.includes('Traer de mi Despensa'));

  const wrap = document.createElement('div');
  wrap.className = 'limpiar-proyecto-wrap';
  wrap.innerHTML = '<button type="button" class="btn-limpiar-proyecto" id="btnLimpiarProyecto">Limpiar proyecto</button>';

  if (botonAgregar) materialesCard.insertBefore(wrap, botonAgregar);
  else materialesCard.insertBefore(wrap, lista);

  function actualizarEstadoLista() {
    const sinMateriales = !Array.isArray(materialesDelProductoActual) || materialesDelProductoActual.length === 0;
    lista.classList.toggle('materiales-vacio', sinMateriales);
    if (sinMateriales) lista.innerHTML = '';
  }

  const observer = new MutationObserver(actualizarEstadoLista);
  observer.observe(lista, { childList:true, subtree:true });

  function limpiarCalculoActual() {
    if (Array.isArray(materialesDelProductoActual)) {
      materialesDelProductoActual.splice(0, materialesDelProductoActual.length);
    }

    if (Array.isArray(empaquesProducto)) {
      empaquesProducto.splice(0, empaquesProducto.length);
    }

    // Si había un producto abierto para editar, salir del modo edición.
    const btnSalirEdicion = document.getElementById('salirEdicionProducto');
    if (btnSalirEdicion) btnSalirEdicion.click();

    if (typeof renderizarMaterialesProducto === 'function') renderizarMaterialesProducto();
    actualizarEstadoLista();
    if (typeof renderizarEmpaques === 'function') renderizarEmpaques();
    if (typeof calcularPrecio === 'function') calcularPrecio();
    if (typeof guardarDatosLocales === 'function') guardarDatosLocales();

    const main = document.getElementById('tab-costear');
    if (main) main.scrollTop = 0;

    if (typeof showToast === 'function') showToast('Proyecto limpiado.');
  }

  document.getElementById('btnLimpiarProyecto').addEventListener('click', limpiarCalculoActual);
  actualizarEstadoLista();
})();
