import { Injectable } from '@angular/core';
import { CONTENT_EN } from '../content/content.en';
import { CONTENT_ES } from '../content/content.es';
import { Lang, SiteContent } from '../content/content.model';

const STORAGE_KEY = 'jpws.lang';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private currentLang: Lang = this.detectInitialLang();

  get lang(): Lang {
    return this.currentLang;
  }

  get content(): SiteContent {
    return this.currentLang === 'en' ? CONTENT_EN : CONTENT_ES;
  }

  set(lang: Lang): void {
    this.currentLang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // storage no disponible (SSR / privacidad): el idioma vive solo en memoria
    }
    this.applyDocumentMeta();
  }

  toggle(): void {
    this.set(this.currentLang === 'es' ? 'en' : 'es');
  }

  applyDocumentMeta(): void {
    if (typeof document === 'undefined') {
      return;
    }
    document.documentElement.lang = this.currentLang;
    document.title = this.content.meta.title;
    const meta = document.querySelector('meta[name="description"]');
    meta?.setAttribute('content', this.content.meta.description);
  }

  private detectInitialLang(): Lang {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'es' || stored === 'en') {
        return stored;
      }
    } catch {
      // sin storage: caer a detección por navegador
    }
    if (typeof navigator !== 'undefined' && !navigator.language.toLowerCase().startsWith('es')) {
      return 'en';
    }
    return 'es';
  }
}
