// Unifica la acción de eliminar con un ícono de papelera pequeño.
// Cargar después de v2-inventory-edit.js y v2-pro-ui.js.

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
  `;
  document.head.appendChild(style);

  function aplicarPapeleras(root = document) {
    root.querySelectorAll('.despensa-actions-v2 .btn-delete, .mat-delete').forEach(btn => {
      if (btn.textContent.trim() !== '🗑️') {
        btn.textContent = '🗑️';
        btn.title = 'Eliminar';
      }
    });
  }

  aplicarPapeleras();

  const observer = new MutationObserver(() => aplicarPapeleras());
  observer.observe(document.body, { childList:true, subtree:true });
})();
