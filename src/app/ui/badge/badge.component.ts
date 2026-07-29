import { Component, Input } from '@angular/core';

export type BadgeVariant = 'default' | 'green' | 'soft' | 'ghost';

export type BadgeSize = 'sm' | 'md';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html'
})
export class BadgeComponent {
  @Input() variant: BadgeVariant | string = 'default';
  @Input() size: BadgeSize = 'sm';
  @Input() dot = false;
  @Input() className = '';

  private resolveVariant(): BadgeVariant {
    if (this.variant === 'green' || this.variant === 'soft' || this.variant === 'ghost') {
      return this.variant;
    }
    if (this.variant === 'default') {
      return 'default';
    }
    // Legacy color names from content data map to default tonal tag
    return 'default';
  }

  get variantClass(): string {
    const variants: Record<BadgeVariant, string> = {
      default: 'bg-[rgba(18,24,32,0.05)] border-[var(--line)] text-[var(--muted)]',
      green: 'bg-[var(--accent-soft)] border-transparent text-[var(--accent)]',
      soft: 'bg-[rgba(36,92,78,0.08)] border-[var(--line)] text-[var(--ink)]',
      ghost: 'bg-transparent border-[var(--line)] text-[var(--muted)]'
    };
    return variants[this.resolveVariant()];
  }

  get sizeClass(): string {
    const sizes: Record<BadgeSize, string> = {
      sm: 'px-2.5 py-1 text-[11px] rounded-md',
      md: 'px-3 py-1.5 text-xs rounded-md'
    };
    return sizes[this.size] ?? sizes.sm;
  }

  get dotClass(): string {
    return this.resolveVariant() === 'green' ? 'bg-[var(--accent)]' : 'bg-[var(--faint)]';
  }
}
