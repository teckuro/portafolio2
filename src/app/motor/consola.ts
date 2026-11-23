import { Lang } from '../content/content.model';
import { Liquidacion, PERIODO_ACTUAL, calcularLiquidacion, formatearCLP } from './liquidacion';

/**
 * `liquidar(bruto)` en la consola del navegador: imprime la liquidación como una
 * boleta con los colores de la página y devuelve el objeto con el detalle.
 * Es el mismo motor que usa la calculadora.
 */

const ANCHO = 44; // caracteres por línea dentro del recuadro

const ESTILO = {
  marco: 'font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:12px;line-height:1.55;background:#18191c;color:#5f6168',
  texto: 'font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:12px;line-height:1.55;background:#18191c;color:#dcdde0',
  tenue: 'font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:12px;line-height:1.55;background:#18191c;color:#888a91',
  titulo: 'font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:12px;line-height:1.55;background:#18191c;color:#ffffff;font-weight:600',
  total: 'font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:12px;line-height:1.55;background:#2c3a52;color:#ffffff;font-weight:600',
  nota: 'font-family:"IBM Plex Mono",ui-monospace,monospace;font-size:11px;color:#888a91'
} as const;

const TEXTOS = {
  es: {
    titulo: 'LIQUIDACIÓN · simulación',
    periodo: (p: string, uf: string) => `Período ${p} · UF ${uf}`,
    bruto: 'Sueldo bruto',
    imponible: 'Imponible',
    afp: 'AFP 11,15%',
    salud: 'Salud 7%',
    cesantia: 'Seguro cesantía 0,6%',
    liquido: 'LÍQUIDO ESTIMADO',
    tope: 'Se aplicó el tope imponible de 87,8 UF.',
    nota: 'UF fija y sin impuesto único. Motor completo: github.com/teckuro/ERP',
    uso: 'Uso: liquidar(1500000) · el sueldo bruto en pesos, sin puntos.',
    pista: 'Prueba el motor del ERP aquí mismo:'
  },
  en: {
    titulo: 'PAYSLIP · simulation',
    periodo: (p: string, uf: string) => `Period ${p} · UF ${uf}`,
    bruto: 'Gross salary',
    imponible: 'Taxable base',
    afp: 'Pension 11.15%',
    salud: 'Health 7%',
    cesantia: 'Unemployment 0.6%',
    liquido: 'ESTIMATED NET PAY',
    tope: 'The 87.8 UF taxable cap was applied.',
    nota: 'Fixed UF, no income tax. Full engine: github.com/teckuro/ERP',
    uso: 'Usage: liquidar(1500000) · gross salary in CLP, no separators.',
    pista: 'Try the ERP engine right here:'
  }
} as const;

type Segmento = [texto: string, estilo: string];

/** Línea "│ etiqueta ........ valor │" con puntos de relleno hasta el ancho fijo. */
function fila(etiqueta: string, valor: string, estiloValor: string = ESTILO.texto): Segmento[] {
  const puntos = '.'.repeat(Math.max(2, ANCHO - etiqueta.length - valor.length - 2));
  return [
    ['│ ', ESTILO.marco],
    [etiqueta + ' ', ESTILO.texto],
    [puntos, ESTILO.marco],
    [' ' + valor, estiloValor],
    [' │\n', ESTILO.marco]
  ];
}

function texto(contenido: string, estilo: string): Segmento[] {
  return [
    ['│ ', ESTILO.marco],
    [contenido.padEnd(ANCHO), estilo],
    [' │\n', ESTILO.marco]
  ];
}

const ufConDecimales = (): string =>
  '$' + PERIODO_ACTUAL.uf.toLocaleString('es-CL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const borde = (izq: string, der: string): Segmento[] => [[izq + '─'.repeat(ANCHO + 2) + der + '\n', ESTILO.marco]];

function imprimir(liq: Liquidacion, lang: Lang): void {
  const t = TEXTOS[lang];
  const menos = (v: number) => '−' + formatearCLP(v);
  const segmentos: Segmento[] = [
    ...borde('┌', '┐'),
    ...texto(t.titulo, ESTILO.titulo),
    ...texto(t.periodo(PERIODO_ACTUAL.periodo, ufConDecimales()), ESTILO.tenue),
    ...borde('├', '┤'),
    ...fila(t.bruto, formatearCLP(liq.bruto)),
    ...fila(t.imponible, formatearCLP(liq.imponible)),
    ...fila(t.afp, menos(liq.afp), ESTILO.tenue),
    ...fila(t.salud, menos(liq.salud), ESTILO.tenue),
    ...fila(t.cesantia, menos(liq.cesantia), ESTILO.tenue),
    ...borde('├', '┤'),
    ['│ ', ESTILO.marco],
    [
      (t.liquido + ' ' + formatearCLP(liq.liquido).padStart(ANCHO - t.liquido.length - 1)),
      ESTILO.total
    ],
    [' │\n', ESTILO.marco],
    ...borde('└', '┘')
  ];

  console.log(segmentos.map(([s]) => '%c' + s).join(''), ...segmentos.map(([, e]) => e));
  if (liq.topeAplicado) {
    console.log('%c' + t.tope, ESTILO.nota);
  }
  console.log('%c' + t.nota, ESTILO.nota);
}

/** Registra `window.liquidar` e imprime el saludo con la pista de uso. */
export function instalarLiquidar(idioma: () => Lang, saludo: { title: string; body: string }): void {
  if (typeof window === 'undefined') {
    return;
  }

  const liquidar = (bruto: unknown = 1_500_000): Liquidacion | undefined => {
    const t = TEXTOS[idioma()];
    const monto = typeof bruto === 'string' ? Number(bruto.replace(/[^\d]/g, '')) : Number(bruto);
    if (!Number.isFinite(monto) || monto <= 0) {
      console.log('%c' + t.uso, ESTILO.nota);
      return undefined;
    }
    const liq = calcularLiquidacion(monto);
    imprimir(liq, idioma());
    return liq;
  };

  (window as unknown as { liquidar: typeof liquidar }).liquidar = liquidar;

  const t = TEXTOS[idioma()];
  console.log('%c' + saludo.title, 'font-family:"IBM Plex Sans",system-ui,sans-serif;font-size:14px;font-weight:600;color:#3d5a85');
  console.log('%c' + saludo.body, 'color:#888a91;line-height:1.5');
  console.log(
    '%c' + t.pista + ' %cliquidar(2500000)',
    'color:#888a91',
    'font-family:"IBM Plex Mono",ui-monospace,monospace;background:#cfd8e6;color:#1a1b1e;padding:1px 4px;border-radius:3px'
  );
}
