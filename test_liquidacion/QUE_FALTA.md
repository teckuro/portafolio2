# Faltantes para tener la BD bien definida

## 1. Esquema requerido

- Falta crear el esquema `personal`.
- La función `personal.fn_generar_liquidacion` hace referencia a objetos dentro de `personal.*`.

## 2. Tablas indispensables que no existen en el esquema actual

- `personal.persona`
- `personal.liquidacion`
- `personal.liquidacion_detalle`
- `personal.parametrosgenerales`
- `personal.movimientos`
- `personal.haberdescuento_persona`
- `personal.haberdescuento`
- `personal.licenciasporpersonal`

## 3. Vistas y funciones auxiliares faltantes

- `personal.vw_persona_factores`
- `web.format_number(...)`
- `fn_formato_decimales(...)`

## 4. Desajustes entre el esquema actual y la lógica de la función

- Tu esquema actual usa `rrhh.persona`, pero la función espera `personal.persona` con columnas como `idpersona`, `cargo`, `nombre`, `apellidopaterno`.
- La función espera `personal.liquidacion` con campos de cabecera diferentes a `remu.liquidacion`, como `idpersona`, `periodo`, `estado`, `monto_dia`, `base`.
- La función usa `personal.liquidacion_detalle` con columnas extra como `descripcion`, `tipo`, `tipo_haber`, `orden`, `idhaberdescuento`.
- Usa `personal.parametrosgenerales` con campos de UF/UTM y topes legales, en lugar de la tabla `param.indicador_economico`.

## 5. Reglas de negocio y datos maestros adicionales necesarios

- Tipos de movimiento y motivos de ausencia
- Conceptos de haberes y descuentos
- Parámetros legales por período (UF, UTM, topes, porcentajes de salud y previsión)
- Registros de licencias, horas extras, anticipos, cargas, préstamos y otros movimientos

## 6. Opciones para avanzar

- Opción A: crear el esquema `personal` y añadir las tablas/vistas/funciones que usa la función actual.
- Opción B: adaptar la función `personal.fn_generar_liquidacion` para usar los esquemas existentes (`rrhh`, `remu`, `laboral`, `param`, `prev`, `core`).

## 7. Siguiente paso recomendado

1. Definir si el proyecto mantendrá el esquema `personal` o migrará todo al nuevo modelo.
2. Crear las tablas mínimas de `personal` mencionadas arriba.
3. Alinear columnas y nombres entre tabla y función.
4. Añadir las vistas y funciones auxiliares necesarias.
