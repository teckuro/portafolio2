import { Component, inject } from '@angular/core';
import { SiteContent, WorkspaceParam } from '../../content/content.model';
import { LanguageService } from '../../services/language.service';
import { ErpEnVivoService, IndicadoresPeriodo } from '../../services/erp-en-vivo.service';
import { Liquidacion, ParametrosPeriodo, calcularLiquidacion, formatearCLP } from '../../motor/liquidacion';
import { montoEnPalabras } from '../../motor/en-palabras';

@Component({
  selector: 'app-erp-workspace',
  templateUrl: './erp-workspace.component.html'
})
export class ErpWorkspaceComponent {
  private readonly language = inject(LanguageService);
  private readonly erp = inject(ErpEnVivoService);

  demoGross = 1500000;

  get t(): SiteContent['workspace'] {
    return this.language.content.workspace;
  }

  /** Parámetros del motor: los del último período de la base, o los del build. */
  get p(): ParametrosPeriodo {
    return this.erp.motor();
  }

  get enVivo(): boolean {
    return this.erp.parametros() !== null;
  }

  onDemoGrossChange(value: string): void {
    const parsed = Number(String(value).replace(/[^\d]/g, ''));
    this.demoGross = Number.isFinite(parsed) ? Math.min(parsed, 99_999_999) : 0;
  }

  /** Cálculo del motor compartido (mismo código que `liquidar()` en consola). */
  get demoBreakdown(): Liquidacion {
    return calcularLiquidacion(this.demoGross, this.p);
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

  /** "Noviembre 2026" a partir de `2026-11`, en UTC para que no dependa de la zona del visitante. */
  get periodoLargo(): string {
    const [anio, mes] = this.p.periodo.split('-').map(Number);
    const nombre = new Intl.DateTimeFormat(this.locale, { month: 'long', timeZone: 'UTC' }).format(
      new Date(Date.UTC(anio, mes - 1, 1))
    );
    return `${nombre.charAt(0).toUpperCase()}${nombre.slice(1)} ${anio}`;
  }

  get rotulos(): { imponible: string; afp: string; salud: string; cesantia: string } {
    const m = this.t.motor;
    const p = this.p;
    return {
      imponible: rellenar(m.taxableLabel, { tope: this.numero(p.topeImponibleUf) }),
      afp: rellenar(m.afpLabel, { afp: p.afpNombre ? ` ${p.afpNombre}` : '', tasa: this.numero(p.tasaAfp * 100) }),
      salud: rellenar(m.healthLabel, { tasa: this.numero(p.tasaSalud * 100) }),
      cesantia: rellenar(m.unemploymentLabel, { tasa: this.numero(p.tasaCesantia * 100) })
    };
  }

  /** Panel de indicadores: el último período y su variación contra el anterior. */
  get indicadores(): WorkspaceParam[] {
    const vivo = this.erp.parametros();
    const respaldo = this.t.parametros.items;
    if (!vivo) {
      return respaldo;
    }
    const { actual, anterior } = vivo;
    const fila = (i: number, clave: keyof Omit<IndicadoresPeriodo, 'periodo'>, decimales = 0): WorkspaceParam => ({
      label: respaldo[i]?.label ?? clave,
      value: '$' + actual[clave].toLocaleString(this.locale, { minimumFractionDigits: decimales, maximumFractionDigits: decimales }),
      delta: this.variacion(actual[clave], anterior?.[clave])
    });
    return [fila(0, 'uf', 2), fila(1, 'utm'), fila(2, 'uta'), fila(3, 'sueldoMinimo')];
  }

  formatCLP(value: number): string {
    return formatearCLP(value);
  }

  private get locale(): string {
    return this.language.lang === 'es' ? 'es-CL' : 'en-US';
  }

  private numero(valor: number): string {
    return valor.toLocaleString(this.locale, { maximumFractionDigits: 2 });
  }

  private variacion(actual: number, anterior: number | undefined): string {
    if (!anterior) {
      return '';
    }
    const pct = ((actual - anterior) / anterior) * 100;
    if (Math.abs(pct) < 0.005) {
      return this.t.parametros.noChange;
    }
    const texto = Math.abs(pct).toLocaleString(this.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${pct > 0 ? '+' : '−'}${texto}%`;
  }
}

/** Reemplaza `{clave}` en una plantilla de contenido. */
function rellenar(plantilla: string, valores: Record<string, string>): string {
  return plantilla.replace(/\{(\w+)\}/g, (_, clave: string) => valores[clave] ?? '');
}
