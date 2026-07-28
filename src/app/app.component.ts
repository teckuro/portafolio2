import { AfterViewInit, Component, HostListener, OnDestroy } from '@angular/core';

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
type ProjectMetric = { value: string; label: string };

type Project = {
  id: number;
  number: string;
  title: string;
  shortTitle: string;
  category: string;
  problem: string;
  solution: string;
  metrics: ProjectMetric[];
  tags: Tag[];
  github: string;
  mockupLabel: string;
  previewDomain: string;
};

type Responsibility = { title: string; desc: string };

type ExperienceJob = {
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  responsibilities: Responsibility[];
  tech: string[];
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  activeProjectId = 3;
  expandedJobIndex = 0;
  scrollProgress = 0;
  demoGross = 1500000;
  private revealObserver?: IntersectionObserver;

  /** Valores referenciales del demo de liquidación (UF y topes imponibles). */
  private readonly UF_CLP = 39500;
  private readonly TOPE_IMPONIBLE_UF = 87.8;
  private readonly TOPE_CESANTIA_UF = 131.9;

  ngAfterViewInit(): void {
    this.initRevealObserver();
    this.updateScrollProgress();
    this.logConsoleGreeting();
  }

  ngOnDestroy(): void {
    this.revealObserver?.disconnect();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateScrollProgress();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateScrollProgress();
  }

  private updateScrollProgress(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    this.scrollProgress = max > 0 ? Math.round(Math.min(100, Math.max(0, (window.scrollY / max) * 100))) : 0;
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

  setActiveProject(projectId: number): void {
    this.activeProjectId = projectId;
  }

  trackProject(_index: number, project: Project): number {
    return project.id;
  }

  toggleJob(index: number): void {
    this.expandedJobIndex = this.expandedJobIndex === index ? -1 : index;
  }

  openBuildingProject(): void {
    this.activeProjectId = 3;
    this.scrollTo('proyectos');
  }

  onDemoGrossChange(value: string): void {
    const parsed = Number(String(value).replace(/[^\d]/g, ''));
    this.demoGross = Number.isFinite(parsed) ? Math.min(parsed, 99_999_999) : 0;
  }

  /** Cálculo simplificado de liquidación chilena: AFP + salud + cesantía con topes en UF. Sin impuesto único. */
  get demoBreakdown(): { imponible: number; afp: number; salud: number; cesantia: number; liquido: number } {
    const gross = this.demoGross || 0;
    const imponible = Math.min(gross, this.TOPE_IMPONIBLE_UF * this.UF_CLP);
    const afp = Math.round(imponible * 0.1115);
    const salud = Math.round(imponible * 0.07);
    const cesantia = Math.round(Math.min(gross, this.TOPE_CESANTIA_UF * this.UF_CLP) * 0.006);
    return {
      imponible: Math.round(imponible),
      afp,
      salud,
      cesantia,
      liquido: gross - afp - salud - cesantia
    };
  }

  formatCLP(value: number): string {
    return '$' + Math.max(0, value).toLocaleString('es-CL');
  }

  private logConsoleGreeting(): void {
    if (typeof console === 'undefined') {
      return;
    }
    console.log(
      '%cJuan Pablo Huerta — Full Stack Developer',
      'font-size:14px;font-weight:700;color:#245c4e;'
    );
    console.log(
      '%c¿Inspeccionando el código? Angular + Tailwind, sin librerías de UI.\nRepositorio: https://github.com/teckuro\nContacto: jphuerta.dev@gmail.com',
      'color:#3f4a57;line-height:1.5;'
    );
  }

  get activeProject(): Project {
    return this.projects.find((p) => p.id === this.activeProjectId) ?? this.projects[0];
  }

  readonly profile = {
    name: 'Juan Pablo Huerta',
    role: 'Full Stack Developer',
    experienceLine: '+5 años desarrollando software empresarial',
    email: 'jphuerta.dev@gmail.com',
    phone: '+56 9 8829 2018',
    location: 'Viña del Mar, Chile',
    cvPdf: 'assets/JuanPabloHuerta-CV.pdf',
    githubUrl: 'https://github.com/teckuro',
    linkedinUrl: 'https://www.linkedin.com/in/jphuerta1/',
    whatsappUrl: 'https://wa.me/56988292018',
    about:
      'Desarrollador Full Stack con más de cinco años de experiencia construyendo soluciones empresariales: facturación electrónica, módulos ERP e integraciones de pago. Stack principal: Angular, TypeScript, PostgreSQL, PHP y Python.'
  };

  readonly heroStack = ['Angular', 'TypeScript', 'PostgreSQL', 'PHP', 'Python'];

  readonly aboutChips: Tag[] = [
    { label: 'Angular', v: 'red' },
    { label: 'TypeScript', v: 'cyan' },
    { label: 'PostgreSQL', v: 'indigo' },
    { label: 'Docker', v: 'ghost' },
    { label: 'Supabase', v: 'teal' },
    { label: 'Python', v: 'green' },
    { label: 'Laravel', v: 'violet' },
    { label: 'GraphQL', v: 'pink' }
  ];

  readonly buildingNow = {
    title: 'ERP de Remuneraciones para Chile',
    description:
      'Sistema en desarrollo para centralizar trabajadores, contratos, previsión y liquidaciones con reglas locales.',
    chips: [
      'Angular',
      'PostgreSQL',
      'Arquitectura modular',
      'Automatización con IA',
      'Motor de cálculo'
    ]
  };

  readonly projects: Project[] = [
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
      metrics: [
        { value: 'ERP', label: 'Flujos mantenibles' },
        { value: 'SQL', label: 'Modelo relacional' },
        { value: 'TS', label: 'Tipado y escala' }
      ],
      tags: [
        { label: 'Angular', v: 'red' },
        { label: 'TypeScript', v: 'cyan' },
        { label: 'Supabase', v: 'teal' },
        { label: 'PostgreSQL', v: 'indigo' }
      ],
      github: 'https://github.com/teckuro',
      mockupLabel: 'Remuneraciones',
      previewDomain: 'remuneraciones.app'
    },
    {
      id: 0,
      number: '02',
      title: 'Plataforma facturacion.cl · Facturación electrónica',
      shortTitle: 'Facturación electrónica',
      category: 'PHP · JavaScript · PostgreSQL · SII · Transbank',
      problem:
        'Automatizar emisión tributaria e integraciones confiables con SII y cobros en línea sin perder trazabilidad.',
      solution:
        'Evolución de la plataforma con PHP/JavaScript, integración SII y Transbank, y lógica de negocio en PostgreSQL.',
      metrics: [
        { value: 'SII', label: 'Integración tributaria' },
        { value: 'TBK', label: 'Pagos Transbank' },
        { value: 'Prod', label: 'Alta disponibilidad' }
      ],
      tags: [
        { label: 'PHP', v: 'violet' },
        { label: 'JavaScript', v: 'yellow' },
        { label: 'PostgreSQL', v: 'indigo' },
        { label: 'SII', v: 'teal' },
        { label: 'Transbank', v: 'green' }
      ],
      github: 'https://github.com/teckuro',
      mockupLabel: 'Facturación',
      previewDomain: 'facturacion.cl'
    },
    {
      id: 1,
      number: '03',
      title: 'ERP institucional · Contabilidad, remuneraciones e inventario',
      shortTitle: 'ERP institucional',
      category: 'PHP · JavaScript · Módulos integrados',
      problem:
        'Coordinar contabilidad, remuneraciones e inventario en un ERP único sin duplicar datos ni romper cierres.',
      solution:
        'Desarrollo y optimización de módulos integrados con PHP/JavaScript y datos centralizados en PostgreSQL.',
      metrics: [
        { value: '3', label: 'Módulos críticos' },
        { value: 'ERP', label: 'Arquitectura unificada' },
        { value: 'QA', label: 'Calidad de entregas' }
      ],
      tags: [
        { label: 'PHP', v: 'violet' },
        { label: 'JavaScript', v: 'yellow' },
        { label: 'ERP', v: 'indigo' },
        { label: 'PostgreSQL', v: 'orange' }
      ],
      github: 'https://github.com/teckuro',
      mockupLabel: 'ERP',
      previewDomain: 'portal.autoatencion.cl'
    },
    {
      id: 2,
      number: '04',
      title: 'Portal de autoatención · APIs y GraphQL',
      shortTitle: 'Portal autoatención',
      category: 'Laravel · GraphQL · UX',
      problem:
        'Ofrecer un portal ágil con menos fricción y consultas eficientes entre sistemas y el canal de autoatención.',
      solution:
        'Automatización con Laravel, APIs internas y capa GraphQL; despliegue con prácticas en Docker y AWS.',
      metrics: [
        { value: 'GQL', label: 'Consultas eficientes' },
        { value: 'Portal', label: 'Autoatención' },
        { value: 'UX', label: 'Canal optimizado' }
      ],
      tags: [
        { label: 'Laravel', v: 'violet' },
        { label: 'GraphQL', v: 'pink' },
        { label: 'APIs', v: 'green' },
        { label: 'Docker', v: 'cyan' }
      ],
      github: 'https://github.com/teckuro',
      mockupLabel: 'Portal',
      previewDomain: 'app.empresa.cl'
    }
  ];

  readonly experienceJobs: ExperienceJob[] = [
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
      tech: ['Angular', 'Laravel', 'PHP', 'JavaScript', 'TypeScript']
    }
  ];
}
