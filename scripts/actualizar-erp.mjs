#!/usr/bin/env node
/**
 * Actualiza src/app/content/erp-actividad.json con datos públicos del repo del ERP:
 * últimos commits (feat/fix/perf/refactor/test) y cifras (migraciones, módulos, commits).
 *
 * Corre solo antes de cada build (`prebuild`), así Vercel lo refresca en cada deploy.
 * Si GitHub no responde, deja el archivo como estaba y el build sigue.
 *
 * Opcional:
 *   GITHUB_TOKEN   sube el límite de la API (sin token: 60 consultas/hora).
 *   ERP_LOCAL      ruta a un clon local del ERP; si existe, también cuenta los tests.
 */
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const REPO = 'teckuro/ERP';
const RAMA = 'main';
const SALIDA = new URL('../src/app/content/erp-actividad.json', import.meta.url);
const TIPOS = /^(feat|fix|perf|refactor|test)(\(([^)]+)\))?!?:\s*(.+)$/;
const MAX_COMMITS = 6;

const headers = { Accept: 'application/vnd.github+json', 'User-Agent': 'portafolio-build' };
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function api(ruta) {
  const res = await fetch(`https://api.github.com/repos/${REPO}${ruta}`, { headers });
  if (!res.ok) {
    throw new Error(`${ruta} → HTTP ${res.status}`);
  }
  return res;
}

function anterior() {
  try {
    return JSON.parse(readFileSync(SALIDA, 'utf8'));
  } catch {
    return null;
  }
}

/** Cuenta `it(` / `test(` en los *.spec.ts de un clon local (la API no da esto barato). */
function contarTestsLocales(raiz) {
  let total = 0;
  const recorrer = (dir) => {
    for (const nombre of readdirSync(dir)) {
      if (['node_modules', 'dist', 'coverage'].includes(nombre) || nombre.startsWith('.')) continue;
      const ruta = join(dir, nombre);
      if (statSync(ruta).isDirectory()) {
        recorrer(ruta);
      } else if (nombre.endsWith('.spec.ts')) {
        total += (readFileSync(ruta, 'utf8').match(/^\s*(it|test)\(/gm) ?? []).length;
      }
    }
  };
  recorrer(raiz); // unitarios (src) y e2e
  return total;
}

async function main() {
  const previo = anterior();

  const commitsRes = await api(`/commits?sha=${RAMA}&per_page=60`);
  const lista = await commitsRes.json();
  const commits = lista
    .filter((c) => c.parents?.length === 1)
    .map((c) => {
      const asunto = c.commit.message.split('\n')[0];
      const m = asunto.match(TIPOS);
      if (!m) return null;
      return {
        sha: c.sha.slice(0, 7),
        fecha: c.commit.committer.date.slice(0, 10),
        tipo: m[1],
        alcance: m[3] ?? '',
        // Sin el código interno del backlog al final, p. ej. "(D3)".
        mensaje: m[4].replace(/\s*\([A-Z]\d+\)\s*$/, ''),
        url: c.html_url
      };
    })
    .filter(Boolean)
    .slice(0, MAX_COMMITS);

  // Total de commits: con per_page=1, la última página del header Link es el total.
  const totalRes = await api(`/commits?sha=${RAMA}&per_page=1`);
  const ultima = totalRes.headers.get('link')?.match(/[?&]page=(\d+)>; rel="last"/);
  const totalCommits = ultima ? Number(ultima[1]) : previo?.cifras?.commits ?? 0;

  const arbol = await (await api(`/git/trees/${RAMA}?recursive=1`)).json();
  const rutas = arbol.tree ?? [];
  const migraciones = rutas.filter((n) => n.type === 'blob' && /^supabase\/migrations\/.+\.sql$/.test(n.path)).length;
  const modulos = rutas.filter((n) => n.type === 'tree' && /^src\/app\/features\/[^/]+$/.test(n.path)).length;
  const specs = rutas.filter((n) => n.type === 'blob' && n.path.endsWith('.spec.ts')).length;

  const local = process.env.ERP_LOCAL;
  const tests = local && existsSync(join(local, 'src')) ? contarTestsLocales(local) : previo?.cifras?.tests ?? 0;

  const datos = {
    generado: new Date().toISOString().slice(0, 10),
    repo: `https://github.com/${REPO}`,
    cifras: { commits: totalCommits, migraciones, modulos, specs, tests },
    commits
  };
  writeFileSync(SALIDA, JSON.stringify(datos, null, 2) + '\n');
  console.log(`erp-actividad.json: ${commits.length} commits, ${migraciones} migraciones, ${modulos} módulos, ${tests} tests`);
}

main().catch((error) => {
  console.warn(`[actualizar-erp] Sin cambios (${error.message}). Se usa el archivo existente.`);
});
