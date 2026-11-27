#!/usr/bin/env node
/**
 * Escribe src/app/content/erp-publico.json con la URL y la clave pública (anon)
 * del Supabase del ERP. El simulador de liquidación la usa para leer, una vez por
 * visita, los indicadores del último período (RPC portafolio_parametros_publicos).
 *
 * El archivo está en .gitignore: la URL del proyecto no se versiona en este repo.
 * Variables (Vercel o .env.local en la raíz):
 *   ERP_SUPABASE_URL        https://<proyecto>.supabase.co
 *   ERP_SUPABASE_ANON_KEY   clave anon / publishable (pública por diseño)
 * Sin variables se escribe vacío y la página usa los parámetros del build.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const SALIDA = new URL('../src/app/content/erp-publico.json', import.meta.url);
const ENV_LOCAL = new URL('../.env.local', import.meta.url);

function leerEnvLocal() {
  if (!existsSync(ENV_LOCAL)) return {};
  return Object.fromEntries(
    readFileSync(ENV_LOCAL, 'utf8')
      .split(/\r?\n/)
      .filter((linea) => /^[A-Z_]+=/.test(linea))
      .map((linea) => {
        const i = linea.indexOf('=');
        return [linea.slice(0, i), linea.slice(i + 1).trim().replace(/^["']|["']$/g, '')];
      })
  );
}

const local = leerEnvLocal();
const url = (process.env.ERP_SUPABASE_URL ?? local.ERP_SUPABASE_URL ?? '').replace(/\/+$/, '');
const anonKey = process.env.ERP_SUPABASE_ANON_KEY ?? local.ERP_SUPABASE_ANON_KEY ?? '';

writeFileSync(SALIDA, JSON.stringify({ url, anonKey }, null, 2) + '\n');
console.log(`erp-publico.json: ${url && anonKey ? 'parámetros en vivo activados' : 'sin variables, se usan los del build'}`);
