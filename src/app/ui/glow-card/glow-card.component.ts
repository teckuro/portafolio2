import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-glow-card',
  templateUrl: './glow-card.component.html'
})
export class GlowCardComponent {
  @Input() className = '';
  @Input() glowColor: 'violet' | 'cyan' | 'indigo' | 'emerald' = 'violet';
  @Input() hover = true;

  get hoverClasses(): string {
    if (!this.hover) return '';
    return 'transition-colors duration-300';
  }
}
