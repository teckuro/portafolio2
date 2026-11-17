import { DOCUMENT } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { CONTENT_EN } from '../content/content.en';
import { CONTENT_ES } from '../content/content.es';
import { Lang, SiteContent } from '../content/content.model';

const STORAGE_KEY = 'jpws.lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  /**
   * Siempre arranca en español: es el idioma del HTML prerenderizado, así la
   * hidratación coincide. La preferencia del visitante se aplica después
   * con {@link applyPreferredLang}.
   */
  private readonly currentLang = signal<Lang>('es');

  readonly langSignal = this.currentLang.asReadonly();
  readonly contentSignal = computed<SiteContent>(() =>
    this.currentLang() === 'en' ? CONTENT_EN : CONTENT_ES
  );

  get lang(): Lang {
    return this.currentLang();
  }

  get content(): SiteContent {
    return this.contentSignal();
  }

  set(lang: Lang): void {
    this.currentLang.set(lang);
    if (this.isBrowser) {
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch {
        // storage no disponible (modo privado): el idioma vive solo en memoria
      }
    }
    this.applyDocumentMeta();
  }

  toggle(): void {
    this.set(this.currentLang() === 'es' ? 'en' : 'es');
  }

  /** Solo navegador: idioma guardado o, si no hay, el del navegador. */
  applyPreferredLang(): void {
    if (!this.isBrowser) {
      return;
    }
    const preferred = this.detectPreferredLang();
    if (preferred !== this.currentLang()) {
      this.currentLang.set(preferred);
      this.applyDocumentMeta();
    }
  }

  applyDocumentMeta(): void {
    const content = this.content;
    this.document.documentElement.lang = this.currentLang();
    this.title.setTitle(content.meta.title);
    this.meta.updateTag({ name: 'description', content: content.meta.description });
  }

  private detectPreferredLang(): Lang {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'es' || stored === 'en') {
        return stored;
      }
    } catch {
      // sin storage: caer a detección por navegador
    }
    return navigator.language.toLowerCase().startsWith('es') ? 'es' : 'en';
  }
}
