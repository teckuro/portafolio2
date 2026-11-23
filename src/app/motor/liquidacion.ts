/**
 * Extracto del motor de remuneraciones del ERP (ADR-04): una función pura,
 * sin Angular ni DOM. La usan la calculadora de la página y `liquidar()` en consola.
 *
 * Simplificado a propósito: UF fija del período y sin impuesto único.
 */

export interface ParametrosPeriodo {
  /** Período al que corresponden los parámetros, `YYYY-MM`. */
  periodo: string;
  uf: number;
  topeImponibleUf: number;
  topeCesantiaUf: number;
  /** AFP: 10% obligatorio + comisión de referencia. */
  tasaAfp: number;
  tasaSalud: number;
  tasaCesantia: number;
}

export const PERIODO_ACTUAL: ParametrosPeriodo = {
  periodo: '2026-11',
  uf: 40820.31, // la misma UF que muestra el panel de parámetros
  topeImponibleUf: 87.8,
  topeCesantiaUf: 131.9,
  tasaAfp: 0.1115,
  tasaSalud: 0.07,
  tasaCesantia: 0.006
};

export interface Liquidacion {
  bruto: number;
  imponible: number;
  afp: number;
  salud: number;
  cesantia: number;
  liquido: number;
  /** El bruto superó el tope imponible y se cortó la base. */
  topeAplicado: boolean;
}

export function calcularLiquidacion(bruto: number, p: ParametrosPeriodo = PERIODO_ACTUAL): Liquidacion {
  const montoBruto = Math.max(0, Math.round(bruto) || 0);
  const topeImponible = p.topeImponibleUf * p.uf;
  const imponible = Math.min(montoBruto, topeImponible);
  const afp = Math.round(imponible * p.tasaAfp);
  const salud = Math.round(imponible * p.tasaSalud);
  const cesantia = Math.round(Math.min(montoBruto, p.topeCesantiaUf * p.uf) * p.tasaCesantia);

  return {
    bruto: montoBruto,
    imponible: Math.round(imponible),
    afp,
    salud,
    cesantia,
    liquido: montoBruto - afp - salud - cesantia,
    topeAplicado: montoBruto > topeImponible
  };
}

export function formatearCLP(valor: number): string {
  return '$' + Math.max(0, Math.round(valor)).toLocaleString('es-CL');
}
