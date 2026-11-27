import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import actividadBuild from '../content/erp-actividad.json';
import erpPublico from '../content/erp-publico.json';
import { PERIODO_ACTUAL, ParametrosPeriodo } from '../motor/liquidacion';

export type ActividadErp = typeof actividadBuild;
type CommitErp = ActividadErp['commits'][number];

/** Indicadores que muestra el panel "Parámetros del período". */
export interface IndicadoresPeriodo {
  periodo: string;
  uf: number;
  utm: number;
  uta: number;
  sueldoMinimo: number;
}

export interface ParametrosEnVivo {
  motor: ParametrosPeriodo;
  actual: IndicadoresPeriodo;
  anterior: IndicadoresPeriodo | null;
}

const REPO = 'teckuro/ERP';
const MAX_COMMITS = 6;
const TIPOS = /^(feat|fix|perf|refactor|test)(\(([^)]+)\))?!?:\s*(.+)$/;
/** Una visita consulta una vez; recargar dentro de este plazo reutiliza la respuesta. */
const CACHE_MS = 10 * 60 * 1000;

interface GithubCommit {
  sha: string;
  html_url: string;
  parents?: unknown[];
  commit: { message: string; committer: { date: string } };
}

interface FilaPeriodo {
  periodo: string;
  uf: number;
  utm: number;
  uta: number;
  sueldo_minimo: number;
  tope_afp_uf: number;
  tope_cesantia_uf: number;
  salud_obligatoria: number;
  afc_trabajador_indefinido: number;
}

interface RespuestaParametros {
  periodos: FilaPeriodo[];
  afp: { nombre: string; tasa_obligatoria: number; comision: number } | null;
}

/**
 * Datos vivos del ERP para la página: últimos commits (GitHub) y parámetros del
 * último período cargado (Supabase). Arranca con lo que trajo el build, consulta
 * una sola vez por visita (con caché de sesión) y actualiza las señales; si algo
 * falla, la página sigue con los datos del build.
 */
@Injectable({ providedIn: 'root' })
export class ErpEnVivoService {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private iniciado = false;

  readonly actividad = signal<ActividadErp>(actividadBuild);
  readonly parametros = signal<ParametrosEnVivo | null>(null);

  /** Motor con los parámetros vigentes: los del ERP si llegaron, si no los del build. */
  motor(): ParametrosPeriodo {
    return this.parametros()?.motor ?? PERIODO_ACTUAL;
  }

  cargarUnaVez(): void {
    if (!this.isBrowser || this.iniciado) {
      return;
    }
    this.iniciado = true;
    void this.cargarCommits();
    void this.cargarParametros();
  }

  private async cargarCommits(): Promise<void> {
    try {
      const datos = await conCache('erp.vivo.commits', async () => {
        const base = `https://api.github.com/repos/${REPO}/commits?sha=main`;
        const cabeceras = { Accept: 'application/vnd.github+json' };
        const [listaRes, totalRes] = await Promise.all([
          fetch(`${base}&per_page=40`, { headers: cabeceras }),
          fetch(`${base}&per_page=1`, { headers: cabeceras })
        ]);
        if (!listaRes.ok) {
          throw new Error(`GitHub ${listaRes.status}`);
        }
        const lista = (await listaRes.json()) as GithubCommit[];
        // Con per_page=1, la última página del header Link es el total de commits.
        const ultima = totalRes.headers.get('link')?.match(/[?&]page=(\d+)>; rel="last"/);
        return { commits: lista.map(aCommit).filter(esCommit).slice(0, MAX_COMMITS), total: ultima ? Number(ultima[1]) : null };
      });

      if (!datos.commits.length) {
        return;
      }
      const build = this.actividad();
      this.actividad.set({
        ...build,
        generado: new Date().toISOString().slice(0, 10),
        cifras: { ...build.cifras, commits: datos.total ?? build.cifras.commits },
        commits: datos.commits
      });
    } catch {
      // Sin red o límite de la API: quedan los commits del build.
    }
  }

  private async cargarParametros(): Promise<void> {
    if (!erpPublico.url || !erpPublico.anonKey) {
      return;
    }
    try {
      const datos = await conCache('erp.vivo.parametros', async () => {
        const res = await fetch(`${erpPublico.url}/rest/v1/rpc/portafolio_parametros_publicos`, {
          method: 'POST',
          headers: { apikey: erpPublico.anonKey, 'Content-Type': 'application/json' },
          body: '{}'
        });
        if (!res.ok) {
          throw new Error(`Supabase ${res.status}`);
        }
        return (await res.json()) as RespuestaParametros;
      });
      this.parametros.set(aParametros(datos));
    } catch {
      // Sin respuesta válida: el simulador sigue con los parámetros del build.
    }
  }
}

function aCommit(c: GithubCommit): CommitErp | null {
  if (c.parents?.length !== 1) {
    return null; // merges fuera
  }
  const m = c.commit.message.split('\n')[0].match(TIPOS);
  if (!m) {
    return null;
  }
  return {
    sha: c.sha.slice(0, 7),
    fecha: c.commit.committer.date.slice(0, 10),
    tipo: m[1],
    alcance: m[3] ?? '',
    mensaje: m[4].replace(/\s*\([A-Z]\d+\)\s*$/, ''),
    url: c.html_url
  };
}

function esCommit(c: CommitErp | null): c is CommitErp {
  return c !== null;
}

const positivo = (v: unknown): number | null => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
};

function aIndicadores(f: FilaPeriodo): IndicadoresPeriodo | null {
  const uf = positivo(f.uf);
  if (!uf || !/^\d{4}-\d{2}$/.test(f.periodo)) {
    return null;
  }
  return {
    periodo: f.periodo,
    uf,
    utm: positivo(f.utm) ?? 0,
    uta: positivo(f.uta) ?? 0,
    sueldoMinimo: positivo(f.sueldo_minimo) ?? 0
  };
}

/** Respuesta de la RPC → parámetros del motor; null si no trae un período utilizable. */
function aParametros(r: RespuestaParametros): ParametrosEnVivo | null {
  const [ultimo, previo] = r.periodos ?? [];
  const actual = ultimo ? aIndicadores(ultimo) : null;
  if (!ultimo || !actual) {
    return null;
  }
  const afpTasa = r.afp ? positivo(Number(r.afp.tasa_obligatoria) + Number(r.afp.comision)) : null;
  return {
    actual,
    anterior: previo ? aIndicadores(previo) : null,
    motor: {
      periodo: actual.periodo,
      uf: actual.uf,
      topeImponibleUf: positivo(ultimo.tope_afp_uf) ?? PERIODO_ACTUAL.topeImponibleUf,
      topeCesantiaUf: positivo(ultimo.tope_cesantia_uf) ?? PERIODO_ACTUAL.topeCesantiaUf,
      tasaAfp: afpTasa ? afpTasa / 100 : PERIODO_ACTUAL.tasaAfp,
      afpNombre: afpTasa ? r.afp?.nombre : undefined,
      tasaSalud: (positivo(ultimo.salud_obligatoria) ?? PERIODO_ACTUAL.tasaSalud * 100) / 100,
      tasaCesantia: (positivo(ultimo.afc_trabajador_indefinido) ?? PERIODO_ACTUAL.tasaCesantia * 100) / 100
    }
  };
}

/** Respuesta guardada en sessionStorage por {@link CACHE_MS}; recargar no vuelve a pedirla. */
async function conCache<T>(clave: string, pedir: () => Promise<T>): Promise<T> {
  try {
    const guardado = JSON.parse(sessionStorage.getItem(clave) ?? 'null') as { t: number; datos: T } | null;
    if (guardado && Date.now() - guardado.t < CACHE_MS) {
      return guardado.datos;
    }
  } catch {
    // storage no disponible o dañado: se consulta igual
  }
  const datos = await pedir();
  try {
    sessionStorage.setItem(clave, JSON.stringify({ t: Date.now(), datos }));
  } catch {
    // sin storage: solo esta carga
  }
  return datos;
}
