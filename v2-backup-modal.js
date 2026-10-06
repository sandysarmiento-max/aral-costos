// Modal propio para confirmar la importación de respaldos.
// Cargar al final, después de los demás módulos.

(function () {
  const phone = document.querySelector('.phone-container');
  if (!phone) return;

  let datosPendientes = null;

  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'modalImportarRespaldo';
  modal.innerHTML = `
    <div class="modal-content" style="max-width:340px;">
      <div class="section-title" style="margin-bottom:6px;">Importar respaldo</div>
      <div style="font-size:.82rem;line-height:1.45;color:var(--texto-secundario);margin-bottom:16px;">
        Este respaldo reemplazará los datos actuales de la app por los datos guardados en el archivo.
      </div>
      <div style="display:flex;gap:8px;">
        <button type="button" class="btn-main btn-secondary" id="cancelarImportarRespaldo">Cancelar</button>
        <button type="button" class="btn-main" id="confirmarImportarRespaldo">Importar</button>
      </div>
    </div>
  `;
  phone.appendChild(modal);

  function cerrar() {
    datosPendientes = null;
    modal.style.display = 'none';
  }

  function aplicarImportacion(datos) {
    try {
      restaurandoDatos = true;
      aplicarDatosRespaldo(datos);
      restaurandoDatos = false;
      renderizarDespensaGlobal();
      renderizarMaterialesProducto();
      renderizarEmpaques();
      renderizarGastosMensuales();
      recalcularGastosVariables();
      guardarDatosLocales();
      showToast('Respaldo importado correctamente.');
    } catch (error) {
      restaurandoDatos = false;
      console.error('Error al aplicar respaldo de Costalia:', error);
      showToast('No se pudo importar el respaldo. Se detectó un error al restaurar los datos.');
    }
  }

  document.getElementById('cancelarImportarRespaldo').addEventListener('click', cerrar);
  document.getElementById('confirmarImportarRespaldo').addEventListener('click', () => {
    const datos = datosPendientes;
    cerrar();
    if (datos) aplicarImportacion(datos);
  });

  modal.addEventListener('click', event => {
    if (event.target === modal) cerrar();
  });

  importarRespaldo = function importarRespaldoConModal(event) {
    const archivo = event.target.files && event.target.files[0];
    if (!archivo) return;

    const lector = new FileReader();
    lector.onload = () => {
      try {
        const datos = JSON.parse(lector.result);
        const appCompatible = datos && (datos.app === 'Costalia' || datos.app === 'Aral Costos');
        const estructuraCompatible = datos && Array.isArray(datos.despensaGlobal);
        if (!datos || (!appCompatible && !estructuraCompatible)) {
          throw new Error('Archivo no compatible');
        }
        datosPendientes = datos;
        modal.style.display = 'flex';
      } catch (error) {
        showToast('No se pudo importar el respaldo. Revisa que sea un archivo .json exportado desde Costalia.');
      }
    };
    lector.onerror = () => showToast('No se pudo leer el archivo de respaldo.');
    lector.readAsText(archivo);
  };
})();
