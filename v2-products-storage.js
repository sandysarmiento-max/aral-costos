// Persistencia reforzada para Productos guardados.
// Debe cargarse ANTES de v2-products.js.

(function () {
  const MAIN_KEY = 'aralCostosDataV1';
  const PRODUCTS_KEY = 'aralCostosProductsV2';

  function leerJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed ?? fallback;
    } catch (_) {
      return fallback;
    }
  }

  function guardarProductosSeparados(items) {
    if (!Array.isArray(items)) return;
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(items));
    } catch (error) {
      console.log('No se pudo guardar el respaldo independiente de productos:', error);
    }
  }

  // 1) Migración/recuperación al iniciar.
  // Si ya existen productos dentro del respaldo principal, crea inmediatamente
  // la copia independiente. Si el principal quedó vacío por una carga anterior,
  // recupera los productos desde la copia independiente antes de que cargue
  // v2-products.js.
  try {
    const main = leerJson(MAIN_KEY, {});
    const independientes = leerJson(PRODUCTS_KEY, []);
    const incluidos = Array.isArray(main?.productosGuardados) ? main.productosGuardados : [];

    if (incluidos.length) {
      guardarProductosSeparados(incluidos);
    } else if (Array.isArray(independientes) && independientes.length) {
      main.productosGuardados = independientes;
      localStorage.setItem(MAIN_KEY, JSON.stringify(main));
    }
  } catch (error) {
    console.log('No se pudo preparar la persistencia de productos:', error);
  }

  // 2) Protección continua.
  // Cada vez que la app reconstruya su respaldo general, conserva también una
  // copia de productos en una clave separada. Esto evita que una actualización
  // del código o un módulo nuevo los reemplace accidentalmente por [].
  const storageProto = window.Storage && window.Storage.prototype;
  if (!storageProto || storageProto.__aralProductosProtegidos) return;

  const setItemOriginal = storageProto.setItem;
  Object.defineProperty(storageProto, '__aralProductosProtegidos', {
    value: true,
    configurable: true
  });

  storageProto.setItem = function (key, value) {
    // Antes de sobrescribir el respaldo principal, si el nuevo valor no trae
    // productos pero sí existe una copia independiente, vuelve a insertarlos.
    if (this === localStorage && key === MAIN_KEY) {
      try {
        const nuevo = JSON.parse(String(value));
        const separados = leerJson(PRODUCTS_KEY, []);
        const traeProductos = Array.isArray(nuevo?.productosGuardados);

        if ((!traeProductos || nuevo.productosGuardados.length === 0) && Array.isArray(separados) && separados.length) {
          nuevo.productosGuardados = separados;
          value = JSON.stringify(nuevo);
        }

        if (Array.isArray(nuevo?.productosGuardados) && nuevo.productosGuardados.length) {
          setItemOriginal.call(this, PRODUCTS_KEY, JSON.stringify(nuevo.productosGuardados));
        }
      } catch (_) {
        // Si el valor no es JSON válido, dejamos que Storage actúe normalmente.
      }
    }

    return setItemOriginal.call(this, key, value);
  };
})();
