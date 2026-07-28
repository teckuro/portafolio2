# JP·Workspace

Demostración interactiva de cómo un Senior Software Engineer piensa, diseña y construye sistemas empresariales. No es una colección de proyectos: cada componente demuestra una capacidad profesional en vez de describirla.

**Live:** [jphuerta.vercel.app](https://jphuerta.vercel.app/)

## Qué contiene

- **Workspace** — simulación navegable del ERP de Remuneraciones (Chile): resumen, empleados, parámetros, proceso de nómina y reportes. La vista **Motor** ejecuta código real de cálculo (topes en UF, AFP, salud, cesantía).
- **Proyectos** — catálogo lista→detalle con problema, solución y diagrama de arquitectura por capas.
- **Thinking** — registros de decisión (ADR): problema, opciones, decisión, trade-offs y resultado.
- **Experiencia** — accordion con responsabilidades e impacto por cargo.
- **ES/EN** — todo el contenido en español e inglés, sin librerías de i18n (diccionarios tipados + servicio con `localStorage`).

## Stack

Angular 15 · TypeScript · Tailwind CSS. Sin librerías de UI ni de animación.

## Desarrollo

```bash
npm install
npm start        # http://localhost:4200
npm run build    # dist/jp-workspace
```

## Estructura

```
src/app/
├── content/            # SiteContent tipado + diccionarios ES/EN
├── services/           # LanguageService (idioma + meta del documento)
├── components/
│   ├── erp-workspace/  # Shell del producto: sidebar + 6 vistas
│   ├── navbar/         # Nav + toggle ES/EN
│   └── footer/
└── app.component.*     # Hero, proyectos, thinking, experiencia, contacto
```
