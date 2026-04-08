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

    const glowMap: Record<string, string> = {
      violet: 'hover:shadow-violet-500/10',
      cyan: 'hover:shadow-cyan-500/10',
      indigo: 'hover:shadow-indigo-500/10',
      emerald: 'hover:shadow-emerald-500/10'
    };

    return `transition-all duration-300 hover:border-white/[0.12] hover:shadow-xl hover:-translate-y-1 ${glowMap[this.glowColor] ?? ''}`;
  }
}

