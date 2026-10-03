// Persistencia reforzada para Costalia.
// Debe cargarse ANTES de v2-products.js.
// Conserva los productos y añade IDs estables a los insumos sin romper respaldos antiguos.

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

  function idInsumoNuevo() {
    return `ins_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
  }

  function nombreClave(valor) {
    return String(valor || '').trim().toLowerCase();
  }

  function asegurarIdInsumo(item) {
    if (!item || typeof item !== 'object') return '';
    if (!item.id) item.id = idInsumoNuevo();
    return String(item.id);
  }

  // La función original del HTML descartaba campos nuevos. La reemplazamos por
  // una versión compatible que mantiene el formato histórico y conserva `id`.
  if (typeof normalizarDespensa === 'function') {
    normalizarDespensa = function normalizarDespensaConId(items) {
      if (!Array.isArray(items)) return [];
      return items.map(item => {
        const costoPaquete = numeroSeguro(item.costoPaquete ?? item.costoCompra, 0);
        const cantidadPaquete = numeroSeguro(item.cantidadPaquete ?? item.cantidadCompra, 0);
        const unidadCompra = unidadNormalizada(item.unidadCompra || item.unidad || 'unidad');
        const id = asegurarIdInsumo(item);
        return {
          id,
          nombre: String(item.nombre || item.font || '').trim(),
          costoPaquete,
          cantidadPaquete,
          unidadCompra,
          costoUnitario: numeroSeguro(item.costoUnitario, cantidadPaquete > 0 ? costoPaquete / cantidadPaquete : 0)
        };
      }).filter(i => i.nombre && i.costoPaquete > 0 && i.cantidadPaquete > 0);
    };
  }

  function buscarInsumoParaMaterial(material, despensa) {
    if (!material || !Array.isArray(despensa)) return null;
    const id = String(material.insumoId || '');
    if (id) {
      const porId = despensa.find(item => String(item.id || '') === id);
      if (porId) return porId;
    }
    const clave = nombreClave(material.nombre);
    return clave ? despensa.find(item => nombreClave(item.nombre) === clave) || null : null;
  }

  if (typeof normalizarMateriales === 'function') {
    normalizarMateriales = function normalizarMaterialesConId(items) {
      if (!Array.isArray(items)) return [];
      return items.map(item => {
        const insumo = buscarInsumoParaMaterial(item, despensaGlobal);
        if (insumo && !item.insumoId) item.insumoId = asegurarIdInsumo(insumo);
        return {
          insumoId: String(item.insumoId || ''),
          nombre: String(item.nombre || '').trim(),
          cantidadUsada: numeroSeguro(item.cantidadUsada, 0),
          unidadUsada: unidadNormalizada(item.unidadUsada || 'unidad'),
          costoFinalCalculado: numeroSeguro(item.costoFinalCalculado, 0)
        };
      }).filter(i => i.nombre && i.cantidadUsada > 0 && i.costoFinalCalculado >= 0);
    };
  }

  function migrarProductos(items, despensa) {
    if (!Array.isArray(items)) return [];
    let cambio = false;
    items.forEach(producto => {
      if (!Array.isArray(producto?.materiales)) return;
      producto.materiales.forEach(material => {
        const insumo = buscarInsumoParaMaterial(material, despensa);
        if (!insumo) return;
        const id = asegurarIdInsumo(insumo);
        if (String(material.insumoId || '') !== id) {
          material.insumoId = id;
          cambio = true;
        }
      });
    });
    return { items, cambio };
  }

  function guardarProductosSeparados(items) {
    if (!Array.isArray(items)) return;
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(items));
    } catch (error) {
      console.log('No se pudo guardar el respaldo independiente de productos:', error);
    }
  }

  // Migra también las variables que ya cargó el script principal.
  try {
    if (Array.isArray(despensaGlobal)) despensaGlobal = normalizarDespensa(despensaGlobal);
    if (Array.isArray(materialesDelProductoActual)) materialesDelProductoActual = normalizarMateriales(materialesDelProductoActual);
  } catch (error) {
    console.log('No se pudieron preparar los IDs de la despensa:', error);
  }

  // Migración/recuperación del respaldo principal y de la copia independiente.
  try {
    const main = leerJson(MAIN_KEY, {});
    const independientes = leerJson(PRODUCTS_KEY, []);

    const despensa = normalizarDespensa(Array.isArray(main?.despensaGlobal) && main.despensaGlobal.length
      ? main.despensaGlobal
      : despensaGlobal);
    main.despensaGlobal = despensa;

    if (Array.isArray(main?.materialesDelProductoActual)) {
      const actuales = main.materialesDelProductoActual;
      actuales.forEach(material => {
        const insumo = buscarInsumoParaMaterial(material, despensa);
        if (insumo && !material.insumoId) material.insumoId = insumo.id;
      });
      main.materialesDelProductoActual = actuales;
    }

    const incluidos = Array.isArray(main?.productosGuardados) ? main.productosGuardados : [];
    let productos = incluidos.length ? incluidos : (Array.isArray(independientes) ? independientes : []);
    const migrados = migrarProductos(productos, despensa);
    productos = migrados.items;

    if (productos.length) {
      main.productosGuardados = productos;
      guardarProductosSeparados(productos);
    }

    localStorage.setItem(MAIN_KEY, JSON.stringify(main));
  } catch (error) {
    console.log('No se pudo preparar la persistencia de Costalia:', error);
  }

  // Protección continua: cada escritura del respaldo conserva productos e IDs.
  const storageProto = window.Storage && window.Storage.prototype;
  if (!storageProto || storageProto.__costaliaPersistenciaProtegida) return;

  const setItemOriginal = storageProto.setItem;
  Object.defineProperty(storageProto, '__costaliaPersistenciaProtegida', {
    value: true,
    configurable: true
  });

  storageProto.setItem = function (key, value) {
    if (this === localStorage && key === MAIN_KEY) {
      try {
        const nuevo = JSON.parse(String(value));
        const separados = leerJson(PRODUCTS_KEY, []);

        if (Array.isArray(nuevo?.despensaGlobal)) {
          nuevo.despensaGlobal = normalizarDespensa(nuevo.despensaGlobal);
        }
        const despensa = Array.isArray(nuevo?.despensaGlobal) ? nuevo.despensaGlobal : [];

        if (Array.isArray(nuevo?.materialesDelProductoActual)) {
          nuevo.materialesDelProductoActual.forEach(material => {
            const insumo = buscarInsumoParaMaterial(material, despensa);
            if (insumo && !material.insumoId) material.insumoId = insumo.id;
          });
        }

        const traeProductos = Array.isArray(nuevo?.productosGuardados);
        if ((!traeProductos || nuevo.productosGuardados.length === 0) && Array.isArray(separados) && separados.length) {
          nuevo.productosGuardados = separados;
        }

        if (Array.isArray(nuevo?.productosGuardados)) {
          const migrados = migrarProductos(nuevo.productosGuardados, despensa);
          nuevo.productosGuardados = migrados.items;
          if (nuevo.productosGuardados.length) {
            setItemOriginal.call(this, PRODUCTS_KEY, JSON.stringify(nuevo.productosGuardados));
          }
        }

        value = JSON.stringify(nuevo);
      } catch (_) {
        // Si el valor no es JSON válido, Storage continúa normalmente.
      }
    }

    return setItemOriginal.call(this, key, value);
  };
})();
