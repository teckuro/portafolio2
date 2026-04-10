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
    { id: 'sobre-mi', label: 'Sobre Mí' },
    { id: 'habilidades', label: 'Habilidades' },
    { id: 'proyectos', label: 'Proyectos' },
    { id: 'experiencia', label: 'Experiencia' },
    { id: 'certificaciones', label: 'Certificaciones' },
    { id: 'formacion', label: 'Formación' },
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

    // Active section detection (best-effort)
    for (let i = this.navLinks.length - 1; i >= 0; i--) {
      const el = document.getElementById(this.navLinks[i].id);
      if (el && el.getBoundingClientRect().top <= 120) {
        this.activeSection = this.navLinks[i].id;
        return;
      }
    }
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    this.menuOpen = false;
  }
}
