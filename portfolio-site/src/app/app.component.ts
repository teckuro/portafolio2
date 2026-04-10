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
    linkedinUrl: 'https://www.linkedin.com/in/jphuerta1/',
    portfolioUrl: 'https://angular-portafolio-phi.vercel.app/',
    whatsappUrl: 'https://wa.me/56982185216',
    tagline:
      'Desarrollador Full Stack con trayectoria en facturación electrónica (facturacion.cl), integraciones complejas y productos con foco en UX y código mantenible.'
  };
  readonly roleTags = [
    'Full Stack Developer',
    'PHP · Laravel',
    'Angular · React',
    'PostgreSQL · GraphQL'
  ];

  readonly metrics = [
    { value: '4+', label: 'Años experiencia' },
    { value: '10+', label: 'Proyectos' },
    { value: 'SII', label: 'Facturación electrónica' },
    { value: 'GraphQL', label: 'APIs optimizadas' }
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
      iconName: 'database',
      label: 'MySQL',
      sublabel: 'Queries · Índices · Normalización',
      level: 85,
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
      label: 'XML / DTE / SII',
      sublabel: 'Documentos Electrónicos · Normativa',
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
      category: 'PHP · JavaScript · PostgreSQL · SII',
      problem:
        'Necesidad de evolucionar la plataforma web de facturación con mejor UX, integraciones externas y datos tributarios consistentes sin degradar la operación en producción.',
      solution:
        'Desarrollo y optimización continua con PHP y JavaScript; integración de APIs externas; modelado en PostgreSQL (vistas, funciones, tipos) para reportería y cumplimiento. PostgreSQL aporta integridad transaccional y consultas complejas frente a cargas variables de documentos.',
      metrics: [
        { value: 'Prod', label: 'facturacion.cl', color: '#06B6D4' },
        { value: 'APIs', label: 'Integraciones externas', color: '#10B981' },
        { value: 'SII', label: 'Dominio tributario', color: '#F8FAFC' }
      ],
      tags: [
        { label: 'PHP', v: 'violet' },
        { label: 'JavaScript', v: 'yellow' },
        { label: 'PostgreSQL', v: 'indigo' },
        { label: 'APIs REST', v: 'green' },
        { label: 'SII / DTE', v: 'teal' }
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
      file: 'portal-laravel.ts',
      title: 'Portal de autoatención y automatización',
      category: 'Laravel · Integraciones internas',
      problem:
        'Procesos operativos repetitivos y comunicación fragmentada entre sistemas internos, con fricción para los usuarios finales en el canal digital.',
      solution:
        'Automatización con Laravel para reducir tareas manuales; mejora del portal de autoatención para una interacción más fluida; integración de APIs internas para unificar datos entre módulos.',
      metrics: [
        { value: '-35%', label: 'Carga operativa manual', color: '#06B6D4' },
        { value: 'UX', label: 'Canal digital unificado', color: '#10B981' },
        { value: 'APIs', label: 'Sistemas conectados', color: '#F8FAFC' }
      ],
      tags: [
        { label: 'Laravel', v: 'violet' },
        { label: 'PHP', v: 'orange' },
        { label: 'APIs internas', v: 'green' },
        { label: 'Autoatención', v: 'cyan' }
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
      file: 'graphql-capas.ts',
      title: 'Rendimiento y capa de datos (GraphQL)',
      category: 'GraphQL · Escalabilidad',
      problem:
        'Consultas y acoplamientos que dificultaban optimizar el rendimiento y la escalabilidad frente al crecimiento de datos y clientes concurrentes.',
      solution:
        'Implementación de GraphQL para gestionar consultas de forma más eficiente y predecible, alineada con estrategias de optimización de aplicaciones y despliegues en entornos cloud (AWS).',
      metrics: [
        { value: 'GraphQL', label: 'Capa de consultas', color: '#06B6D4' },
        { value: 'AWS', label: 'Infra cloud', color: '#10B981' },
        { value: 'Perf', label: 'Enfoque medible', color: '#F8FAFC' }
      ],
      tags: [
        { label: 'GraphQL', v: 'pink' },
        { label: 'AWS', v: 'orange' },
        { label: 'Docker', v: 'cyan' },
        { label: 'PostgreSQL', v: 'indigo' },
        { label: 'Angular', v: 'red' }
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
      role: 'Desarrollador Full Stack',
      company: 'Desis Limitada',
      period: 'ago. 2021 – ago. 2025',
      location: 'Chile',
      intro:
        'Producto digital de facturación electrónica y servicios web de alto tráfico; stack PHP, JavaScript, PostgreSQL, integraciones y optimización de rendimiento.',
      responsibilities: [
        {
          title: 'Plataforma facturacion.cl',
          desc: 'Desarrollo y optimización con PHP y JavaScript para mejorar UX y funcionalidad del sitio.'
        },
        {
          title: 'APIs e integraciones',
          desc: 'Integración de APIs externas e internas para automatizar procesos y mejorar la interoperabilidad entre sistemas.'
        },
        {
          title: 'Servicios web (Java / C#)',
          desc: 'Mantenimiento y actualización de servicios legacy en Java y C# para operatividad y estabilidad.'
        },
        {
          title: 'PostgreSQL en profundidad',
          desc: 'Diseño de estructuras, vistas, funciones y tipos de datos para soportar la gestión de la información.'
        },
        {
          title: 'Laravel y automatización',
          desc: 'Automatización de procesos operativos para reducir carga manual y errores.'
        },
        {
          title: 'Portal de autoatención',
          desc: 'Evolución y mejora continua del canal digital para usuarios finales.'
        },
        {
          title: 'GraphQL y rendimiento',
          desc: 'Optimización de consultas y aplicaciones con GraphQL para una gestión más eficiente de datos.'
        },
        {
          title: 'Arquitectura y soluciones a medida',
          desc: 'Análisis y diseño técnico orientado a necesidades de negocio, escalabilidad y sostenibilidad.'
        }
      ],
      tech: [
        'PHP',
        'Laravel',
        'JavaScript',
        'PostgreSQL',
        'GraphQL',
        'Java',
        'C#',
        'Angular',
        'React'
      ]
    },
    {
      role: 'Programador Junior',
      company: 'Anida Latam',
      period: 'ene. 2021 – ago. 2021',
      location: 'Chile',
      intro:
        'Primera experiencia en desarrollo de software en entorno profesional, bases de buenas prácticas y trabajo en equipo.',
      responsibilities: [
        {
          title: 'Desarrollo asistido',
          desc: 'Tareas de desarrollo y aprendizaje en proyectos de software bajo supervisión.'
        }
      ],
      tech: ['JavaScript', 'PHP', 'Git']
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
    'Desarrollo full stack PHP, Laravel, Angular y React',
    'Plataformas de facturación electrónica e integración SII',
    'APIs REST y GraphQL; integraciones internas y externas',
    'PostgreSQL: modelado, vistas y optimización de consultas',
    'Automatización de procesos y portales de autoatención',
    'Docker, AWS y buenas prácticas de despliegue'
  ];

  readonly highlights = [
    'Análisis de requerimientos con stakeholders',
    'Implementación backend Laravel + frontend Angular/React',
    'Integraciones REST y servicios externos (SII/pagos)',
    'Optimización SQL en MySQL y PostgreSQL',
    'Participación en Scrum/Kanban con Jira y GitFlow',
    'Soporte productivo, refactoring y documentación técnica'
  ];

  readonly keywordTags: { label: string; v: BadgeVariant }[] = [
    { label: 'PHP', v: 'violet' },
    { label: 'Laravel', v: 'violet' },
    { label: 'JavaScript', v: 'yellow' },
    { label: 'Angular', v: 'red' },
    { label: 'React', v: 'cyan' },
    { label: 'Tailwind CSS', v: 'teal' },
    { label: 'PostgreSQL', v: 'indigo' },
    { label: 'GraphQL', v: 'pink' },
    { label: 'APIs REST', v: 'green' },
    { label: 'SII / DTE', v: 'teal' },
    { label: 'Docker', v: 'ghost' },
    { label: 'AWS', v: 'orange' }
  ];

  readonly tools = [
    'VS Code', 'Cursor', 'Postman', 'GitHub', 'Docker', 'AWS', 'pgAdmin', 'Composer', 'NPM/Yarn',
    'Jira', 'Linux', 'XAMPP'
  ];

  readonly competencies = [
    'Análisis de Requerimientos',
    'Pensamiento Analítico',
    'Trabajo en Equipo',
    'Comunicación Efectiva',
    'Orientación a Resultados',
    'Aprendizaje Continuo',
    'Gestión del Tiempo',
    'Resolución de Problemas'
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
      org: 'Comunicación',
      title: 'Inglés y español',
      level: 'Comunicación profesional',
      year: 'Actual',
      description:
        'Español nativo; inglés para documentación técnica, equipos y entornos de desarrollo internacional.',
      tags: [
        { label: 'Español', v: 'green' },
        { label: 'Inglés', v: 'teal' },
        { label: 'Tech', v: 'ghost' }
      ],
      accentColor: '#10B981',
      verified: false,
      verifyText: '',
      iconName: 'globe'
    },
    {
      org: 'Formación Continua',
      title: 'Laravel Avanzado · React · DevOps',
      level: 'Actualización técnica constante',
      year: 'En progreso',
      description:
        'Microservicios, patrones de diseño, testing automatizado, CI/CD y buenas prácticas DevOps aplicadas al desarrollo web moderno.',
      tags: [
        { label: 'Laravel', v: 'violet' },
        { label: 'Testing', v: 'orange' },
        { label: 'CI/CD', v: 'indigo' }
      ],
      accentColor: '#8B5CF6',
      verified: false,
      verifyText: '',
      iconName: 'award'
    }
  ];
}
