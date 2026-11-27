import { SiteContent } from './content.model';
import actividad from './erp-actividad.json';

const ERP_REPO = 'https://github.com/teckuro/ERP';

export const CONTENT_ES: SiteContent = {
  meta: {
    title: 'Juan Pablo Huerta · Full stack engineer · ERP y remuneraciones',
    description:
      'Hago software empresarial: un ERP de remuneraciones para Chile, facturación electrónica e integraciones con el SII. Puedes probar el motor de cálculo en la página.'
  },
  nav: {
    links: [
      { id: 'workspace', label: 'Motor' },
      { id: 'ahora', label: 'Ahora' },
      { id: 'proyectos', label: 'ERP' },
      { id: 'thinking', label: 'Decisiones' },
      { id: 'experiencia', label: 'Experiencia' }
    ],
    cv: 'CV',
    contact: 'Contacto',
    menuAria: 'Abrir menú'
  },
  hero: {
    eyebrow: 'Viña del Mar, Chile · Disponible ahora',
    role: 'Full stack engineer · ERP y remuneraciones',
    statement:
      'Desde 2021 hago software para empresas chilenas: facturación electrónica, integraciones con el SII y Transbank, y remuneraciones. Ahora construyo mi propio ERP de remuneraciones, y su motor de cálculo corre aquí abajo.',
    stack: ['Angular', 'TypeScript', 'PostgreSQL', 'Python', 'Docker'],
    ctaWorkspace: 'Probar el motor',
    ctaCv: 'Descargar CV',
    ctaContact: 'Escribirme',
    scrollCue: 'Ver más'
  },
  workspace: {
    eyebrow: 'motor',
    title: 'El motor de mi ERP, funcionando aquí',
    subtitle:
      'Un extracto del cálculo de remuneraciones de mi ERP, con los parámetros del período. Cambia el sueldo bruto y mira cómo se arma la liquidación.',
    productLabel: 'erp-remuneraciones · motor de cálculo',
    openDemo: 'Abrir el ERP',
    parametros: {
      title: 'Parámetros del período',
      items: [
        { label: 'UF', value: '$40.820,31', delta: '+0,52%' },
        { label: 'UTM', value: '$71.506', delta: '+1,30%' },
        { label: 'UTA', value: '$858.072', delta: '+1,30%' },
        { label: 'Sueldo mínimo', value: '$539.000', delta: 'sin variación' }
      ],
      footnote: 'En el ERP, estos parámetros se versionan por mes en PostgreSQL y el motor usa los del período activo.'
    },
    motor: {
      title: 'Motor de cálculo · en vivo',
      grossLabel: 'Sueldo bruto (CLP)',
      taxableLabel: 'Imponible (tope 87,8 UF)',
      afpLabel: 'AFP (11,15% ref.)',
      healthLabel: 'Salud (7%)',
      unemploymentLabel: 'Seguro de cesantía (0,6%)',
      totalLabel: 'Líquido estimado',
      note: 'Versión simplificada: UF fija y sin impuesto único. El motor completo está en el ERP.'
    },
    slip: {
      title: 'Liquidación de sueldo',
      period: 'Noviembre 2026',
      earnings: 'Haberes',
      deductions: 'Descuentos',
      inWords: 'Son',
      received: 'Recibí conforme',
      capApplied: 'Se aplicó el tope imponible'
    }
  },
  now: {
    eyebrow: 'ahora',
    title: 'En qué estoy trabajando',
    subtitle:
      'Los últimos cambios del ERP, leídos del repositorio público en cada publicación de este sitio.',
    updated: 'Actualizado el',
    commitsLabel: 'commits en main',
    viewAll: 'Ver todos los commits',
    months: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  },
  projects: {
    eyebrow: 'proyecto',
    title: 'El ERP por dentro',
    problemLabel: 'Problema',
    solutionLabel: 'Solución',
    architectureLabel: 'Arquitectura',
    demoLabel: 'Ver demo',
    codeLabel: 'Ver código',
    items: [
      {
        id: 3,
        title: 'ERP de remuneraciones · Chile',
        shortTitle: 'ERP de remuneraciones',
        category: 'Angular · TypeScript · Supabase · PostgreSQL',
        problem:
          'Calcular remuneraciones en Chile es llevar trabajadores, contratos, AFP, salud, licencias y topes que cambian cada mes. Un error es plata mal pagada a una persona.',
        solution:
          'Un ERP en Angular sobre Supabase/PostgreSQL. El cálculo vive en un motor de reglas puro y testeado, los parámetros se versionan por período y la base valida la seguridad multiempresa con RLS.',
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
          { value: String(actividad.cifras.migraciones), label: 'migraciones SQL' },
          { value: actividad.cifras.tests.toLocaleString('es-CL'), label: 'tests automatizados' },
          { value: String(actividad.cifras.modulos), label: 'módulos de dominio' }
        ],
        tags: ['Angular', 'TypeScript', 'Supabase', 'PostgreSQL'],
        github: ERP_REPO,
        demoUrl: 'https://erp-beta-bay.vercel.app/',
        demoNote: 'Acceso demo: demo@demo.cl · DEMO1234',
        screenshot: 'assets/projects/erp-remuneraciones.webp',
        mockupLabel: 'Remuneraciones',
        previewDomain: 'erp-beta-bay.vercel.app'
      }
    ]
  },
  thinking: {
    eyebrow: 'decisiones',
    title: 'Cómo decido',
    subtitle:
      'Decisiones de arquitectura escritas como ADR: el problema, las opciones, lo que elegí y lo que me costó. Parto por un error real.',
    labels: {
      problem: 'Problema',
      options: 'Opciones',
      decision: 'Decisión',
      tradeoffs: 'Lo que me costó',
      result: 'Resultado',
      code: 'En el código'
    },
    items: [
      {
        code: 'ADR-06',
        title: 'Un error real: desplegar integración y UI juntos',
        problem:
          'En facturación electrónica, un cambio de integración con el SII salió a producción junto con mejoras de UI. Un caso borde tributario bloqueó la emisión para parte de los clientes.',
        options: 'Hotfix rápido y seguir igual, o rediseñar el proceso de entrega.',
        decision:
          'Separar los despliegues de integraciones de los de UI, versionar los contratos y convertir los casos borde del SII en una suite de regresión.',
        tradeoffs: 'Entregas algo más lentas y más disciplina de proceso.',
        result:
          'Los incidentes de integración dejaron de llegar a clientes. Aprendí que la estabilidad se diseña en el proceso, no en el hotfix.'
      },
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
        result: 'El modelo relacional es la fuente de verdad; el frontend no improvisa reglas.',
        link: { label: 'supabase/migrations', href: `${ERP_REPO}/tree/main/supabase/migrations` }
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
          'Testeable con casos reales (topes 87,8 UF / 131,9 UF). El motor de esta página es un extracto de ese código.',
        link: {
          label: 'features/nomina-mensual/rules',
          href: `${ERP_REPO}/tree/main/src/app/features/nomina-mensual/rules`
        }
      },
      {
        code: 'ADR-05',
        title: 'Arquitectura modular por dominio',
        problem:
          'Un ERP mezcla dominios distintos (personas, nóminas, parámetros, reportes) y tiende al monolito de pantallas acopladas.',
        options: 'Feature folders sueltos, microfrontends, módulos por dominio.',
        decision:
          'Módulos por dominio con frontera clara: cada uno posee sus rutas, estado y acceso a datos; lo transversal vive en core/shared.',
        tradeoffs: 'Más estructura inicial. Microfrontends habría sido sobreingeniería para el tamaño del equipo.',
        result: 'Se puede modificar licencias médicas sin miedo a romper nóminas.',
        link: { label: 'src/app/features', href: `${ERP_REPO}/tree/main/src/app/features` }
      }
    ]
  },
  experience: {
    eyebrow: 'experiencia',
    title: 'Experiencia',
    impactLabel: 'Impacto',
    items: [
      {
        role: 'Desarrollador full stack / Líder de equipo',
        company: 'Desis Limitada',
        period: 'ago. 2021 – ago. 2025',
        location: 'Chile',
        summary:
          'Facturación electrónica, integraciones con el SII y Transbank, y módulos ERP para clientes en todo Chile. Durante 8 meses también lideré un equipo.',
        responsibilities: [
          {
            title: 'Liderazgo técnico',
            desc: 'Lideré un equipo de desarrollo durante 8 meses: revisión de entregas y problemas técnicos complejos.'
          },
          {
            title: 'Módulos ERP',
            desc: 'Contabilidad, remuneraciones e inventario, en PHP y JavaScript.'
          },
          {
            title: 'Integraciones SII y Transbank',
            desc: 'Emisión de documentos tributarios con el SII y pagos con Transbank.'
          },
          {
            title: 'PostgreSQL',
            desc: 'Vistas y funciones para reglas de negocio y reportes.'
          }
        ],
        impact:
          'Plataforma de facturación operando en producción para clientes en todo Chile, con entregas estables durante 4 años.',
        tech: ['PHP', 'Laravel', 'Angular', 'PostgreSQL', 'GraphQL', 'SII', 'Transbank', 'Docker', 'AWS']
      },
      {
        role: 'Programador junior',
        company: 'Anida Latam',
        period: 'ene. 2021 – ago. 2021',
        location: 'Chile',
        summary: 'Desarrollo web con Angular y backend en Laravel/PHP.',
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
    ]
  },
  contact: {
    eyebrow: 'contacto',
    title: '¿Hablamos?',
    subtitle:
      'Busco un rol de ingeniería de software en un equipo que construya sistemas empresariales. Si tienes un ERP, una integración o un proceso que automatizar, escríbeme.',
    emailCta: 'Escribir un email',
    links: [
      { label: 'Email', value: 'jphuerta.dev@gmail.com', href: 'mailto:jphuerta.dev@gmail.com', external: false },
      { label: 'LinkedIn', value: 'linkedin.com/in/jphuerta1', href: 'https://www.linkedin.com/in/jphuerta1/', external: true },
      { label: 'GitHub', value: 'github.com/teckuro', href: 'https://github.com/teckuro', external: true },
      { label: 'WhatsApp', value: '+56 9 8829 2018', href: 'https://wa.me/56988292018', external: true }
    ],
    whatsappAria: 'Contactar por WhatsApp'
  },
  footer: {
    tagline: 'Full stack engineer en Viña del Mar. ERP, remuneraciones e integraciones.',
    navTitle: 'Navegación',
    contactTitle: 'Contacto',
    rights: '© 2026 Juan Pablo Huerta',
    availability: 'Disponible ahora'
  },
  consoleGreeting: {
    title: 'Juan Pablo Huerta · Full stack engineer',
    body:
      '¿Revisando el código? Angular + Tailwind, sin librerías de UI.\nRepositorio del ERP: https://github.com/teckuro/ERP\nContacto: jphuerta.dev@gmail.com'
  },
  sheet: {
    label: 'Hoja',
    of: 'de',
    end: 'Fin del listado',
    totals: 'Totales'
  }
};
