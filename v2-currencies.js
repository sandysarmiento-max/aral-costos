// Monedas adicionales de Sudamérica para Costalia.
// Se cargan al final por compatibilidad con la base existente y luego se restaura
// nuevamente la moneda guardada, ya con todas las opciones disponibles.
(function () {
  const select = document.getElementById('currency');
  if (!select) return;

  const existentes = new Set(Array.from(select.options).map(o => String(o.textContent || '').trim()));
  const adicionales = [
    { value: 'R$', symbol: 'R$', text: 'BRL (R$) - Real Brasileño' },
    { value: '₲', symbol: '₲', text: 'PYG (₲) - Guaraní Paraguayo' },
    { value: '$', symbol: '$', text: 'UYU ($) - Peso Uruguayo' },
    { value: 'Bs.', symbol: 'Bs.', text: 'VES (Bs.) - Bolívar Venezolano' },
    { value: 'G$', symbol: 'G$', text: 'GYD (G$) - Dólar Guyanés' },
    { value: 'SRD$', symbol: 'SRD$', text: 'SRD (SRD$) - Dólar Surinamés' }
  ];

  adicionales.forEach(item => {
    if (existentes.has(item.text)) return;
    const option = document.createElement('option');
    option.value = item.value;
    option.dataset.symbol = item.symbol;
    option.textContent = item.text;
    select.appendChild(option);
  });

  // La base restaura datos antes de que existan estas opciones y puede haber
  // limitado el índice al último disponible. Reaplicamos el índice original
  // una vez que la lista de monedas ya está completa.
  try {
    const raw = localStorage.getItem('aralCostosDataV1');
    const datos = raw ? JSON.parse(raw) : null;
    const indiceGuardado = Number(datos?.formulario?.currencyIndex);
    if (Number.isInteger(indiceGuardado) && indiceGuardado >= 0 && indiceGuardado < select.options.length) {
      select.selectedIndex = indiceGuardado;
      select.dispatchEvent(new Event('change', { bubbles:true }));
      if (typeof calcularPrecio === 'function') calcularPrecio();
    }
  } catch (error) {
    console.log('No se pudo restaurar la moneda guardada:', error);
  }
})();
