
import { LucideArrowRight, LucideChevronDown, LucideExternalLink } from '@lucide/angular';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ErpWorkspaceComponent } from './components/erp-workspace/erp-workspace.component';
import { SectionHeaderComponent } from './ui/section-header/section-header.component';
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { Lang, ProjectItem, SiteContent } from './content/content.model';
import { LanguageService } from './services/language.service';

@Component({
  imports: [NavbarComponent, FooterComponent, ErpWorkspaceComponent, SectionHeaderComponent, LucideArrowRight, LucideExternalLink, LucideChevronDown],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  activeProjectId = 3;
  expandedJobIndex = 0;
  expandedAdrIndex = 0;
  readonly scrollProgress = signal(0);
  private revealObserver?: IntersectionObserver;

  /** Recursos que no cambian con el idioma. */
  readonly cvPdf = 'assets/JuanPabloHuerta-CV.pdf';
  readonly whatsappUrl = 'https://wa.me/56988292018';

  private readonly language = inject(LanguageService);

  constructor() {
    // Solo navegador, tras hidratar: idioma preferido, reveals y progreso de scroll.
    afterNextRender(() => {
      this.language.applyPreferredLang();
      this.initRevealObserver();
      this.updateScrollProgress();
      this.logConsoleGreeting();
    });
  }

  get content(): SiteContent {
    return this.language.content;
  }

  get lang(): Lang {
    return this.language.lang;
  }

  ngOnInit(): void {
    this.language.applyDocumentMeta();
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
    this.scrollProgress.set(
      max > 0 ? Math.round(Math.min(100, Math.max(0, (window.scrollY / max) * 100))) : 0
    );
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

  trackProject(_index: number, project: ProjectItem): number {
    return project.id;
  }

  get activeProject(): ProjectItem {
    const items = this.content.projects.items;
    return items.find((p) => p.id === this.activeProjectId) ?? items[0];
  }

  toggleJob(index: number): void {
    this.expandedJobIndex = this.expandedJobIndex === index ? -1 : index;
  }

  toggleAdr(index: number): void {
    this.expandedAdrIndex = this.expandedAdrIndex === index ? -1 : index;
  }

  private logConsoleGreeting(): void {
    if (typeof console === 'undefined') {
      return;
    }
    const greeting = this.content.consoleGreeting;
    console.log('%c' + greeting.title, 'font-size:14px;font-weight:700;color:#245c4e;');
    console.log('%c' + greeting.body, 'color:#3f4a57;line-height:1.5;');
  }
}
