import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  @Input() email = '';
  @Input() phone = '';
  @Input() location = '';
  @Input() githubUrl = '';
  @Input() linkedinUrl = '';

  readonly navLinks = [
    { id: 'sobre-mi', label: 'Sobre mí' },
    { id: 'habilidades', label: 'Skills' },
    { id: 'proyectos', label: 'Proyectos' },
    { id: 'experiencia', label: 'Experiencia' },
    { id: 'certificaciones', label: 'Certificaciones' },
    { id: 'formacion', label: 'Formación' },
    { id: 'contacto', label: 'Contacto' }
  ] as const;

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }
}
