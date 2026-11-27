/**
 * Monto en palabras para la línea "Son: …" de la liquidación, como se imprime
 * en una liquidación de sueldo chilena. Cubre 0 … 999.999.999.
 */
import { Lang } from '../content/content.model';

const UNIDADES = [
  'cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
  'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve',
  'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho', 'veintinueve'
];
const DECENAS = ['', '', '', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const CENTENAS = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

/** 0–999 en palabras, con "uno" al final (la apócope a "un" la decide quien llama). */
function centenaEs(n: number): string {
  if (n === 100) return 'cien';
  const c = Math.floor(n / 100);
  const resto = n % 100;
  const partes: string[] = [];
  if (c) partes.push(CENTENAS[c]);
  if (resto) {
    if (resto < 30) {
      partes.push(UNIDADES[resto]);
    } else {
      const d = Math.floor(resto / 10);
      const u = resto % 10;
      partes.push(u ? `${DECENAS[d]} y ${UNIDADES[u]}` : DECENAS[d]);
    }
  }
  return partes.join(' ');
}

/** "uno" → "un", "veintiuno" → "veintiún" (delante de mil, millón o pesos). */
function apocope(texto: string): string {
  return texto.replace(/veintiuno$/, 'veintiún').replace(/uno$/, 'un');
}

/** Número en palabras, sin la moneda. */
export function numeroEnPalabrasEs(valor: number): string {
  const n = Math.max(0, Math.floor(valor));
  if (n === 0) return 'cero';

  const millones = Math.floor(n / 1_000_000);
  const miles = Math.floor((n % 1_000_000) / 1000);
  const resto = n % 1000;
  const partes: string[] = [];

  if (millones) {
    partes.push(millones === 1 ? 'un millón' : `${apocope(centenaEs(millones))} millones`);
  }
  if (miles) {
    partes.push(miles === 1 ? 'mil' : `${apocope(centenaEs(miles))} mil`);
  }
  if (resto) {
    partes.push(centenaEs(resto));
  }
  return partes.join(' ');
}

/**
 * Agrega la moneda a las palabras: es la parte que distingue una liquidación
 * bien impresa de una calculadora.
 */
export function conPesos(palabras: string, n: number): string {
  // TODO(human): ajustar la gramática de la moneda (ver la petición en el chat).
  return `${palabras} pesos`;
}

/* ---------- English ---------- */

const ONES = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function hundredEn(n: number): string {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const parts: string[] = [];
  if (h) parts.push(`${ONES[h]} hundred`);
  if (r) parts.push(r < 20 ? ONES[r] : TENS[Math.floor(r / 10)] + (r % 10 ? `-${ONES[r % 10]}` : ''));
  return parts.join(' ');
}

function numberInWordsEn(valor: number): string {
  const n = Math.max(0, Math.floor(valor));
  if (n === 0) return 'zero';
  const millions = Math.floor(n / 1_000_000);
  const thousands = Math.floor((n % 1_000_000) / 1000);
  const rest = n % 1000;
  const parts: string[] = [];
  if (millions) parts.push(`${hundredEn(millions)} million`);
  if (thousands) parts.push(`${hundredEn(thousands)} thousand`);
  if (rest) parts.push(hundredEn(rest));
  return parts.join(' ');
}

/** "Son: …" en el idioma de la página. */
export function montoEnPalabras(valor: number, lang: Lang): string {
  const n = Math.max(0, Math.round(valor));
  if (lang === 'en') {
    return `${numberInWordsEn(n)} ${n === 1 ? 'peso' : 'pesos'}`;
  }
  return conPesos(numeroEnPalabrasEs(n), n);
}
