// Monedas adicionales de Sudamérica para Aral Costos V2.
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
})();
