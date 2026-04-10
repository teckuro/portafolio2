import { Component } from '@angular/core';

type BadgeVariant =
  | 'violet'
  | 'cyan'
  | 'indigo'
  | 'green'
  | 'ghost'
  | 'orange'
  | 'pink'
  | 'yellow'
  | 'teal'
  | 'red';

type Tag = { label: string; v: BadgeVariant };
type ProjectMetric = { value: string; label: string; color: string };
type Cert = {
  org: string;
  title: string;
  level: string;
  year: string;
  description: string;
  tags: Tag[];
  accentColor: string;
  verified: boolean;
  verifyText: string;
  iconName: 'code-2' | 'globe' | 'award';
};

type Project = {
  id: number;
  number: string;
  file: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  metrics: ProjectMetric[];
  tags: Tag[];
  github: string;
  accentColor: string;
  mockup: 'invoice' | 'erp' | 'web';
  iconName: 'file-text' | 'shopping-cart' | 'globe';
  /** Dominio mostrado en la barra del mockup del navegador */
  previewDomain: string;
};

type ContactItem = {
  label: string;
  value: string;
  href: string;
  sub: string;
  gradient: string;
  glow: string;
  border: string;
  iconName: 'mail' | 'phone' | 'map-pin';
};

type Responsibility = { title: string; desc: string };

type ExperienceJob = {
  role: string;
  company: string;
  period: string;
  location: string;
  intro?: string;
  responsibilities: Responsibility[];
  tech: string[];
};

type Skill = {
  iconName:
    | 'file-code'
    | 'code-2'
    | 'layout-grid'
    | 'database'
    | 'server'
    | 'file-text'
    | 'git-branch'
    | 'layers';
  label: string;
  sublabel: string;
  level: number;
  iconBg: string;
  bar: string;
  glowColor: 'violet' | 'cyan' | 'indigo' | 'emerald';
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  activeProjectId = 0;

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  readonly profile = {
    name: 'Juan Pablo Huerta',
    role: 'Full Stack Developer',
    email: 'teckuro6@gmail.com',
    phone: '+56 9 8218 5216',
    location: 'Viña del Mar, Chile',
    cvPdf: 'assets/JuanPabloHuerta-CV.pdf',
    githubUrl: 'https://github.com/teckuro',
    linkedinUrl: 'https://www.linkedin.com/in/jphuertal/',
    portfolioUrl: 'https://angular-portafolio-phi.vercel.app/',
    whatsappUrl: 'https://wa.me/56982185216',
    tagline:
      'Desarrollador Full Stack con 4 años en soluciones escalables (PHP, Laravel, JavaScript, Angular). Integraciones críticas: SII, Transbank y ERP (contabilidad, remuneraciones, inventario). Liderazgo técnico 8 meses, QA y documentación.'
  };
  readonly roleTags = [
    'Analista Programador Computacional',
    'PHP · Laravel · Angular',
    'SII · Transbank · ERP',
    'PostgreSQL · GraphQL'
  ];

  readonly metrics = [
    { value: '4+', label: 'Años experiencia' },
    { value: '10+', label: 'Proyectos' },
    { value: 'ERP', label: 'Contab. · RRHH · Inventario' },
    { value: 'SII', label: 'Transbank · Pagos' }
  ];

  readonly skills: Skill[] = [
    {
      iconName: 'file-code',
      label: 'PHP / Laravel',
      sublabel: 'Backend · MVC · Eloquent',
      level: 88,
      iconBg: 'bg-violet-500/10 border-violet-500/20 text-violet-400',
      bar: 'bg-gradient-to-r from-violet-500 to-purple-400',
      glowColor: 'violet'
    },
    {
      iconName: 'code-2',
      label: 'JavaScript / TypeScript',
      sublabel: 'ES6+ · DOM · Async',
      level: 82,
      iconBg: 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400',
      bar: 'bg-gradient-to-r from-yellow-400 to-amber-400',
      glowColor: 'indigo'
    },
    {
      iconName: 'layout-grid',
      label: 'Angular / React',
      sublabel: 'SPA · Components · Hooks',
      level: 78,
      iconBg: 'bg-cyan-400/10 border-cyan-400/20 text-cyan-400',
      bar: 'bg-gradient-to-r from-cyan-400 to-blue-400',
      glowColor: 'cyan'
    },
    {
      iconName: 'server',
      label: 'Node.js / Django',
      sublabel: 'APIs · Backend complementario',
      level: 72,
      iconBg: 'bg-orange-400/10 border-orange-400/20 text-orange-400',
      bar: 'bg-gradient-to-r from-orange-400 to-red-400',
      glowColor: 'indigo'
    },
    {
      iconName: 'database',
      label: 'PostgreSQL',
      sublabel: 'JSONB · PL/pgSQL · CTE',
      level: 75,
      iconBg: 'bg-blue-400/10 border-blue-400/20 text-blue-400',
      bar: 'bg-gradient-to-r from-blue-400 to-indigo-400',
      glowColor: 'indigo'
    },
    {
      iconName: 'server',
      label: 'APIs REST',
      sublabel: 'HTTP · JSON · Auth · Postman',
      level: 87,
      iconBg: 'bg-emerald-400/10 border-emerald-400/20 text-emerald-400',
      bar: 'bg-gradient-to-r from-emerald-400 to-teal-400',
      glowColor: 'emerald'
    },
    {
      iconName: 'file-text',
      label: 'SII / DTE / Transbank',
      sublabel: 'Tributario · Pagos · Integraciones',
      level: 83,
      iconBg: 'bg-red-400/10 border-red-400/20 text-red-400',
      bar: 'bg-gradient-to-r from-red-400 to-rose-400',
      glowColor: 'indigo'
    },
    {
      iconName: 'git-branch',
      label: 'Git / Control de Versiones',
      sublabel: 'GitHub · Branching · PR',
      level: 80,
      iconBg: 'bg-pink-400/10 border-pink-400/20 text-pink-400',
      bar: 'bg-gradient-to-r from-pink-400 to-fuchsia-400',
      glowColor: 'violet'
    },
    {
      iconName: 'layers',
      label: 'GraphQL · APIs',
      sublabel: 'Consultas eficientes · Integración de datos',
      level: 78,
      iconBg: 'bg-fuchsia-400/10 border-fuchsia-400/20 text-fuchsia-400',
      bar: 'bg-gradient-to-r from-fuchsia-500 to-pink-400',
      glowColor: 'violet'
    }
  ];

  readonly projects: Project[] = [
    {
      id: 0,
      number: '01',
      file: 'facturacion-cl.ts',
      title: 'Plataforma facturacion.cl · Facturación electrónica',
      category: 'PHP · JavaScript · PostgreSQL · SII · Transbank',
      problem:
        'Automatizar emisión y cumplimiento tributario con integraciones confiables al SII y cobros en línea, sin sacrificar rendimiento ni trazabilidad.',
      solution:
        'Evolución de la plataforma con PHP y JavaScript; integración SII para documentos electrónicos; pasarelas como Transbank para pagos. PostgreSQL con vistas y funciones para reglas de negocio y reportería auditable.',
      metrics: [
        { value: 'SII', label: 'Integración tributaria', color: '#06B6D4' },
        { value: 'TBK', label: 'Transbank / pagos', color: '#10B981' },
        { value: 'Prod', label: 'Alta disponibilidad', color: '#F8FAFC' }
      ],
      tags: [
        { label: 'PHP', v: 'violet' },
        { label: 'JavaScript', v: 'yellow' },
        { label: 'PostgreSQL', v: 'indigo' },
        { label: 'SII', v: 'teal' },
        { label: 'Transbank', v: 'green' }
      ],
      github: 'https://github.com/teckuro',
      accentColor: '#06B6D4',
      mockup: 'invoice',
      iconName: 'file-text',
      previewDomain: 'facturacion.cl'
    },
    {
      id: 1,
      number: '02',
      file: 'erp-modulos.ts',
      title: 'ERP institucional · Contabilidad, remuneraciones e inventario',
      category: 'PHP · JavaScript · Módulos integrados',
      problem:
        'Un ERP único debe coordinar contabilidad, remuneraciones e inventario sin duplicar datos ni romper cierres contables ni stock.',
      solution:
        'Desarrollo y optimización de módulos integrados en el ERP institucional con PHP y JavaScript, flujos consistentes entre áreas y datos centralizados en PostgreSQL.',
      metrics: [
        { value: '3', label: 'Módulos críticos', color: '#06B6D4' },
        { value: 'ERP', label: 'Arquitectura unificada', color: '#10B981' },
        { value: 'QA', label: 'Calidad de entregas', color: '#F8FAFC' }
      ],
      tags: [
        { label: 'PHP', v: 'violet' },
        { label: 'JavaScript', v: 'yellow' },
        { label: 'ERP', v: 'indigo' },
        { label: 'PostgreSQL', v: 'orange' },
        { label: 'QA', v: 'cyan' }
      ],
      github: 'https://github.com/teckuro',
      accentColor: '#10B981',
      mockup: 'erp',
      iconName: 'shopping-cart',
      previewDomain: 'portal.autoatencion.cl'
    },
    {
      id: 2,
      number: '03',
      file: 'portal-graphql.ts',
      title: 'Portal de autoatención · APIs y GraphQL',
      category: 'Laravel · GraphQL · UX',
      problem:
        'Usuarios finales necesitaban un portal ágil, menos fricción y consultas de datos eficientes entre sistemas y el canal de autoatención.',
      solution:
        'Automatización con Laravel, integración de APIs internas y capa GraphQL para optimizar consultas; mejora continua de UX en el portal, con despliegue y prácticas en Docker y AWS.',
      metrics: [
        { value: 'GraphQL', label: 'Consultas eficientes', color: '#06B6D4' },
        { value: 'Portal', label: 'Autoatención', color: '#10B981' },
        { value: 'UX', label: 'Canal optimizado', color: '#F8FAFC' }
      ],
      tags: [
        { label: 'Laravel', v: 'violet' },
        { label: 'GraphQL', v: 'pink' },
        { label: 'APIs', v: 'green' },
        { label: 'Docker', v: 'cyan' },
        { label: 'AWS', v: 'orange' }
      ],
      github: 'https://github.com/teckuro',
      accentColor: '#8B5CF6',
      mockup: 'web',
      iconName: 'globe',
      previewDomain: 'app.empresa.cl'
    }
  ];

  get activeProject(): Project {
    return this.projects[this.activeProjectId] ?? this.projects[0];
  }

  setActiveProject(projectId: number): void {
    this.activeProjectId = projectId;
  }

  prevProject(): void {
    this.activeProjectId = Math.max(0, this.activeProjectId - 1);
  }

  nextProject(): void {
    this.activeProjectId = Math.min(this.projects.length - 1, this.activeProjectId + 1);
  }

  readonly experienceJobs: ExperienceJob[] = [
    {
      role: 'Desarrollador Full Stack / Líder de Equipo',
      company: 'Desis Limitada',
      period: 'ago. 2021 – ago. 2025',
      location: 'Chile',
      intro:
        'Desarrollo de productos escalables, módulos ERP institucionales e integraciones críticas (SII, Transbank), con foco en calidad, documentación y liderazgo técnico.',
      responsibilities: [
        {
          title: 'Liderazgo técnico',
          desc: 'Liderazgo y apoyo a un equipo de desarrollo durante 8 meses, supervisando calidad de entregas y resolución de problemas técnicos complejos.'
        },
        {
          title: 'Desarrollo de ERP',
          desc: 'Desarrollo y optimización de módulos de contabilidad, remuneraciones e inventario integrados en el ERP institucional con PHP y JavaScript.'
        },
        {
          title: 'Integraciones estratégicas',
          desc: 'Implementación de integraciones con el SII y pasarelas de pago como Transbank para automatización de procesos.'
        },
        {
          title: 'Optimización de datos',
          desc: 'Diseño y ejecución de estructuras avanzadas en PostgreSQL: vistas y funciones personalizadas para la gestión de la información.'
        },
        {
          title: 'Mantenimiento y QA',
          desc: 'Documentación técnica y mantenimiento proactivo para operatividad y seguridad del sistema.'
        }
      ],
      tech: [
        'PHP',
        'Laravel',
        'JavaScript',
        'Angular',
        'React',
        'PostgreSQL',
        'GraphQL',
        'SII',
        'Transbank',
        'Git',
        'Docker',
        'AWS'
      ]
    },
    {
      role: 'Programador Junior',
      company: 'Anida Latam',
      period: 'ene. 2021 – ago. 2021',
      location: 'Chile',
      intro:
        'Automatización, GraphQL y portal de autoatención en un entorno de integración de APIs.',
      responsibilities: [
        {
          title: 'Automatización con Laravel',
          desc: 'Procesos automatizados que incrementaron la eficiencia operativa y redujeron tareas manuales.'
        },
        {
          title: 'Gestión con GraphQL',
          desc: 'Optimización del rendimiento mediante GraphQL para consultas de datos más eficientes.'
        },
        {
          title: 'Integración de APIs',
          desc: 'Integración de APIs internas para mejorar comunicación entre sistemas y el portal de autoatención.'
        },
        {
          title: 'Mejora de UX',
          desc: 'Participación en el desarrollo y mejora continua del portal para una interacción más fluida con los clientes.'
        }
      ],
      tech: ['Laravel', 'PHP', 'GraphQL', 'JavaScript', 'Git']
    }
  ];

  readonly contactItems: ContactItem[] = [
    {
      label: 'Email',
      value: 'teckuro6@gmail.com',
      href: 'mailto:teckuro6@gmail.com',
      sub: 'Respondo en menos de 24h',
      gradient: 'from-violet-600 to-indigo-500',
      glow: 'shadow-violet-500/20 hover:shadow-violet-500/35',
      border: 'hover:border-violet-500/25',
      iconName: 'mail'
    },
    {
      label: 'Teléfono',
      value: '+56 9 8218 5216',
      href: 'tel:+56982185216',
      sub: 'Disponible en horario laboral',
      gradient: 'from-cyan-500 to-blue-500',
      glow: 'shadow-cyan-500/20 hover:shadow-cyan-500/35',
      border: 'hover:border-cyan-500/25',
      iconName: 'phone'
    },
    {
      label: 'Ubicación',
      value: 'Viña del Mar, Chile',
      href: '#inicio',
      sub: 'Remoto · Híbrido · Presencial',
      gradient: 'from-emerald-500 to-teal-500',
      glow: 'shadow-emerald-500/20 hover:shadow-emerald-500/35',
      border: 'hover:border-emerald-500/25',
      iconName: 'map-pin'
    }
  ];

  readonly whatIOffer = [
    'Full stack PHP, Laravel, JavaScript, Angular y React',
    'Integraciones SII, Transbank y APIs críticas',
    'Módulos ERP: contabilidad, remuneraciones e inventario',
    'PostgreSQL avanzado, GraphQL y optimización de consultas',
    'Liderazgo técnico, QA y documentación para equipos',
    'Docker, AWS y buenas prácticas de despliegue'
  ];

  readonly highlights = [
    '8 meses de liderazgo técnico y calidad de entregas',
    'ERP: contabilidad, remuneraciones e inventario (PHP/JS)',
    'SII y Transbank para automatización de procesos',
    'PostgreSQL: vistas, funciones y tipos complejos',
    'QA, documentación técnica y análisis de requisitos',
    'Portal de autoatención, Laravel y GraphQL (Anida)'
  ];

  readonly keywordTags: { label: string; v: BadgeVariant }[] = [
    { label: 'PHP', v: 'violet' },
    { label: 'Laravel', v: 'violet' },
    { label: 'JavaScript', v: 'yellow' },
    { label: 'TypeScript', v: 'cyan' },
    { label: 'Angular', v: 'red' },
    { label: 'React', v: 'cyan' },
    { label: 'Node.js', v: 'green' },
    { label: 'Django', v: 'green' },
    { label: 'Tailwind', v: 'teal' },
    { label: 'Bootstrap', v: 'indigo' },
    { label: 'PostgreSQL', v: 'indigo' },
    { label: 'GraphQL', v: 'pink' },
    { label: 'SII', v: 'teal' },
    { label: 'Transbank', v: 'orange' },
    { label: 'ERP', v: 'ghost' },
    { label: 'QA', v: 'yellow' },
    { label: 'Docker', v: 'ghost' },
    { label: 'AWS', v: 'orange' }
  ];

  readonly tools = [
    'VS Code', 'Cursor', 'Postman', 'Git', 'GitHub', 'Docker', 'AWS', 'pgAdmin', 'Composer', 'NPM/Yarn',
    'Jira', 'Linux'
  ];

  readonly competencies = [
    'QA y calidad de código',
    'Documentación técnica',
    'Liderazgo de equipos técnicos',
    'Análisis de requisitos',
    'Comunicación con stakeholders',
    'Pensamiento analítico',
    'Trabajo en equipo',
    'Orientación a resultados'
  ];

  readonly certifications: Cert[] = [
    {
      org: 'Cisco Networking Academy',
      title: 'JavaScript Essentials 1',
      level: 'Certificación oficial',
      year: '2024',
      description:
        'Fundamentos de JavaScript: variables, funciones, DOM, programación orientada a objetos y manejo de errores en entornos reales.',
      tags: [
        { label: 'JavaScript', v: 'yellow' },
        { label: 'DOM', v: 'cyan' },
        { label: 'OOP', v: 'violet' }
      ],
      accentColor: '#06B6D4',
      verified: true,
      verifyText: 'Cisco Verified',
      iconName: 'code-2'
    },
    {
      org: 'ETS · TOEIC',
      title: 'Inglés — nivel intermedio',
      level: 'Certificación TOEIC',
      year: 'Vigente',
      description:
        'Inglés intermedio certificado; español nativo. Lectura de documentación técnica y comunicación en equipos.',
      tags: [
        { label: 'Inglés intermedio', v: 'green' },
        { label: 'Español nativo', v: 'teal' },
        { label: 'TOEIC', v: 'ghost' }
      ],
      accentColor: '#10B981',
      verified: true,
      verifyText: 'Certificación',
      iconName: 'globe'
    },
    {
      org: 'Práctica profesional',
      title: 'Liderazgo · QA · Documentación',
      level: 'Competencias de gestión',
      year: 'Desis Limitada',
      description:
        'Liderazgo técnico durante 8 meses, procesos de QA, documentación técnica detallada y análisis de requisitos con el negocio.',
      tags: [
        { label: 'Liderazgo', v: 'violet' },
        { label: 'QA', v: 'orange' },
        { label: 'Docs', v: 'indigo' }
      ],
      accentColor: '#8B5CF6',
      verified: false,
      verifyText: '',
      iconName: 'award'
    }
  ];
}
