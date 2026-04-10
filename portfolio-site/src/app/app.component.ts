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
    tagline:
      'Desarrollador con experiencia en sistemas empresariales críticos: ERP, facturación electrónica SII y plataformas web a medida.'
  };
  readonly roleTags = [
    'Full Stack Developer',
    'PHP · Laravel',
    'Angular · React',
    'MySQL · PostgreSQL'
  ];

  readonly metrics = [
    { value: '3+', label: 'Años experiencia' },
    { value: '10+', label: 'Proyectos' },
    { value: 'SII', label: 'Especialista DTE' },
    { value: 'ERP', label: 'Sistemas empresariales' }
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
      label: 'Agile · Scrum · Kanban',
      sublabel: 'Jira · Sprints · Retrospectivas',
      level: 76,
      iconBg: 'bg-teal-400/10 border-teal-400/20 text-teal-400',
      bar: 'bg-gradient-to-r from-teal-400 to-cyan-400',
      glowColor: 'cyan'
    }
  ];

  readonly projects: Project[] = [
    {
      id: 0,
      number: '01',
      file: 'facturacion-sii.ts',
      title: 'Sistema de Facturación Electrónica SII',
      category: 'DTE · XML · Tributario',
      problem:
        'Las empresas generaban documentos tributarios manualmente, causando rechazos del SII, errores de validación y demoras críticas en el flujo de ventas.',
      solution:
        'Plataforma para emisión, firma digital y envío automatizado de DTE. Integra ciclo completo con el SII vía APIs XML y normativa tributaria chilena vigente.',
      metrics: [
        { value: '-40%', label: 'Tiempo de procesamiento', color: '#06B6D4' },
        { value: '0%', label: 'Tasa de rechazo SII', color: '#10B981' },
        { value: '+95%', label: 'Documentos automatizados', color: '#F8FAFC' }
      ],
      tags: [
        { label: 'PHP', v: 'violet' },
        { label: 'XML / DTE', v: 'red' },
        { label: 'MySQL', v: 'orange' },
        { label: 'APIs REST', v: 'green' },
        { label: 'SII', v: 'teal' }
      ],
      github: 'https://github.com',
      accentColor: '#06B6D4',
      mockup: 'invoice',
      iconName: 'file-text'
    },
    {
      id: 1,
      number: '02',
      file: 'erp-modular.ts',
      title: 'ERP Empresarial Modular',
      category: 'Gestión · Módulos · Multi-área',
      problem:
        'La empresa operaba con sistemas aislados para ventas, inventario y administración, generando duplicidad de datos, inconsistencias y pérdida de tiempo en reportería.',
      solution:
        'Módulos ERP integrados bajo arquitectura Laravel/MySQL con dashboard unificado, control de inventario en tiempo real y reportería ejecutiva automatizada.',
      metrics: [
        { value: '-35%', label: 'Tiempo en reportería', color: '#06B6D4' },
        { value: '+28%', label: 'Precisión de inventario', color: '#10B981' },
        { value: '6', label: 'Módulos en producción', color: '#F8FAFC' }
      ],
      tags: [
        { label: 'Laravel', v: 'violet' },
        { label: 'JavaScript', v: 'yellow' },
        { label: 'MySQL', v: 'orange' },
        { label: 'ERP', v: 'indigo' },
        { label: 'Agile', v: 'cyan' }
      ],
      github: 'https://github.com',
      accentColor: '#10B981',
      mockup: 'erp',
      iconName: 'shopping-cart'
    },
    {
      id: 2,
      number: '03',
      file: 'web-platforms.ts',
      title: 'Plataformas Web a Medida',
      category: 'Full Stack · B2B · Personalizado',
      problem:
        'Clientes con procesos críticos manuales: alta dependencia de hojas de cálculo y comunicación por email para tareas operativas.',
      solution:
        'Aplicaciones web full stack con Angular/React y PHP/PostgreSQL, desde el levantamiento de requerimientos hasta el despliegue en producción.',
      metrics: [
        { value: '8+', label: 'Procesos digitalizados', color: '#06B6D4' },
        { value: '-50%', label: 'Tiempo operativo reducido', color: '#10B981' },
        { value: '100%', label: 'Satisfacción del cliente', color: '#F8FAFC' }
      ],
      tags: [
        { label: 'React', v: 'cyan' },
        { label: 'Angular', v: 'red' },
        { label: 'PostgreSQL', v: 'indigo' },
        { label: 'PHP', v: 'violet' },
        { label: 'REST', v: 'green' }
      ],
      github: 'https://github.com',
      accentColor: '#8B5CF6',
      mockup: 'web',
      iconName: 'globe'
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

  readonly experienceResponsibilities: Responsibility[] = [
    {
      title: 'Análisis de requerimientos',
      desc: 'Levantamiento funcional con stakeholders y traducción a soluciones técnicas.'
    },
    {
      title: 'Desarrollo Full Stack',
      desc: 'Implementación backend (PHP/Laravel) y frontend (Angular/React) end-to-end.'
    },
    {
      title: 'Integraciones y APIs',
      desc: 'Consumo e integración de APIs REST y servicios externos (SII, pasarelas de pago).'
    },
    {
      title: 'Optimización de bases de datos',
      desc: 'Mejora de consultas SQL, índices y arquitectura de datos en MySQL y PostgreSQL.'
    },
    {
      title: 'Facturación Electrónica SII',
      desc: 'Desarrollo y mantenimiento de módulos DTE con procesamiento de XML normativa chilena.'
    },
    {
      title: 'Metodologías Ágiles',
      desc: 'Participación activa en sprints Scrum y tableros Kanban con Jira y GitFlow.'
    },
    {
      title: 'Control de versiones',
      desc: 'Gestión de repositorios Git con estrategia de branching y code review.'
    },
    {
      title: 'Soporte y mejora continua',
      desc: 'Resolución de incidencias en producción, refactoring y documentación técnica.'
    }
  ];

  readonly techMain: string[] = [
    'PHP',
    'Laravel',
    'JavaScript',
    'Angular',
    'React',
    'MySQL',
    'PostgreSQL',
    'Git',
    'Jira',
    'Postman'
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
    'Análisis de requerimientos y propuesta técnica',
    'Desarrollo backend PHP/Laravel robusto',
    'Frontends Angular/React modernos',
    'Integración SII, DTE y documentos electrónicos',
    'Implementación de módulos ERP a medida',
    'Mantenimiento y optimización de sistemas'
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
    { label: 'MySQL', v: 'orange' },
    { label: 'PostgreSQL', v: 'indigo' },
    { label: 'APIs REST', v: 'green' },
    { label: 'XML / DTE', v: 'pink' },
    { label: 'SII Chile', v: 'teal' },
    { label: 'ERP', v: 'ghost' },
    { label: 'Agile / Scrum', v: 'ghost' }
  ];

  readonly tools = [
    'VS Code', 'Postman', 'MySQL Workbench', 'pgAdmin', 'Composer', 'NPM/Yarn',
    'Docker (básico)', 'Linux', 'XAMPP', 'Jira', 'Confluence', 'Notion'
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
      title: 'JavaScript Essentials',
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
      org: 'ETS TOEIC',
      title: 'TOEIC - Test of English for International Communication',
      level: 'Nivel B1+ - Comunicación profesional',
      year: 'Vigente',
      description:
        'Certificación internacional de inglés para contextos profesionales, enfocada en comunicación con equipos globales y entornos TI.',
      tags: [
        { label: 'English B1+', v: 'green' },
        { label: 'Business', v: 'teal' },
        { label: 'Tech Comm.', v: 'ghost' }
      ],
      accentColor: '#10B981',
      verified: true,
      verifyText: 'ETS Verified',
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
