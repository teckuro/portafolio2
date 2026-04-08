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

type Project = {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  tags: Tag[];
  impacts: string[];
  topGradient: string;
  iconGradient: string;
  shadow: string;
  borderAccent: string;
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
      number: '01',
      title: 'Sistema de Facturación Electrónica',
      subtitle: 'SII Chile · DTE · Normativa Tributaria',
      description:
        'Plataforma para emisión, validación y gestión de Documentos Tributarios Electrónicos (DTE) bajo normativa del SII. Firma digital, envío automatizado y trazabilidad completa de documentos.',
      tags: [
        { label: 'PHP', v: 'violet' },
        { label: 'XML / DTE', v: 'red' },
        { label: 'MySQL', v: 'orange' },
        { label: 'APIs REST', v: 'green' },
        { label: 'SII', v: 'teal' }
      ],
      impacts: [
        'Cumplimiento 100% normativa SII',
        'Automatización completa de emisión de DTE',
        'Reducción de errores operativos en facturación'
      ],
      topGradient: 'from-violet-600 via-indigo-500 to-blue-500',
      iconGradient: 'from-violet-600 to-indigo-500',
      shadow: 'hover:shadow-violet-500/10',
      borderAccent: 'group-hover:border-violet-500/25',
      iconName: 'file-text'
    },
    {
      number: '02',
      title: 'Sistema ERP Empresarial',
      subtitle: 'Gestión Integral · Módulos de Negocio',
      description:
        'Desarrollo de módulos para gestión interna: ventas, inventario, compras y administración bajo una arquitectura escalable con enfoque en eficiencia operativa y reportería.',
      tags: [
        { label: 'Laravel', v: 'violet' },
        { label: 'JavaScript', v: 'yellow' },
        { label: 'MySQL', v: 'orange' },
        { label: 'ERP', v: 'indigo' },
        { label: 'Agile', v: 'cyan' }
      ],
      impacts: [
        'Optimización de procesos internos críticos',
        'Mejor rendimiento y tiempo de respuesta',
        'Soporte a operaciones de alto volumen'
      ],
      topGradient: 'from-cyan-500 via-blue-500 to-indigo-500',
      iconGradient: 'from-cyan-500 to-blue-500',
      shadow: 'hover:shadow-cyan-500/10',
      borderAccent: 'group-hover:border-cyan-500/25',
      iconName: 'shopping-cart'
    },
    {
      number: '03',
      title: 'Aplicaciones Web a Medida',
      subtitle: 'Full Stack · Soluciones Personalizadas',
      description:
        'Implementación de plataformas web según requerimientos específicos del cliente, desde el levantamiento funcional hasta el despliegue. Enfoque en UX, rendimiento y escalabilidad.',
      tags: [
        { label: 'React', v: 'cyan' },
        { label: 'Angular', v: 'red' },
        { label: 'PostgreSQL', v: 'indigo' },
        { label: 'PHP', v: 'violet' },
        { label: 'REST', v: 'green' }
      ],
      impacts: [
        'Digitalización de procesos clave de negocio',
        'Mejora en experiencia y conversión de usuarios',
        'Integración con servicios y APIs externas'
      ],
      topGradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      iconGradient: 'from-emerald-500 to-teal-500',
      shadow: 'hover:shadow-emerald-500/10',
      borderAccent: 'group-hover:border-emerald-500/25',
      iconName: 'globe'
    }
  ];

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
}
