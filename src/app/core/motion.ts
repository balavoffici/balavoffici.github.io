import { Injectable } from '@angular/core';

export function prefersReducedMotion(): boolean {
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Mouse or trackpad: cursor effects and pinned scroll scenes only make sense here */
export function hasFinePointer(): boolean {
  return typeof matchMedia !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/** Seconds until the opening titles have cleared, read from the `--enter` token set in index.html */
export function introDelayMs(): number {
  if (typeof document === 'undefined') {
    return 0;
  }
  const value = getComputedStyle(document.documentElement).getPropertyValue('--enter');
  return (parseFloat(value) || 0) * 1000;
}

interface Watcher<T> {
  read: () => T;
  write: (value: T) => void;
}

/**
 * Every scroll-linked effect shares one passive listener and one animation frame.
 * Reads for all watchers run before any writes, so layout is measured once per frame.
 */
@Injectable({ providedIn: 'root' })
export class ScrollEngine {
  private readonly watchers = new Set<Watcher<unknown>>();
  private frame = 0;
  private listening = false;

  private readonly schedule = () => {
    this.frame ||= requestAnimationFrame(this.run);
  };

  private readonly run = () => {
    this.frame = 0;
    const watchers = [...this.watchers];
    const values = watchers.map((watcher) => watcher.read());
    watchers.forEach((watcher, i) => watcher.write(values[i]));
  };

  /** Re-measure on the next frame, e.g. after a layout change that wasn't a scroll or resize */
  refresh() {
    this.schedule();
  }

  /** Browser only. Runs once immediately, then on every scroll/resize frame. Returns a stop function. */
  watch<T>(read: () => T, write: (value: T) => void): () => void {
    const watcher = { read, write } as Watcher<unknown>;
    this.watchers.add(watcher);
    if (!this.listening) {
      this.listening = true;
      addEventListener('scroll', this.schedule, { passive: true });
      addEventListener('resize', this.schedule, { passive: true });
    }
    write(read());
    return () => this.watchers.delete(watcher);
  }
}

/** One shared IntersectionObserver for every on-scroll reveal */
@Injectable({ providedIn: 'root' })
export class RevealObserver {
  private observer?: IntersectionObserver;
  private readonly callbacks = new WeakMap<Element, () => void>();

  observe(element: Element, onEnter: () => void) {
    this.observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.callbacks.get(entry.target)?.();
            this.unobserve(entry.target);
          }
        }
      },
      // Any visible pixel counts, so a card peeking into a carousel shows itself as a swipe cue
      { rootMargin: '0px 0px -12% 0px', threshold: 0 },
    );
    this.callbacks.set(element, onEnter);
    this.observer.observe(element);
  }

  unobserve(element: Element) {
    this.callbacks.delete(element);
    this.observer?.unobserve(element);
  }
}
