-- ============================================
-- ESQUEMAS
-- ============================================
CREATE SCHEMA IF NOT EXISTS core;   -- Empresa y Auditoría
CREATE SCHEMA IF NOT EXISTS rrhh;   -- Datos maestros de personas
CREATE SCHEMA IF NOT EXISTS laboral;-- Contratos y relación empresa-persona
CREATE SCHEMA IF NOT EXISTS prev;   -- Previsión y Salud
CREATE SCHEMA IF NOT EXISTS param;  -- UF, UTM, Comunas, Bancos
CREATE SCHEMA IF NOT EXISTS remu;   -- Motor de liquidaciones

-- ============================================
-- PARAMETROS (Tablas Maestras)
-- ============================================
CREATE TABLE param.comuna (
    id_comuna INT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE param.banco (
    id_banco SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla consolidada para indicadores económicos y parámetros legales por período
CREATE TABLE param.parametros_generales (
    periodo VARCHAR(7) PRIMARY KEY, -- YYYY-MM
    uf NUMERIC(14,4),
    utm NUMERIC(12,0),
    sueldo_minimo NUMERIC(12,0),
    sueldo_minimo18_65 NUMERIC(12,0),
    gratificacion BOOLEAN DEFAULT TRUE,
    imm_gratificacion NUMERIC(5,2) DEFAULT 4.75, -- Meses para gratificación
    tope_afp NUMERIC(12,0),
    tope_ips NUMERIC(12,0),
    tope_cesantia NUMERIC(12,0),
    tope_afpvoluntario NUMERIC(12,0),
    sis NUMERIC(5,2), -- Seguro Invalidez y Sobrevivencia
    dsctosbpordia BOOLEAN DEFAULT TRUE, -- Descuentos por día base proporcional
    fecha_actualizacion TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- CORE & RRHH
-- ============================================
CREATE TABLE core.empresa (
    id_empresa SERIAL PRIMARY KEY,
    rut INT UNIQUE NOT NULL, -- RUT como INT para indexación rápida
    dv CHAR(1) NOT NULL,
    razon_social VARCHAR(150) NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

CREATE TABLE rrhh.persona (
    id_persona SERIAL PRIMARY KEY,
    rut INT UNIQUE NOT NULL,
    dv CHAR(1) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellido_paterno VARCHAR(50) NOT NULL,
    apellido_materno VARCHAR(50),
    fecha_nacimiento DATE NOT NULL,
    sexo CHAR(1) CHECK (sexo IN ('M', 'F', 'O')),
    email VARCHAR(100),
    id_comuna INT REFERENCES param.comuna(id_comuna),
    direccion TEXT,
    -- Columnas adicionales para compatibilidad con la función
    cargo VARCHAR(100),
    tipotrabajador INT, -- 0=Dependiente, 1=Pensionado AFP, 2=Pensionado IPS, 3=Independiente, 4=Menor de 18
    prevision VARCHAR(20), -- AFP o IPS
    salud_nombre VARCHAR(100), -- FONASA o nombre ISAPRE
    afp_ahorrovoluntario NUMERIC(12,0) DEFAULT 0,
    valor_apvi NUMERIC(12,0) DEFAULT 0,
    cargas INT DEFAULT 0,
    segurocesantia BOOLEAN DEFAULT TRUE,
    fecha_ingreso DATE,
    fecha_retiro DATE,
    hsemanales NUMERIC(5,2), -- Horas semanales pactadas
    dsemanales NUMERIC(5,2), -- Días semanales pactados
    tipojornada VARCHAR(10) -- C=Completo, P=Parcial, A=Articulado
);

CREATE TABLE rrhh.cuenta_bancaria (
    id_cuenta SERIAL PRIMARY KEY,
    id_persona INT REFERENCES rrhh.persona(id_persona),
    id_banco INT REFERENCES param.banco(id_banco),
    tipo_cuenta VARCHAR(30),
    numero_cuenta VARCHAR(50) NOT NULL
);

-- ============================================
-- PREVISION (Con soporte para cambios de tasas)
-- ============================================
CREATE TABLE prev.afp (
    id_afp SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tasa_obligatoria NUMERIC(5,2) DEFAULT 10.00,
    comision NUMERIC(5,2),
    vigente BOOLEAN DEFAULT TRUE,
    -- Columna adicional para APVI
    forma_pago_apvi INT -- 1=Descuento, 2=Retención
);

CREATE TABLE prev.salud (
    id_salud SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('FONASA', 'ISAPRE'))
);

-- ============================================
-- LABORAL (Versionamiento de Sueldo)
-- ============================================
CREATE TABLE laboral.contrato (
    id_contrato SERIAL PRIMARY KEY,
    id_persona INT REFERENCES rrhh.persona(id_persona),
    id_empresa INT REFERENCES core.empresa(id_empresa),
    id_afp INT REFERENCES prev.afp(id_afp),
    id_salud INT REFERENCES prev.salud(id_salud),
    tipo_contrato VARCHAR(50),
    fecha_inicio DATE NOT NULL,
    fecha_termino DATE,
    sueldo_base_actual NUMERIC(12,0), -- Pesos chilenos no usan decimales en pago final
    estado VARCHAR(20) DEFAULT 'ACTIVO',
    CHECK (estado IN ('ACTIVO', 'TERMINADO', 'SUSPENDIDO', 'PENDIENTE')),
    CHECK (fecha_termino IS NULL OR fecha_termino >= fecha_inicio),
    -- Columna adicional
    monto_dia NUMERIC(12,0) -- Monto diario calculado (sueldo_base_actual / 30)
);

-- Importante: Para historial de anexos y cambios de sueldo
CREATE TABLE laboral.anexo_contrato (
    id_anexo SERIAL PRIMARY KEY,
    id_contrato INT REFERENCES laboral.contrato(id_contrato),
    fecha_cambio DATE NOT NULL,
    sueldo_base_nuevo NUMERIC(12,0),
    observacion TEXT
);

-- ============================================
-- REMUNERACIONES
-- ============================================
CREATE TABLE remu.concepto (
    id_concepto SERIAL PRIMARY KEY,
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    tipo VARCHAR(20) CHECK (tipo IN ('HABER', 'DESCUENTO')),
    naturaleza VARCHAR(20) CHECK (naturaleza IN ('IMPONIBLE', 'NO_IMPONIBLE')),
    formula_json JSONB -- Para lógica dinámica en el código
);

CREATE TABLE remu.liquidacion (
    id_liquidacion SERIAL PRIMARY KEY,
    id_contrato INT REFERENCES laboral.contrato(id_contrato),
    periodo DATE NOT NULL, -- Siempre usar 1er día del mes (2024-01-01)
    fecha_proceso TIMESTAMP DEFAULT NOW(),
    dias_trabajados INT DEFAULT 30,
    total_haberes NUMERIC(12,0),
    total_descuentos NUMERIC(12,0),
    monto_liquido NUMERIC(12,0),
    estado VARCHAR(20) DEFAULT 'BORRADOR',
    UNIQUE(id_contrato, periodo),
    -- Columnas adicionales para compatibilidad
    idusuario INT, -- ID del usuario que procesó
    valoruf NUMERIC(14,4), -- Valor UF del período
    valorutm NUMERIC(12,0), -- Valor UTM del período
    renta_imponible NUMERIC(12,0), -- Renta imponible calculada
    haberes_imponibles NUMERIC(12,0),
    haberes_noimponibles NUMERIC(12,0),
    descuentos_legales NUMERIC(12,0),
    descuentos_nolegales NUMERIC(12,0),
    imponible_100sc NUMERIC(12,0) -- Imponible para Seguro Cesantía
);

CREATE TABLE remu.liquidacion_detalle (
    id_detalle SERIAL PRIMARY KEY,
    id_liquidacion INT REFERENCES remu.liquidacion(id_liquidacion) ON DELETE CASCADE,
    id_concepto INT REFERENCES remu.concepto(id_concepto),
    monto NUMERIC(12,0) NOT NULL,
    cantidad NUMERIC(10,2),
    UNIQUE(id_liquidacion, id_concepto),
    -- Columnas adicionales para compatibilidad
    descripcion VARCHAR(200), -- Descripción del ítem
    tipo VARCHAR(10), -- H=Haber, D=Descuento
    tipo_haber VARCHAR(10), -- I=Imponible, N=No Imponible, G=Gratificación
    orden INT -- Orden de aparición
);

-- ============================================
-- NUEVAS TABLAS PARA COMPATIBILIDAD CON LA FUNCIÓN
-- ============================================

-- Parámetros legales por período (OBSOLETO: reemplazado por param.parametros_generales)
-- CREATE TABLE param.parametros_legales (
--     id_param SERIAL PRIMARY KEY,
--     periodo VARCHAR(7) UNIQUE NOT NULL, -- YYYY-MM
--     uf NUMERIC(14,4),
--     utm NUMERIC(12,0),
--     sueldo_minimo NUMERIC(12,0),
--     sueldo_minimo18_65 NUMERIC(12,0),
--     gratificacion BOOLEAN DEFAULT TRUE,
--     imm_gratificacion NUMERIC(5,2) DEFAULT 4.75, -- Meses para gratificación
--     tope_afp NUMERIC(12,0),
--     tope_ips NUMERIC(12,0),
--     tope_cesantia NUMERIC(12,0),
--     tope_afpvoluntario NUMERIC(12,0),
--     sis NUMERIC(5,2), -- Seguro Invalidez y Sobrevivencia
--     dsctosbpordia BOOLEAN DEFAULT TRUE -- Descuentos por día base proporcional
-- );

-- Tramos para cargas familiares
CREATE TABLE param.tramo_carga (
    id_tramo SERIAL PRIMARY KEY,
    periodo VARCHAR(7) NOT NULL, -- YYYY-MM
    desde NUMERIC(12,0),
    hasta NUMERIC(12,0),
    valor NUMERIC(12,0),
    tramo VARCHAR(10) -- Ej: A, B, C
);

-- Tramos para impuesto a la renta
CREATE TABLE param.tramo_impuesto (
    id_tramo SERIAL PRIMARY KEY,
    periodo VARCHAR(7) NOT NULL, -- YYYY-MM
    desde NUMERIC(12,0),
    hasta NUMERIC(12,0),
    factor NUMERIC(5,2),
    rebaja NUMERIC(12,0)
);

-- Movimientos laborales (atrasos, horas extras, licencias, etc.)
CREATE TABLE laboral.movimiento (
    id_movimiento SERIAL PRIMARY KEY,
    id_persona INT REFERENCES rrhh.persona(id_persona),
    fecha DATE NOT NULL,
    tipomovimiento INT, -- 1=Anticipo, 2=Horas Extras, 3=Inasistencia, etc.
    motivoinasist INT, -- 101=Licencia Médica, 104=Reducción Jornada, etc.
    diainasist NUMERIC(5,2), -- Días de inasistencia
    hrs_pactadas NUMERIC(5,2), -- Horas pactadas (para reducción jornada)
    monto NUMERIC(12,0),
    observacion TEXT
);

-- Préstamos
CREATE TABLE laboral.prestamo (
    id_prestamo SERIAL PRIMARY KEY,
    id_persona INT REFERENCES rrhh.persona(id_persona),
    descripcion VARCHAR(200),
    monto_total NUMERIC(12,0),
    valor_cuota NUMERIC(12,0),
    cuotas_total INT,
    cuotas_pagadas INT DEFAULT 0,
    saldo_pendiente NUMERIC(12,0),
    fecha_otorgamiento DATE,
    caja VARCHAR(50), -- Ej: prestamosolidario
    estado VARCHAR(20) DEFAULT 'ACTIVO'
);

-- Haberes y descuentos asignados por persona
CREATE TABLE laboral.haberdescuento_persona (
    id_asignacion SERIAL PRIMARY KEY,
    id_persona INT REFERENCES rrhh.persona(id_persona),
    id_concepto INT REFERENCES remu.concepto(id_concepto),
    monto NUMERIC(12,0),
    porcentaje NUMERIC(5,2),
    tipo VARCHAR(20), -- FIJO, PORCENTAJE
    tipohaber VARCHAR(20), -- IMPONIBLE, NOIMPONIBLE, etc.
    estado BOOLEAN DEFAULT TRUE
);

-- ============================================
-- INDICES & AUDITORIA
-- ============================================
CREATE INDEX idx_persona_full ON rrhh.persona(rut, dv);
CREATE INDEX idx_cuenta_persona ON rrhh.cuenta_bancaria(id_persona);
CREATE INDEX idx_contrato_persona ON laboral.contrato(id_persona);
CREATE INDEX idx_contrato_empresa ON laboral.contrato(id_empresa);
CREATE INDEX idx_contrato_afp ON laboral.contrato(id_afp);
CREATE INDEX idx_contrato_salud ON laboral.contrato(id_salud);
CREATE INDEX idx_anexo_contrato ON laboral.anexo_contrato(id_contrato);
CREATE INDEX idx_liq_periodo ON remu.liquidacion(periodo);
CREATE INDEX idx_liquidacion_contrato ON remu.liquidacion(id_contrato);
CREATE INDEX idx_detalle_liquidacion ON remu.liquidacion_detalle(id_liquidacion);
CREATE INDEX idx_detalle_concepto ON remu.liquidacion_detalle(id_concepto);

-- Índices para nuevas tablas
-- CREATE INDEX idx_param_legales_periodo ON param.parametros_legales(periodo);
CREATE INDEX idx_param_generales_periodo ON param.parametros_generales(periodo);
CREATE INDEX idx_tramo_carga_periodo ON param.tramo_carga(periodo);
CREATE INDEX idx_tramo_impuesto_periodo ON param.tramo_impuesto(periodo);
CREATE INDEX idx_movimiento_persona ON laboral.movimiento(id_persona);
CREATE INDEX idx_movimiento_fecha ON laboral.movimiento(fecha);
CREATE INDEX idx_prestamo_persona ON laboral.prestamo(id_persona);
CREATE INDEX idx_haberdescuento_persona ON laboral.haberdescuento_persona(id_persona);

CREATE TABLE core.audit_log (
    id SERIAL PRIMARY KEY,
    esquema_tabla VARCHAR(150),
    id_registro INT,
    operacion VARCHAR(10), -- INS, UPD, DEL
    usuario VARCHAR(50),
    fecha TIMESTAMP DEFAULT NOW(),
    datos_json JSONB
);

-- ============================================
-- FUNCIONES AUXILIARES
-- ============================================

-- Función para calcular días trabajados en un período
CREATE OR REPLACE FUNCTION remu.fn_calcular_dias_trabajados(
    p_id_contrato INTEGER,
    p_periodo DATE,
    p_fecha_ingreso DATE,
    p_fecha_retiro DATE
) RETURNS NUMERIC AS $$
DECLARE
    v_dias_periodo INTEGER;
    v_dias_trabajados NUMERIC := 0;
    v_fecha_inicio DATE;
    v_fecha_fin DATE;
    v_dias_licencia NUMERIC := 0;
BEGIN
    -- Calcular fechas del período
    v_fecha_inicio := p_periodo;
    v_fecha_fin := (p_periodo + INTERVAL '1 month') - INTERVAL '1 day';
    v_dias_periodo := EXTRACT(DAY FROM v_fecha_fin);

    -- Ajustar por fecha de ingreso
    IF p_fecha_ingreso > v_fecha_inicio THEN
        v_fecha_inicio := p_fecha_ingreso;
    END IF;

    -- Ajustar por fecha de retiro
    IF p_fecha_retiro IS NOT NULL AND p_fecha_retiro < v_fecha_fin THEN
        v_fecha_fin := p_fecha_retiro;
    END IF;

    -- Calcular días base
    v_dias_trabajados := EXTRACT(DAY FROM (v_fecha_fin - v_fecha_inicio + 1));

    -- Restar días de licencia médica
    SELECT COALESCE(SUM(diainasist), 0) INTO v_dias_licencia
    FROM laboral.movimiento
    WHERE id_persona = (SELECT id_persona FROM laboral.contrato WHERE id_contrato = p_id_contrato)
    AND fecha BETWEEN v_fecha_inicio AND v_fecha_fin
    AND tipomovimiento = 3
    AND motivoinasist = 101; -- Licencia médica

    v_dias_trabajados := v_dias_trabajados - v_dias_licencia;

    -- Asegurar no negativo
    RETURN GREATEST(v_dias_trabajados, 0);
END;
$$ LANGUAGE plpgsql;

-- Función para formatear decimales
CREATE OR REPLACE FUNCTION fn_formato_decimales(
    p_valor NUMERIC,
    p_decimales INT DEFAULT 0
) RETURNS VARCHAR AS $$
BEGIN
    RETURN TO_CHAR(p_valor, 'FM999G999G999G999' || CASE WHEN p_decimales > 0 THEN 'D' || REPEAT('9', p_decimales) ELSE '' END);
END;
$$ LANGUAGE plpgsql;

-- Vista para compatibilidad con personal.vw_persona_factores
CREATE OR REPLACE VIEW rrhh.vw_persona_factores AS
SELECT
    p.id_persona,
    p.rut,
    p.dv,
    p.nombres,
    p.apellido_paterno,
    p.apellido_materno,
    p.fecha_nacimiento,
    p.sexo,
    p.email,
    p.id_comuna,
    p.direccion,
    p.cargo,
    p.tipotrabajador,
    p.prevision,
    p.salud_nombre,
    p.afp_ahorrovoluntario,
    p.valor_apvi,
    p.cargas,
    p.segurocesantia,
    p.fecha_ingreso,
    p.fecha_retiro,
    p.hsemanales,
    p.dsemanales,
    p.tipojornada,
    c.id_contrato,
    c.sueldo_base_actual AS base,
    c.monto_dia,
    afp.nombre AS afp_nombre,
    afp.tasa_obligatoria,
    afp.comision,
    afp.forma_pago_apvi,
    s.nombre AS salud_nombre_full,
    c.fecha_inicio AS fingreso,
    c.fecha_termino AS fretiro,
    c.estado AS estado_contrato
FROM rrhh.persona p
LEFT JOIN laboral.contrato c ON p.id_persona = c.id_persona AND c.estado = 'ACTIVO'
LEFT JOIN prev.afp afp ON c.id_afp = afp.id_afp
LEFT JOIN prev.salud s ON c.id_salud = s.id_salud;

-- ============================================
-- TABLA DE CONFIGURACIÓN CENTRALIZADA
-- ============================================

-- Tabla para configuración global del sistema
CREATE TABLE param.configuracion (
    id_config SERIAL PRIMARY KEY,
    clave VARCHAR(100) UNIQUE NOT NULL,
    valor TEXT NOT NULL,
    tipo_dato VARCHAR(20) DEFAULT 'STRING', -- STRING, NUMERIC, BOOLEAN, DATE
    descripcion TEXT,
    modulo VARCHAR(50) -- RRHH, REMU, etc.
);

-- Tabla centralizada para valores flexibles
CREATE TABLE param.valores_flexibles (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descripcion TEXT NOT NULL,
    tipo VARCHAR(50), -- BANCO, AFP, SALUD, MONEDA, etc.
    valor TEXT, -- Valor asociado si es necesario
    activo BOOLEAN DEFAULT TRUE,
    orden INTEGER DEFAULT 0
);

-- ============================================
-- INDICES & AUDITORIA
-- ============================================
CREATE INDEX idx_persona_full ON rrhh.persona(rut, dv);
CREATE INDEX idx_cuenta_persona ON rrhh.cuenta_bancaria(id_persona);
CREATE INDEX idx_contrato_persona ON laboral.contrato(id_persona);
CREATE INDEX idx_contrato_empresa ON laboral.contrato(id_empresa);
CREATE INDEX idx_contrato_afp ON laboral.contrato(id_afp);
CREATE INDEX idx_contrato_salud ON laboral.contrato(id_salud);
CREATE INDEX idx_anexo_contrato ON laboral.anexo_contrato(id_contrato);
CREATE INDEX idx_liq_periodo ON remu.liquidacion(periodo);
CREATE INDEX idx_liquidacion_contrato ON remu.liquidacion(id_contrato);
CREATE INDEX idx_detalle_liquidacion ON remu.liquidacion_detalle(id_liquidacion);
CREATE INDEX idx_detalle_concepto ON remu.liquidacion_detalle(id_concepto);

-- Índices para nuevas tablas
CREATE INDEX idx_configuracion_clave ON param.configuracion(clave);
CREATE INDEX idx_valores_flexibles_tipo ON param.valores_flexibles(tipo, activo);
CREATE INDEX idx_valores_flexibles_codigo ON param.valores_flexibles(codigo);

-- ============================================
-- FUNCIONES PRINCIPALES
-- ============================================

-- Nueva función optimizada para generar liquidaciones
CREATE OR REPLACE FUNCTION remu.fn_generar_liquidacion (
  p_id_contrato INTEGER,  -- ID del contrato
  p_periodo DATE,         -- Período como DATE
  p_id_usuario INTEGER,   -- ID del usuario
  p_preview BOOLEAN       -- Vista previa
)
RETURNS TABLE (
    id_liquidacion INTEGER,
    estado VARCHAR(20),
    total_liquido NUMERIC,
    mensaje VARCHAR
) AS $$
DECLARE
    -- Tipos de datos consolidados
    TYPE t_persona_data IS RECORD (
        id_persona INTEGER,
        rut INTEGER,
        dv CHAR(1),
        nombres VARCHAR(100),
        apellido_paterno VARCHAR(50),
        fecha_nacimiento DATE,
        cargo VARCHAR(100),
        tipotrabajador INTEGER,
        prevision VARCHAR(20),
        salud_nombre VARCHAR(100),
        afp_ahorrovoluntario NUMERIC,
        valor_apvi NUMERIC,
        cargas INTEGER,
        segurocesantia BOOLEAN,
        fecha_ingreso DATE,
        fecha_retiro DATE,
        hsemanales NUMERIC,
        dsemanales NUMERIC,
        tipojornada VARCHAR(10),
        id_contrato INTEGER,
        base NUMERIC,
        monto_dia NUMERIC,
        afp_nombre VARCHAR(100),
        tasa_obligatoria NUMERIC,
        comision NUMERIC,
        forma_pago_apvi INTEGER,
        salud_nombre_full VARCHAR(100),
        fingreso DATE,
        fretiro DATE,
        estado_contrato VARCHAR(20)
    );

    TYPE t_parametros IS RECORD (
        uf NUMERIC,
        utm NUMERIC,
        sueldo_minimo NUMERIC,
        sueldo_minimo18_65 NUMERIC,
        gratificacion BOOLEAN,
        imm_gratificacion NUMERIC,
        tope_afp NUMERIC,
        tope_ips NUMERIC,
        tope_cesantia NUMERIC,
        tope_afpvoluntario NUMERIC,
        sis NUMERIC,
        dsctosbpordia BOOLEAN
    );

    TYPE t_calculos IS RECORD (
        dias_trabajados NUMERIC,
        dias_licencia NUMERIC,
        total_haberes_imponibles NUMERIC,
        total_haberes_noimponibles NUMERIC,
        total_descuentos NUMERIC,
        total_descuentos_legales NUMERIC,
        valor_impuesto_renta NUMERIC,
        cesantia NUMERIC,
        sis NUMERIC,
        afp NUMERIC,
        salud NUMERIC,
        gratificacion NUMERIC,
        prestamos NUMERIC
    );

    -- Variables principales (adaptadas)
    v_persona t_persona_data;
    v_parametros t_parametros;
    v_calc t_calculos;
    v_id_liquidacion INTEGER;
    v_mensaje VARCHAR := '';
    v_estado VARCHAR(20) := 'BORRADOR';

    -- Variables heredadas de la función original (temporalmente)
    _valida_duplicidad RECORD;
    _cabecera RECORD;
    _parametros_old RECORD;
    _movimientos RECORD;
    _prestamos RECORD;
    _haberes_desc RECORD;
    _tramos_cargas RECORD;
    _impuesto_renta RECORD;
    _rcd_param_dias_per RECORD;

    _orden INTEGER := 1;

    -- Variables numéricas principales (consolidadas)
    _total_haberes_imponibles NUMERIC := 0;
    _total_haberes_noimponibles NUMERIC := 0;
    _total_haberes NUMERIC := 0;
    _total_descuentos NUMERIC := 0;
    _total_descuentos_legales NUMERIC := 0;
    _total_liquidacion NUMERIC := 0;
    _monto_haberes_singratif NUMERIC := 0;

    -- Variables para cálculos específicos
    _porc_prevision NUMERIC := 0;
    _porc_isapre NUMERIC := 0;
    _porc_salud7 NUMERIC := 0;
    _porc_salud7_paso NUMERIC := 0;
    _salud_dias NUMERIC := 0;
    _adicional_isapre NUMERIC := 0;
    _valor_uf NUMERIC := 0;
    _valor_utm NUMERIC := 0;
    _total_prevision NUMERIC := 0;
    _dias_licencia NUMERIC := 0;
    _total_salud_dias NUMERIC := 0;
    _total_gratificacion NUMERIC := 0;
    _monto_gratificacion NUMERIC := 0;
    _total_imponibles_legales NUMERIC := 0;
    _valor_impuesto_renta NUMERIC := 0;
    _sueldo_base NUMERIC := 0;

    _total_afpvoluntario NUMERIC := 0;
    _total_imponibles_legales_utm NUMERIC := 0;
    _total_salud NUMERIC := 0;

    _tope_gratificacion NUMERIC := 0;
    _tope_afp NUMERIC := 0;
    _tope_ips NUMERIC := 0;
    _tope_cesantia NUMERIC := 0;
    _tope_afpvoluntario NUMERIC := 0;
    _tope_salud NUMERIC := 0;

    -- Variables de fechas (simplificadas)
    _dia_ini VARCHAR;
    _mes_ini VARCHAR;
    _anno_ini VARCHAR;
    _periodo_ini VARCHAR;
    _dia_fin VARCHAR;
    _mes_fin VARCHAR;
    _anno_fin VARCHAR;
    _periodo_fin VARCHAR;
    _periodo2 VARCHAR;

    -- Variables de días y movimientos
    _dias_trabajados NUMERIC := 0;
    _atrasos_inasist NUMERIC := 0;
    _anticipos NUMERIC := 0;
    _horas_extras NUMERIC := 0;
    _fonasa NUMERIC := 0;
    _isapre NUMERIC := 0;
    _adicional NUMERIC := 0;
    _cargas NUMERIC := 0;
    _otros_desctos NUMERIC := 0;
    _locomocion NUMERIC := 0;
    _colacion NUMERIC := 0;
    _impto_renta NUMERIC := 0;
    _otros_imp NUMERIC := 0;
    _otros_noimp NUMERIC := 0;
    _total_plan_salud NUMERIC := 0;
    _total_apvi NUMERIC := 0;
    _valor_prestamo NUMERIC := 0;

    -- Variables para seguros
    _haber_licencia NUMERIC := 0;
    _seg_impprevio NUMERIC := 0;
    _seg_imponible NUMERIC := 0;
    _seg_empleador NUMERIC := 0;
    _cesantia NUMERIC := 0;
    _sisbase NUMERIC := 0;
    _sis NUMERIC := 0;

    -- Variables adicionales
    v_edad INTEGER;
    _tiempo INTEGER;
    _renta NUMERIC;
    _descripcion VARCHAR;
    _valor_haber NUMERIC;
    _valor_dia NUMERIC;
    _dias_inasis NUMERIC := 0;
    _dias NUMERIC;
    _promedio NUMERIC;
    _finmes DATE;

    -- Variables con prefijo __ (mantener por compatibilidad)
    __anios INTEGER;
    __maxanios INTEGER := 11;
    __cempleador NUMERIC := 0.8;
    __valortt INTEGER;
    __ccafahorro NUMERIC := 0;
    __ccafsegurovida NUMERIC := 0;
    __ccafdental NUMERIC := 0;
    __ccafotrodescto NUMERIC := 0;
    __desc_gratificacion VARCHAR := '';
    __forma_pago_apvi INTEGER;
    __sispaso01 NUMERIC := 0;
    __sispaso02 NUMERIC := 0;
    __segurocesantiapaso01 NUMERIC := 0;
    __cesantiaempleador NUMERIC := 0;
    __rutPersonal VARCHAR;
    __varfiltro VARCHAR;
    __jornadalaboralpactada DECIMAL;
    __sbasetemporal NUMERIC;
    __sbasetemporalcalculado NUMERIC;
    __edadmenor INTEGER;
    __cantdiasmescurso INTEGER;
    __diafinmes INTEGER;
    __islicenciamedica BOOLEAN := FALSE;
    __montoajuste NUMERIC;
    __saldopendiente NUMERIC;
    __diainasist NUMERIC := 0;
    __tipotramo VARCHAR;
    __desctoley21252 NUMERIC;
    __cargo VARCHAR;
    __valor_uf_ips NUMERIC;
    __imponiblemes NUMERIC;
    __leysanna NUMERIC := 0;
    __leysannapaso1 NUMERIC := 0;
    __leysannapaso2 NUMERIC := 0;
    __imponible_actual NUMERIC := 0;
    __imponible_100sc NUMERIC := 0;

BEGIN
    -- Paso 1: Validar entrada
    IF p_id_contrato IS NULL OR p_periodo IS NULL THEN
        RETURN QUERY SELECT NULL::INTEGER, 'ERROR'::VARCHAR, NULL::NUMERIC, 'Parámetros inválidos'::VARCHAR;
        RETURN;
    END IF;

    -- Paso 2: Obtener datos de persona y contrato (adaptado al nuevo esquema)
    SELECT * INTO v_persona
    FROM rrhh.vw_persona_factores
    WHERE id_contrato = p_id_contrato;

    IF NOT FOUND THEN
        RETURN QUERY SELECT NULL::INTEGER, 'ERROR'::VARCHAR, NULL::NUMERIC, 'Contrato no encontrado'::VARCHAR;
        RETURN;
    END IF;

    -- Paso 3: Obtener parámetros del período (adaptado a param.parametros_generales)
    SELECT * INTO v_parametros
    FROM param.parametros_generales
    WHERE periodo = TO_CHAR(p_periodo, 'YYYY-MM');

    IF NOT FOUND THEN
        RETURN QUERY SELECT NULL::INTEGER, 'ERROR'::VARCHAR, NULL::NUMERIC, 'No existen parámetros para el período'::VARCHAR;
        RETURN;
    END IF;

    -- Asignar valores a variables heredadas para compatibilidad
    _valor_uf := v_parametros.uf;
    _valor_utm := v_parametros.utm;
    _parametros_old := ROW(v_parametros.*); -- Convertir a RECORD para compatibilidad

    -- Paso 4: Verificar duplicidad (adaptado)
    IF EXISTS (
        SELECT 1 FROM remu.liquidacion
        WHERE id_contrato = p_id_contrato
        AND periodo = p_periodo
        AND estado <> 'BORRADOR'
    ) THEN
        RETURN QUERY SELECT NULL::INTEGER, 'ERROR'::VARCHAR, NULL::NUMERIC, 'Liquidación ya existe'::VARCHAR;
        RETURN;
    END IF;

    -- Paso 5: Crear cabecera de liquidación (adaptado)
    INSERT INTO remu.liquidacion (
        id_contrato, periodo, fecha_proceso, dias_trabajados,
        idusuario, valoruf, valorutm, estado
    ) VALUES (
        p_id_contrato, p_periodo, NOW(), 30,
        p_id_usuario, v_parametros.uf, v_parametros.utm, 'EP'
    ) RETURNING id_liquidacion INTO v_id_liquidacion;

    -- Paso 6: Calcular días trabajados (placeholder - implementar función auxiliar)
    v_calc.dias_trabajados := remu.fn_calcular_dias_trabajados(
        p_id_contrato, p_periodo, v_persona.fingreso, v_persona.fretiro
    );

    -- Paso 7: Insertar sueldo base (adaptado)
    INSERT INTO remu.liquidacion_detalle (
        id_liquidacion, id_concepto, monto, cantidad, descripcion, tipo, tipo_haber, orden
    ) SELECT
        v_id_liquidacion,
        c.id_concepto,
        ROUND(v_calc.dias_trabajados * v_persona.monto_dia, 0),
        v_calc.dias_trabajados,
        'Sueldo Base - ' || v_calc.dias_trabajados || ' días',
        'H', 'I', 1
    FROM remu.concepto c
    WHERE c.codigo = 'SUELDO_BASE';

    -- Paso 8: Calcular e insertar gratificación (optimizado - agregado)
    IF v_parametros.gratificacion THEN
        -- Calcular monto de gratificación (25% del sueldo base mensual)
        v_calc.gratificacion := ROUND(v_persona.base * v_parametros.imm_gratificacion / 12, 0);
        
        -- Aplicar tope si corresponde (basado en sueldo mínimo)
        IF v_calc.gratificacion > v_parametros.sueldo_minimo * v_parametros.imm_gratificacion THEN
            v_calc.gratificacion := ROUND(v_parametros.sueldo_minimo * v_parametros.imm_gratificacion, 0);
        END IF;

        -- Insertar gratificación
        INSERT INTO remu.liquidacion_detalle (
            id_liquidacion, id_concepto, monto, cantidad, descripcion, tipo, tipo_haber, orden
        ) SELECT
            v_id_liquidacion,
            c.id_concepto,
            v_calc.gratificacion,
            1,
            'Gratificación Legal',
            'H', 'N', 2
        FROM remu.concepto c
        WHERE c.codigo = 'GRATIFICACION';
    END IF;

    -- Paso 9: Procesar movimientos laborales (optimizado - agregado)
    -- Agregar haberes/descuentos fijos asignados por persona
    INSERT INTO remu.liquidacion_detalle (
        id_liquidacion, id_concepto, monto, cantidad, descripcion, tipo, tipo_haber, orden
    )
    SELECT
        v_id_liquidacion,
        hd.id_concepto,
        CASE WHEN hd.tipo = 'FIJO' THEN hd.monto ELSE hd.porcentaje * v_persona.base / 100 END,
        1,
        c.nombre,
        c.tipo,
        CASE WHEN c.tipo = 'HABER' THEN
            CASE WHEN c.naturaleza = 'IMPONIBLE' THEN 'I' ELSE 'N' END
        ELSE NULL END,
        ROW_NUMBER() OVER (ORDER BY hd.id_concepto) + 10
    FROM laboral.haberdescuento_persona hd
    JOIN remu.concepto c ON hd.id_concepto = c.id_concepto
    WHERE hd.id_persona = v_persona.id_persona
    AND hd.estado = TRUE;

    -- Procesar movimientos (horas extras, inasistencias, etc.)
    INSERT INTO remu.liquidacion_detalle (
        id_liquidacion, id_concepto, monto, cantidad, descripcion, tipo, tipo_haber, orden
    )
    SELECT
        v_id_liquidacion,
        CASE 
            WHEN m.tipomovimiento = 2 THEN (SELECT id_concepto FROM remu.concepto WHERE codigo = 'HORAS_EXTRAS')
            WHEN m.tipomovimiento = 3 THEN (SELECT id_concepto FROM remu.concepto WHERE codigo = 'INASISTENCIA')
            ELSE NULL
        END,
        m.monto,
        m.diainasist,
        CASE m.tipomovimiento
            WHEN 2 THEN 'Horas Extras'
            WHEN 3 THEN 'Inasistencia'
            ELSE 'Movimiento'
        END,
        CASE WHEN m.tipomovimiento = 2 THEN 'H' ELSE 'D' END,
        CASE WHEN m.tipomovimiento = 2 THEN 'I' ELSE NULL END,
        ROW_NUMBER() OVER (ORDER BY m.fecha) + 20
    FROM laboral.movimiento m
    WHERE m.id_persona = v_persona.id_persona
    AND m.fecha BETWEEN p_periodo AND (p_periodo + INTERVAL '1 month - 1 day')
    AND m.tipomovimiento IN (2, 3); -- Horas extras, inasistencias

    -- Paso 10: Calcular descuentos legales (AFP, Salud, Seguro Cesantía) - optimizado
    -- Calcular imponible para descuentos
    SELECT COALESCE(SUM(monto), 0) INTO v_calc.total_haberes_imponibles
    FROM remu.liquidacion_detalle
    WHERE id_liquidacion = v_id_liquidacion
    AND tipo = 'H' AND tipo_haber = 'I';

    -- AFP
    IF v_persona.prevision = 'AFP' THEN
        v_calc.afp := ROUND(v_calc.total_haberes_imponibles * v_persona.tasa_obligatoria / 100, 0);
        IF v_calc.afp > v_parametros.tope_afp THEN
            v_calc.afp := v_parametros.tope_afp;
        END IF;

        INSERT INTO remu.liquidacion_detalle (
            id_liquidacion, id_concepto, monto, cantidad, descripcion, tipo, tipo_haber, orden
        ) SELECT
            v_id_liquidacion,
            c.id_concepto,
            v_calc.afp,
            v_persona.tasa_obligatoria,
            'AFP ' || v_persona.afp_nombre,
            'D', NULL, 30
        FROM remu.concepto c
        WHERE c.codigo = 'AFP';
    END IF;

    -- Salud
    IF v_persona.salud_nombre_full = 'FONASA' THEN
        v_calc.salud := ROUND(v_calc.total_haberes_imponibles * 7 / 100, 0);
    ELSE
        -- ISAPRE: calcular adicional si corresponde
        v_calc.salud := ROUND(v_calc.total_haberes_imponibles * 7 / 100, 0);
        -- Adicional ISAPRE (simplificado)
        IF v_persona.salud_nombre IS NOT NULL THEN
            v_calc.salud := v_calc.salud + COALESCE(v_persona.valor_apvi, 0);
        END IF;
    END IF;

    IF v_calc.salud > v_parametros.tope_afp THEN
        v_calc.salud := v_parametros.tope_afp;
    END IF;

    INSERT INTO remu.liquidacion_detalle (
        id_liquidacion, id_concepto, monto, cantidad, descripcion, tipo, tipo_haber, orden
    ) SELECT
        v_id_liquidacion,
        c.id_concepto,
        v_calc.salud,
        7,
        'Salud ' || v_persona.salud_nombre_full,
        'D', NULL, 31
    FROM remu.concepto c
    WHERE c.codigo = 'SALUD';

    -- Seguro Cesantía (si aplica)
    IF v_persona.segurocesantia THEN
        v_calc.cesantia := ROUND(v_calc.total_haberes_imponibles * 0.6 / 100, 0);
        IF v_calc.cesantia > v_parametros.tope_cesantia THEN
            v_calc.cesantia := v_parametros.tope_cesantia;
        END IF;

        INSERT INTO remu.liquidacion_detalle (
            id_liquidacion, id_concepto, monto, cantidad, descripcion, tipo, tipo_haber, orden
        ) SELECT
            v_id_liquidacion,
            c.id_concepto,
            v_calc.cesantia,
            0.6,
            'Seguro Cesantía',
            'D', NULL, 32
        FROM remu.concepto c
        WHERE c.codigo = 'CESANTIA';
    END IF;

    -- SIS (Seguro de Invalidez y Sobrevivencia) - simplificado
    IF v_persona.prevision = 'AFP' AND v_persona.tasa_obligatoria >= 10 THEN
        v_calc.sis := ROUND(v_calc.total_haberes_imponibles * v_parametros.sis / 100, 0);
        IF v_calc.sis > v_parametros.tope_afp THEN
            v_calc.sis := v_parametros.tope_afp;
        END IF;

        INSERT INTO remu.liquidacion_detalle (
            id_liquidacion, id_concepto, monto, cantidad, descripcion, tipo, tipo_haber, orden
        ) SELECT
            v_id_liquidacion,
            c.id_concepto,
            v_calc.sis,
            v_parametros.sis,
            'SIS',
            'D', NULL, 33
        FROM remu.concepto c
        WHERE c.codigo = 'SIS';
    END IF;

    -- Paso 12: Procesar préstamos activos
    INSERT INTO remu.liquidacion_detalle (
        id_liquidacion, id_concepto, monto, cantidad, descripcion, tipo, tipo_haber, orden
    )
    SELECT
        v_id_liquidacion,
        c.id_concepto,
        p.valor_cuota,
        1,
        'Préstamo: ' || p.descripcion,
        'D', NULL, 40 + ROW_NUMBER() OVER (ORDER BY p.fecha_otorgamiento)
    FROM laboral.prestamo p
    CROSS JOIN (SELECT id_concepto FROM remu.concepto WHERE codigo = 'PRESTAMO') c
    WHERE p.id_persona = v_persona.id_persona
    AND p.estado = 'ACTIVO'
    AND p.saldo_pendiente > 0;

    -- Paso 13: Calcular impuesto a la renta (simplificado - primer tramo)
    -- Nota: Implementación básica, se puede expandir con tramos completos
    SELECT COALESCE(SUM(monto), 0) INTO v_calc.total_haberes_imponibles
    FROM remu.liquidacion_detalle
    WHERE id_liquidacion = v_id_liquidacion
    AND tipo = 'H' AND tipo_haber = 'I';

    -- Calcular renta imponible (haberes imponibles - descuentos legales)
    SELECT COALESCE(SUM(monto), 0) INTO v_calc.total_descuentos_legales
    FROM remu.liquidacion_detalle
    WHERE id_liquidacion = v_id_liquidacion
    AND tipo = 'D' AND tipo_haber IS NULL; -- Descuentos legales

    _renta := v_calc.total_haberes_imponibles - v_calc.total_descuentos_legales;

    -- Impuesto simplificado (primer tramo)
    IF _renta > 0 THEN
        SELECT factor, rebaja INTO _porc_prevision, _porc_isapre
        FROM param.tramo_impuesto
        WHERE periodo = TO_CHAR(p_periodo, 'YYYY-MM')
        AND desde <= _renta
        ORDER BY desde DESC
        LIMIT 1;

        IF FOUND THEN
            v_calc.valor_impuesto_renta := ROUND(_renta * _porc_prevision / 100 - _porc_isapre, 0);
            IF v_calc.valor_impuesto_renta > 0 THEN
                INSERT INTO remu.liquidacion_detalle (
                    id_liquidacion, id_concepto, monto, cantidad, descripcion, tipo, tipo_haber, orden
                ) SELECT
                    v_id_liquidacion,
                    c.id_concepto,
                    v_calc.valor_impuesto_renta,
                    _porc_prevision,
                    'Impuesto a la Renta',
                    'D', NULL, 50
                FROM remu.concepto c
                WHERE c.codigo = 'IMPUESTO_RENTA';
            END IF;
        END IF;
    END IF;

    -- Paso 14: Calcular totales finales y actualizar cabecera completa
    SELECT 
        COALESCE(SUM(CASE WHEN tipo = 'H' AND tipo_haber = 'I' THEN monto END), 0),
        COALESCE(SUM(CASE WHEN tipo = 'H' AND tipo_haber = 'N' THEN monto END), 0),
        COALESCE(SUM(CASE WHEN tipo = 'H' THEN monto END), 0),
        COALESCE(SUM(CASE WHEN tipo = 'D' AND tipo_haber IS NULL THEN monto END), 0), -- Legales
        COALESCE(SUM(CASE WHEN tipo = 'D' THEN monto END), 0)
    INTO _total_imponibles_legales, _total_haberes_noimponibles, _total_haberes, _total_descuentos_legales, _total_descuentos
    FROM remu.liquidacion_detalle
    WHERE id_liquidacion = v_id_liquidacion;

    _total_liquidacion := _total_haberes - _total_descuentos;

    UPDATE remu.liquidacion SET
        dias_trabajados = v_calc.dias_trabajados,
        total_haberes = _total_haberes,
        total_descuentos = _total_descuentos,
        monto_liquido = _total_liquidacion,
        renta_imponible = _renta,
        haberes_imponibles = _total_imponibles_legales,
        haberes_noimponibles = _total_haberes_noimponibles,
        descuentos_legales = _total_descuentos_legales,
        descuentos_nolegales = _total_descuentos - _total_descuentos_legales,
        imponible_100sc = _total_imponibles_legales, -- Simplificado
        estado = CASE WHEN p_preview THEN 'BORRADOR' ELSE 'PROCESADA' END
    WHERE id_liquidacion = v_id_liquidacion;

    -- Paso final: Retornar resultado
    RETURN QUERY SELECT v_id_liquidacion, v_estado, _total_liquidacion, v_mensaje;

EXCEPTION
    WHEN OTHERS THEN
        RETURN QUERY SELECT NULL::INTEGER, 'ERROR'::VARCHAR, NULL::NUMERIC, SQLERRM::VARCHAR;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SCRIPT DE PRUEBA PARA LA FUNCIÓN OPTIMIZADA
-- ============================================

-- Insertar datos de prueba
INSERT INTO param.comuna (id_comuna, nombre) VALUES (1, 'Santiago') ON CONFLICT DO NOTHING;
INSERT INTO param.banco (id_banco, nombre) VALUES (1, 'Banco Estado') ON CONFLICT DO NOTHING;

INSERT INTO core.empresa (id_empresa, rut, dv, razon_social) VALUES
(1, 12345678, '9', 'Empresa Prueba') ON CONFLICT DO NOTHING;

INSERT INTO prev.afp (id_afp, nombre, tasa_obligatoria) VALUES
(1, 'AFP Modelo', 10.00) ON CONFLICT DO NOTHING;

INSERT INTO prev.salud (id_salud, nombre, tipo) VALUES
(1, 'FONASA', 'FONASA') ON CONFLICT DO NOTHING;

INSERT INTO rrhh.persona (id_persona, rut, dv, nombres, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, id_comuna, cargo, tipotrabajador, prevision, salud_nombre, segurocesantia, fecha_ingreso, hsemanales, dsemanales, tipojornada) VALUES
(1, 11222333, '4', 'Juan', 'Pérez', 'González', '1980-01-01', 'M', 1, 'Analista', 0, 'AFP', 'FONASA', TRUE, '2020-01-01', 40, 5, 'C') ON CONFLICT DO NOTHING;

INSERT INTO laboral.contrato (id_contrato, id_persona, id_empresa, id_afp, id_salud, tipo_contrato, fecha_inicio, sueldo_base_actual, estado, monto_dia) VALUES
(1, 1, 1, 1, 1, 'Plazo Indefinido', '2020-01-01', 500000, 'ACTIVO', 16667) ON CONFLICT DO NOTHING;

-- Parámetros para 2024-01
INSERT INTO param.parametros_generales (periodo, uf, utm, sueldo_minimo, sueldo_minimo18_65, gratificacion, imm_gratificacion, tope_afp, tope_ips, tope_cesantia, tope_afpvoluntario, sis, dsctosbpordia) VALUES
('2024-01', 35000.00, 60000, 460000, 320000, TRUE, 4.75, 1500000, 1500000, 1500000, 1500000, 1.26, TRUE) ON CONFLICT DO NOTHING;

-- Tramos de impuesto para 2024-01
INSERT INTO param.tramo_impuesto (periodo, desde, hasta, factor, rebaja) VALUES
('2024-01', 0, 806250, 0, 0),
('2024-01', 806251, 1796250, 4, 32250),
('2024-01', 1796251, 3000000, 8, 106250) ON CONFLICT DO NOTHING;

-- Probar la función
SELECT * FROM remu.fn_generar_liquidacion(1, '2024-01-01'::DATE, 1, FALSE);