import { DOCUMENT, Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

export { gsap, ScrollTrigger, SplitText };

/**
 * One owner for the animation runtime: registers GSAP plugins, drives Lenis
 * from GSAP's ticker so smooth scroll and ScrollTrigger share a clock, and
 * gates the hero entrance on the preloader.
 */
@Injectable({ providedIn: 'root' })
export class Motion {
  private readonly document = inject(DOCUMENT);
  readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Honours the OS setting; every scene degrades to a static layout. */
  readonly reduced = signal(false);

  /** Resolved once the preloader finishes (or is skipped). */
  readonly introDone: Promise<void>;
  private resolveIntro!: () => void;

  private lenis?: Lenis;
  private started = false;
  private refreshQueued = false;

  constructor() {
    this.introDone = new Promise((resolve) => (this.resolveIntro = resolve));
  }

  start(): void {
    if (!this.isBrowser || this.started) return;
    this.started = true;

    gsap.registerPlugin(ScrollTrigger, SplitText);
    gsap.defaults({ ease: 'expo.out', duration: 1.2 });

    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.reduced.set(media.matches);
    if (this.reduced()) return;

    this.lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, autoRaf: false });
    this.lenis.on('scroll', ScrollTrigger.update);
    // GSAP's default lag smoothing stays on: boot stalls (hydration, shader
    // compile) would otherwise fast-forward the preloader
    gsap.ticker.add((time) => this.lenis?.raf(time * 1000));

    // Fonts swap in late and shift every trigger's start/end
    this.document.fonts?.ready.then(() => this.refresh());

    if (this.document.documentElement.classList.contains('intro')) this.lenis.stop();
  }

  finishIntro(): void {
    this.document.documentElement.classList.remove('intro');
    this.lenis?.start();
    this.resolveIntro();
  }

  scrollTo(target: string | HTMLElement): void {
    const el = typeof target === 'string' ? this.document.querySelector<HTMLElement>(target) : target;
    if (!el) return;
    if (this.lenis) {
      this.lenis.scrollTo(el, { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) });
    } else {
      el.scrollIntoView({ behavior: this.reduced() ? 'auto' : 'smooth' });
    }
  }

  /** Freezes page scroll, e.g. while the mobile menu covers the screen. */
  lock(locked: boolean): void {
    if (this.lenis) {
      if (locked) this.lenis.stop();
      else this.lenis.start();
    } else {
      this.document.documentElement.style.overflow = locked ? 'hidden' : '';
    }
  }

  get velocity(): number {
    return this.lenis?.velocity ?? 0;
  }

  /** Coalesces the many refresh requests scenes make while they mount. */
  refresh(): void {
    if (this.refreshQueued) return;
    this.refreshQueued = true;
    requestAnimationFrame(() => {
      this.refreshQueued = false;
      ScrollTrigger.refresh();
    });
  }
}
