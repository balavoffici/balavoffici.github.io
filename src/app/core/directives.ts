import {
  DestroyRef,
  Directive,
  ElementRef,
  afterNextRender,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { RevealObserver, ScrollEngine, introDelayMs, prefersReducedMotion } from './motion';

/**
 * Fades/slides the host in the first time it scrolls into view.
 * Variants (`reveal="mask"` etc.) are styled in styles.css; hidden only once JS runs (`html.js`).
 */
@Directive({
  selector: '[reveal]',
  host: {
    '[attr.data-reveal]': 'reveal() || "up"',
    '[style.--d.ms]': 'revealDelay()',
  },
})
export class RevealDirective {
  readonly reveal = input<'' | 'up' | 'mask' | 'zoom' | 'left' | 'right' | 'blur'>('');
  readonly revealDelay = input(0, { transform: numberAttribute });

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const observer = inject(RevealObserver);
    afterNextRender(() => observer.observe(element, () => element.classList.add('in')));
    inject(DestroyRef).onDestroy(() => observer.unobserve(element));
  }
}

/** Pulls the host toward the cursor while hovered */
@Directive({
  selector: '[magnetic]',
  host: {
    '(pointermove)': 'move($event)',
    '(pointerleave)': 'reset()',
  },
})
export class MagneticDirective {
  readonly magnetic = input(0.3, { transform: (value: unknown) => numberAttribute(value, 0.3) });
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  move(event: PointerEvent) {
    if (event.pointerType !== 'mouse') {
      return;
    }
    const rect = this.element.getBoundingClientRect();
    const strength = this.magnetic();
    this.element.style.setProperty('--mx', `${(event.clientX - rect.left - rect.width / 2) * strength}px`);
    this.element.style.setProperty('--my', `${(event.clientY - rect.top - rect.height / 2) * strength}px`);
  }

  reset() {
    this.element.style.removeProperty('--mx');
    this.element.style.removeProperty('--my');
  }
}

/**
 * Writes the host's scroll progress (0–1) to `--p` for CSS to animate against.
 * `view`: from the host's top entering the viewport to its bottom leaving it.
 * `pin`: across a tall host whose child is `position: sticky`.
 * `exit`: from the host's top at the viewport top until it has scrolled fully out.
 */
@Directive({ selector: '[scrollProgress]' })
export class ScrollProgressDirective {
  readonly scrollProgress = input<'' | 'view' | 'pin' | 'exit'>('');

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const engine = inject(ScrollEngine);
    const destroyRef = inject(DestroyRef);
    let last = -1;

    afterNextRender(() => {
      const stop = engine.watch(
        () => {
          const rect = element.getBoundingClientRect();
          const vh = innerHeight;
          switch (this.scrollProgress()) {
            case 'pin':
              return -rect.top / Math.max(rect.height - vh, 1);
            case 'exit':
              return -rect.top / Math.max(rect.height, 1);
            default:
              return (vh - rect.top) / (vh + rect.height);
          }
        },
        (raw) => {
          const value = Math.round(Math.min(Math.max(raw, 0), 1) * 1000) / 1000;
          if (value !== last) {
            last = value;
            element.style.setProperty('--p', String(value));
          }
        },
      );
      destroyRef.onDestroy(stop);
    });
  }
}

/**
 * Counts the host's number up from 0 when it comes into view.
 * The server renders the final value, so no-JS and reduced-motion visitors see it directly.
 */
@Directive({ selector: '[countUp]' })
export class CountUpDirective {
  readonly countUp = input.required({ transform: numberAttribute });
  /** Hold until the opening titles have cleared */
  readonly countAfterIntro = input(false, { transform: (value: unknown) => value !== false && value !== 'false' });

  constructor() {
    const element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const observer = inject(RevealObserver);

    afterNextRender(() => {
      if (prefersReducedMotion()) {
        return;
      }
      const target = this.countUp();
      element.textContent = '0';
      observer.observe(element, () => {
        const start = () => {
          const began = performance.now();
          const duration = 1600;
          const tick = (now: number) => {
            const t = Math.min((now - began) / duration, 1);
            const eased = 1 - Math.pow(2, -10 * t);
            element.textContent = String(Math.round(target * (t === 1 ? 1 : eased)));
            if (t < 1) {
              requestAnimationFrame(tick);
            }
          };
          requestAnimationFrame(tick);
        };
        const wait = this.countAfterIntro() ? introDelayMs() : 0;
        wait ? setTimeout(start, wait) : start();
      });
    });
    inject(DestroyRef).onDestroy(() => observer.unobserve(element));
  }
}

export const MOTION = [RevealDirective, MagneticDirective, ScrollProgressDirective, CountUpDirective];
