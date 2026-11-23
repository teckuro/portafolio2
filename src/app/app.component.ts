
import {
  LucideArrowRight,
  LucideArrowUpRight,
  LucideChevronDown,
  LucideDownload,
  LucideFolderGit,
  LucideMail,
} from '@lucide/angular';
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
import { Lang, SiteContent } from './content/content.model';
import { LanguageService } from './services/language.service';
import { instalarLiquidar } from './motor/consola';
import actividad from './content/erp-actividad.json';

@Component({
  imports: [NavbarComponent, FooterComponent, ErpWorkspaceComponent, SectionHeaderComponent, LucideArrowRight, LucideArrowUpRight, LucideChevronDown, LucideDownload, LucideFolderGit, LucideMail],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  expandedJobIndex = 0;
  expandedAdrIndex = 0;
  readonly scrollProgress = signal(0);
  private revealObserver?: IntersectionObserver;

  /** Recursos que no cambian con el idioma. */
  /** `?v=` invalida la caché de /assets en Vercel al publicar un CV nuevo. */
  readonly cvPdf = 'assets/JuanPabloHuerta-CV.pdf?v=2026-11';
  readonly whatsappUrl = 'https://wa.me/56988292018';

  /** Commits y cifras del ERP, generados en cada build por scripts/actualizar-erp.mjs. */
  readonly actividad = actividad;

  /** `2026-11-20` → `20 nov`. Sin Date ni zona horaria: igual en SSR y en el navegador. */
  fechaCorta(iso: string): string {
    const [, mes, dia] = iso.split('-').map(Number);
    return `${dia} ${this.content.now.months[mes - 1] ?? ''}`;
  }

  fechaLarga(iso: string): string {
    return `${this.fechaCorta(iso)} ${iso.slice(0, 4)}`;
  }

  /** Enlace mailto tomado del primer contacto de tipo email. */
  get emailHref(): string {
    return this.content.contact.links.find((l) => l.href.startsWith('mailto:'))?.href ?? '#contacto';
  }

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
      return;
    }

    // Lo que ya está en pantalla se marca visible antes de activar el ocultamiento,
    // así no parpadea al hidratar.
    const viewportBottom = window.innerHeight;
    nodes.forEach((el) => {
      if (el.getBoundingClientRect().top < viewportBottom) {
        el.classList.add('is-visible');
      }
    });
    document.documentElement.classList.add('reveal-ready');

    this.revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            this.revealObserver?.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -5% 0px' }
    );

    nodes
      .filter((el) => !el.classList.contains('is-visible'))
      .forEach((el) => this.revealObserver?.observe(el));
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  toggleJob(index: number): void {
    this.expandedJobIndex = this.expandedJobIndex === index ? -1 : index;
  }

  toggleAdr(index: number): void {
    this.expandedAdrIndex = this.expandedAdrIndex === index ? -1 : index;
  }

  /** Saludo en consola + `liquidar(bruto)` con el mismo motor de la calculadora. */
  private logConsoleGreeting(): void {
    if (typeof console === 'undefined') {
      return;
    }
    instalarLiquidar(() => this.lang, this.content.consoleGreeting);
  }
}
