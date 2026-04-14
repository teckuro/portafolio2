CREATE OR REPLACE FUNCTION personal.fn_generar_liquidacion (
  integer,
  varchar,
  varchar,
  boolean
)
RETURNS boolean AS
$body$
DECLARE
	--ULTIMA ACTUALIZACION : 23-08-2019 [VIGENTE]

	_idempleado			ALIAS FOR $1;	--Identificador del Empleado
	_periodo			ALIAS FOR $2;	--Periodo de la liquidacion ej: 2012-07
	_usuario			ALIAS FOR $3;	--Id del usuario de sistema
    _preview     		ALIAS FOR $4;	--Nos indica si generaremos una vista previa de la liquidación

	_valida_duplicidad	RECORD;
	_cabecera			RECORD;
	_parametros			RECORD;
	_movimientos		RECORD;
	_prestamos			RECORD;
	_haberes_desc		RECORD;
	_tramos_cargas		RECORD;
	_impuesto_renta		RECORD;
    _rcd_param_dias_per	RECORD;

	_idliquidacion		INTEGER;	-- Recibe el id de la liquidacion generada
	_orden				INTEGER;

	_total_haberes_imponibles		NUMERIC;
	_total_haberes_noimponibles		NUMERIC;
	_total_haberes					NUMERIC;
	_total_descuentos				NUMERIC;
	_total_descuentos_legales		NUMERIC;
	_total_liquidacion				NUMERIC;
	_monto_haberes_singratif		NUMERIC;

	_porc_prevision					NUMERIC;
	_porc_isapre					NUMERIC;
	_porc_salud7					NUMERIC;
	_porc_salud7_paso				NUMERIC;
	_salud_dias						NUMERIC;
	_adicional_isapre				NUMERIC;
	_valor_uf						NUMERIC;
	_valor_utm						NUMERIC;
	_total_prevision				NUMERIC;
	_dias_licencia					NUMERIC;
	_total_salud_dias				NUMERIC;
	_total_gratificacion			NUMERIC;
	_monto_gratificacion			NUMERIC;
	_total_imponibles_legales		NUMERIC;
	_valor_impuesto_renta			NUMERIC;
	_sueldo_base					NUMERIC;

	_total_afpvoluntario			NUMERIC;
	_total_imponibles_legales_utm	NUMERIC;
	_total_salud					NUMERIC;

	_tope_gratificacion				NUMERIC;
	_tope_afp						NUMERIC;
	_tope_ips						NUMERIC;
	_tope_cesantia					NUMERIC;
	_tope_afpvoluntario				NUMERIC;
	_tope_salud						NUMERIC;

	_dia_ini						VARCHAR;
	_mes_ini						VARCHAR;
	_anno_ini						VARCHAR;
	_periodo_ini					VARCHAR;

	_dia_fin						VARCHAR;
	_mes_fin						VARCHAR;
	_anno_fin						VARCHAR;
	_periodo_fin					VARCHAR;

	_periodo2						VARCHAR;

	_dias_trabajados				NUMERIC;
	_atrasos_inasist				NUMERIC;
	_anticipos						NUMERIC;
	_horas_extras					NUMERIC;
	_fonasa							NUMERIC;
	_isapre							NUMERIC;
	_adicional						NUMERIC;
	_cargas							NUMERIC;
	_otros_desctos					NUMERIC;
	_locomocion						NUMERIC;
	_colacion						NUMERIC;
	_impto_renta					NUMERIC;
	_otros_imp						NUMERIC;
	_otros_noimp					NUMERIC;
	_total_plan_salud				NUMERIC;
	_total_apvi						NUMERIC;
	_valor_prestamo					NUMERIC;

	_haber_licencia					NUMERIC;	--BASE ANTES DE LICENCIA
	_seg_impprevio					NUMERIC;	--IMPONIBLE CALCULADO SI HAY LICENCIA
	_seg_imponible					NUMERIC;	--BASE DE CALCULO
	_seg_empleador					NUMERIC;	--EMPLEADOR
	_cesantia						NUMERIC;	--TRABAJADOR
	_sisbase						NUMERIC;	--BASE DE CALCULO SIS
	_sis							NUMERIC;	--SEGURO DE INVALIDEZ Y SOBREVICENCIA (1.26 %)

	_prestamo_ccaf					NUMERIC;
	_carga_retroactiva				NUMERIC;

	v_edad							INTEGER;
    _tiempo							INTEGER;
	_renta							NUMERIC;
    _descripcion					VARCHAR;
    _valor_haber					NUMERIC; 	-- Valor del haber en base a los días laborales
    _valor_dia						NUMERIC;    -- Valor del haber por dia
    _dias_inasis					NUMERIC; 	-- Dias de inasistencia
    _dias							NUMERIC;	-- Total dias trabajados = Dias laborales - dias de inasistencia
	_promedio						NUMERIC;
    _finmes							DATE;

	__anios      					INTEGER;
	__maxanios   					INTEGER;	-- Tope años Seguro Cesantia
	__cempleador 					NUMERIC;	-- Monto Empresa Seguro Cesantia al superar tope años
   	_valortt						INTEGER;

    __ccafahorro                    NUMERIC;
    __ccafsegurovida                NUMERIC;
    __ccafdental                    NUMERIC;
    __ccafotrodescto                NUMERIC;
	__desc_gratificacion			VARCHAR;

    __forma_pago_apvi				INTEGER;
    __sispaso01                     NUMERIC;
    __sispaso02                     NUMERIC;
    __segurocesantiapaso01          NUMERIC;
    __cesantiaempleador             NUMERIC;

    __rutPersonal					VARCHAR;	--Identifica el rut segun el párametro _idempleado
    __varfiltro						VARCHAR;

	__jornadalaboralpactada			DECIMAL;
    __sbasetemporal					NUMERIC;
    __sbasetemporalcalculado		NUMERIC;
    __edadmenor                     INTEGER;

    __cantdiasmescurso				INTEGER;

    __diafinmes						INTEGER;

    __islicenciamedica				BOOLEAN;
    __montoajuste 					NUMERIC;
    __saldopendiente				NUMERIC;

    __diainasist                   NUMERIC;

    __tipotramo						VARCHAR;
    __desctoley21252				NUMERIC;
    
    __cargo							VARCHAR;
    
    __valor_uf_ips					NUMERIC;
    
    __imponiblemes					NUMERIC;
    __leysanna						NUMERIC;
    __leysannapaso1					NUMERIC;
    __leysannapaso2					NUMERIC;
    __imponible_actual              NUMERIC;
    
    __imponible_100sc					NUMERIC;
BEGIN

	-- VALIDO QUE LA LIQUIDACION NO EXISTA PARA LA PERSONA Y EL PERIODO (SOLO SI ESTA EN ESTADO EP=EN PROCESO LA PISAMOS)
	SELECT INTO _valida_duplicidad *
	FROM personal.liquidacion liq
	INNER JOIN personal.persona per
	ON liq.idpersona = per.idpersona
	WHERE liq.periodo = _periodo
	AND per.idpersona = _idempleado
	AND liq.estado <> 'EP';

	IF (FOUND) THEN
		RAISE EXCEPTION 'Liquidacion de Sueldo ya fue generada para % %',_valida_duplicidad.nombre,_valida_duplicidad.apellidopaterno;
	END IF;

	-- BORRAMOS CUALQUIER BORRADOR DE LIQUIDACION PREVIA PARA LA PERSONA Y PERIODO INDICADO
	DELETE FROM personal.liquidacion_detalle WHERE id_liquidacion = (SELECT id FROM personal.liquidacion WHERE periodo = _periodo AND idpersona = _idempleado);
	DELETE FROM personal.liquidacion WHERE periodo = _periodo AND idpersona = _idempleado;

	_periodo2 := REPLACE(_periodo, '-', '');

	-- OBTENGO LOS PARAMETROS GENERALES DEL PERIODO
	SELECT INTO _parametros * FROM personal.parametrosgenerales par WHERE par.periodo = _periodo2;

	IF (NOT FOUND) THEN
		RAISE EXCEPTION 'No Existe registro de Parametros Generales en el Periodo Seleccionado';
	END IF;


	-- ASIGNO Y SETEO VALORES GENERALES PARA USO POSTERIOR
	_valor_uf               := _parametros.uf;
	_valor_utm				:= _parametros.utm;
	_porc_salud7			:= 0;
	_porc_salud7_paso		:= 0;
	_adicional_isapre		:= 0;
	_total_salud			:= 0;
	_total_prevision		:= 0;
	_total_afpvoluntario	:= 0;
	_dias_licencia			:= 0;
	_sueldo_base			:= 0;
	_salud_dias				:= 0;
	_dias_trabajados		:= 0;
	_atrasos_inasist		:= 0;
	_anticipos				:= 0;
	_horas_extras			:= 0;
	_fonasa					:= 0;
	_isapre					:= 0;
	_adicional				:= 0;
	_cargas					:= 0;
	_otros_desctos			:= 0;
	_locomocion				:= 0;
	_colacion				:= 0;
	_impto_renta			:= 0;
	_valor_impuesto_renta	:= 0;
	_otros_imp				:= 0;
	_otros_noimp			:= 0;
	_total_plan_salud		:= 0;
	_total_apvi				:= 0;
	_valor_prestamo			:= 0;
	_carga_retroactiva		:= 0;
	_prestamo_ccaf			:= 0;
	_total_imponibles_legales		:= 0;
	_total_imponibles_legales_utm	:= 0;
    __ccafahorro            := 0;
    __ccafsegurovida        := 0;

    __ccafdental            := 0;
    __ccafotrodescto        := 0;

	_dia_ini				:= NULL;
	_mes_ini				:= NULL;
	_anno_ini				:= NULL;
	_periodo_ini			:= NULL;

	_dia_fin				:= NULL;
	_mes_fin				:= NULL;
	_anno_fin				:= NULL;
	_periodo_fin			:= NULL;
	_dias_inasis 			:= 0;

	__maxanios   			:= 11;
	__cempleador 			:= 0.8;
    __islicenciamedica		:= FALSE;

    __cargo 				:= (SELECT COALESCE(cargo, '') as cargo FROM personal.persona WHERE idpersona = _idempleado LIMIT 1);

	-- Verifico si el empleado tiene dias de licencia
	SELECT INTO _dias_licencia CASE WHEN SUM(mv.diainasist) = (SELECT EXTRACT('days' FROM(to_date(_periodo, 'YYYY-MM') + interval '1 month' 
    																	- to_date(_periodo, 'YYYY-MM'))))
    			   AND _parametros.dsctosbpordia IS NOT TRUE
          	THEN 30
         ELSE
            SUM(mv.diainasist)  
         END  
	FROM personal.movimientos mv
	WHERE mv.tipomovimiento = 3
	AND mv.motivoinasist = 101
	AND to_char(mv.fecha, 'YYYY-MM') = _periodo
	AND mv.idpersona = _idempleado;

	-- OBTENGO DATOS LIQUIDACION DE LA PERSONA
	SELECT INTO _cabecera *
	FROM personal.vw_persona_factores vp
	WHERE vp.idpersona = _idempleado;

	IF (NOT FOUND) THEN
		RAISE EXCEPTION 'No Existe el ID persona en la Tabla Personal';
	END IF;

	IF (_cabecera.base = 0)	THEN
		RAISE EXCEPTION 'No se indico Sueldo Base, RUT: %', _cabecera.rut;
	END IF;

	IF (_cabecera.hsemanales = 0)	THEN
		RAISE EXCEPTION 'No se indico Jornada Horas Semanales, RUT: %', _cabecera.rut;
	END IF;

	IF (_cabecera.dsemanales = 0)	THEN
		RAISE EXCEPTION 'No se indico Jornada Dias Semanales, RUT: %', _cabecera.rut;
	END IF;

	IF (_cabecera.tipojornada IS NULL)	THEN
		_cabecera.tipojornada = 'C';
        --RAISE EXCEPTION 'No se indico el Tipo de Jornada Laboral, RUT: %', _cabecera.rut;
	END IF;

    IF (_cabecera.segurocesantia = TRUE AND _cabecera.tipotrabajador IN (1, 2))	THEN
		RAISE EXCEPTION 'Tipo trabajador pensionado con descuento Seguro de Cesantía activo, favor regularizar situación desde Maestro Personal';
	END IF;

	-- Verifico si el empleado reduccion de la jornada laboral
    IF EXISTS (SELECT mv.id FROM personal.movimientos mv
                WHERE mv.tipomovimiento = 3 AND mv.motivoinasist = 104
                AND to_char(mv.fecha, 'YYYY-MM') = _periodo
                AND mv.idpersona = _idempleado)
    THEN

    	__jornadalaboralpactada := (SELECT mv.hrs_pactadas FROM personal.movimientos mv
                                      WHERE mv.tipomovimiento = 3 AND mv.motivoinasist = 104
                                      AND to_char(mv.fecha, 'YYYY-MM') = _periodo
                                      AND mv.idpersona = _idempleado);

    	--RESPALDO SUELDO BASE ORIGINAL
		__sbasetemporal := _cabecera.base;

        --ACTUALIZO SUELDO BASE RECALCULADO PARA REUTILIZAR VISTA
  		UPDATE personal.persona
        SET sbase = (round(_cabecera.base * ((__jornadalaboralpactada * 100)/_cabecera.hsemanales)/100, 0))
        WHERE idpersona = _idempleado;

        -- OBTENGO DATOS LIQUIDACION DE LA PERSONA RECALCULADOS SEGUN REDUCCION LABORAL
        SELECT INTO _cabecera *
        FROM personal.vw_persona_factores vp
        WHERE vp.idpersona = _idempleado;

        --VUELVO A COLOCAR SUELDO BASE ORIGINAL
        UPDATE personal.persona
        SET sbase = __sbasetemporal
        WHERE idpersona = _idempleado;
    END IF;

	-- AGREGO DATOS DE CABECERA DE LIQUIDACION
	INSERT INTO personal.liquidacion(
		  idpersona
		, periodo
		, sueldo_base
		, valor_dia
		, usuario
		, estado
        ,valoruf
        ,valorutm
	) VALUES (
		  _idempleado
		, _periodo
		, _cabecera.base
		, _cabecera.monto_dia
		, _usuario
		, 'EP'
    	,_parametros.uf
        ,_parametros.utm
	)
	RETURNING id INTO _idliquidacion;

	-- Extraigo datos de inicio y fin de contrato, si es el caso que este mes inicio o termino contrato;
	_anno_ini := substring(_cabecera.fingreso::VARCHAR FROM 0 FOR 5);
	_mes_ini  := substring(_cabecera.fingreso::VARCHAR FROM 6 FOR 2);
	_dia_ini  := substring(_cabecera.fingreso::VARCHAR FROM 9 FOR 2);
	_periodo_ini := _anno_ini || '-' || _mes_ini;
    _finmes := (_periodo || '-01')::DATE + '1 month'::INTERVAL - '1 day'::INTERVAL;

	IF (_cabecera.fretiro IS NOT NULL) THEN	-- Si fecha retiro no es NULL tiene contrato a plazo fijo
		_anno_fin := substring(_cabecera.fretiro::VARCHAR FROM 0 FOR 5);
		_mes_fin  := substring(_cabecera.fretiro::VARCHAR FROM 6 FOR 2);
		_dia_fin  := substring(_cabecera.fretiro::VARCHAR FROM 9 FOR 2);
        RAISE NOTICE '_anno_fin: %', _anno_fin;
        RAISE NOTICE '_mes_fin: %', _mes_fin;
        RAISE NOTICE '_dia_fin: %', _dia_fin;
        RAISE NOTICE '_cabecera.fretiro: %', _cabecera.fretiro;
        RAISE NOTICE '_finmes: %', _finmes;
		IF (_dia_fin = EXTRACT (DAY FROM _finmes)::VARCHAR) THEN
        	RAISE NOTICE 'Entró aqui';
			_dia_fin := '30';
		END IF;
		_periodo_fin := _anno_fin || '-' || _mes_fin;
	END IF;

-- AGREGAMOS SUELDO BASE
	SELECT INTO v_edad EXTRACT (YEAR FROM age(_cabecera.fecha_nac::TIMESTAMP));
    __desc_gratificacion := '';
    IF (v_edad BETWEEN 18 AND 65)THEN
		_parametros.sueldo_minimo := _parametros.sueldo_minimo;
	ELSE
        IF (v_edad > 65)  THEN
            __desc_gratificacion := ' Mayor de 65 años';
            IF _cabecera.tipotrabajador = 0 THEN 
                _parametros.sueldo_minimo := _parametros.sueldo_minimo;
            ELSE
                _parametros.sueldo_minimo := _parametros.sueldo_minimo18_65;
            END IF;
        ELSE
            __desc_gratificacion := ' Menor de 18 años';
            _parametros.sueldo_minimo := _parametros.sueldo_minimo18_65;
        END IF;
	END IF;

	SELECT INTO __edadmenor EXTRACT(YEAR FROM age(to_date(to_char(_cabecera.fecha_nac::DATE,'01-mm-yyyy'),'dd-mm-yyyy') + interval '1 month'));
    IF (__edadmenor >= 18 AND _cabecera.tipotrabajador = 4) THEN
    	RAISE EXCEPTION 'El trabajador tiene más de 18 años, para actualizar los datos deberá dirigirse a:
                         Remuneraciones -> Maestro -> Personal';
    END IF;

	__valor_uf_ips := (SELECT uf FROM dblink(dblink_dteconfiguracion(), 'SELECT uf FROM public.valoresmonedas
                WHERE to_char(fecha,''dd-mm-yyyy'') =  to_char(('''||_periodo||''' || ''-'' || ''01'')::date - 1, ''dd-mm-yyyy'') LIMIT 1 ') as (uf NUMERIC));

	IF (_periodo = _periodo_ini) THEN -- Si ingreso a trabajar el mes en curso
		IF (_periodo =_periodo_fin) THEN
            -- AQUI AGREGAR EL IF DE JORNADA CON ESTADO C -> COMPLETO
            IF (_cabecera.tipojornada IN('C','A')) THEN
       			--SI INGRESO Y TERMINO CONTRATO DENTRO DEL MISMO MES
                _dias_trabajados := (31 - (_dia_ini::INTEGER) - (30 - (_dia_fin::INTEGER)));
                IF (_parametros.dsctosbpordia IS TRUE AND substring(_cabecera.fretiro::VARCHAR FROM 9 FOR 2) = '31') THEN
                	_dias_trabajados := _dias_trabajados + 1;
                END IF;
                RAISE NOTICE '_dia_ini: %', _dia_ini;
                RAISE NOTICE '_dia_fin: %', _dia_fin;
                RAISE NOTICE '_dias_trabajados: %', _dias_trabajados;
            ELSE
                _dias_trabajados := ROUND(((((31 - (_dia_ini::INTEGER) - (30 - (_dia_fin::INTEGER))))::NUMERIC / 7)::NUMERIC * _cabecera.dsemanales ),0) + 1;

            END IF;
		ELSE
            IF EXTRACT (DAY FROM _finmes)::INTEGER < 30 THEN
            	__diafinmes := 30;
            ELSE
            	__diafinmes := EXTRACT (DAY FROM _finmes)::INTEGER;
            END IF;
            IF (_cabecera.tipojornada IN('C','A')) THEN
            	_dias_trabajados := ((__diafinmes+1) - (_dia_ini::INTEGER));
          	ELSE
          	  	_dias_trabajados := ROUND(((((__diafinmes+1) - (_dia_ini::INTEGER))::NUMERIC  / 7)::NUMERIC * _cabecera.dsemanales ),0) + 1;
          	END IF;
		END IF;
        IF _dias_trabajados = 31 THEN
        	_dias_trabajados = 30;
        END IF;
		--SELECT INTO coalesce(s.diainasist,0)::integer FROM personal.movimientos s WHERE to_char(s.fecha,'yyyy-mm') = _periodo and s.idpersona = _idempleado;
        --	falla por que no descuenta los dias de inasistencia
		_sueldo_base := round((_dias_trabajados * _cabecera.monto_dia),0);
		-- SETEAMOS TOPES
		_tope_gratificacion		:= round(((_parametros.imm_gratificacion * _parametros.sueldo_minimo)/12),0);
		_tope_afp				:= round(_parametros.tope_afp * _valor_uf,0);
		_tope_ips				:= round(_parametros.tope_ips * __valor_uf_ips,0);
		_tope_cesantia			:= round(_parametros.tope_cesantia * _valor_uf,0);
		_tope_afpvoluntario		:= round(_parametros.tope_afpvoluntario * _valor_uf,0);

        -- Verifico si el empleado reduccion de la jornada laboral
        IF EXISTS (SELECT mv.id FROM personal.movimientos mv
                    WHERE mv.tipomovimiento = 3 AND mv.motivoinasist = 104
                    AND to_char(mv.fecha, 'YYYY-MM') = _periodo
                    AND mv.idpersona = _idempleado)
        THEN
            INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden)
            VALUES (_idliquidacion,'Sueldo Base Pactado- '|| _dias_trabajados  || ' días a '||web.format_number(round(_cabecera.monto_dia),'MONEY') ||' (Ley 21.227)',_sueldo_base,'H','I',1);
        ELSE
		INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden)
        VALUES (_idliquidacion,'Sueldo Base - '|| _dias_trabajados  || ' días a '||web.format_number(round(_cabecera.monto_dia),'MONEY'),_sueldo_base,'H','I',1);
        END IF;

	ELSIF (_periodo = _periodo_fin) THEN --	Si su contrato termina el mes en curso
        IF (_cabecera.tipojornada IN('C','A')) THEN
			_dias_trabajados := (_dia_fin::INTEGER);
        ELSE
        	_dias_trabajados := ROUND(((_dia_fin::NUMERIC / 7)::NUMERIC * _cabecera.dsemanales )::NUMERIC,0) + 1;
        END IF;
		_sueldo_base := ROUND ((_dias_trabajados * _cabecera.monto_dia),0);

		-- SETEAMOS TOPES
		_tope_gratificacion	:= round(((_parametros.imm_gratificacion * _parametros.sueldo_minimo)/12),0);
		_tope_afp				:= round(_parametros.tope_afp * _valor_uf,0);
		_tope_ips				:= round(_parametros.tope_ips * __valor_uf_ips,0);
		_tope_cesantia			:= round(_parametros.tope_cesantia * _valor_uf,0);
		_tope_afpvoluntario		:= round(_parametros.tope_afpvoluntario * _valor_uf,0);
        -- Verifico si el empleado reduccion de la jornada laboral
        IF EXISTS (SELECT mv.id FROM personal.movimientos mv
                    WHERE mv.tipomovimiento = 3 AND mv.motivoinasist = 104
                    AND to_char(mv.fecha, 'YYYY-MM') = _periodo
                    AND mv.idpersona = _idempleado)
        THEN
            INSERT INTO personal.liquidacion_detalle(
                  id_liquidacion
                , descripcion
                , monto
                , tipo
                , tipo_haber
                , orden
            ) VALUES (
                  _idliquidacion
                , 'Sueldo Base Pactado - ' || _dias_trabajados || ' días a ' || web.format_number(round(_cabecera.monto_dia)::numeric, 'MONEY') ||' (Ley 21.227)'
                , _sueldo_base
                , 'H'
                , 'I'
                , 1
            );
    	ELSE
		INSERT INTO personal.liquidacion_detalle(
        	  id_liquidacion
            , descripcion
            , monto
            , tipo
            , tipo_haber
            , orden
        ) VALUES (
        	  _idliquidacion
        	, 'Sueldo Base - ' || _dias_trabajados || ' días a ' || web.format_number(round(_cabecera.monto_dia)::numeric, 'MONEY')
            , _sueldo_base
            , 'H'
            , 'I'
            , 1
        );
        END IF;
	ELSE	--	Caso normal, no ingreso ni se termina su contrato el mes a liquidar
        IF (_cabecera.tipojornada IN('C','A')) THEN
        	_dias_trabajados := 30;
        ELSE
        	_dias_trabajados := ROUND(((30::NUMERIC / 7)::NUMERIC * _cabecera.dsemanales)::NUMERIC, 0) + 1;-- ESTA DA 1 MENOS
        END IF;

		_sueldo_base := _cabecera.base;

		-- SETEAMOS TOPES
		_tope_gratificacion	:= round(((_parametros.imm_gratificacion * _parametros.sueldo_minimo)/12),0);
		_tope_afp			:= round((_parametros.tope_afp * _valor_uf),0);
		_tope_ips			:= round((_parametros.tope_ips * __valor_uf_ips),0);
		_tope_cesantia		:= round((_parametros.tope_cesantia * _valor_uf),0);
		_tope_afpvoluntario	:= round((_parametros.tope_afpvoluntario * _valor_uf),0);

        -- Verifico si el empleado reduccion de la jornada laboral
        IF EXISTS (SELECT mv.id FROM personal.movimientos mv
                    WHERE mv.tipomovimiento = 3 AND mv.motivoinasist = 104
                    AND to_char(mv.fecha, 'YYYY-MM') = _periodo
                    AND mv.idpersona = _idempleado)
        THEN
            INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden)
            VALUES (_idliquidacion,'Sueldo Base Pactado - 30 días a '||web.format_number(round(_cabecera.monto_dia)::numeric,'MONEY') ||' (Ley 21.227)',_sueldo_base,'H','I',1);
        ELSE
		INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden)
		VALUES (_idliquidacion,'Sueldo Base - 30 días a '||web.format_number(round(_cabecera.monto_dia)::numeric,'MONEY'),_sueldo_base,'H','I',1);
	END IF;
	END IF;
--------------------------------------------------------------------------------
-- EL ELSE CON ESTADO P -> PARCIAL
-- FIN SUELDO BASE	-----------------------------------------------------------------------

-- INICIO MOVIMIENTOS - ATRASOS -- HORAS EXTRAS -- INASISTENCIAS -- ANTICIPOS ----
	_orden := 13;
	FOR _movimientos IN SELECT DISTINCT
			 _idliquidacion AS id_liquidacion
			,(CASE WHEN mv.tipomovimiento = 1 THEN 'HORAS NO TRABAJADAS / ' || (((mv.totalminutos || 'minutes'::text))::interval || ' hrs/min'::text)
				WHEN mv.tipomovimiento = 2	THEN 'ANTICIPOS'
                WHEN  (mv.tipomovimiento = 3) AND (mv.motivoinasist = 101) AND (lpp.mediajornada = TRUE) THEN 'Licencia médica al 50% - '|| mv.diainasist ||' Dias a ' || fn_formato('$', 'I', round(pf.monto_dia,0))
				WHEN (mv.tipomovimiento = 3) AND (mv.motivoinasist = 101) THEN 'INASISTENCIA '|| mv.diainasist ||' Dia(s) - Licencia Medica'
				WHEN (mv.tipomovimiento = 3) AND (mv.motivoinasist = 102) OR (mv.motivoinasist = 103)	THEN 'INASISTENCIA '|| mv.diainasist ||' Dia(s)'
				WHEN mv.tipomovimiento = 4 AND mv.tipohora = 50 THEN (((((mv.totalminutos || 'minutes'::text)::interval || ' hrs/min al '::text) || mv.tipohora) || '% a '::text) || round(pf.monto_hora50,0)::VARCHAR)
				WHEN mv.tipomovimiento = 4 AND mv.tipohora = 100 THEN ((((((mv.totalminutos || 'minutes'::text))::interval || ' hrs/min al '::text) || mv.tipohora) || '% a '::text) || round(pf.monto_hora100,0)::VARCHAR)
				WHEN mv.tipomovimiento = 5 THEN 'Cargas Retroactivas'
			END) AS descripcion
			,mv.tipomovimiento AS movimiento
			,mv.diainasist AS dias
			,(CASE WHEN mv.tipomovimiento = 1 THEN - round(((mv.totalminutos::NUMERIC/60) * pf.monto_hora_atraso))
				WHEN mv.tipomovimiento = 2	THEN mv.monto
                WHEN  (mv.tipomovimiento = 3) AND (mv.motivoinasist = 101) AND (lpp.mediajornada = TRUE) THEN -(round(((diainasist * pf.monto_dia) /2),0))
				WHEN (mv.tipomovimiento = 3) AND (mv.motivoinasist = 101) THEN - (round((diainasist * pf.monto_dia),0))
				WHEN (mv.tipomovimiento = 3) AND (mv.motivoinasist = 102) OR (mv.motivoinasist = 103) THEN - (round((diainasist * pf.monto_dia),0))
				WHEN mv.tipomovimiento = 4 AND mv.tipohora = 50 THEN round((mv.totalminutos * pf.monto_minuto50),0)::NUMERIC
				WHEN mv.tipomovimiento = 4 AND mv.tipohora = 100 THEN round((mv.totalminutos * pf.monto_minuto100),0)::NUMERIC
				WHEN mv.tipomovimiento = 5 THEN mv.monto
			END) AS monto
			,(CASE WHEN mv.tipomovimiento = 2 THEN 'D' ELSE 'H' END)::CHAR AS tipo
			,(CASE WHEN mv.tipomovimiento = 2 THEN NULL
				WHEN mv.tipomovimiento = 5 THEN 'N'
				ELSE 'I' END)::CHAR AS tipo_haber
                ,mv.motivoinasist AS motivoinasist
			FROM personal.vw_persona_factores pf
			INNER JOIN (
				SELECT
				 m.idpersona
				,to_char(m.fecha,'YYYY-MM') AS periodo
				,m.tipomovimiento
				,m.tipohora
				,SUM(m.totalminutos) AS totalminutos
				,CASE WHEN SUM(m.diainasist) = (SELECT EXTRACT('days' FROM(to_date(_periodo, 'YYYY-MM') + interval '1 month' 
    																	- to_date(_periodo, 'YYYY-MM'))))
            				AND _parametros.dsctosbpordia IS NOT TRUE
          			THEN 30
                ELSE
            		SUM(m.diainasist)
                END AS diainasist
				,CASE WHEN m.motivoinasist = 103 THEN 102 ELSE m.motivoinasist END AS motivoinasist
				,SUM(m.monto) AS monto
				FROM personal.movimientos m
				GROUP BY 1, 2, 3, 7, 4
				--ORDER BY m.tipomovimiento ASC
			) mv
			ON pf.idpersona = mv.idpersona
			AND mv.periodo = _periodo
            LEFT JOIN personal.licenciasporpersonal lpp
            ON lpp.idpersona = mv.idpersona AND to_char(lpp.fechadesde, 'YYYY-MM') = mv.periodo
			WHERE pf.idpersona = _idempleado
	LOOP
		IF (_movimientos.monto IS NOT NULL) THEN
			IF (_movimientos.movimiento = 5) THEN		--Cargas retoactivas
				_carga_retroactiva := (_carga_retroactiva::NUMERIC + _movimientos.monto::NUMERIC);
				_orden := 6;
			ELSIF (_movimientos.movimiento = 1) THEN -- Atrasos
				IF (_movimientos.monto > 0) THEN
					_atrasos_inasist := (_atrasos_inasist::NUMERIC + _movimientos.monto::NUMERIC );
				ELSE
					_atrasos_inasist := (_atrasos_inasist::NUMERIC + (_movimientos.monto::NUMERIC * -1));
				END IF;
			ELSIF (_movimientos.movimiento = 2) THEN -- Anticipos
				_anticipos := (_anticipos::NUMERIC + _movimientos.monto::NUMERIC);
			ELSIF (_movimientos.movimiento = 3) THEN -- Inasistencias

            	IF (_movimientos.motivoinasist = 101 AND _movimientos.dias > 0) THEN
					__islicenciamedica := TRUE;
                END IF;

				IF (_movimientos.monto > 0) THEN
					_atrasos_inasist := (_atrasos_inasist::NUMERIC + _movimientos.monto::NUMERIC );
				ELSE
					_atrasos_inasist := (_atrasos_inasist::NUMERIC + (_movimientos.monto::NUMERIC * -1));
				END IF;
				IF (_movimientos.dias > 0) THEN
					_dias_trabajados:= (_dias_trabajados -	_movimientos.dias);
                    _dias_inasis := (_dias_inasis + _movimientos.dias); -- Atraso en dias
				END IF;
			ELSIF (_movimientos.movimiento = 4) THEN -- Horas extras
				_horas_extras := (_horas_extras::NUMERIC + _movimientos.monto::NUMERIC);
			END IF;

            IF (_movimientos.movimiento = 3 AND _movimientos.motivoinasist = 102 OR _movimientos.motivoinasist = 103) THEN
            	IF (_parametros.dsctosbpordia = TRUE) THEN
					__cantdiasmescurso := (SELECT DATE_PART ('days', DATE_TRUNC('month', TO_DATE(_periodo||'-01', 'YYYY-MM-DD')) + '1 MONTH'::INTERVAL - '1 DAY'::INTERVAL));
                    _movimientos.monto :=  - (round((_cabecera.base - ((__cantdiasmescurso - _movimientos.dias) * _cabecera.monto_dia)),0)::NUMERIC);
                END IF;
            END IF;

			INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden)
			VALUES (_movimientos.id_liquidacion,_movimientos.descripcion,_movimientos.monto,_movimientos.tipo,_movimientos.tipo_haber,_orden);
			_orden := _orden + 1;
		END IF;
	END LOOP;
-- FIN MOVIMIENTOS	---------------------------------------------------------------------

-- INICIO REGISTROS HABERES/DESCUENTOS	-----------------------------------------
	FOR _haberes_desc IN SELECT
			 (CASE WHEN (upper(hde.tipohaber) ='IMPONIBLENEGATIVO') THEN
				CASE WHEN (upper(hdp.moneda) ='PESOS') THEN - round((hdp.monto),0)
					WHEN (upper(hdp.moneda) ='UF') THEN - round((hdp.monto * _valor_uf),0)
                    WHEN (upper(hdp.moneda) = 'UTM') THEN - round((hdp.monto * _valor_utm),0)
					WHEN (upper(hdp.moneda) ='PORCENTAJE') THEN - round(((hdp.monto * _sueldo_base)/100),0)
				END
				WHEN (upper(hdp.moneda) ='PESOS') THEN round(hdp.monto,0)
				WHEN (upper(hdp.moneda) ='UF') THEN round((hdp.monto * _valor_uf),0)
                WHEN (upper(hdp.moneda) = 'UTM') THEN round((hdp.monto * _valor_utm),0)
				WHEN (upper(hdp.moneda) ='PORCENTAJE') THEN round(((hdp.monto * _sueldo_base)/100),0)
			END)::NUMERIC AS monto
			,hde.nombre AS nombre_haber
			,hde.tipohaber AS tipo_haber
			,(CASE WHEN (upper(hde.tipohaber) IN ('DESCUENTO', 'AHORROCCAF', 'SEGUROVIDACCAF')) THEN 'D'
                   ELSE 'H'
              END)::CHAR AS tipo
			,(CASE WHEN (upper(hde.tipohaber) ='HNOIMPONIBLE') THEN 'N'
				WHEN (upper(hde.tipohaber) IN ('DESCUENTO', 'AHORROCCAF', 'SEGUROVIDACCAF')) THEN NULL
				WHEN (upper(hde.tipohaber) ='SINGRATIFICACION') THEN 'G'
				ELSE 'I' END)::CHAR AS tipohaber
			,hde.idhaberdescuento AS idhaberdescto
            ,hdp.diastrabajados -- Flag para dias trabajados
			FROM personal.haberdescuento_persona hdp
			INNER JOIN personal.haberdescuento hde
			ON hde.idhaberdescuento=hdp.idhaberdescuento
			WHERE hdp.idpersona = _idempleado
			AND ((overlay(_periodo placing '' FROM 5 FOR 1)::INTEGER BETWEEN to_char (hdp.fecha, 'yyyymm')::INTEGER
				AND to_char (hdp.fechahasta, 'yyyymm')::INTEGER)
				OR (overlay(_periodo placing '' FROM 5 FOR 1)::INTEGER >= to_char (hdp.fecha, 'yyyymm')::INTEGER
					AND hdp.fechahasta IS NULL AND hdp.indefinido IS TRUE
				)
			)
	LOOP
		_orden := _orden + 1;
		IF (_haberes_desc.monto IS NOT NULL) THEN
			IF ( _haberes_desc.diastrabajados = TRUE ) THEN

	            SELECT sum(diainasist) INTO __diainasist FROM personal.movimientos
	            WHERE idpersona = _idempleado
	            AND tipomovimiento = 3
	            AND motivoinasist IN (105, 106, 107)
	            AND to_char(fecha, 'YYYY-MM') = _periodo;

	            IF  __diainasist > 0 AND upper(_haberes_desc.tipo_haber) = 'HNOIMPONIBLE' THEN
		            _dias := _dias_trabajados - __diainasist ;
	                _valor_haber := _haberes_desc.monto / 30;
	                _haberes_desc.monto := _valor_haber * _dias;
	                _haberes_desc.nombre_haber := _haberes_desc.nombre_haber || ' de ' || _dias::text || ' dias a ' || fn_formato_decimales ('$', 'I', _valor_haber, 0);
	            ELSE
					_dias := _dias_trabajados;
	                _valor_haber := _haberes_desc.monto / 30;
	                _haberes_desc.monto := _valor_haber * _dias;
	                _haberes_desc.nombre_haber := _haberes_desc.nombre_haber || ' de ' || _dias::text || ' dias a ' || fn_formato_decimales ('$', 'I', _valor_haber, 0);

	            END IF;
            END IF;

			INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden,idhaberdescuento )
			VALUES (_idliquidacion,_haberes_desc.nombre_haber,_haberes_desc.monto,_haberes_desc.tipo,_haberes_desc.tipohaber,_orden, _haberes_desc.idhaberdescto);

			IF (upper(_haberes_desc.tipo_haber) = 'DESCUENTO') THEN
				_otros_desctos := (_otros_desctos + _haberes_desc.monto);
            ELSIF (upper(_haberes_desc.tipo_haber) = 'AHORROCCAF') THEN
                __ccafahorro := COALESCE(__ccafahorro,0)+_haberes_desc.monto;
                _otros_desctos := (_otros_desctos + _haberes_desc.monto);
            ELSIF (upper(_haberes_desc.tipo_haber) = 'SEGUROVIDACCAF') THEN
                __ccafsegurovida := COALESCE(__ccafsegurovida,0)+_haberes_desc.monto;
                _otros_desctos   := (_otros_desctos + _haberes_desc.monto);
			ELSIF (upper(_haberes_desc.tipo_haber) = 'HIMPONIBLE') THEN
				_otros_imp := (_otros_imp + _haberes_desc.monto);
			ELSIF (upper(_haberes_desc.tipo_haber) = 'HNOIMPONIBLE') THEN
				_otros_noimp := (_otros_noimp + _haberes_desc.monto);
			END IF;
		END IF;
	END LOOP;
-- FIN REGISTROS HABERES/DESCUENTOS	---------------------------------------------

-- GRATIFICACION	-------------------------------------------------------------------------
	-- Si la empresa paga gratificacion
	IF (_parametros.gratificacion IS TRUE) THEN
		-- Si por contrato al empleado le pagan gratificacion
		IF (_cabecera.gratificacion = 'cong') THEN
			SELECT INTO _total_haberes_imponibles SUM(monto)
			FROM personal.liquidacion_detalle
			WHERE tipo = 'H'
			AND tipo_haber = 'I'
			AND id_liquidacion = _idliquidacion;

			_total_gratificacion := round((_total_haberes_imponibles *_parametros.valor_gratificacion)/100 ,0);
			-- GRATIFICACION CON TOPE LEGAL -----------------------
			IF (_parametros.gratificacion_tope IS TRUE) THEN
				IF (_total_gratificacion > _tope_gratificacion) THEN
					_monto_gratificacion := _tope_gratificacion;
				ELSE
					_monto_gratificacion := _total_gratificacion;
				END IF;


                INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
				VALUES (_idliquidacion,'Gratificación - Tope Legal' || COALESCE(__desc_gratificacion,''),_monto_gratificacion,'H','I',18);

				UPDATE personal.liquidacion SET
				 tope_gratificacion = CASE WHEN (_total_gratificacion > _tope_gratificacion) THEN _tope_gratificacion ELSE _total_gratificacion END
				WHERE id = _idliquidacion;
			ELSE

				-- GRATIFICACION SIN TOPE LEGAL -----------------------
                 _monto_gratificacion := _total_gratificacion;
                INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
                VALUES (_idliquidacion,'Gratificación - '|| _parametros.valor_gratificacion || '% Sin Tope Legal',_monto_gratificacion,'H','I',19);
			END IF;
		END IF;
	END IF;
-- FIN GRATIFICACION	--------------------------------------------------------------------

-- INICIO TOTALES	------------------------------------------------------------------------
	SELECT INTO _total_haberes_imponibles SUM(monto)
	FROM personal.liquidacion_detalle
	WHERE tipo = 'H'
	AND tipo_haber = 'I'
	AND id_liquidacion = _idliquidacion;

	SELECT INTO _monto_haberes_singratif SUM(ld.monto)
	FROM personal.liquidacion_detalle ld
	WHERE ld.id_liquidacion = _idliquidacion
	AND ld.tipo_haber = 'G';

	IF( _monto_haberes_singratif IS NULL) THEN
		_monto_haberes_singratif := 0;
	END IF;
	_total_haberes_imponibles := (_total_haberes_imponibles + _monto_haberes_singratif);

-- INICIO: CALCULO SEGURO DE CESANTIA -------------------------------------------------------------
	_haber_licencia	:= 0;
	_seg_impprevio	:= 0;
	_seg_imponible	:= 0;
	_seg_empleador	:= 0;
	_cesantia		:= 0;
    __segurocesantiapaso01  := 0;

	IF (_dias_licencia > 0) THEN
		--ESTA CON LICENCIA MEDICA
		--OBTENEMOS EL IMPONIBLE DEL ULTIMO MES PREVIO TRABAJADO COMPLETO ANTES DE LA LICENCIA
		--_haber_licencia := (SELECT haberes_imponibles FROM personal.liquidacion WHERE idpersona = _idempleado AND NOT haberes_imponibles IS NULL ORDER BY to_date(periodo || '-01','YYYY-MM-DD') DESC LIMIT 1);
		SELECT INTO _haber_licencia haberes_imponibles
		FROM personal.liquidacion
		WHERE idpersona = _idempleado
		AND NOT haberes_imponibles IS NULL
		AND haberes_imponibles > 0
		AND to_date(periodo || '-01','YYYY-MM-DD') < to_date(_periodo || '-01','YYYY-MM-DD')
        AND dias_trabajados = 30
		ORDER BY to_date(periodo || '-01','YYYY-MM-DD') DESC
		LIMIT 1;

        IF (_cabecera.indef IS TRUE) THEN
            SELECT INTO __anios EXTRACT(YEAR FROM AGE((_periodo || '-' || CASE WHEN EXTRACT(DAY FROM NOW())::INTEGER > EXTRACT (DAY FROM _finmes)::INTEGER THEN EXTRACT (DAY FROM _finmes) ELSE EXTRACT(DAY FROM NOW()) END)::TIMESTAMP, _cabecera.fingreso::TIMESTAMP));

			IF (__anios >= __maxanios) THEN
				_parametros.cesantia_empleado  := 0;
				_parametros.cesantia_empleador := __cempleador;
			END IF;
            __cesantiaempleador := _parametros.cesantia_empleador;
        ELSE
            __cesantiaempleador := _parametros.cesantia_empleadorfull;
        END IF;

		IF (_haber_licencia IS NULL) THEN
			--SI NO HAY BASE PREVIO, POR QUE NO HAY LICENCIA PREVIA LA CALCULAMOS EN BASE AL SUELDO BASE
			--BASE MES PREVIO MENOS DIAS NO TRABAJADOS (PROPORCIONAL CALCULADO)

            IF _dias_licencia <> 30 THEN
                __segurocesantiapaso01 = round(((_total_haberes_imponibles * __cesantiaempleador) / 100), 0);
            END IF;
            _seg_impprevio := ROUND(((_cabecera.base / 30) * _dias_licencia) , 0);
		ELSE
			--IMPONIBLE MES PREVIO MENOS DIAS NO TRABAJADOS (PROPORCIONAL CALCULADO)
            IF _dias_licencia <> 30 THEN
                __segurocesantiapaso01 = round(((_total_haberes_imponibles * __cesantiaempleador) / 100), 0);
            END IF;
			_seg_impprevio := ROUND(((_haber_licencia / 30) * _dias_licencia) , 0);
            IF (_haber_licencia > _tope_cesantia) THEN
                __imponible_100sc := _tope_cesantia;
            ELSE 
                __imponible_100sc := _haber_licencia;
            END IF;
		END IF;
        _seg_imponible := _seg_impprevio;
	ELSE
		--NO HAY LICENCIA MEDICA
		_seg_imponible	:= _total_haberes_imponibles;
	END IF;


    IF (_cabecera.segurocesantia IS TRUE) THEN

		IF (_cabecera.indef IS TRUE) THEN
			--CON CONTRATO INDEFINIDO
			SELECT INTO __anios EXTRACT(YEAR FROM AGE((_periodo || '-' || CASE WHEN EXTRACT(DAY FROM NOW())::INTEGER > EXTRACT (DAY FROM _finmes)::INTEGER THEN EXTRACT (DAY FROM _finmes) ELSE EXTRACT(DAY FROM NOW()) END)::TIMESTAMP, _cabecera.fingreso::TIMESTAMP));

			IF (__anios >= __maxanios) THEN
				_parametros.cesantia_empleado  := 0;
				_parametros.cesantia_empleador := __cempleador;
			END IF;
            IF (_total_haberes_imponibles > _tope_cesantia) THEN
				_seg_imponible := _tope_cesantia;
				_cesantia      := round(((_tope_cesantia * _parametros.cesantia_empleado) / 100), 0);
				_seg_empleador := round(((_tope_cesantia * _parametros.cesantia_empleador) / 100), 0);
			ELSE
				_cesantia      := round(((_total_haberes_imponibles * _parametros.cesantia_empleado) / 100), 0);		--TRABAJADOR SIEMPRE PAGA SOLO POR LOS DIAS TRABAJADOS
				_seg_empleador := round(((_seg_imponible * _parametros.cesantia_empleador) / 100), 0);
                _seg_empleador := __segurocesantiapaso01 + _seg_empleador;
			END IF;

			INSERT INTO personal.liquidacion_detalle(
            	  id_liquidacion
                , descripcion
                , monto
                , tipo
                , tipo_haber
                , orden
            ) VALUES (
            	  _idliquidacion
                , 'Seguro Cesantía - (Aporte Trabajador) ' || _parametros.cesantia_empleado || '%'
                , _cesantia
                , 'D'
                , 'L'
                , 1
            );

			UPDATE personal.liquidacion SET
				tope_cesantia = CASE WHEN (_total_haberes_imponibles > _tope_cesantia) THEN _tope_cesantia ELSE _total_haberes_imponibles END
			WHERE id = _idliquidacion;

		ELSE
			--CON CONTRATO A PLAZO FIJO
            IF (_total_haberes_imponibles > _tope_cesantia) THEN
				_seg_imponible := _tope_cesantia;
				_cesantia      := 0;
				_seg_empleador := round(((_tope_cesantia * _parametros.cesantia_empleadorfull) / 100), 0);
			ELSE
				_cesantia      := 0;
				_seg_empleador := round(((_seg_imponible * _parametros.cesantia_empleadorfull) / 100), 0);
                _seg_empleador := __segurocesantiapaso01 + _seg_empleador;
			END IF;
		END	IF;
	END	IF;
-- FIN: CALCULO SEGURO DE CESANTIA -----------------------------------------------------


-- INICIO: CALCULO SEGURO DE INVALIDEZ Y SOBREVICENCIA (SIS)
	_valortt := (SELECT tipotrabajador FROM personal.persona WHERE idpersona = _idempleado LIMIT 1);

    IF (_valortt=1 OR _valortt=2) THEN
	    _sis := 0;
	ELSE
		_sisbase := 0;
        __sispaso01 := 0;
        __sispaso02 := 0;
		IF (_dias_licencia > 0) THEN
			--SI HAY LICENCIA MEDICA EL MES EN CURSO
			IF (_haber_licencia IS NULL) THEN
				--SI NO HAY BASE PREVIO, POR QUE NO HAY LICENCIA PREVIA LA CALCULAMOS EN BASE AL SUELDO BASE
				--BASE MES PREVIO MENOS DIAS NO TRABAJADOS (PROPORCIONAL CALCULADO)
                IF _dias_licencia <> 30 THEN
                    __sispaso01 := round(_total_haberes_imponibles *  (COALESCE(_parametros.sis,0)/100), 0);
                END IF;
                __sispaso02 := round(((_cabecera.base / 30) * _dias_licencia) , 0);
                _sisbase := __sispaso02;
			ELSE
				--IMPONIBLE MES PREVIO MENOS DIAS NO TRABAJADOS (PROPORCIONAL CALCULADO)
                IF _dias_licencia <> 30 THEN
                    __sispaso01 := round(_total_haberes_imponibles *  (COALESCE(_parametros.sis,0)/100), 0);
                END IF;
                __sispaso02 := round(((_haber_licencia / 30) * _dias_licencia) , 0);
                _sisbase := __sispaso02;
			END IF;
		ELSE
			--NO HAY LICENCIA EL MES EN CURSO
			_sisbase := _total_haberes_imponibles;
		END IF;
		--_sis := round(_sisbase *  (COALESCE(_parametros.sis,0)) , 0); --ERROR GARRAFAL 2015-09-10 (VROJAS)
		_sis := round(_sisbase *  (COALESCE(_parametros.sis,0)/100), 0);
        _sis := __sispaso01 + _sis;
    END IF;
-- FIN: CALCULO SEGURO DE INVALIDEZ Y SOBREVICENCIA (SIS)

-- INICIO: CALCULO LEY SANNA (LEY SANNA)
   
    IF (COALESCE(_dias_licencia,0) > 0 ) THEN
        __leysanna := 0;
        __leysannapaso1 := 0;
        __leysannapaso2 := 0;
        __imponible_actual := 0;
        
        IF (_total_haberes_imponibles > _tope_afp) THEN
            __imponible_actual := _tope_afp;
        ELSE 
        	__imponible_actual := _total_haberes_imponibles;
        END IF; 
    
        --SI HAY LICENCIA MEDICA EL MES EN CURSO
        IF (COALESCE(_haber_licencia,0) = 0 ) THEN
            IF (_cabecera.base > _tope_afp) THEN
            	__imponiblemes := _tope_afp;
            ELSE 
                __imponiblemes := _cabecera.base;
            END IF;
        	IF _dias_licencia < 30 THEN
            	__leysannapaso1 := round(__imponible_actual *  COALESCE(_parametros.val_mutual,0) / 100);
                __leysannapaso2 := round((__imponiblemes/30 *  _dias_licencia) * 0.0003,0);
                __leysanna := __leysannapaso1 + __leysannapaso2;
            ELSE
                IF _dias_trabajados = 0 THEN 
                	__leysannapaso2 := round(__imponiblemes * 0.0003,0);
                    __leysanna := __leysannapaso2;
            END IF;
            END IF;

        ELSE
            	IF (_haber_licencia > _tope_afp) THEN
					_haber_licencia := _tope_afp;
				END IF;
          IF _dias_licencia < 30 THEN
            	__leysannapaso1 := round(__imponible_actual *  COALESCE(_parametros.val_mutual,0) / 100);
                __leysannapaso2 := round((_haber_licencia/30 *  _dias_licencia) * 0.0003,0);
                __leysanna := __leysannapaso1 + __leysannapaso2;
                
          ELSE
              IF _dias_trabajados = 0 THEN 
                  __leysannapaso2 := round(_haber_licencia * 0.0003,0);
                  __leysanna := __leysannapaso2;
              END IF;
            END IF;
        END IF;
    END IF;
-- FIN: CALCULO LEY SANNA

-- INICIO CALCULOS PREVISION	----------------------------------------------------------
	UPDATE personal.liquidacion SET
	 renta_imponible = _total_haberes_imponibles
	WHERE id = _idliquidacion;

	IF (_cabecera.tipotrabajador != 2) THEN
		IF (_cabecera.prevision = 'AFP') THEN
			IF (_total_haberes_imponibles > _tope_afp) THEN
				_total_prevision := round(((_tope_afp * _cabecera.afp_cotobligatoria)/100),0);
			ELSE
				_total_prevision := round(((_total_haberes_imponibles * _cabecera.afp_cotobligatoria)/100),0);
			END IF;

			INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
            VALUES (_idliquidacion,'AFP - '||CASE WHEN TRIM(_cabecera.afp_nombre, ' ') = 'SIN AFP' THEN 'Sin AFP' ELSE initcap(lower(_cabecera.afp_nombre)) END||' ' || _cabecera.afp_cotobligatoria || '% ',_total_prevision,'D','L',2 );

			UPDATE personal.liquidacion SET
			 renta_imponible = CASE WHEN (_total_haberes_imponibles > _tope_afp) THEN _tope_afp ELSE _total_haberes_imponibles END
			WHERE id = _idliquidacion;
		ELSIF (_cabecera.prevision = 'INP') THEN
			IF (_total_haberes_imponibles > _tope_ips) THEN
				_total_prevision := round(((_tope_ips * _cabecera.tasaexcaja)/100),0);
			ELSE
				_total_prevision := round(((_total_haberes_imponibles * _cabecera.tasaexcaja)/100),0);
			END IF;

			INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
            VALUES (_idliquidacion,'IPS - Tasa ' || _cabecera.tasaexcaja || '% ',_total_prevision,'D','L',2 );

			UPDATE personal.liquidacion SET
			 renta_imponible = CASE WHEN (_total_haberes_imponibles > _tope_ips) THEN _tope_ips ELSE _total_haberes_imponibles END
			WHERE id = _idliquidacion;
		END IF;
	END IF;
	-- ADD ITEM A DESCUENTOS SI HAY AHORRO AFP Voluntario - CUENTA 2 ------------------------
	-- Si tiene AFP Voluntario
	IF (_cabecera.afp_ahorrovoluntario > 0) THEN
		-- SI el APV es en UF
		IF (_cabecera.tipomoneda_apv = 'UF') THEN
			_total_afpvoluntario := round((_cabecera.afp_ahorrovoluntario * _valor_uf),0)	;
        ELSIF (_cabecera.tipomoneda_apv = 'PORCEN') THEN
            -- Si el APV es en PORCENTAJE
            _total_afpvoluntario := round(_cabecera.afp_ahorrovoluntario * _total_haberes_imponibles / 100::numeric);
		ELSE -- SI el APV es en Pesos
			_total_afpvoluntario := _cabecera.afp_ahorrovoluntario;
		END IF;

            IF ((_total_haberes_imponibles - _otros_desctos  -  _total_afpvoluntario ) < 0) THEN
                _total_afpvoluntario := 0;
            END IF;

		INSERT INTO personal.liquidacion_detalle(id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
		VALUES(_idliquidacion,'Ahorro Voluntario - Cuenta 2 ',_total_afpvoluntario,'D','',5 );

		_otros_desctos:= _otros_desctos + _total_afpvoluntario;
	END IF;
	-- FIN ITEM AHORRO VOLUNTARIO	------------------------------------

	-- ADD ITEM AHORRO PREVISIONAL VOLUNTARIO INDIVIDUAL - APVI	-------------------------
	SELECT forma_pago_apvi
    INTO __forma_pago_apvi
    FROM personal.afpsalud
    WHERE  idpersona = _idempleado;

    IF ((_cabecera.nombreapvi != 'No Cotiza APVI') AND (__forma_pago_apvi = 1 OR __forma_pago_apvi = 2)) THEN
        IF (_cabecera.valor_apvi > 0) THEN
            -- SI el APVI es en UF
            IF (_cabecera.tp_moneda_apvi = 'UF') THEN
                _total_apvi := round((_cabecera.valor_apvi * _valor_uf),0)	;
            ELSE -- SI el APVI es en Pesos
                _total_apvi := _cabecera.valor_apvi;
            END IF;

            IF (_total_apvi > _tope_afpvoluntario) THEN
                _total_apvi := _tope_afpvoluntario;
            END IF;

            IF ((_total_haberes_imponibles - _otros_desctos  -  _total_apvi ) < 0) THEN
                _total_apvi := 0;
            END IF;

            INSERT INTO personal.liquidacion_detalle(id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
            VALUES(_idliquidacion,'APVI - '||initcap(lower(_cabecera.nombreapvi)),_total_apvi,'D','L',3 );

            UPDATE personal.liquidacion SET
             tope_afpvoluntario = CASE WHEN (_total_apvi > _tope_afpvoluntario) THEN _tope_afpvoluntario ELSE _total_apvi END
            WHERE id = _idliquidacion;
        END IF;
	-- FIN ITEM AHORRO PREVISIONAL VOLUNTARIO INDIVIDUAL - APVI	------------------------------------
    END IF;
-- FIN CALCULOS PREVISION	-------------------------------------------------------------

-- INICIO CALCULOS SALUD	------------------------------------------------------------
	--	Calculo el 7% legal en base a los imponibles
    IF(_cabecera.salud_nombre != 'SIN ISAPRE') THEN
	IF (_total_haberes_imponibles > _tope_afp) THEN
		_porc_salud7 := round((_tope_afp * 0.07),0);
	ELSE
		_porc_salud7 := round((_total_haberes_imponibles * 0.07),0);
	END IF;
    END IF;

    IF(_cabecera.salud_nombre != 'SIN ISAPRE') THEN
	IF (_periodo = _periodo_ini) THEN	-- Si el empleado ingreso durante el periodo a liquidar
		IF (_cabecera.salud_nombre != 'FONASA') THEN	-- Si el empleado tiene ISAPRE.-
			_porc_isapre := (_cabecera.salud_valorplan + _cabecera.salud_planauge);
			IF (_cabecera.salud_tpomoneda = 'UF') THEN -- Si el plan de ISAPRE es en UF

                _adicional_isapre	:= ((_porc_isapre * _valor_uf) - _porc_salud7);


				IF (_adicional_isapre > 0) THEN -- Existe adicional de Isapre
					IF (_dias_licencia IS NULL) THEN	-- No tiene dias de licencia
                        -- Grabo el 7% de salud
						INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
						VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );

						-- Grabo el adicional de Isapre
						INSERT INTO personal.liquidacion_detalle(id_liquidacion,descripcion,monto,tipo,tipo_haber,orden)
						VALUES(_idliquidacion,'Adicional - '||initcap(lower(_cabecera.salud_nombre)),round(_adicional_isapre,0),'D','L',5 );

						_isapre	:= _porc_salud7;
						_adicional	:= _adicional_isapre;
					ELSE

						-- Recalculo el adicional isapre en base a los dias de licencia
                        _adicional_isapre := (((_porc_isapre * _valor_uf) / 30) * (_dias_trabajados) - _porc_salud7);

                        IF ((_dias_inasis - _dias_licencia) > 0) THEN
                        	--Recalculo cuando tiene inasistencias
                            _adicional_isapre := (((_porc_isapre * _valor_uf) / 30) * (_dias_trabajados + (_dias_inasis - _dias_licencia)) - _porc_salud7);
                        END IF;

						-- Si el adicional de ISAPRE	me da negativo con los decuentos de los dias
						IF (_adicional_isapre <= 0) THEN
							_porc_salud7_paso := _porc_salud7 + _adicional_isapre;
							-- Consulto si el 7% salud es mayor a lo que quedo con la licencia
							IF (_porc_salud7 > _porc_salud7_paso) THEN
								-- Grabo el 7% de salud
								INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
								VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4);
								_isapre := _porc_salud7;
							ELSE
								-- Grabo el 7% de salud
								INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
								VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7_paso,'D','L',4);
								_isapre := _porc_salud7;
							END IF;
						ELSE -- Adicional de Isapre, aun quedo con valor
							-- Grabo el 7% de salud
							INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
							VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
							-- Grabo el adicional de Isapre
							INSERT INTO personal.liquidacion_detalle(id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
							VALUES(_idliquidacion,'Adicional - '||initcap(lower(_cabecera.salud_nombre)),round(_adicional_isapre,0),'D','L',5 );
							_isapre	:= _porc_salud7;
							_adicional	:= _adicional_isapre;
						END IF;
					END IF;

				ELSE -- Adicional de Isapre Negativo, no tiene adicional, solo grabo el 7%
					-- Grabo el 7% de salud
					INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
					VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4);
					_isapre := _porc_salud7;
				END IF;
			ELSE -- Plan de Isapre es en Pesos

				_adicional_isapre	:= (_porc_isapre - _porc_salud7);

				IF (_adicional_isapre > 0) THEN -- Existe adicional de Isapre
					IF (_dias_licencia IS NULL) THEN	-- No tiene dias de licencia
						-- Grabo el 7% de salud
						INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
						VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );

						-- Grabo el adicional de Isapre
						INSERT INTO personal.liquidacion_detalle(id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
						VALUES(_idliquidacion,'Adicional - '||initcap(lower(_cabecera.salud_nombre)),round(_adicional_isapre,0),'D','L',5 );

						_isapre	:= _porc_salud7;
						_adicional	:= _adicional_isapre;
					ELSE

						-- Recalculo el adicional isapre en base a los dias de licencia
                        _adicional_isapre := ((_porc_isapre - _porc_salud7) * (30 - _dias_licencia) / 30);
                        IF ((_dias_inasis - _dias_licencia) > 0) THEN
                        	--Recalculo cuando tiene inasistencias
                        	_adicional_isapre := ((_porc_isapre * (30 - _dias_licencia) / 30) - _porc_salud7);
                        END IF;


						-- Si el adicional de ISAPRE	me da negativo con los decuentos de los dias
						IF (_adicional_isapre <= 0) THEN
							_porc_salud7_paso := _porc_salud7 + _adicional_isapre;
							-- Consulto si el 7% salud es mayor a lo que quedo con la licencia
							IF (_porc_salud7 > _porc_salud7_paso) THEN
								-- Grabo el 7% de salud
								INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
								VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
								_isapre := _porc_salud7;
							ELSE
								-- Grabo el 7% de salud
								INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
								VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7_paso,'D','L',4 );
								_isapre := _porc_salud7;
							END IF;
						ELSE -- Adicional de Isapre, aun quedo con valor
							-- Grabo el 7% de salud
							INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
							VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
							-- Grabo el adicional de Isapre
							INSERT INTO personal.liquidacion_detalle(id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
							VALUES(_idliquidacion,'Adicional - '||initcap(lower(_cabecera.salud_nombre)),round(_adicional_isapre,0),'D','L',5 );

							_isapre	:= _porc_salud7;
							_adicional	:= _adicional_isapre;
						END IF;
					END IF;
				ELSE -- Adicional de Isapre Negativo, no tiene adicional, solo grabo el 7%
					-- Grabo el 7% de salud
					INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
					VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4);
					_isapre := _porc_salud7;
				END IF;
			END IF;
		ELSE	--	El empleado tiene Fonasa
			-- Grabo el 7% de salud
			INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
			VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
			_fonasa := _porc_salud7;
		END IF;
	ELSIF (_periodo = _periodo_fin) THEN -- Si el empleado termino contrato durante el mes
		IF (_cabecera.salud_nombre != 'FONASA') THEN	-- -- Si el empleado tiene ISAPRE.-
			_porc_isapre := (_cabecera.salud_valorplan + _cabecera.salud_planauge);
			IF (_cabecera.salud_tpomoneda = 'UF') THEN -- Si el plan de ISAPRE es en UF

                _adicional_isapre	:= ((_porc_isapre * _valor_uf) - _porc_salud7);

				IF (_adicional_isapre > 0) THEN -- Existe adicional de Isapre
					IF (_dias_licencia IS NULL) THEN	-- No tiene dias de licencia
						-- Grabo el 7% de salud
						INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
						VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4);
						-- Grabo el adicional de Isapre
						INSERT INTO personal.liquidacion_detalle(id_liquidacion,descripcion,monto,tipo,tipo_haber,orden)
						VALUES(_idliquidacion,'Adicional - '||initcap(lower(_cabecera.salud_nombre)),round(_adicional_isapre,0),'D','L',5 );
						_isapre		:= _porc_salud7;
						_adicional	:= _adicional_isapre;
					ELSE

						-- Recalculo el adicional isapre en base a los dias de licencia
                        _adicional_isapre := (((_porc_isapre * _valor_uf) / 30) * (_dias_trabajados) - _porc_salud7);

                        IF ((_dias_inasis - _dias_licencia) > 0) THEN
                        	--Recalculo cuando tiene inasistencias
                            _adicional_isapre := (((_porc_isapre * _valor_uf) / 30) * (_dias_trabajados + (_dias_inasis - _dias_licencia)) - _porc_salud7);
                        END IF;

						-- Si el adicional de ISAPRE	me da negativo con los decuentos de los dias
						IF (_adicional_isapre <= 0) THEN
							_porc_salud7_paso := _porc_salud7 + _adicional_isapre;
							-- Consulto si el 7% salud es mayor a lo que quedo con la licencia
							IF (_porc_salud7 > _porc_salud7_paso) THEN
								-- Grabo el 7% de salud
								INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
								VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
								_isapre := _porc_salud7;
							ELSE
								-- Grabo el 7% de salud
								INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
								VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7_paso,'D','L',4 );
								_isapre := _porc_salud7;
							END IF;
						ELSE -- Adicional de Isapre, aun quedo con valor
							-- Grabo el 7% de salud
							INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
							VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
							-- Grabo el adicional de Isapre
							INSERT INTO personal.liquidacion_detalle(id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
							VALUES(_idliquidacion,'Adicional - '||initcap(lower(_cabecera.salud_nombre)),round(_adicional_isapre,0),'D','L',5 );
							_isapre	:= _porc_salud7;
							_adicional	:= _adicional_isapre;
						END IF;
					END IF;
				ELSE -- Adicional de Isapre Negativo, no tiene adicional, solo grabo el 7%
					-- Grabo el 7% de salud
					INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
					VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
					_isapre := _porc_salud7;
				END IF;
			ELSE -- Plan de Isapre es en Pesos

				_adicional_isapre	:= (_porc_isapre - _porc_salud7);

				IF (_adicional_isapre > 0) THEN -- Existe adicional de Isapre
					IF (_dias_licencia IS NULL) THEN	-- No tiene dias de licencia
						-- Grabo el 7% de salud
						INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
						VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
						-- Grabo el adicional de Isapre
						INSERT INTO personal.liquidacion_detalle(id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
						VALUES(_idliquidacion,'Adicional - '||initcap(lower(_cabecera.salud_nombre)),round(_adicional_isapre,0),'D','L',5 );
						_isapre	:= _porc_salud7;
						_adicional	:= _adicional_isapre;
					ELSE

						-- Recalculo el adicional isapre en base a los dias de licencia
                        _adicional_isapre := ((_porc_isapre - _porc_salud7) * (30 - _dias_licencia) / 30);
                        IF ((_dias_inasis - _dias_licencia) > 0) THEN
                        	--Recalculo cuando tiene inasistencias
                        	_adicional_isapre := ((_porc_isapre * (30 - _dias_licencia) / 30) - _porc_salud7);
                        END IF;

						-- Si el adicional de ISAPRE	me da negativo con los decuentos de los dias
						IF (_adicional_isapre <= 0) THEN
							_porc_salud7_paso := _porc_salud7 + _adicional_isapre;
							-- Consulto si el 7% salud es mayor a lo que quedo con la licencia
							IF (_porc_salud7 > _porc_salud7_paso) THEN
								-- Grabo el 7% de salud
								INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
								VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
								_isapre := _porc_salud7;
							ELSE
								-- Grabo el 7% de salud
								INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
								VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7_paso,'D','L',4 );
								_isapre := _porc_salud7;
							END IF;
						ELSE -- Adicional de Isapre, aun quedo con valor
							-- Grabo el 7% de salud
							INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden)
							VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4);
							_isapre := _porc_salud7;
							-- Grabo el adicional de Isapre
							INSERT INTO personal.liquidacion_detalle(id_liquidacion,descripcion,monto,tipo,tipo_haber,orden)
							VALUES(_idliquidacion,'Adicional - '||initcap(lower(_cabecera.salud_nombre)),round(_adicional_isapre,0),'D','L',5);
							_isapre := _porc_salud7;
						END IF;
					END IF;
				ELSE -- Adicional de Isapre Negativo, no tiene adicional, solo grabo el 7%
					-- Grabo el 7% de salud
					INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
					VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
					_isapre := _porc_salud7;
				END IF;
			END IF;
		ELSE	--	El empleado tiene Fonasa
			-- Grabo el 7% de salud
			INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
			VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
			_fonasa := _porc_salud7;
		END IF;
	ELSE -- Empleado con contrato normal de mes completo
		IF (_cabecera.salud_nombre != 'FONASA') THEN	-- -- Si el empleado tiene ISAPRE.-
			_porc_isapre := (_cabecera.salud_valorplan + _cabecera.salud_planauge);
			IF (_cabecera.salud_tpomoneda = 'UF') THEN -- Si el plan de ISAPRE es en UF

                _adicional_isapre	:= ((_porc_isapre * _valor_uf) - _porc_salud7);

				IF (_adicional_isapre > 0) THEN -- Existe adicional de Isapre
					IF (_dias_licencia IS NULL) THEN	-- No tiene dias de licencia
						-- Grabo el 7% de salud
						INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
						VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
						-- Grabo el adicional de Isapre
						INSERT INTO personal.liquidacion_detalle(id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
						VALUES(_idliquidacion,'Adicional - '||initcap(lower(_cabecera.salud_nombre)),round(_adicional_isapre,0),'D','L',5 );
						_isapre		:= _porc_salud7;
						_adicional	:= _adicional_isapre;
					ELSE --	Tiene dias de licencia

						-- Recalculo el adicional isapre en base a los dias de licencia
                        _adicional_isapre := (((_porc_isapre * _valor_uf) / 30) * (_dias_trabajados) - _porc_salud7);

                        IF ((_dias_inasis - _dias_licencia) > 0) THEN
                        	--Recalculo cuando tiene inasistencias
                        	_adicional_isapre := (((_porc_isapre * _valor_uf) / 30) * (_dias_trabajados + (_dias_inasis - _dias_licencia)) - _porc_salud7);
                        END IF;

						-- Si el adicional de ISAPRE	me da negativo con los descuentos de los dias
						IF (_adicional_isapre <= 0) THEN
							_porc_salud7_paso := _porc_salud7 + _adicional_isapre;
							-- Consulto si el 7% salud es mayor a lo que quedo con la licencia
							IF (_porc_salud7 > _porc_salud7_paso) THEN
								-- Grabo el 7% de salud
								INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
								VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
								_isapre := _porc_salud7;
							ELSE
								-- Grabo el 7% de salud
								INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
								VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7_paso,'D','L',4 );
								_isapre := _porc_salud7;
							END IF;
						ELSE -- Adicional de Isapre, aun quedo con valor
							-- Grabo el 7% de salud
							INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
							VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
							-- Grabo el adicional de Isapre
							INSERT INTO personal.liquidacion_detalle(id_liquidacion,descripcion,monto,tipo,tipo_haber,orden)
							VALUES(_idliquidacion,'Adicional - '||initcap(lower(_cabecera.salud_nombre)),round(_adicional_isapre,0),'D','L',5 );
							_isapre		:= _porc_salud7;
							_adicional	:= _adicional_isapre;
						END IF;
					END IF;
				ELSE -- Adicional de Isapre Negativo, no tiene adicional, solo grabo el 7%
					-- Grabo el 7% de salud
					INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
					VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
					_isapre := _porc_salud7;
				END IF;
			ELSE -- Plan de Isapre es en Pesos

				_adicional_isapre	:= (_porc_isapre - _porc_salud7);

				IF (_adicional_isapre > 0) THEN -- Existe adicional de Isapre
					IF (_dias_licencia IS NULL) THEN	-- No tiene dias de licencia
						-- Grabo el 7% de salud
						INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
						VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
						-- Grabo el adicional de Isapre
						INSERT INTO personal.liquidacion_detalle(id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
						VALUES(_idliquidacion,'Adicional - '||initcap(lower(_cabecera.salud_nombre)),round(_adicional_isapre,0),'D','L',5 );
						_isapre	:= _porc_salud7;
						_adicional	:= _adicional_isapre;
					ELSE

						-- Recalculo el adicional isapre en base a los dias de licencia
                        _adicional_isapre := ((_porc_isapre - _porc_salud7) * (30 - _dias_licencia) / 30);
                        IF ((_dias_inasis - _dias_licencia) > 0) THEN
                        	--Recalculo cuando tiene inasistencias
                        	_adicional_isapre := ((_porc_isapre * (30 - _dias_licencia) / 30) - _porc_salud7);
                        END IF;

						-- Si el adicional de ISAPRE	me da negativo con los decuentos de los dias
						IF (_adicional_isapre <= 0) THEN
							_porc_salud7_paso := _porc_salud7 + _adicional_isapre;
							-- Consulto si el 7% salud es mayor a lo que quedo con la licencia
							IF (_porc_salud7 > _porc_salud7_paso) THEN
								-- Grabo el 7% de salud
								INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
								VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
								_isapre := _porc_salud7;
							ELSE
								-- Grabo el 7% de salud
								INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
								VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7_paso,'D','L',4 );
								_isapre := _porc_salud7;
							END IF;
						ELSE -- Adicional de Isapre, aun quedo con valor
							-- Grabo el 7% de salud
							INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
							VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
							-- Grabo el adicional de Isapre
							INSERT INTO personal.liquidacion_detalle(id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
							VALUES(_idliquidacion,'Adicional - '||initcap(lower(_cabecera.salud_nombre)),round(_adicional_isapre,0),'D','L',5 );
							_isapre		:= _porc_salud7;
							_adicional	:= _adicional_isapre;
						END IF;
					END IF;
				ELSE -- Adicional de Isapre Negativo, no tiene adicional, solo grabo el 7%
					-- Grabo el 7% de salud
					INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden)
					VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
					_isapre := _porc_salud7;
				END IF;
			END IF;
		ELSE	--	El empleado tiene Fonasa
			-- Grabo el 7% de salud
			INSERT INTO personal.liquidacion_detalle (id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
			VALUES(_idliquidacion,initcap(lower(_cabecera.salud_nombre)) || ' 7%',_porc_salud7,'D','L',4 );
			_fonasa := _porc_salud7;
		END IF;
	END IF;
    END IF;
-- FIN CALCULOS SALUD	------------------------------------------------------------------

-- INICIO CALCULOS IMPUESTO A LA RENTA---------------------------------------------
	IF (_adicional_isapre > 0) THEN
		_total_salud := _porc_salud7 + _adicional_isapre;
	ELSE
		_total_salud := _porc_salud7;
	END IF;

	_tope_salud := (_tope_afp * 0.07);
	IF (_total_salud > _tope_salud) THEN
		_total_descuentos_legales := (_total_prevision + _total_apvi + _cesantia + _tope_salud);
	ELSE
		_total_descuentos_legales := (_total_prevision + _total_apvi + _cesantia + _total_salud);
	END IF;

	--RAISE EXCEPTION '1[%] 2[%]  3[%]',_total_haberes_imponibles,_total_descuentos_legales,_valor_utm;

    IF  _dias_trabajados > 0 THEN
        IF _valor_utm <= 0 THEN
        	RAISE EXCEPTION 'NO existe el valor de la UTM';
        END IF;
        IF COALESCE(_total_haberes_imponibles,0) > 0 THEN
            _total_imponibles_legales		:= (_total_haberes_imponibles - COALESCE( _total_descuentos_legales,0));
            _total_imponibles_legales_utm	:= (_total_imponibles_legales / _valor_utm);
			IF (COALESCE(_preview,FALSE) = FALSE) THEN
            IF _total_imponibles_legales_utm < 0 THEN
            	RAISE EXCEPTION 'No existe registro en Parametros Generales, tramo impuesto sobre la renta, ya que el total imponible de esta liquidación es menor a cero.';
            END IF;
            END IF;
            SELECT INTO _impuesto_renta * FROM dblink(dblink_dteconfiguracion(),'
              SELECT factor, rebaja
              FROM personal.tramos_imptorenta imp
              WHERE (('|| _total_imponibles_legales_utm || ' > imp.desde)
              AND (' || _total_imponibles_legales_utm || ' <=imp.hasta)
              AND imp.periodo = replace('''|| _periodo2 ||''',''-'',''''))
              ') AS (factor NUMERIC, rebaja NUMERIC);
           -- raise exception 'factor =[%] rebaja[%]',_impuesto_renta.factor,_impuesto_renta.rebaja;
            IF (FOUND) THEN
                IF (_impuesto_renta.factor > 0 ) THEN
                    _valor_impuesto_renta := round(((_total_imponibles_legales * _impuesto_renta.factor) - (_impuesto_renta.rebaja * _valor_utm)),0);
                    INSERT INTO personal.liquidacion_detalle(id_liquidacion,descripcion,monto,tipo,tipo_haber,orden)
                    VALUES(_idliquidacion,'Impuesto a la Renta',_valor_impuesto_renta,'D','L',7 );

                    UPDATE personal.liquidacion SET
                     renta_afecta_impuesto_unico = _total_imponibles_legales
                    WHERE id = _idliquidacion;
                END IF;
            ELSE
            	IF (COALESCE(_preview,FALSE) = FALSE) THEN
                	RAISE EXCEPTION 'No existe registro en Parametros Generales: tramo impuesto sobre la renta, en el periodo seleccionado'; --Validacion parametros generales tramo impuesto sobre la renta
                END IF;
            END IF;
        END IF;
    END IF;

	_total_descuentos_legales := (_total_prevision + _total_apvi + _cesantia + _total_salud);
-- FIN CALCULOS IMPUESTO A LA RENTA ------------------------------------------------

-- INICIO CALCULOS PRESTAMOS POR PERIODO	--------------------------------------
	FOR _prestamos IN SELECT
			 pre.idprestamo
			,pre.idpersona
			,pre.glosa
			,pag.fecha_vencimiento
			,pag.valor AS valorcuota
			,pag.detalle_cuota
			,pre.caja
            ,pre.tipodescto
			FROM personal.prestamo pre
			INNER JOIN personal.pagocuota pag
			ON pre.idprestamo=pag.idprestamo
			WHERE pre.idpersona=_idempleado
            		AND pre.estado != 'anulado'
			AND to_char(pag.fecha_vencimiento,'YYYY-MM') = _periodo
            AND COALESCE(pre.caja,'') != 'prestamosolidario'
	LOOP
		IF (_prestamos.valorcuota IS NOT NULL) THEN
			IF(_prestamos.caja = 'empresa' OR _prestamos.caja = '' OR _prestamos.caja IS NULL)THEN
				INSERT INTO personal.liquidacion_detalle (
				 id_liquidacion
				,descripcion
				,monto
				,tipo
				,tipo_haber
				,orden
				) VALUES (
				 _idliquidacion
				,'Prestamo - '||_prestamos.glosa || ' cuota	'||_prestamos.detalle_cuota
				,_prestamos.valorcuota
				,'D'
				,NULL
				,_orden
				);
				/*
				UPDATE personal.pagocuota SET
				estado = TRUE
				WHERE idprestamo = _prestamos.idprestamo				--no se genera el pago de los prestamos en la grilla, esto lo ahce pero se tiene que estudia bien la forma de hacerlo
				AND detalle_cuota = _prestamos.detalle_cuota;
				*/
				_valor_prestamo :=_valor_prestamo + _prestamos.valorcuota;
            ELSIF (_prestamos.tipodescto IN ('D', 'L', 'SV', 'OD')) THEN
				INSERT INTO personal.liquidacion_detalle (
				 id_liquidacion
				,descripcion
				,monto
				,tipo
				,tipo_haber
				,orden
				) VALUES (
				 _idliquidacion
				,'Préstamo ' || _prestamos.glosa
				,_prestamos.valorcuota
				,'D'
				,NULL
				,_orden
				);
				/*
				UPDATE personal.pagocuota SET
				estado = TRUE
				WHERE idprestamo = _prestamos.idprestamo				--no se genera el pago de los prestamos en la grilla, esto lo ahce pero se tiene que estudia bien la forma de hacerlo
				AND detalle_cuota = _prestamos.detalle_cuota;
				*/

                IF (_prestamos.tipodescto = 'D') THEN 
                    __ccafdental := __ccafdental + _prestamos.valorcuota;
                ELSIF (_prestamos.tipodescto = 'L') THEN
                    __ccafahorro := __ccafahorro + _prestamos.valorcuota;
                ELSIF (_prestamos.tipodescto = 'SV') THEN
                    __ccafsegurovida := __ccafsegurovida + _prestamos.valorcuota;
                ELSIF (_prestamos.tipodescto = 'OD') THEN
                    __ccafotrodescto :=  __ccafotrodescto + _prestamos.valorcuota;
                ELSE
                    _prestamo_ccaf := _prestamo_ccaf + _prestamos.valorcuota;
                END IF;
                _valor_prestamo :=_valor_prestamo + _prestamos.valorcuota;
			ELSE
				INSERT INTO personal.liquidacion_detalle (
				 id_liquidacion
				,descripcion
				,monto
				,tipo
				,tipo_haber
				,orden
				) VALUES (
				 _idliquidacion
				,'Prestamo Credito Personal CCAF cuota - ' || _prestamos.detalle_cuota
				,_prestamos.valorcuota
				,'D'
				,NULL
				,_orden
				);
				/*
				UPDATE personal.pagocuota SET
				estado = TRUE
				WHERE idprestamo = _prestamos.idprestamo				--no se genera el pago de los prestamos en la grilla, esto lo ahce pero se tiene que estudia bien la forma de hacerlo
				AND detalle_cuota = _prestamos.detalle_cuota;
				*/
				_prestamo_ccaf := _prestamo_ccaf + _prestamos.valorcuota;
				_valor_prestamo :=_valor_prestamo + _prestamos.valorcuota;
			END IF;
		END IF;
	END LOOP;
    FOR _prestamos IN SELECT
			 pre.idprestamo
			,pre.idpersona
			,pre.glosa
			,pag.fecha_vencimiento
			,pag.valor AS valorcuota
			,pag.detalle_cuota
			,pre.caja
            ,pre.monto
			FROM personal.prestamo pre
			INNER JOIN personal.pagocuota pag
			ON pre.idprestamo=pag.idprestamo
			WHERE pre.idpersona=_idempleado
            		AND pre.estado != 'anulado'
                    AND COALESCE( pre.caja, '') = 'prestamosolidario'
                    AND to_char(pag.fecha_vencimiento,'YYYY-MM') <= _periodo
                    ORDER BY pag.fecha_vencimiento DESC
                    LIMIT 1
	LOOP
		IF(COALESCE(_prestamos.caja,'') = 'prestamosolidario')THEN
			__desctoley21252 := CASE WHEN (_total_haberes_imponibles-_total_descuentos_legales)*(_prestamos.monto / 100) >= 0 THEN (_total_haberes_imponibles-_total_descuentos_legales)*(_prestamos.monto / 100) ELSE 0 END;
			INSERT INTO personal.liquidacion_detalle (
				 id_liquidacion
				,descripcion
				,monto
				,tipo
				,tipo_haber
				,orden
				,idprestamo
				) VALUES (
				 _idliquidacion
				,'Descuento Ley 21252'
				,__desctoley21252
				,'D'
				,NULL
				,_orden
				,_prestamos.idprestamo
				);

			_valor_prestamo := __desctoley21252 + _valor_prestamo;
		END IF;
	END LOOP;
-- FIN PRESTAMOS POR PERIODO --------------------------------------------------------

-- SETEAMOS MAS TOTALES	------------------------------------------------------------
      SELECT INTO _total_haberes_noimponibles SUM(ld.monto)
      FROM personal.liquidacion_detalle ld
      WHERE ld.id_liquidacion=_idliquidacion
      AND ld.tipo='H'
      AND ld.tipo_haber = 'N';

      IF (_total_haberes_noimponibles IS NULL) THEN
          _total_haberes_noimponibles := 0;
      END IF;
      _total_haberes		:= (_total_haberes_imponibles + _total_haberes_noimponibles);
      _total_descuentos	:= (_total_descuentos_legales + _valor_impuesto_renta + _anticipos + _otros_desctos + _valor_prestamo);
      _total_liquidacion	:= round((_total_haberes - _total_descuentos),0);

    	--RAISE EXCEPTION 'TDL: [%] TP[%] TA[%] CE[%] TS[%] ', _total_descuentos_legales, _total_prevision,_total_apvi, _cesantia, _total_salud;

      -- CARGAS FAMILIARES --------------------------------------------------------------------
	IF (_cabecera.cargas > 0) THEN
    	IF (COALESCE(_total_liquidacion,0) > 0 OR __islicenciamedica IS TRUE) THEN

            SELECT INTO __tipotramo p.tipotramo FROM personal.persona p  WHERE p.idpersona = _idempleado;
            IF (__tipotramo IS NOT NULL) THEN
			SELECT INTO _tramos_cargas *  FROM dblink((SELECT dblink_dteconfiguracion())::text,'
			SELECT id,valor,tramo
			FROM personal.tramos_cargas car
			WHERE car.periodo =  replace('''|| _periodo2 ||''',''-'','''')
			AND car.tramo = '''|| __tipotramo ||'''
    			LIMIT 1') AS (id NUMERIC, valor NUMERIC, tramo char(1));

            _cabecera.valor_cargas := _tramos_cargas.valor;
            ELSE 
				SELECT INTO _tramos_cargas *  FROM dblink((SELECT dblink_dteconfiguracion())::text,'
				SELECT id,valor,tramo
				FROM personal.tramos_cargas car
				WHERE car.periodo =  replace('''|| _periodo2 ||''',''-'','''')
				AND car.valor = '''|| _cabecera.valor_cargas ||'''
				') AS (id NUMERIC, valor NUMERIC, tramo char(1));
            END IF; 
			--raise exception '(2) id =[%] valor[%] total[%]',_tramos_cargas.id,_tramos_cargas.valor , _total_liquidacion;
			IF (NOT _tramos_cargas.id IS NULL) THEN
				IF (_cabecera.cargas > 0) AND (_cabecera.valor_cargas > 0) THEN
					_cargas := (_cabecera.valor_cargas * _cabecera.cargas);
					IF (_dias_trabajados < 25 AND __islicenciamedica IS FALSE)
                    THEN
                    	_cargas := ((_cargas/30) * _dias_trabajados);
                    END IF;

					INSERT INTO personal.liquidacion_detalle(id_liquidacion,descripcion,monto,tipo,tipo_haber,orden )
					VALUES(_idliquidacion,'Cargas Familiares ('||_cabecera.cargas||')',_cargas,'H','N',5 );

					--Recalcular Totales
					_total_haberes_noimponibles := (_total_haberes_noimponibles + _cargas);
					_total_haberes := (_total_haberes_imponibles + _total_haberes_noimponibles);
					_total_liquidacion := round((_total_haberes - _total_descuentos),0);
				END IF;
			ELSE
            __rutPersonal := '';
                __varfiltro := ' AND idpersona = ' || _idempleado;
                IF EXISTS (SELECT * FROM personal.fn_persona_periodo(__varfiltro))
                THEN
                    __rutPersonal := (SELECT rut FROM personal.fn_persona_periodo(__varfiltro));
                END IF;
                __varfiltro := 'RUT: ' || __rutPersonal || ' Carga Familiar no corresponde a valor de tramo, modificar en Maestro/Personal';
                RAISE EXCEPTION 'ERROR: %', __varfiltro;
            END IF;
		ELSE
			SELECT INTO _tramos_cargas 1 AS id,0 AS valor,''::char AS tramo;
		END IF;
   ELSE
        SELECT INTO _tramos_cargas 1 AS id,0 AS valor,''::char AS tramo;
   END IF;
-- FIN CARGAS FAMILIARES --

	_tope_afp := round((_parametros.tope_afp * _valor_uf),0);
	IF(_total_haberes_imponibles > _tope_afp) THEN
		_sis := round(_tope_afp *  (COALESCE(_parametros.sis,0)/100), 0);
	END IF;

    IF (_adicional_isapre > 0 AND _total_liquidacion < 0) THEN

		IF (ABS(_total_liquidacion) > ROUND(_adicional_isapre)) THEN
          --SI EL VALOR ABS DEL TOTAL DE LA LIQUIDACION ES MAYOR AL ADICIONAL, LA LIQUIDACION DA NEGATIVO POR OTROS MOVIMIENTOS, NO SE RELIZA REAJUSTE
          IF (COALESCE(_preview,FALSE) = FALSE) THEN
                  RAISE EXCEPTION 'Verificar movimientos asociados al Trabajador de RUT: %, puede tener prestamo vigente que impide generar liquidacion.', _cabecera.rut;
          END IF;
        ELSE
          --SOLO CALCULAMOS REAJUSTE SI SE CUMPLE CONDICION, PARA EVITAR DESCUADRES EN RESUMEN
          __montoajuste := ROUND(_adicional_isapre - ABS(_total_liquidacion), 0)::NUMERIC;
          __saldopendiente := (_adicional_isapre - __montoajuste);
          _adicional_isapre := ABS(__montoajuste);
        END IF;


		--RECALCULAMOS TOTAL DE LA LIQUIDACION
		_total_salud := (_porc_salud7 + _adicional_isapre);
        _total_descuentos_legales := (_total_prevision + _total_apvi + _cesantia + _total_salud);
        _total_descuentos	:= (_total_descuentos_legales + _valor_impuesto_renta + _anticipos + _otros_desctos + _valor_prestamo);
		_total_liquidacion	:= round((_total_haberes - _total_descuentos),0);

    	--ELIMINAMOS REGISTRO DE IMPUESTO A LA RENTA PARA RECALCULAR
        DELETE FROM personal.liquidacion_detalle
        WHERE descripcion = 'Impuesto a la Renta'
        AND id_liquidacion = _idliquidacion;

		--ELIMINAMOS REGISTRO DE ADICIONAL DE ISAPRE
        DELETE FROM personal.liquidacion_detalle
        WHERE descripcion LIKE '%Adicional -%'
        AND id_liquidacion = _idliquidacion;

		--REFISTRAMOS ADICIONAL DE SALUD RECALCULADO
        INSERT INTO personal.liquidacion_detalle(id_liquidacion,descripcion,monto,tipo,tipo_haber,orden)
        VALUES(_idliquidacion,'Adicional - '||initcap(lower(_cabecera.salud_nombre)),round((_adicional_isapre),0),'D','L',5 );

    	--RECALCULAMOS EL IMPUESTO A LA RENTA
    	IF  _dias_trabajados > 0 THEN
          IF _valor_utm <= 0 THEN
			IF (COALESCE(_preview,FALSE) = FALSE) THEN
					RAISE EXCEPTION 'NO existe el valor de la UTM';
			END IF;
          END IF;
          IF COALESCE(_total_haberes_imponibles,0) > 0 THEN
              _total_imponibles_legales		:= (_total_haberes_imponibles - COALESCE( _total_descuentos_legales,0));
              _total_imponibles_legales_utm	:= (_total_imponibles_legales / _valor_utm);

              IF _total_imponibles_legales_utm < 0 THEN
				IF (COALESCE(_preview,FALSE) = FALSE) THEN
					RAISE EXCEPTION 'No existe registro en Parametros Generales, tramo impuesto sobre la renta, ya que el total imponible de esta liquidación es menor a cero.';
				END IF;
              END IF;

              SELECT INTO _impuesto_renta * FROM dblink(dblink_dteconfiguracion(),'
                SELECT factor, rebaja
                FROM personal.tramos_imptorenta imp
                WHERE (('|| _total_imponibles_legales_utm || ' > imp.desde)
                AND (' || _total_imponibles_legales_utm || ' <=imp.hasta)
                AND imp.periodo = replace('''|| _periodo2 ||''',''-'',''''))
                ') AS (factor NUMERIC, rebaja NUMERIC);
			  --Validacion parametros generales tramo impuesto sobre la renta
              IF (FOUND) THEN
                  IF (_impuesto_renta.factor > 0 ) THEN
                      _valor_impuesto_renta := round(((_total_imponibles_legales * _impuesto_renta.factor) - (_impuesto_renta.rebaja * _valor_utm)),0);
                      INSERT INTO personal.liquidacion_detalle(id_liquidacion,descripcion,monto,tipo,tipo_haber,orden)
                      VALUES(_idliquidacion,'Impuesto a la Renta',_valor_impuesto_renta,'D','L',7 );

                      UPDATE personal.liquidacion SET
                       renta_afecta_impuesto_unico = _total_imponibles_legales
                      WHERE id = _idliquidacion;
                  END IF;
              ELSE
				IF (COALESCE(_preview,FALSE) = FALSE) THEN
					RAISE EXCEPTION 'No existe registro en Parametros Generales: tramo impuesto sobre la renta, en el periodo seleccionado';
				END IF;
              END IF;
          END IF;
      END IF;
    END IF;
    IF (COALESCE(_preview,FALSE) = FALSE) THEN
        IF (_total_liquidacion < 0) THEN
            RAISE EXCEPTION 'Verificar movimientos asociados al Trabajador de RUT: %, puede tener prestamo vigente que impide generar liquidacion.', _cabecera.rut;
        END IF;
    END IF;

    _valortt := (SELECT tipotrabajador FROM personal.persona WHERE idpersona = _idempleado LIMIT 1);
    IF v_edad > 64 AND (_valortt = 0 OR _valortt = 3) THEN
        _sis := 0;
    END IF;

-- ACTUALIZACION CABECERA DE LIQUIDACION CON TOTALES--
	UPDATE personal.liquidacion SET
		  haberes_imponibles    = round(_total_haberes_imponibles,0)
		, haberes_noimponibles  = round(_total_haberes_noimponibles,0)
		, descuentos            = round(_total_descuentos,0)
		, total                 = round(_total_liquidacion,0)
		, total_haberes         = round(_total_haberes,0)
		, desctos_legales       = round(_total_descuentos_legales,0)
		, gratificacion         = round(_monto_gratificacion,0)
		, dias_trabajados       = round(_dias_trabajados,0)
        , seg_imponible         = round(_seg_imponible,0)
		, seg_desempleo         = round(_cesantia,0)
		, seg_empleador         = round(_seg_empleador,0)
		, seg_sis               = round(_sis,0)
		, afp                   = round(_total_prevision,0)
		, apv                   = round(_total_apvi,0)
		, impto_renta           = round(_valor_impuesto_renta,0)
		, anticipos             = round(_anticipos,0)
		, horas_extras          = round(_horas_extras,0)
		, inasist_atrasos       = round(_atrasos_inasist,0)
		, asignacion            = round(_cargas,0)
		, isapre                = round(_isapre,0)
		, adicional             = round(_adicional,0)
		, fonasa                = round(_fonasa,0)
		, otros_desctos         = round(_otros_desctos,0)
		, otros_imp             = round(_otros_imp,0)
		, otros_noimp           = round(_otros_noimp,0)
		, tramo_asignacion      = COALESCE( _tramos_cargas.tramo::char, ''::char)
		, prestamo_ccaf         = _prestamo_ccaf
		, carga_retroactiva     = _carga_retroactiva
        , ccafahorro            = __ccafahorro
        , ccafsegurovida        = __ccafsegurovida
        , dsctosbpordia			= _parametros.dsctosbpordia
        ,reajusteisapre			= COALESCE(__saldopendiente,0)
        , cargo					= __cargo
        , ccafdental            = __ccafdental
        , ccafotrodescto        = __ccafotrodescto
        ,seg_leysanna			= __leysanna
		,imponible_100sc			= COALESCE(__imponible_100sc,0)
	WHERE id = _idliquidacion;
-- FIN ACTUALIZACION CABECERA DE LIQUIDACION CON TOTALES

    IF EXISTS(SELECT id FROM personal.movimientos
                WHERE idpersona = _idempleado
                AND tipomovimiento = 3
                AND motivoinasist IN (105, 106,	107)
                AND to_char(fecha, 'YYYY-MM') = _periodo)
    THEN
    	PERFORM personal.fn_suspension_contrato(_idempleado, _periodo, _idliquidacion);
    END IF;
    	RETURN TRUE;
    END;
$body$
LANGUAGE 'plpgsql';