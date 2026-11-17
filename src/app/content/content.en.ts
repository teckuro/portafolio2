import { SiteContent } from './content.model';

export const CONTENT_EN: SiteContent = {
  meta: {
    title: 'JP·Workspace — Juan Pablo Huerta · Senior Software Engineer',
    description:
      'JP·Workspace: how a Senior Software Engineer designs and builds enterprise systems. Payroll ERP, architecture, and AI-driven automation.'
  },
  nav: {
    links: [
      { id: 'workspace', label: 'Workspace' },
      { id: 'proyectos', label: 'Projects' },
      { id: 'thinking', label: 'Thinking' },
      { id: 'experiencia', label: 'Experience' }
    ],
    cv: 'Resume',
    contact: 'Contact',
    menuAria: 'Open menu'
  },
  hero: {
    eyebrow: 'Viña del Mar, Chile · Available immediately',
    role: 'Senior Software Engineer',
    specialization: 'Enterprise Systems · Software Architecture · Artificial Intelligence',
    statement:
      'Designing enterprise platforms, business engines, and AI-driven automation.',
    stack: ['Angular', 'TypeScript', 'PostgreSQL', 'Python', 'Docker'],
    ctaWorkspace: 'View workspace',
    ctaCv: 'Download resume',
    ctaContact: 'Get in touch',
    scrollCue: 'Explore'
  },
  workspace: {
    eyebrow: '01 · What he builds',
    title: 'JP·Workspace',
    titleHighlight: 'Payroll ERP',
    subtitle:
      'The ERP calculation engine running on this page, fed by the period parameters. The full system lives in the live demo.',
    productLabel: 'jp.workspace — Payroll ERP · Chile',
    openDemo: 'Open live demo',
    demoNote: 'Demo access: demo@demo.cl · DEMO1234',
    philosophy: [
      'Architecture before framework.',
      'Automate before repeating.',
      'Maintainability is a feature.',
      'Complex systems are designed. They do not happen by accident.'
    ],
    parametros: {
      title: 'Period parameters',
      items: [
        { label: 'UF', value: '$40,820.31', delta: '+0.52%' },
        { label: 'UTM', value: '$71,506', delta: '+1.30%' },
        { label: 'UTA', value: '$858,072', delta: '+1.30%' },
        { label: 'Minimum wage', value: '$539,000', delta: 'No change' }
      ],
      footnote: 'Parameters versioned per month in PostgreSQL; the engine consumes the active period.'
    },
    motor: {
      title: 'Calculation engine · live',
      grossLabel: 'Gross salary (CLP)',
      taxableLabel: 'Taxable base (87.8 UF cap)',
      afpLabel: 'Pension fund (10% + ref. fee)',
      healthLabel: 'Health (7%)',
      unemploymentLabel: 'Unemployment insurance (0.6%)',
      totalLabel: 'Estimated net pay',
      note: 'Simplified excerpt of the real engine. Reference values (fixed UF, income tax excluded).'
    },
    teaser: 'How he solves problems'
  },
  projects: {
    eyebrow: '02 · How he solves problems',
    title: 'Selected',
    titleHighlight: 'projects',
    subtitle: 'Selecting a project updates the detail view. Only one case open at a time.',
    problemLabel: 'Problem',
    solutionLabel: 'Solution',
    architectureLabel: 'Architecture',
    demoLabel: 'Live demo',
    codeLabel: 'View code',
    items: [
      {
        id: 3,
        number: '01',
        title: 'Payroll System (ERP) · Chile',
        shortTitle: 'Payroll ERP',
        category: 'Angular · TypeScript · Supabase · PostgreSQL',
        problem:
          'Centralize employees, contracts, pension, and health data under Chilean rules while preventing payslip errors.',
        solution:
          'Angular/TypeScript architecture and a relational model on Supabase/PostgreSQL with typed flows, states, and validations.',
        architectureLayers: [
          'Angular · modular UI',
          'API · Supabase',
          'Rules engine · TypeScript',
          'Payroll domain',
          'PostgreSQL · RLS'
        ],
        architectureNote:
          'Calculation lives in a pure, testable engine; the UI only orchestrates. Parameters versioned per period.',
        metrics: [
          { value: 'ERP', label: 'Maintainable flows' },
          { value: 'SQL', label: 'Relational model' },
          { value: 'TS', label: 'Typing and scale' }
        ],
        tags: ['Angular', 'TypeScript', 'Supabase', 'PostgreSQL'],
        github: 'https://github.com/teckuro',
        demoUrl: 'https://erp-beta-bay.vercel.app/',
        demoNote: 'Demo access: demo@demo.cl · DEMO1234',
        screenshot: 'assets/projects/erp-remuneraciones.webp',
        mockupLabel: 'Payroll',
        previewDomain: 'erp-beta-bay.vercel.app'
      },
      {
        id: 4,
        number: '02',
        title: 'HuntOS · Autonomous job-hunting agent',
        shortTitle: 'HuntOS',
        category: 'AI · Automation · Supabase · Vercel',
        problem:
          'Job hunting is repetitive: scanning boards, filtering openings, tailoring the resume, applying, and following up, every single day.',
        solution:
          'An autonomous agent that finds openings, scores them against the profile, optimizes the resume, and applies non-stop until an offer is accepted, with a traceable pipeline.',
        architectureLayers: [
          'Control panel · pipeline',
          'API · health and approvals',
          'AI agent · scoring and matching',
          'Supabase · state and traceability'
        ],
        architectureNote:
          'The agent runs behind a safety flag (HUNTING_ENABLED) and exposes health checks; every application is traceable in the pipeline.',
        metrics: [
          { value: 'AI', label: 'Job scoring' },
          { value: '75–90', label: 'Score threshold' },
          { value: '24/7', label: 'Autonomous applying' }
        ],
        tags: ['AI', 'Automation', 'Supabase', 'Vercel'],
        github: 'https://github.com/teckuro',
        demoUrl: 'https://huntos.vercel.app/',
        mockupLabel: 'HuntOS',
        previewDomain: 'huntos.vercel.app'
      }
    ],
    teaser: 'How he thinks and decides'
  },
  thinking: {
    eyebrow: '03 · How he thinks and decides',
    title: 'Thinking',
    titleHighlight: 'architecture decisions',
    subtitle: 'Decision records (ADRs): problem, options, decision, trade-offs, and outcome.',
    labels: {
      problem: 'Problem',
      options: 'Options',
      decision: 'Decision',
      tradeoffs: 'Trade-offs',
      result: 'Outcome'
    },
    items: [
      {
        code: 'ADR-01',
        title: 'Angular for enterprise software',
        problem:
          'An ERP lives for years and is maintained by rotating teams. The frontend needs a structure that outlives the people who wrote it.',
        options: 'React (maximum flexibility), Vue (gentle curve), Angular (complete framework).',
        decision:
          'Angular: dependency injection, router, forms, and a single set of conventions. Two developers write similar code without agreeing on it first.',
        tradeoffs: 'More verbose, steeper initial curve, and less freedom for exploratory UI.',
        result: 'Consistent modules (employees, payroll, parameters) and predictable onboarding.'
      },
      {
        code: 'ADR-02',
        title: 'PostgreSQL as the system core',
        problem:
          'Payroll demands transactional integrity, historical rules, and auditability. A data error is money wrongly paid to a person.',
        options: 'MySQL (familiar), MongoDB (flexible), PostgreSQL (integrity + extensibility).',
        decision:
          'PostgreSQL: strong constraints, views and functions for business rules, JSONB for flexible parameters, and RLS for multi-company.',
        tradeoffs: 'More logic in the database demands migration and versioning discipline.',
        result: 'The relational model is the source of truth; the frontend never improvises rules.'
      },
      {
        code: 'ADR-03',
        title: 'Signals for local state, RxJS for async',
        problem:
          'The ERP handles UI state (active period, filters, selection) without needing a heavy global store.',
        options: 'RxJS everywhere, NgRx (global store), Signals (local reactive state).',
        decision:
          'Signals for local and derived state (period, selection, totals); RxJS only where real asynchrony exists: HTTP and realtime.',
        tradeoffs: 'Two mental models coexisting; requires a clear, documented boundary.',
        result: 'Less boilerplate than NgRx and effects that are easier to reason about and test.'
      },
      {
        code: 'ADR-04',
        title: 'A rules engine separated from the UI',
        problem:
          'Chilean payroll calculation changes every month (UF, caps, tax brackets). Hardcoding it in screens makes it untestable.',
        options: 'Calculation in components, pure SQL, or an independent domain engine.',
        decision:
          'A pure TypeScript engine: deterministic functions (gross + period parameters → payslip), with parameters versioned per month in PostgreSQL.',
        tradeoffs: 'One more layer of indirection and keeping parameters in sync between database and engine.',
        result:
          'Testable with real cases (87.8 UF / 131.9 UF caps). The Engine in this workspace runs an excerpt of that code.'
      },
      {
        code: 'ADR-05',
        title: 'Modular architecture by domain',
        problem:
          'An ERP mixes distinct domains (people, payroll, parameters, reports) and tends toward a monolith of coupled screens.',
        options: 'Loose feature folders, microfrontends, domain modules.',
        decision:
          'Domain modules with clear boundaries: each owns its routes, state, and data access; cross-cutting concerns live in core/shared.',
        tradeoffs: 'More upfront structure. Microfrontends would have been over-engineering for the team size.',
        result: 'Medical leaves can be changed without fear of breaking payroll.'
      },
      {
        code: 'ADR-06',
        title: 'A real mistake: shipping integration and UI together',
        problem:
          'In electronic invoicing, an SII integration change shipped to production together with UI improvements. A tax edge case blocked issuance for part of the customers.',
        options: 'Quick hotfix and carry on, or redesign the delivery process.',
        decision:
          'Separate integration deployments from UI deployments, version the contracts, and turn SII edge cases into a regression suite.',
        tradeoffs: 'Somewhat slower deliveries and more process discipline.',
        result:
          'Integration incidents stopped reaching customers. Lesson: stability is designed into the process, not the hotfix.'
      }
    ],
    teaser: 'Where he applied it'
  },
  experience: {
    eyebrow: '04 · Where he applied that knowledge',
    title: 'Professional',
    titleHighlight: 'experience',
    impactLabel: 'Impact',
    items: [
      {
        role: 'Full Stack Developer / Team Lead',
        company: 'Desis Limitada',
        period: 'Aug 2021 – Aug 2025',
        location: 'Chile',
        summary: 'Scalable products, ERP modules, and SII/Transbank integrations with technical leadership.',
        responsibilities: [
          {
            title: 'Technical leadership',
            desc: 'Led a development team for 8 months, overseeing delivery quality and complex technical issues.'
          },
          {
            title: 'ERP development',
            desc: 'Accounting, payroll, and inventory modules integrated with PHP and JavaScript.'
          },
          {
            title: 'Strategic integrations',
            desc: 'Integrations with the Chilean IRS (SII) and Transbank payment gateways for process automation.'
          },
          {
            title: 'Data optimization',
            desc: 'PostgreSQL views and functions for business rules and reporting.'
          }
        ],
        impact:
          'Invoicing platform running in production for customers across Chile, with stable deliveries over 4 years.',
        tech: ['PHP', 'Laravel', 'Angular', 'PostgreSQL', 'GraphQL', 'SII', 'Transbank', 'Docker', 'AWS']
      },
      {
        role: 'Junior Developer',
        company: 'Anida Latam',
        period: 'Jan 2021 – Aug 2021',
        location: 'Chile',
        summary: 'Web development with Angular/JavaScript and a Laravel/PHP backend.',
        responsibilities: [
          {
            title: 'Angular frontend',
            desc: 'Web features with Angular, TypeScript, and JavaScript.'
          },
          {
            title: 'Angular Material',
            desc: 'Interfaces built with Angular Material components.'
          },
          {
            title: 'Laravel / PHP backend',
            desc: 'Development and maintenance of Laravel and PHP features.'
          }
        ],
        impact: 'Features shipped in a self-service portal used by end customers.',
        tech: ['Angular', 'Laravel', 'PHP', 'JavaScript', 'TypeScript']
      }
    ]
  },
  contact: {
    links: [
      { label: 'Email', value: 'jphuerta.dev@gmail.com', href: 'mailto:jphuerta.dev@gmail.com', external: false },
      { label: 'LinkedIn', value: 'linkedin.com/in/jphuerta1', href: 'https://www.linkedin.com/in/jphuerta1/', external: true },
      { label: 'GitHub', value: 'github.com/teckuro', href: 'https://github.com/teckuro', external: true },
      { label: 'WhatsApp', value: '+56 9 8829 2018', href: 'https://wa.me/56988292018', external: true }
    ],
    whatsappAria: 'Contact via WhatsApp'
  },
  footer: {
    tagline: 'Senior Software Engineer. Enterprise systems, architecture, and AI-driven automation.',
    navTitle: 'Navigation',
    contactTitle: 'Contact',
    rights: '© 2026 Juan Pablo Huerta',
    availability: 'Available immediately'
  },
  consoleGreeting: {
    title: 'JP·Workspace — Juan Pablo Huerta · Senior Software Engineer',
    body:
      'Inspecting the code? Angular + Tailwind, no UI libraries.\nRepository: https://github.com/teckuro\nContact: jphuerta.dev@gmail.com'
  }
};
