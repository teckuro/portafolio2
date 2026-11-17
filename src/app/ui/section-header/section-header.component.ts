import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  imports: [NgClass],
  selector: 'app-section-header',
  templateUrl: './section-header.component.html'
})
export class SectionHeaderComponent {
  @Input() eyebrow = '';
  @Input() title = '';
  @Input() highlight?: string;
  @Input() subtitle?: string;
  @Input() align: 'center' | 'left' = 'center';

  get alignClass(): string {
    return this.align === 'center' ? 'text-center items-center' : 'text-left items-start';
  }
}

