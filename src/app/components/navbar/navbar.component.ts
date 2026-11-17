import { isPlatformBrowser } from '@angular/common';
import { LucideMenu, LucideX } from '@lucide/angular';
import { Component, HostListener, Input, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { Lang, SiteContent } from '../../content/content.model';
import { LanguageService } from '../../services/language.service';

@Component({
  imports: [LucideMenu, LucideX],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  /** Ruta al PDF del CV en assets (ej. assets/JuanPabloHuerta-CV.pdf) */
  @Input() cvHref = '';

  scrolled = false;
  menuOpen = false;
  activeSection = '';

  private readonly platformId = inject(PLATFORM_ID);

  constructor(private readonly language: LanguageService) {}

  get content(): SiteContent {
    return this.language.content;
  }

  get lang(): Lang {
    return this.language.lang;
  }

  setLang(lang: Lang): void {
    this.language.set(lang);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.onScroll();
    }
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 30;

    // Active section detection (best-effort)
    const links = this.content.nav.links;
    for (let i = links.length - 1; i >= 0; i--) {
      const el = document.getElementById(links[i].id);
      if (el && el.getBoundingClientRect().top <= 120) {
        this.activeSection = links[i].id;
        return;
      }
    }
    this.activeSection = '';
  }

  scrollTo(id: string): void {
    this.menuOpen = false;
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
