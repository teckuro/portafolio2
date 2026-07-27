import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Input() name = '';
  /** Ruta al PDF del CV en assets (ej. assets/JuanPabloHuerta-CV.pdf) */
  @Input() cvHref = '';

  readonly navLinks = [
    { id: 'sobre-mi', label: 'Sobre mí' },
    { id: 'habilidades', label: 'Skills' },
    { id: 'proyectos', label: 'Proyectos' },
    { id: 'experiencia', label: 'Experiencia' },
    { id: 'contacto', label: 'Contacto' }
  ] as const;

  scrolled = false;
  menuOpen = false;
  activeSection = '';

  ngOnInit(): void {
    this.onScroll();
  }

  ngOnDestroy(): void {
    // nothing to clean up (HostListener)
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scrolled = window.scrollY > 30;

    for (let i = this.navLinks.length - 1; i >= 0; i--) {
      const el = document.getElementById(this.navLinks[i].id);
      if (el && el.getBoundingClientRect().top <= 120) {
        this.activeSection = this.navLinks[i].id;
        return;
      }
    }

    this.activeSection = '';
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    this.menuOpen = false;
  }
}
