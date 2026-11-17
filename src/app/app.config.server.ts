import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, RenderMode, ServerRoute, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';

/** Sitio de una sola página: se prerenderiza completo en build (SSG). */
const serverRoutes: ServerRoute[] = [{ path: '**', renderMode: RenderMode.Prerender }];

export const serverConfig: ApplicationConfig = mergeApplicationConfig(appConfig, {
  providers: [provideServerRendering(withRoutes(serverRoutes))],
});
