import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay, withNoIncrementalHydration } from '@angular/platform-browser';

// Single-page site navigated by scrolling to sections, so no router is needed
export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection(), provideClientHydration(withEventReplay(), withNoIncrementalHydration())]
};
