# Aral Costos V2 — Base universal

Objetivo: convertir la app actual en una calculadora de costos usable por distintos tipos de emprendimiento (papelería, tejido, repostería, costura, velas, bisutería, etc.) sin romper la versión pública actual.

## Principios
- Mantener la lógica existente cuando sea válida.
- Evitar textos fijos ligados a papelería o encuadernación.
- Permitir nombres y unidades configurables.
- Priorizar claridad para usuarios no técnicos y personas mayores.
- Mantener funcionamiento offline/PWA.
- Trabajar solo en esta rama hasta validar.

## 1. Materiales / insumos
Cada material debe guardar:
- nombre
- costo de compra
- cantidad comprada
- unidad de compra
- cantidad usada
- unidad usada
- costo calculado

Unidades mínimas:
- unidad
- g
- kg
- ml
- l
- cm
- m
- paquete
- caja
- rollo
- ovillo
- personalizado

Regla: si unidad de compra y unidad usada son convertibles (kg↔g, l↔ml, m↔cm), convertir antes de calcular proporción. Si son iguales, usar proporción directa.

Ejemplos:
- 1 kg de harina por 6.00; uso 350 g => 2.10
- 1 kg de lana por 60.00; uso 350 g => 21.00
- 20 cartones por 15.00; uso 2 und => 1.50

## 2. Mano de obra
Debe permitir:
- por tiempo: horas/minutos × valor por hora
- monto fijo

No obligar a usar ambos.

## 3. Empaque
Sacar empaque de costos operativos.
Debe ser una lista de filas personalizables:
- nombre
- monto

Ej.: caja, bolsa, etiqueta, cinta.

## 4. Gastos adicionales / operativos
Eliminar campos fijos de luz, agua, alquiler y “otros”.
Permitir `+ Agregar gasto` con:
- nombre
- tipo de cálculo
- valor

Tipos de cálculo:
- monto fijo por producto
- por tiempo
- mensual prorrateado por horas de trabajo mensuales

Ejemplos:
- Gas: por tiempo
- Electricidad: por tiempo o mensual prorrateado
- Alquiler: mensual prorrateado
- Transporte: monto fijo

## 5. Ganancia
Permitir elegir:
- porcentaje
- monto fijo

Ejemplo monto fijo: costo 32.00 + quiero ganar 10.00 => precio sugerido 42.00.

## 6. Cargos / impuestos
Sección opcional, neutra para cualquier país.
No usar textos fijos como IGV.
Cada fila debe permitir:
- nombre libre
- porcentaje o monto fijo
- comportamiento: se suma al precio final / se descuenta del precio de venta

## 7. Calculadora flotante
Botón pequeño flotante.
Calculadora básica:
- + - × ÷
- decimales
- borrar
- resultado
- cerrar sin perder la pantalla actual

Más adelante se puede añadir “Usar resultado” en el campo numérico activo.

## 8. Respaldo y compatibilidad
La versión actual usa `backupVersion: 1` y campos fijos.
La V2 debe usar `backupVersion: 2` y migrar respaldos/localStorage V1 sin perder:
- despensa
- materiales seleccionados
- moneda
- horas
- valor por hora
- margen
- gastos actuales
- tema

Mapeo inicial sugerido:
- `gastoEmpaque` -> fila de empaque llamada “Empaque”
- `gastoLuz` -> gasto mensual “Luz”
- `gastoAgua` -> gasto mensual “Agua”
- `gastoAlquiler` -> gasto mensual “Alquiler / Espacio”
- `gastoOtros` -> gasto mensual “Otros gastos”
- `margen` -> ganancia tipo porcentaje

## 9. No tocar todavía
- nombre final de la app
- logo final
- publicación en Google Play
- Supabase/login
- monetización

Primero validar cálculos, guardado, migración y experiencia móvil.
