import { SiteContent } from './content.model';
import actividad from './erp-actividad.json';

const ERP_REPO = 'https://github.com/teckuro/ERP';

export const CONTENT_EN: SiteContent = {
  meta: {
    title: 'Juan Pablo Huerta · Full stack engineer · ERP and payroll',
    description:
      'I build business software: a payroll ERP for Chile, electronic invoicing, and integrations with the Chilean IRS (SII). You can try the calculation engine on the page.'
  },
  nav: {
    links: [
      { id: 'workspace', label: 'Engine' },
      { id: 'ahora', label: 'Now' },
      { id: 'proyectos', label: 'ERP' },
      { id: 'thinking', label: 'Decisions' },
      { id: 'experiencia', label: 'Experience' }
    ],
    cv: 'Resume',
    contact: 'Contact',
    menuAria: 'Open menu'
  },
  hero: {
    eyebrow: 'Viña del Mar, Chile · Available now',
    role: 'Full stack engineer · ERP and payroll',
    statement:
      "Since 2021 I've built software for Chilean companies: electronic invoicing, SII and Transbank integrations, and payroll. Now I'm building my own payroll ERP, and its calculation engine runs right below.",
    stack: ['Angular', 'TypeScript', 'PostgreSQL', 'Python', 'Docker'],
    ctaWorkspace: 'Try the engine',
    ctaCv: 'Download resume',
    ctaContact: 'Contact me',
    scrollCue: 'See more'
  },
  workspace: {
    eyebrow: 'engine',
    title: "My ERP's engine, running right here",
    subtitle:
      "An excerpt of my ERP's payroll calculation, using the period parameters. Change the gross salary and watch the payslip come together.",
    productLabel: 'payroll-erp · calculation engine',
    openDemo: 'Open the ERP',
    parametros: {
      title: 'Period parameters',
      items: [
        { label: 'UF', value: '$40,820.31', delta: '+0.52%' },
        { label: 'UTM', value: '$71,506', delta: '+1.30%' },
        { label: 'UTA', value: '$858,072', delta: '+1.30%' },
        { label: 'Minimum wage', value: '$539,000', delta: 'no change' }
      ],
      noChange: 'no change',
      liveNote: 'Read from the ERP database: the last period loaded.',
      footnote: 'In the ERP, these parameters are versioned per month in PostgreSQL and the engine uses the active period.'
    },
    motor: {
      title: 'Calculation engine · live',
      grossLabel: 'Gross salary (CLP)',
      taxableLabel: 'Taxable base ({tope} UF cap)',
      afpLabel: 'Pension fund{afp} ({tasa}%)',
      healthLabel: 'Health ({tasa}%)',
      unemploymentLabel: 'Unemployment insurance ({tasa}%)',
      totalLabel: 'Estimated net pay',
      note: 'Simplified version: no income tax. The full engine lives in the ERP.'
    },
    slip: {
      title: 'Pay slip',
      earnings: 'Earnings',
      deductions: 'Deductions',
      inWords: 'Amount in words',
      received: 'Received in full',
      capApplied: 'Taxable cap applied'
    }
  },
  now: {
    eyebrow: 'now',
    title: 'What I am working on',
    subtitle: 'The latest changes to the ERP, read from the public repository every time this site is published.',
    updated: 'Updated',
    commitsLabel: 'commits on main',
    viewAll: 'See all commits',
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    note: 'Commit messages are in Spanish.'
  },
  projects: {
    eyebrow: 'project',
    title: 'Inside the ERP',
    problemLabel: 'Problem',
    solutionLabel: 'Solution',
    architectureLabel: 'Architecture',
    demoLabel: 'Live demo',
    codeLabel: 'View code',
    items: [
      {
        id: 3,
        title: 'Payroll ERP · Chile',
        shortTitle: 'Payroll ERP',
        category: 'Angular · TypeScript · Supabase · PostgreSQL',
        problem:
          'Running payroll in Chile means tracking employees, contracts, pension funds, health plans, medical leave, and caps that change every month. A mistake is money wrongly paid to a person.',
        solution:
          'An Angular ERP on Supabase/PostgreSQL. Calculation lives in a pure, tested rules engine, parameters are versioned per period, and the database enforces multi-company security with RLS.',
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
          { value: String(actividad.cifras.migraciones), label: 'SQL migrations' },
          { value: actividad.cifras.tests.toLocaleString('en-US'), label: 'automated tests' },
          { value: String(actividad.cifras.modulos), label: 'domain modules' }
        ],
        tags: ['Angular', 'TypeScript', 'Supabase', 'PostgreSQL'],
        github: ERP_REPO,
        demoUrl: 'https://erp-beta-bay.vercel.app/',
        demoNote: 'Demo access: demo@demo.cl · DEMO1234',
        screenshot: 'assets/projects/erp-remuneraciones.webp',
        mockupLabel: 'Payroll',
        previewDomain: 'erp-beta-bay.vercel.app'
      }
    ]
  },
  thinking: {
    eyebrow: 'decisions',
    title: 'How I decide',
    subtitle:
      'Architecture decisions written as ADRs: the problem, the options, what I chose, and what it cost me. I start with a real mistake.',
    labels: {
      problem: 'Problem',
      options: 'Options',
      decision: 'Decision',
      tradeoffs: 'What it cost',
      result: 'Outcome',
      code: 'In the code'
    },
    items: [
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
          'Integration incidents stopped reaching customers. I learned that stability is designed into the process, not the hotfix.'
      },
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
        result: 'The relational model is the source of truth; the frontend never improvises rules.',
        link: { label: 'supabase/migrations', href: `${ERP_REPO}/tree/main/supabase/migrations` }
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
          'Testable with real cases (87.8 UF / 131.9 UF caps). The engine on this page is an excerpt of that code.',
        link: {
          label: 'features/nomina-mensual/rules',
          href: `${ERP_REPO}/tree/main/src/app/features/nomina-mensual/rules`
        }
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
        result: 'Medical leaves can be changed without fear of breaking payroll.',
        link: { label: 'src/app/features', href: `${ERP_REPO}/tree/main/src/app/features` }
      }
    ]
  },
  experience: {
    eyebrow: 'experience',
    title: 'Experience',
    impactLabel: 'Impact',
    items: [
      {
        role: 'Full stack developer / Team lead',
        company: 'Desis Limitada',
        period: 'Aug 2021 – Aug 2025',
        location: 'Chile',
        summary:
          'Electronic invoicing, SII and Transbank integrations, and ERP modules for customers across Chile. For 8 months I also led a team.',
        responsibilities: [
          {
            title: 'Technical leadership',
            desc: 'Led a development team for 8 months: reviewing deliveries and working through complex technical issues.'
          },
          {
            title: 'ERP modules',
            desc: 'Accounting, payroll, and inventory, in PHP and JavaScript.'
          },
          {
            title: 'SII and Transbank integrations',
            desc: 'Tax document issuance with the Chilean IRS (SII) and payments with Transbank.'
          },
          {
            title: 'PostgreSQL',
            desc: 'Views and functions for business rules and reporting.'
          }
        ],
        impact:
          'Invoicing platform running in production for customers across Chile, with stable deliveries over 4 years.',
        tech: ['PHP', 'Laravel', 'Angular', 'PostgreSQL', 'GraphQL', 'SII', 'Transbank', 'Docker', 'AWS']
      },
      {
        role: 'Junior developer',
        company: 'Anida Latam',
        period: 'Jan 2021 – Aug 2021',
        location: 'Chile',
        summary: 'Web development with Angular and a Laravel/PHP backend.',
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
    eyebrow: 'contact',
    title: "Let's talk",
    subtitle:
      "I'm looking for a software engineering role on a team that builds business systems. If you have an ERP, an integration, or a process to automate, write to me.",
    emailCta: 'Send an email',
    links: [
      { label: 'Email', value: 'jphuerta.dev@gmail.com', href: 'mailto:jphuerta.dev@gmail.com', external: false },
      { label: 'LinkedIn', value: 'linkedin.com/in/jphuerta1', href: 'https://www.linkedin.com/in/jphuerta1/', external: true },
      { label: 'GitHub', value: 'github.com/teckuro', href: 'https://github.com/teckuro', external: true },
      { label: 'WhatsApp', value: '+56 9 8829 2018', href: 'https://wa.me/56988292018', external: true }
    ],
    whatsappAria: 'Contact via WhatsApp'
  },
  footer: {
    tagline: 'Full stack engineer in Viña del Mar. ERP, payroll, and integrations.',
    navTitle: 'Navigation',
    contactTitle: 'Contact',
    rights: '© 2026 Juan Pablo Huerta',
    availability: 'Available now'
  },
  consoleGreeting: {
    title: 'Juan Pablo Huerta · Full stack engineer',
    body:
      'Inspecting the code? Angular + Tailwind, no UI libraries.\nERP repository: https://github.com/teckuro/ERP\nContact: jphuerta.dev@gmail.com'
  },
  sheet: {
    label: 'Sheet',
    of: 'of',
    end: 'End of listing',
    totals: 'Totals'
  }
};
