
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ErpWorkspaceComponent } from './components/erp-workspace/erp-workspace.component';
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
import { ActividadErp, ErpEnVivoService } from './services/erp-en-vivo.service';

@Component({
  imports: [NavbarComponent, FooterComponent, ErpWorkspaceComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  expandedJobIndex = 0;
  expandedAdrIndex = 0;
  readonly scrollProgress = signal(0);
  private revealObserver?: IntersectionObserver;
  private revealMutations?: MutationObserver;

  /** Recursos que no cambian con el idioma. */
  /** `?v=` invalida la caché de /assets en Vercel al publicar un CV nuevo. */
  readonly cvPdf = 'assets/JuanPabloHuerta-CV.pdf?v=2026-11';
  readonly whatsappUrl = 'https://wa.me/56988292018';

  private readonly erp = inject(ErpEnVivoService);

  /**
   * Commits y cifras del ERP: los del build (scripts/actualizar-erp.mjs) y, tras
   * cargar, los que devuelve GitHub en ese momento.
   */
  get actividad(): ActividadErp {
    return this.erp.actividad();
  }

  /** `2026-11-20` → `20 nov`. Sin Date ni zona horaria: igual en SSR y en el navegador. */
  fechaCorta(iso: string): string {
    const [, mes, dia] = iso.split('-').map(Number);
    return `${dia} ${this.content.now.months[mes - 1] ?? ''}`;
  }

  fechaLarga(iso: string): string {
    return `${this.fechaCorta(iso)} ${iso.slice(0, 4)}`;
  }

  /** Orden de las hojas del papel continuo; "ahora" solo existe si hay commits. */
  get hojas(): string[] {
    const todas = ['inicio', 'workspace', 'ahora', 'proyectos', 'thinking', 'experiencia', 'contacto'];
    return this.actividad.commits.length ? todas : todas.filter((h) => h !== 'ahora');
  }

  /** "Hoja 3 de 7" para la cabecera de cada sección. */
  hoja(id: string): string {
    const s = this.content.sheet;
    return `${s.label} ${this.hojas.indexOf(id) + 1} ${s.of} ${this.hojas.length}`;
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
      this.erp.cargarUnaVez();
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
    this.revealMutations?.disconnect();
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

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
      { threshold: 0, rootMargin: '0px 0px -5% 0px' }
    );

    // Lo que ya está en pantalla se marca visible al tiro (sin parpadeo); el resto se observa.
    const preparar = (el: HTMLElement): void => {
      if (el.classList.contains('is-visible')) {
        return;
      }
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.classList.add('is-visible');
      } else {
        this.revealObserver?.observe(el);
      }
    };

    document.querySelectorAll<HTMLElement>('.reveal').forEach(preparar);

    // Angular puede reemplazar nodos después del primer render; sin esto, el observer
    // seguía mirando los nodos viejos y las secciones nuevas quedaban en opacidad 0.
    this.revealMutations = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            if (node.matches('.reveal')) {
              preparar(node);
            }
            node.querySelectorAll<HTMLElement>('.reveal').forEach(preparar);
          }
        });
      }
    });
    this.revealMutations.observe(document.body, { childList: true, subtree: true });

    document.documentElement.classList.add('reveal-ready');
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
    instalarLiquidar(() => this.lang, this.content.consoleGreeting, () => this.erp.motor());
  }
}
