import { SiteContent } from './content.model';

export const CONTENT_ES: SiteContent = {
  meta: {
    title: 'JP·Workspace — Juan Pablo Huerta · Senior Software Engineer',
    description:
      'JP·Workspace: cómo un Senior Software Engineer diseña y construye sistemas empresariales. ERP de remuneraciones, arquitectura y automatización con IA.'
  },
  nav: {
    links: [
      { id: 'workspace', label: 'Workspace' },
      { id: 'proyectos', label: 'Proyectos' },
      { id: 'thinking', label: 'Thinking' },
      { id: 'experiencia', label: 'Experiencia' }
    ],
    cv: 'CV',
    contact: 'Contacto',
    menuAria: 'Abrir menú'
  },
  hero: {
    eyebrow: 'Viña del Mar, Chile · Disponibilidad inmediata',
    role: 'Senior Software Engineer',
    specialization: 'Enterprise Systems · Software Architecture · Artificial Intelligence',
    statement:
      'Diseñando plataformas empresariales, motores de negocio y automatización mediante inteligencia artificial.',
    stack: ['Angular', 'TypeScript', 'PostgreSQL', 'Python', 'Docker'],
    ctaWorkspace: 'Ver workspace',
    ctaCv: 'Descargar CV',
    ctaContact: 'Contactar',
    scrollCue: 'Explorar'
  },
  workspace: {
    eyebrow: '01 · Qué construye',
    title: 'JP·Workspace',
    titleHighlight: 'ERP Remuneraciones',
    subtitle:
      'Simulación navegable del sistema en desarrollo. Todo es representativo del producto real; el Motor ejecuta código de cálculo de verdad.',
    productLabel: 'jp.workspace — ERP Remuneraciones · Chile',
    openDemo: 'Abrir demo real',
    demoNote: 'Acceso demo: demo@demo.cl · DEMO1234',
    philosophy: [
      'Arquitectura antes que framework.',
      'Automatizar antes que repetir.',
      'La mantenibilidad es una funcionalidad.',
      'Los sistemas complejos se diseñan. No aparecen por accidente.'
    ],
    views: [
      { id: 'resumen', label: 'Resumen' },
      { id: 'empleados', label: 'Empleados' },
      { id: 'parametros', label: 'Parámetros' },
      { id: 'motor', label: 'Motor' },
      { id: 'nomina', label: 'Nómina' },
      { id: 'reportes', label: 'Reportes' }
    ],
    resumen: {
      greeting: 'Período Julio 2026 · Empresa Prueba',
      kpis: [
        { label: 'Empleados activos', value: '13', sub: 'Dotación del período' },
        { label: 'Aptos para nómina', value: '100%', sub: '13 de 13 trabajadores' },
        { label: 'Nómina en curso', value: 'Etapa 3/6', sub: 'Cálculo de liquidaciones' },
        { label: 'Licencias pendientes', value: '6', sub: 'Requieren revisión' }
      ],
      chartTitle: 'Evolución del costo empresa',
      chart: [
        { month: 'Feb', pct: 6 },
        { month: 'Mar', pct: 6 },
        { month: 'Abr', pct: 42 },
        { month: 'May', pct: 100 },
        { month: 'Jun', pct: 14 },
        { month: 'Jul', pct: 9 }
      ]
    },
    empleados: {
      headers: ['RUT', 'Empleado', 'Cargo', 'Estado'],
      rows: [
        { rut: '12.345.678-9', name: 'C. Fuentes', role: 'Jefa de Turno', status: 'Activo' },
        { rut: '13.456.789-0', name: 'M. Riquelme', role: 'Contador', status: 'Activo' },
        { rut: '14.567.890-1', name: 'P. Salazar', role: 'Analista de Operaciones', status: 'Activo' },
        { rut: '15.678.901-2', name: 'V. Aravena', role: 'Supervisora de Bodega', status: 'Licencia', warn: true },
        { rut: '16.789.012-3', name: 'R. Castillo', role: 'Vendedor Sucursal', status: 'Activo' }
      ],
      footnote: 'Ficha completa: contratos, previsión, salud, banca y parámetros por período.'
    },
    parametros: {
      title: 'Indicadores del período',
      items: [
        { label: 'UF', value: '$40.820,31', delta: '+0,52%' },
        { label: 'UTM', value: '$71.506', delta: '+1,30%' },
        { label: 'UTA', value: '$858.072', delta: '+1,30%' },
        { label: 'Sueldo mínimo', value: '$539.000', delta: 'Sin variación' }
      ],
      footnote: 'Parámetros versionados por mes en PostgreSQL; el motor consume el período activo.'
    },
    motor: {
      title: 'Motor de cálculo · en vivo',
      grossLabel: 'Sueldo bruto (CLP)',
      taxableLabel: 'Imponible (tope 87,8 UF)',
      afpLabel: 'AFP (10% + comisión ref.)',
      healthLabel: 'Salud (7%)',
      unemploymentLabel: 'Seguro cesantía (0,6%)',
      totalLabel: 'Líquido estimado',
      note: 'Extracto simplificado del motor real. Valores referenciales (UF fija, sin impuesto único).'
    },
    nomina: {
      title: 'Proceso de nómina',
      steps: [
        'Apertura del período',
        'Movimientos del mes',
        'Cálculo de liquidaciones',
        'Revisión y ajustes',
        'Aprobación',
        'Cierre · LRE y Previred'
      ],
      activeStep: 2,
      footnote: 'Cada etapa valida la anterior; no hay cierre con inconsistencias abiertas.'
    },
    reportes: {
      title: 'Salidas del sistema',
      items: [
        { name: 'Libro de Remuneraciones Electrónico', desc: 'Formato Dirección del Trabajo', tag: 'CSV' },
        { name: 'Archivo Previred', desc: 'Cotizaciones previsionales del período', tag: 'TXT' },
        { name: 'Liquidaciones de sueldo', desc: 'Por trabajador, firmables', tag: 'PDF' },
        { name: 'Centralización contable', desc: 'Asiento por centro de costo', tag: 'SQL' }
      ]
    },
    teaser: 'Cómo resuelve problemas'
  },
  projects: {
    eyebrow: '02 · Cómo resuelve problemas',
    title: 'Proyectos',
    titleHighlight: 'seleccionados',
    subtitle: 'Seleccionar un proyecto actualiza el detalle. Un solo caso abierto a la vez.',
    problemLabel: 'Problema',
    solutionLabel: 'Solución',
    architectureLabel: 'Arquitectura',
    demoLabel: 'Ver demo',
    codeLabel: 'Ver código',
    items: [
      {
        id: 3,
        number: '01',
        title: 'Sistema de Remuneraciones (ERP) · Chile',
        shortTitle: 'Remuneraciones ERP',
        category: 'Angular · TypeScript · Supabase · PostgreSQL',
        problem:
          'Centralizar trabajadores, contratos, previsión y salud con reglas chilenas, evitando errores en liquidaciones.',
        solution:
          'Arquitectura Angular/TypeScript y modelo relacional en Supabase/PostgreSQL con flujos tipados, estados y validaciones.',
        architectureLayers: [
          'Angular · UI modular',
          'API · Supabase',
          'Motor de reglas · TypeScript',
          'Dominio remuneraciones',
          'PostgreSQL · RLS'
        ],
        architectureNote:
          'El cálculo vive en un motor puro y testeable; la UI solo orquesta. Parámetros versionados por período.',
        metrics: [
          { value: 'ERP', label: 'Flujos mantenibles' },
          { value: 'SQL', label: 'Modelo relacional' },
          { value: 'TS', label: 'Tipado y escala' }
        ],
        tags: ['Angular', 'TypeScript', 'Supabase', 'PostgreSQL'],
        github: 'https://github.com/teckuro',
        demoUrl: 'https://erp-beta-bay.vercel.app/',
        demoNote: 'Acceso demo: demo@demo.cl · DEMO1234',
        screenshot: 'assets/projects/erp-remuneraciones.png',
        mockupLabel: 'Remuneraciones',
        previewDomain: 'erp-beta-bay.vercel.app'
      },
      {
        id: 4,
        number: '02',
        title: 'HuntOS · Agente autónomo de búsqueda de empleo',
        shortTitle: 'HuntOS',
        category: 'IA · Automatización · Supabase · Vercel',
        problem:
          'Buscar trabajo es repetitivo: revisar portales, filtrar vacantes, adaptar el CV, postular y hacer seguimiento, todos los días.',
        solution:
          'Agente autónomo que busca vacantes, las puntúa contra el perfil, optimiza el CV y postula sin detenerse hasta una oferta aceptada, con pipeline trazable.',
        architectureLayers: [
          'Panel de control · pipeline',
          'API · health y aprobaciones',
          'Agente IA · scoring y matching',
          'Supabase · estado y trazabilidad'
        ],
        architectureNote:
          'El agente corre tras un flag de seguridad (HUNTING_ENABLED) y expone health checks; cada postulación queda trazable en el pipeline.',
        metrics: [
          { value: 'IA', label: 'Scoring de vacantes' },
          { value: '75–90', label: 'Umbral de score' },
          { value: '24/7', label: 'Postulación autónoma' }
        ],
        tags: ['IA', 'Automatización', 'Supabase', 'Vercel'],
        github: 'https://github.com/teckuro',
        demoUrl: 'https://huntos.vercel.app/',
        mockupLabel: 'HuntOS',
        previewDomain: 'huntos.vercel.app'
      }
    ],
    teaser: 'Cómo piensa y decide'
  },
  thinking: {
    eyebrow: '03 · Cómo piensa y decide',
    title: 'Thinking',
    titleHighlight: 'decisiones de arquitectura',
    subtitle: 'Registros de decisión (ADR): problema, opciones, decisión, trade-offs y resultado.',
    labels: {
      problem: 'Problema',
      options: 'Opciones',
      decision: 'Decisión',
      tradeoffs: 'Trade-offs',
      result: 'Resultado'
    },
    items: [
      {
        code: 'ADR-01',
        title: 'Angular para software empresarial',
        problem:
          'Un ERP vive años y lo mantienen equipos que rotan. El frontend necesita una estructura que sobreviva a las personas que lo escribieron.',
        options: 'React (máxima flexibilidad), Vue (curva suave), Angular (framework completo).',
        decision:
          'Angular: inyección de dependencias, router, formularios y convenciones únicas. Dos desarrolladores escriben código parecido sin ponerse de acuerdo.',
        tradeoffs: 'Más verboso, curva inicial mayor y menos libertad para UI exploratoria.',
        result: 'Módulos consistentes (empleados, nóminas, parámetros) y onboarding predecible.'
      },
      {
        code: 'ADR-02',
        title: 'PostgreSQL como núcleo del sistema',
        problem:
          'Remuneraciones exige integridad transaccional, reglas históricas y auditoría. Un error de datos es plata mal pagada a una persona.',
        options: 'MySQL (familiar), MongoDB (flexible), PostgreSQL (integridad + extensibilidad).',
        decision:
          'PostgreSQL: constraints fuertes, vistas y funciones para reglas de negocio, JSONB para parámetros flexibles y RLS para multiempresa.',
        tradeoffs: 'Más lógica en la base exige disciplina de migraciones y versionado.',
        result: 'El modelo relacional es la fuente de verdad; el frontend no improvisa reglas.'
      },
      {
        code: 'ADR-03',
        title: 'Signals para estado local, RxJS para lo asíncrono',
        problem:
          'El ERP maneja estado de UI (período activo, filtros, selección) sin necesidad de un store global pesado.',
        options: 'RxJS en todo, NgRx (store global), Signals (estado reactivo local).',
        decision:
          'Signals para estado local y derivado (período, selección, totales); RxJS solo donde hay asincronía real: HTTP y realtime.',
        tradeoffs: 'Dos modelos mentales conviviendo; requiere un criterio de borde claro y documentado.',
        result: 'Menos boilerplate que NgRx y efectos más fáciles de razonar y testear.'
      },
      {
        code: 'ADR-04',
        title: 'Motor de reglas separado de la UI',
        problem:
          'El cálculo chileno cambia todos los meses (UF, topes, tramos). Hardcodearlo en pantallas lo vuelve intesteable.',
        options: 'Cálculo en componentes, SQL puro, o un motor de dominio independiente.',
        decision:
          'Motor puro en TypeScript: funciones deterministas (bruto + parámetros del período → liquidación), con parámetros versionados por mes en PostgreSQL.',
        tradeoffs: 'Una capa más de indirección y sincronizar parámetros entre base y motor.',
        result:
          'Testeable con casos reales (topes 87,8 UF / 131,9 UF). El Motor de este workspace ejecuta un extracto de ese código.'
      },
      {
        code: 'ADR-05',
        title: 'Arquitectura modular por dominio',
        problem:
          'Un ERP mezcla dominios distintos (personas, nóminas, parámetros, reportes) y tiende al monolito de pantallas acopladas.',
        options: 'Feature folders sueltos, microfrontends, módulos por dominio.',
        decision:
          'Módulos por dominio con frontera clara: cada uno posee sus rutas, estado y acceso a datos; lo transversal vive en core/shared.',
        tradeoffs: 'Más estructura inicial. Microfrontends habría sido sobre-ingeniería para el tamaño del equipo.',
        result: 'Se puede modificar licencias médicas sin miedo a romper nóminas.'
      },
      {
        code: 'ADR-06',
        title: 'Un error real: desplegar integración y UI juntos',
        problem:
          'En facturación electrónica, un cambio de integración SII salió a producción junto con mejoras de UI. Un caso borde tributario bloqueó la emisión para parte de los clientes.',
        options: 'Hotfix rápido y seguir igual, o rediseñar el proceso de entrega.',
        decision:
          'Separar despliegues de integraciones de los de UI, versionar contratos y convertir los casos borde del SII en suite de regresión.',
        tradeoffs: 'Entregas algo más lentas y más disciplina de proceso.',
        result:
          'Los incidentes de integración dejaron de llegar a clientes. Aprendizaje: la estabilidad se diseña en el proceso, no en el hotfix.'
      }
    ],
    teaser: 'Dónde lo aplicó'
  },
  experience: {
    eyebrow: '04 · Dónde aplicó ese conocimiento',
    title: 'Experiencia',
    titleHighlight: 'profesional',
    impactLabel: 'Impacto',
    items: [
      {
        role: 'Desarrollador Full Stack / Líder de Equipo',
        company: 'Desis Limitada',
        period: 'ago. 2021 – ago. 2025',
        location: 'Chile',
        summary: 'Productos escalables, módulos ERP e integraciones SII/Transbank con liderazgo técnico.',
        responsibilities: [
          {
            title: 'Liderazgo técnico',
            desc: 'Apoyo a un equipo de desarrollo durante 8 meses, supervisando calidad de entregas y problemas técnicos complejos.'
          },
          {
            title: 'Desarrollo de ERP',
            desc: 'Módulos de contabilidad, remuneraciones e inventario integrados con PHP y JavaScript.'
          },
          {
            title: 'Integraciones estratégicas',
            desc: 'Integraciones con SII y pasarelas de pago Transbank para automatización de procesos.'
          },
          {
            title: 'Optimización de datos',
            desc: 'Vistas y funciones en PostgreSQL para reglas de negocio y reportería.'
          }
        ],
        impact:
          'Plataforma de facturación operando en producción para clientes en todo Chile, con entregas estables durante 4 años.',
        tech: ['PHP', 'Laravel', 'Angular', 'PostgreSQL', 'GraphQL', 'SII', 'Transbank', 'Docker', 'AWS']
      },
      {
        role: 'Programador Junior',
        company: 'Anida Latam',
        period: 'ene. 2021 – ago. 2021',
        location: 'Chile',
        summary: 'Desarrollo web con Angular/JavaScript y backend Laravel/PHP.',
        responsibilities: [
          {
            title: 'Frontend Angular',
            desc: 'Funcionalidades web con Angular, TypeScript y JavaScript.'
          },
          {
            title: 'Angular Material',
            desc: 'Interfaces con componentes Angular Material.'
          },
          {
            title: 'Backend Laravel / PHP',
            desc: 'Desarrollo y mantención de funcionalidades en Laravel y PHP.'
          }
        ],
        impact: 'Funcionalidades entregadas en un portal de autoatención usado por clientes finales.',
        tech: ['Angular', 'Laravel', 'PHP', 'JavaScript', 'TypeScript']
      }
    ],
    teaser: 'Hablemos'
  },
  contact: {
    links: [
      { label: 'Email', value: 'jphuerta.dev@gmail.com', href: 'mailto:jphuerta.dev@gmail.com', external: false },
      { label: 'LinkedIn', value: 'linkedin.com/in/jphuerta1', href: 'https://www.linkedin.com/in/jphuerta1/', external: true },
      { label: 'GitHub', value: 'github.com/teckuro', href: 'https://github.com/teckuro', external: true },
      { label: 'WhatsApp', value: '+56 9 8829 2018', href: 'https://wa.me/56988292018', external: true }
    ],
    whatsappAria: 'Contactar por WhatsApp'
  },
  footer: {
    tagline: 'Senior Software Engineer. Sistemas empresariales, arquitectura y automatización con IA.',
    navTitle: 'Navegación',
    contactTitle: 'Contacto',
    rights: '© 2026 Juan Pablo Huerta',
    availability: 'Disponibilidad inmediata'
  },
  consoleGreeting: {
    title: 'JP·Workspace — Juan Pablo Huerta · Senior Software Engineer',
    body:
      '¿Inspeccionando el código? Angular + Tailwind, sin librerías de UI.\nRepositorio: https://github.com/teckuro\nContacto: jphuerta.dev@gmail.com'
  }
};
