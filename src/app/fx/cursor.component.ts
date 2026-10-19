import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { hasFinePointer, prefersReducedMotion } from '../core/motion';

/**
 * Dot that tracks the pointer exactly, plus a trailing ring that grows over interactive elements.
 * `data-cursor="Label"` on any element shows that label inside the ring. Mouse/trackpad only.
 */
@Component({
  selector: 'app-cursor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[class.on]': 'enabled()',
  },
  template: `
    <div class="ring" [class.hover]="hovering()" [class.labelled]="!!label()">
      <span>{{ label() }}</span>
    </div>
    <div class="dot"></div>
  `,
  styles: `
    :host {
      display: none;
    }

    :host(.on) {
      display: block;
    }

    .ring,
    .dot {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9998;
      pointer-events: none;
      border-radius: 50%;
      will-change: transform;
    }

    .dot {
      width: 6px;
      height: 6px;
      margin: -3px 0 0 -3px;
      background: var(--text);
      transition: opacity 0.3s;
    }

    .ring {
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      margin: -18px 0 0 -18px;
      border: 1px solid color-mix(in oklab, var(--text) 45%, transparent);
      transition: width 0.4s var(--ease-out), height 0.4s var(--ease-out), margin 0.4s var(--ease-out),
        background-color 0.3s, border-color 0.3s;
    }

    .ring.hover {
      width: 64px;
      height: 64px;
      margin: -32px 0 0 -32px;
      border-color: var(--brand);
      background: color-mix(in oklab, var(--brand) 14%, transparent);
    }

    .ring.labelled {
      width: 92px;
      height: 92px;
      margin: -46px 0 0 -46px;
      border-color: transparent;
      background: var(--text);
    }

    .ring.labelled + .dot {
      opacity: 0;
    }

    span {
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: var(--bg);
    }
  `,
})
export class CursorComponent {
  protected readonly enabled = signal(false);
  protected readonly hovering = signal(false);
  protected readonly label = signal('');

  constructor() {
    const document = inject(DOCUMENT);
    const host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      if (!hasFinePointer() || prefersReducedMotion()) {
        return;
      }
      const ring = host.querySelector<HTMLElement>('.ring')!;
      const dot = host.querySelector<HTMLElement>('.dot')!;
      const pos = { x: -100, y: -100, rx: -100, ry: -100 };
      let frame = 0;

      const follow = () => {
        pos.rx += (pos.x - pos.rx) * 0.18;
        pos.ry += (pos.y - pos.ry) * 0.18;
        ring.style.transform = `translate3d(${pos.rx}px, ${pos.ry}px, 0)`;
        frame = Math.abs(pos.x - pos.rx) + Math.abs(pos.y - pos.ry) > 0.2 ? requestAnimationFrame(follow) : 0;
      };

      const onMove = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') {
          return;
        }
        if (!this.enabled()) {
          this.enabled.set(true);
          document.documentElement.classList.add('has-cursor');
          pos.rx = event.clientX;
          pos.ry = event.clientY;
        }
        pos.x = event.clientX;
        pos.y = event.clientY;
        dot.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
        frame ||= requestAnimationFrame(follow);
      };

      const onOver = (event: PointerEvent) => {
        const target = (event.target as Element).closest<HTMLElement>('a, button, [data-cursor]');
        this.hovering.set(!!target);
        this.label.set(target?.dataset['cursor'] ?? '');
      };

      const onLeaveWindow = () => {
        this.enabled.set(false);
        document.documentElement.classList.remove('has-cursor');
      };

      addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerover', onOver, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeaveWindow);

      destroyRef.onDestroy(() => {
        cancelAnimationFrame(frame);
        removeEventListener('pointermove', onMove);
        document.removeEventListener('pointerover', onOver);
        document.documentElement.removeEventListener('pointerleave', onLeaveWindow);
        document.documentElement.classList.remove('has-cursor');
      });
    });
  }
}
