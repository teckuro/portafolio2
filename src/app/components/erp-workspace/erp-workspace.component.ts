
import { LucideExternalLink } from '@lucide/angular';
import { Component } from '@angular/core';
import { SiteContent } from '../../content/content.model';
import { LanguageService } from '../../services/language.service';

@Component({
  imports: [LucideExternalLink],
  selector: 'app-erp-workspace',
  templateUrl: './erp-workspace.component.html'
})
export class ErpWorkspaceComponent {
  demoGross = 1500000;

  /** Valores referenciales del motor (UF y topes imponibles). */
  private readonly UF_CLP = 39500;
  private readonly TOPE_IMPONIBLE_UF = 87.8;
  private readonly TOPE_CESANTIA_UF = 131.9;

  constructor(private readonly language: LanguageService) {}

  get t(): SiteContent['workspace'] {
    return this.language.content.workspace;
  }

  onDemoGrossChange(value: string): void {
    const parsed = Number(String(value).replace(/[^\d]/g, ''));
    this.demoGross = Number.isFinite(parsed) ? Math.min(parsed, 99_999_999) : 0;
  }

  /** Cálculo simplificado: AFP + salud + cesantía con topes en UF. Sin impuesto único. */
  get demoBreakdown(): { imponible: number; afp: number; salud: number; cesantia: number; liquido: number } {
    const gross = this.demoGross || 0;
    const imponible = Math.min(gross, this.TOPE_IMPONIBLE_UF * this.UF_CLP);
    const afp = Math.round(imponible * 0.1115);
    const salud = Math.round(imponible * 0.07);
    const cesantia = Math.round(Math.min(gross, this.TOPE_CESANTIA_UF * this.UF_CLP) * 0.006);
    return {
      imponible: Math.round(imponible),
      afp,
      salud,
      cesantia,
      liquido: gross - afp - salud - cesantia
    };
  }

  formatCLP(value: number): string {
    return '$' + Math.max(0, value).toLocaleString('es-CL');
  }
}
