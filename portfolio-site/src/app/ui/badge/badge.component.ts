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
    const variants: Record<BadgeVariant, string> = {
      violet: 'bg-violet-500/12 border-violet-500/25 text-violet-300',
      cyan: 'bg-cyan-500/12 border-cyan-500/25 text-cyan-300',
      indigo: 'bg-indigo-500/12 border-indigo-500/25 text-indigo-300',
      green: 'bg-emerald-500/12 border-emerald-500/25 text-emerald-300',
      ghost: 'bg-white/5 border-white/10 text-slate-400',
      orange: 'bg-orange-500/12 border-orange-500/25 text-orange-300',
      pink: 'bg-pink-500/12 border-pink-500/25 text-pink-300',
      yellow: 'bg-yellow-500/12 border-yellow-500/25 text-yellow-300',
      teal: 'bg-teal-500/12 border-teal-500/25 text-teal-300',
      red: 'bg-red-500/12 border-red-500/25 text-red-300'
    };
    return variants[this.variant] ?? variants.ghost;
  }

  get sizeClass(): string {
    const sizes: Record<BadgeSize, string> = {
      sm: 'px-2.5 py-1 text-[11px]',
      md: 'px-3.5 py-1.5 text-xs'
    };
    return sizes[this.size] ?? sizes.sm;
  }

  get dotClass(): string {
    const dots: Record<BadgeVariant, string> = {
      violet: 'bg-violet-400',
      cyan: 'bg-cyan-400',
      indigo: 'bg-indigo-400',
      green: 'bg-emerald-400',
      ghost: 'bg-slate-400',
      orange: 'bg-orange-400',
      pink: 'bg-pink-400',
      yellow: 'bg-yellow-400',
      teal: 'bg-teal-400',
      red: 'bg-red-400'
    };
    return dots[this.variant] ?? dots.ghost;
  }
}

