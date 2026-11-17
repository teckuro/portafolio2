export type Lang = 'es' | 'en';

export interface NavLink {
  id: string;
  label: string;
}

export interface WorkspaceParam {
  label: string;
  value: string;
  delta: string;
}

export interface ProjectItem {
  id: number;
  number: string;
  title: string;
  shortTitle: string;
  category: string;
  problem: string;
  solution: string;
  /** Capas del diagrama de arquitectura, de UI a datos. */
  architectureLayers: string[];
  architectureNote: string;
  metrics: { value: string; label: string }[];
  tags: string[];
  github: string;
  demoUrl?: string;
  demoNote?: string;
  screenshot?: string;
  mockupLabel: string;
  previewDomain: string;
}

export interface AdrItem {
  code: string;
  title: string;
  problem: string;
  options: string;
  decision: string;
  tradeoffs: string;
  result: string;
}

export interface JobItem {
  role: string;
  company: string;
  period: string;
  location: string;
  summary: string;
  responsibilities: { title: string; desc: string }[];
  impact: string;
  tech: string[];
}

export interface ContactLink {
  label: string;
  value: string;
  href: string;
  external: boolean;
}

export interface SiteContent {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    links: NavLink[];
    cv: string;
    contact: string;
    menuAria: string;
  };
  hero: {
    eyebrow: string;
    role: string;
    specialization: string;
    statement: string;
    stack: string[];
    ctaWorkspace: string;
    ctaCv: string;
    ctaContact: string;
    scrollCue: string;
  };
  workspace: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    productLabel: string;
    openDemo: string;
    demoNote: string;
    philosophy: string[];
    parametros: {
      title: string;
      items: WorkspaceParam[];
      footnote: string;
    };
    motor: {
      title: string;
      grossLabel: string;
      taxableLabel: string;
      afpLabel: string;
      healthLabel: string;
      unemploymentLabel: string;
      totalLabel: string;
      note: string;
    };
    teaser: string;
  };
  projects: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    problemLabel: string;
    solutionLabel: string;
    architectureLabel: string;
    demoLabel: string;
    codeLabel: string;
    items: ProjectItem[];
    teaser: string;
  };
  thinking: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    labels: {
      problem: string;
      options: string;
      decision: string;
      tradeoffs: string;
      result: string;
    };
    items: AdrItem[];
    teaser: string;
  };
  experience: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    impactLabel: string;
    items: JobItem[];
  };
  contact: {
    eyebrow: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    emailCta: string;
    links: ContactLink[];
    whatsappAria: string;
  };
  footer: {
    tagline: string;
    navTitle: string;
    contactTitle: string;
    rights: string;
    availability: string;
  };
  consoleGreeting: {
    title: string;
    body: string;
  };
}
