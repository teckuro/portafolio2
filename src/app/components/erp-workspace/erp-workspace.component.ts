import { LucideExternalLink } from '@lucide/angular';
import { Component, inject } from '@angular/core';
import { SiteContent } from '../../content/content.model';
import { LanguageService } from '../../services/language.service';
import { Liquidacion, calcularLiquidacion, formatearCLP } from '../../motor/liquidacion';

@Component({
  imports: [LucideExternalLink],
  selector: 'app-erp-workspace',
  templateUrl: './erp-workspace.component.html'
})
export class ErpWorkspaceComponent {
  private readonly language = inject(LanguageService);

  demoGross = 1500000;

  get t(): SiteContent['workspace'] {
    return this.language.content.workspace;
  }

  onDemoGrossChange(value: string): void {
    const parsed = Number(String(value).replace(/[^\d]/g, ''));
    this.demoGross = Number.isFinite(parsed) ? Math.min(parsed, 99_999_999) : 0;
  }

  /** Cálculo del motor compartido (mismo código que `liquidar()` en consola). */
  get demoBreakdown(): Liquidacion {
    return calcularLiquidacion(this.demoGross);
  }

  formatCLP(value: number): string {
    return formatearCLP(value);
  }
}
