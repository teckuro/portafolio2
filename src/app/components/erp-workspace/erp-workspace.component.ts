import { Component, inject } from '@angular/core';
import { SiteContent } from '../../content/content.model';
import { LanguageService } from '../../services/language.service';
import { Liquidacion, calcularLiquidacion, formatearCLP } from '../../motor/liquidacion';
import { montoEnPalabras } from '../../motor/en-palabras';

@Component({
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

  /** Total de descuentos legales, para la columna derecha de la liquidación. */
  get totalDescuentos(): number {
    const l = this.demoBreakdown;
    return l.afp + l.salud + l.cesantia;
  }

  /** Línea "Son: …" de la liquidación impresa. */
  get liquidoEnPalabras(): string {
    return montoEnPalabras(this.demoBreakdown.liquido, this.language.lang);
  }

  formatCLP(value: number): string {
    return formatearCLP(value);
  }
}
