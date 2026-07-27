import { Component, Input } from '@angular/core';

export type BadgeVariant =
  | 'violet'
  | 'cyan'
  | 'indigo'
  | 'green'
  | 'ghost'
  | 'orange'
  | 'pink'
  | 'yellow'
  | 'teal'
  | 'red';

export type BadgeSize = 'sm' | 'md';

@Component({
  selector: 'app-badge',
  templateUrl: './badge.component.html'
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'ghost';
  @Input() size: BadgeSize = 'sm';
  @Input() dot = false;
  @Input() className = '';

  get variantClass(): string {
    // Minimalist: monochrome tags; accent only for status-like badges
    const variants: Record<BadgeVariant, string> = {
      violet: 'bg-transparent border-[var(--line)] text-[var(--muted)]',
      cyan: 'bg-transparent border-[var(--line)] text-[var(--muted)]',
      indigo: 'bg-transparent border-[var(--line)] text-[var(--muted)]',
      green: 'bg-[var(--accent-soft)] border-transparent text-[var(--accent)]',
      ghost: 'bg-transparent border-[var(--line)] text-[var(--muted)]',
      orange: 'bg-transparent border-[var(--line)] text-[var(--muted)]',
      pink: 'bg-transparent border-[var(--line)] text-[var(--muted)]',
      yellow: 'bg-transparent border-[var(--line)] text-[var(--muted)]',
      teal: 'bg-transparent border-[var(--line)] text-[var(--muted)]',
      red: 'bg-transparent border-[var(--line)] text-[var(--muted)]'
    };
    return variants[this.variant] ?? variants.ghost;
  }

  get sizeClass(): string {
    const sizes: Record<BadgeSize, string> = {
      sm: 'px-2.5 py-1 text-[11px] rounded-md',
      md: 'px-3 py-1.5 text-xs rounded-md'
    };
    return sizes[this.size] ?? sizes.sm;
  }

  get dotClass(): string {
    return this.variant === 'green' ? 'bg-[var(--accent)]' : 'bg-[var(--faint)]';
  }
}
