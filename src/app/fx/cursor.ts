import { ChangeDetectionStrategy, Component, DestroyRef, ElementRef, afterNextRender, inject, signal, viewChild } from '@angular/core';
import { Motion, gsap } from '../core/motion';

/**
 * Custom cursor: a dot that tracks exactly and a ring that trails behind,
 * growing over links and showing a label over [data-cursor].
 */
@Component({
  selector: 'app-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', '[class.on]': 'enabled()' },
  template: `
    <div class="ring" #ring [class.hover]="hover()" [class.label]="!!label()">
      <span>{{ label() }}</span>
    </div>
    <div class="dot" #dot></div>
  `,
  styles: `
    :host {
      display: none;
    }
    :host(.on) {
      display: block;
    }
    .dot,
    .ring {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1000;
      pointer-events: none;
      border-radius: 50%;
      translate: -50% -50%;
    }
    .dot {
      width: 6px;
      height: 6px;
      background: var(--amber);
    }
    .ring {
      display: grid;
      place-items: center;
      width: 38px;
      height: 38px;
      border: 1px solid rgb(239 233 223 / 0.45);
      transition:
        width 0.45s var(--ease-out),
        height 0.45s var(--ease-out),
        background-color 0.45s var(--ease-out),
        border-color 0.45s var(--ease-out);
    }
    .ring.hover {
      width: 64px;
      height: 64px;
      border-color: var(--amber);
      background: var(--amber-soft);
    }
    .ring.label {
      width: 92px;
      height: 92px;
      border-color: transparent;
      background: var(--amber);
    }
    span {
      font-family: var(--font-mono);
      font-size: 11px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--bg);
      opacity: 0;
      transition: opacity 0.3s;
    }
    .label span {
      opacity: 1;
    }
  `,
})
export class Cursor {
  private readonly dot = viewChild.required<ElementRef<HTMLElement>>('dot');
  private readonly ring = viewChild.required<ElementRef<HTMLElement>>('ring');
  protected readonly enabled = signal(false);
  protected readonly hover = signal(false);
  protected readonly label = signal('');

  constructor() {
    const motion = inject(Motion);
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      motion.start();
      if (motion.reduced() || !matchMedia('(pointer: fine)').matches) return;
      this.enabled.set(true);
      document.documentElement.classList.add('has-cursor');

      const dot = this.dot().nativeElement;
      const ring = this.ring().nativeElement;
      gsap.set([dot, ring], { x: innerWidth / 2, y: innerHeight / 2 });
      const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'none' });
      const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'none' });
      const rx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3.out' });
      const ry = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3.out' });

      const move = (e: PointerEvent) => {
        dx(e.clientX);
        dy(e.clientY);
        rx(e.clientX);
        ry(e.clientY);
      };
      const over = (e: PointerEvent) => {
        const target = (e.target as Element).closest<HTMLElement>('a, button, [data-cursor]');
        this.hover.set(!!target);
        this.label.set(target?.dataset['cursor'] ?? '');
      };
      const down = () => gsap.to(ring, { scale: 0.8, duration: 0.2 });
      const up = () => gsap.to(ring, { scale: 1, duration: 0.5, ease: 'elastic.out(1, 0.4)' });

      addEventListener('pointermove', move, { passive: true });
      addEventListener('pointerover', over, { passive: true });
      addEventListener('pointerdown', down);
      addEventListener('pointerup', up);
      destroyRef.onDestroy(() => {
        document.documentElement.classList.remove('has-cursor');
        removeEventListener('pointermove', move);
        removeEventListener('pointerover', over);
        removeEventListener('pointerdown', down);
        removeEventListener('pointerup', up);
      });
    });
  }
}
