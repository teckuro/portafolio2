import { AfterViewInit, Component, OnDestroy } from '@angular/core';

type BadgeVariant = 'default' | 'green' | 'soft' | 'ghost';

type Tag = { label: string; v: BadgeVariant };
type ProjectMetric = { value: string; label: string };
type Cert = {
  org: string;
  title: string;
  level: string;
  year: string;
  description: string;
  verified: boolean;
  verifyText: string;
};

type Project = {
  id: number;
  number: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  metrics: ProjectMetric[];
  tags: Tag[];
  github: string;
  previewDomain: string;
};

type ContactItem = {
  label: string;
  value: string;
  href: string;
  sub: string;
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
  label: string;
  sublabel: string;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  readonly featuredProjectId = 3;
  private revealObserver?: IntersectionObserver;

  ngAfterViewInit(): void {
    this.initRevealObserver();
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
  }

  private initRevealObserver(): void {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nodes = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));

    if (reducedMotion) {
      nodes.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.revealObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    nodes.forEach((el) => this.revealObserver?.observe(el));
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  skillIndex(i: number): string {
    return String(i + 1).padStart(2, '0');
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
    portfolioUrl: 'https://portafolio2-beige.vercel.app/',
    whatsappUrl: 'https://wa.me/56982185216',
    tagline:
      'Desarrollo y mantengo sistemas productivos (PHP 7/vanilla, Laravel, Angular) para empresas: facturación electrónica SII, módulos ERP y pagos con Transbank/Webpay. Me muevo cómodo entre soporte real, mejoras evolutivas, integraciones (SOAP/REST/XML/YAML/GraphQL) y SQL en PostgreSQL/MySQL.'
  };

  readonly focusAreas = [
    'SII · DTE',
    'Transbank / Webpay',
    'ERP remuneraciones',
    'Laravel · Angular'
  ];

  readonly skills: Skill[] = [
    { label: 'PHP / Laravel', sublabel: 'Backend · MVC · Eloquent' },
    { label: 'JavaScript / TypeScript', sublabel: 'ES6+ · DOM · Async' },
    { label: 'Angular / React', sublabel: 'SPA · Components · Hooks' },
    { label: 'Node.js / Django', sublabel: 'APIs · Backend complementario' },
    { label: 'PostgreSQL', sublabel: 'JSONB · PL/pgSQL · CTE' },
    { label: 'APIs REST', sublabel: 'HTTP · JSON · Auth · Postman' },
    { label: 'SII / DTE / Transbank', sublabel: 'Tributario · Pagos · Integraciones' },
    { label: 'Git / Control de Versiones', sublabel: 'GitHub · Branching · PR' },
    { label: 'GraphQL · APIs', sublabel: 'Consultas eficientes · Integración de datos' }
  ];

  readonly projects: Project[] = [
    {
      id: 0,
      number: '01',
      title: 'Plataforma facturacion.cl · Facturación electrónica',
      category: 'PHP · JavaScript · PostgreSQL · SII · Transbank',
      problem:
        'Automatizar emisión y cumplimiento tributario con integraciones confiables al SII y cobros en línea, sin sacrificar rendimiento ni trazabilidad.',
      solution:
        'Evolución de la plataforma con PHP y JavaScript; integración SII para documentos electrónicos; pasarelas como Transbank para pagos. PostgreSQL con vistas y funciones para reglas de negocio y reportería auditable.',
      metrics: [
        { value: 'SII', label: 'Integración tributaria' },
        { value: 'TBK', label: 'Transbank / pagos' },
        { value: 'Prod', label: 'Alta disponibilidad' }
      ],
      tags: [
        { label: 'PHP', v: 'default' },
        { label: 'JavaScript', v: 'default' },
        { label: 'PostgreSQL', v: 'default' },
        { label: 'SII', v: 'soft' },
        { label: 'Transbank', v: 'green' }
      ],
      github: 'https://github.com/teckuro',
      previewDomain: 'facturacion.cl'
    },
    {
      id: 1,
      number: '02',
      title: 'ERP institucional · Contabilidad, remuneraciones e inventario',
      category: 'PHP · JavaScript · Módulos integrados',
      problem:
        'Un ERP único debe coordinar contabilidad, remuneraciones e inventario sin duplicar datos ni romper cierres contables ni stock.',
      solution:
        'Desarrollo y optimización de módulos integrados en el ERP institucional con PHP y JavaScript, flujos consistentes entre áreas y datos centralizados en PostgreSQL.',
      metrics: [
        { value: '3', label: 'Módulos críticos' },
        { value: 'ERP', label: 'Arquitectura unificada' },
        { value: 'QA', label: 'Calidad de entregas' }
      ],
      tags: [
        { label: 'PHP', v: 'default' },
        { label: 'JavaScript', v: 'default' },
        { label: 'ERP', v: 'soft' },
        { label: 'PostgreSQL', v: 'default' },
        { label: 'QA', v: 'default' }
      ],
      github: 'https://github.com/teckuro',
      previewDomain: 'portal.autoatencion.cl'
    },
    {
      id: 2,
      number: '03',
      title: 'Portal de autoatención · APIs y GraphQL',
      category: 'Laravel · GraphQL · UX',
      problem:
        'Usuarios finales necesitaban un portal ágil, menos fricción y consultas de datos eficientes entre sistemas y el canal de autoatención.',
      solution:
        'Automatización con Laravel, integración de APIs internas y capa GraphQL para optimizar consultas; mejora continua de UX en el portal, con despliegue y prácticas en Docker y AWS.',
      metrics: [
        { value: 'GraphQL', label: 'Consultas eficientes' },
        { value: 'Portal', label: 'Autoatención' },
        { value: 'UX', label: 'Canal optimizado' }
      ],
      tags: [
        { label: 'Laravel', v: 'default' },
        { label: 'GraphQL', v: 'soft' },
        { label: 'APIs', v: 'green' },
        { label: 'Docker', v: 'ghost' },
        { label: 'AWS', v: 'default' }
      ],
      github: 'https://github.com/teckuro',
      previewDomain: 'app.empresa.cl'
    },
    {
      id: 3,
      number: '04',
      title: 'Sistema de Remuneraciones (ERP) · Chile',
      category: 'Angular · TypeScript · Supabase · PostgreSQL',
      problem:
        'Centralizar trabajadores, contratos, previsión y salud con reglas locales, evitando errores en liquidaciones y asegurando flujos escalables.',
      solution:
        'Diseño de arquitectura frontend en Angular/TypeScript y modelo relacional en Supabase/PostgreSQL: entidades (trabajadores, contratos, previsión, salud, banca, parámetros mensuales), flujos de creación (básico/avanzado), estados y validaciones.',
      metrics: [
        { value: 'ERP', label: 'Flujos mantenibles' },
        { value: 'SQL', label: 'Modelo relacional' },
        { value: 'TS', label: 'Tipado y escalabilidad' }
      ],
      tags: [
        { label: 'Angular', v: 'default' },
        { label: 'TypeScript', v: 'default' },
        { label: 'Supabase', v: 'soft' },
        { label: 'PostgreSQL', v: 'default' },
        { label: 'Tailwind', v: 'soft' }
      ],
      github: 'https://github.com/teckuro',
      previewDomain: 'remuneraciones.app'
    }
  ];

  get featuredProject(): Project {
    return this.projects.find((p) => p.id === this.featuredProjectId) ?? this.projects[0];
  }

  get participationProjects(): Project[] {
    return this.projects.filter((p) => p.id !== this.featuredProjectId);
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
        'Desarrollo web con Angular y JavaScript, soporte evolutivo y UI con Angular Material; backend con Laravel/PHP.',
      responsibilities: [
        {
          title: 'Frontend Angular',
          desc: 'Desarrollo de funcionalidades web con Angular, TypeScript y JavaScript.'
        },
        {
          title: 'Angular Material',
          desc: 'Implementación de componentes e interfaces utilizando Angular Material.'
        },
        {
          title: 'Backend Laravel / PHP',
          desc: 'Desarrollo y mantención de funcionalidades en Laravel y PHP.'
        },
        {
          title: 'Soporte y mejoras',
          desc: 'Ajustes funcionales, mejoras internas y soporte técnico a proyectos web.'
        }
      ],
      tech: ['Angular', 'Angular Material', 'Laravel', 'PHP', 'JavaScript', 'HTML', 'CSS']
    }
  ];

  readonly contactItems: ContactItem[] = [
    {
      label: 'Email',
      value: 'teckuro6@gmail.com',
      href: 'mailto:teckuro6@gmail.com',
      sub: 'Respondo en menos de 24h'
    },
    {
      label: 'Teléfono',
      value: '+56 9 8218 5216',
      href: 'tel:+56982185216',
      sub: 'Disponible en horario laboral'
    },
    {
      label: 'Ubicación',
      value: 'Viña del Mar, Chile',
      href: '#inicio',
      sub: 'Remoto · Híbrido · Presencial'
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

  readonly keywordTags: { label: string; v: BadgeVariant }[] = [
    { label: 'PHP', v: 'default' },
    { label: 'Laravel', v: 'default' },
    { label: 'JavaScript', v: 'default' },
    { label: 'TypeScript', v: 'default' },
    { label: 'Angular', v: 'soft' },
    { label: 'React', v: 'default' },
    { label: 'Node.js', v: 'green' },
    { label: 'Django', v: 'default' },
    { label: 'Tailwind', v: 'soft' },
    { label: 'Bootstrap', v: 'ghost' },
    { label: 'PostgreSQL', v: 'default' },
    { label: 'GraphQL', v: 'soft' },
    { label: 'SII', v: 'green' },
    { label: 'Transbank', v: 'green' },
    { label: 'ERP', v: 'soft' },
    { label: 'QA', v: 'default' },
    { label: 'Docker', v: 'ghost' },
    { label: 'AWS', v: 'default' }
  ];

  readonly tools = [
    'VS Code',
    'Cursor',
    'Postman',
    'Git',
    'GitHub',
    'Docker',
    'AWS',
    'pgAdmin',
    'Composer',
    'NPM/Yarn',
    'Jira',
    'Linux'
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
      verified: true,
      verifyText: 'Cisco Verified'
    },
    {
      org: 'ETS · TOEIC',
      title: 'Inglés — nivel intermedio',
      level: 'Certificación TOEIC',
      year: 'Vigente',
      description:
        'Inglés intermedio certificado; español nativo. Lectura de documentación técnica y comunicación en equipos.',
      verified: true,
      verifyText: 'Certificación'
    },
    {
      org: 'Práctica profesional',
      title: 'Liderazgo · QA · Documentación',
      level: 'Competencias de gestión',
      year: 'Desis Limitada',
      description:
        'Liderazgo técnico durante 8 meses, procesos de QA, documentación técnica detallada y análisis de requisitos con el negocio.',
      verified: false,
      verifyText: ''
    }
  ];
}
